import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Product,
  CartItem,
  ApparelSize,
  DeliveryAddress,
  Order,
  PaymentMethod,
  StoreSettings,
} from '../types/ecommerce';
import { INITIAL_PRODUCTS, DEFAULT_STORE_SETTINGS } from '../data/products';
import {
  subscribeToProducts,
  createOrderInFirestore,
  getStoreSettings,
  updateStoreSettings as updateSettingsInDb,
} from '../lib/firebase';

interface ShopContextType {
  products: Product[];
  loadingProducts: boolean;
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  deliveryFee: number;
  cartTotal: number;
  addToCart: (product: Product, size: ApparelSize, quantity?: number) => { success: boolean; message: string };
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  savedAddress: DeliveryAddress | null;
  saveSavedAddress: (addr: DeliveryAddress) => void;
  customerOrders: Order[];
  placeOrder: (
    address: DeliveryAddress,
    paymentMethod: PaymentMethod,
    utrNumber?: string
  ) => Promise<{ success: boolean; order?: Order; error?: string }>;
  storeSettings: StoreSettings;
  updateStoreSettings: (newSettings: StoreSettings) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'blj_cart_v2';
const WISHLIST_STORAGE_KEY = 'blj_wishlist_v2';
const ADDRESS_STORAGE_KEY = 'blj_address_v2';
const ORDERS_STORAGE_KEY = 'blj_orders_v2';

export function ShopProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedAddress, setSavedAddress] = useState<DeliveryAddress | null>(() => {
    try {
      const saved = localStorage.getItem(ADDRESS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [customerOrders, setCustomerOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);

  // Sync products from Firestore with live real-time snapshot
  useEffect(() => {
    const unsubscribe = subscribeToProducts((loadedProducts) => {
      if (loadedProducts && loadedProducts.length > 0) {
        setProducts(loadedProducts);
      }
      setLoadingProducts(false);
    });

    getStoreSettings().then((settings) => {
      if (settings) setStoreSettings(settings);
    });

    return () => unsubscribe();
  }, []);

  // Save Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart:', e);
    }
  }, [cart]);

  // Save Wishlist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Could not save wishlist:', e);
    }
  }, [wishlist]);

  // Save Orders to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(customerOrders));
    } catch (e) {
      console.warn('Could not save orders:', e);
    }
  }, [customerOrders]);

  const saveSavedAddress = (addr: DeliveryAddress) => {
    setSavedAddress(addr);
    try {
      localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(addr));
    } catch (e) {
      console.warn('Could not save address:', e);
    }
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug || p.id === slug);
  };

  // Add to cart with size validation & stock check
  const addToCart = (product: Product, size: ApparelSize, quantity: number = 1) => {
    if (!size) {
      return { success: false, message: 'Please select an available size (XS, S, M, L, XL, XXL).' };
    }

    const currentStock = product.stock?.[size] ?? 0;
    if (currentStock <= 0) {
      return { success: false, message: `Size ${size} is currently SOLD OUT / UNAVAILABLE.` };
    }

    const lineItemId = `${product.id}-${size}`;
    const existingIndex = cart.findIndex((item) => item.id === lineItemId);

    if (existingIndex > -1) {
      const existingItem = cart[existingIndex];
      const newQty = existingItem.quantity + quantity;

      if (newQty > currentStock) {
        return {
          success: false,
          message: `Only ${currentStock} units available for size ${size}. You already have ${existingItem.quantity} in your cart.`,
        };
      }

      const updated = [...cart];
      updated[existingIndex] = { ...existingItem, quantity: newQty };
      setCart(updated);
      return { success: true, message: `Updated quantity for ${product.name} (${size}) in cart.` };
    } else {
      if (quantity > currentStock) {
        return {
          success: false,
          message: `Only ${currentStock} units available for size ${size}.`,
        };
      }

      const newItem: CartItem = {
        id: lineItemId,
        productId: product.id,
        product,
        selectedSize: size,
        quantity,
        price: product.price,
      };

      setCart([...cart, newItem]);
      return { success: true, message: `Added ${product.name} (${size}) to your cart.` };
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const product = getProductById(item.productId) || item.product;
          const maxStock = product.stock?.[item.selectedSize] ?? 99;
          const safeQty = Math.min(quantity, maxStock);
          return { ...item, quantity: safeQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  // Cart calculations in ₹ INR
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryFee =
    cartSubtotal === 0 || cartSubtotal >= storeSettings.freeDeliveryThreshold
      ? 0
      : storeSettings.standardDeliveryFee;
  const cartTotal = cartSubtotal + deliveryFee;

  // Place Order
  const placeOrder = async (
    address: DeliveryAddress,
    paymentMethod: PaymentMethod,
    utrNumber?: string
  ): Promise<{ success: boolean; order?: Order; error?: string }> => {
    if (cart.length === 0) {
      return { success: false, error: 'Your cart is empty.' };
    }

    // Verify stock availability for all items
    for (const item of cart) {
      const prod = getProductById(item.productId);
      if (prod) {
        const available = prod.stock?.[item.selectedSize] ?? 0;
        if (available < item.quantity) {
          return {
            success: false,
            error: `Insufficient stock for ${prod.name} in size ${item.selectedSize} (Available: ${available}). Please adjust your cart.`,
          };
        }
      }
    }

    const orderNumber = `BLJ-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();

    const orderItems = cart.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      image: item.product.images[0] || '',
      size: item.selectedSize,
      quantity: item.quantity,
      price: item.price,
    }));

    const paymentStatus =
      paymentMethod === 'bank_transfer'
        ? 'Bank Transfer – Verification Pending'
        : 'Pending';

    const orderStatus = 'ORDER PLACED';

    const newOrder: Order = {
      id: orderNumber,
      createdAt: now,
      customer: address,
      items: orderItems,
      subtotal: cartSubtotal,
      deliveryFee,
      total: cartTotal,
      paymentMethod,
      paymentStatus,
      utrNumber: utrNumber?.trim() || undefined,
      orderStatus,
      agreedToPolicies: true,
    };

    try {
      // 1. Save to Firestore and deduct stock
      await createOrderInFirestore(newOrder);

      // 2. Dispatch real emails via backend server
      fetch('/api/orders/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: newOrder,
          companyEmail: storeSettings.companyEmail,
        }),
      }).catch((err) => console.warn('Email dispatch notification call error:', err));

      // 3. Save locally in customer's orders history
      setCustomerOrders((prev) => [newOrder, ...prev]);

      // 4. Remember default address
      saveSavedAddress(address);

      // 5. Clear cart
      clearCart();

      return { success: true, order: newOrder };
    } catch (err: any) {
      console.error('Order placement failed:', err);
      return { success: false, error: err.message || 'Failed to place order. Please try again.' };
    }
  };

  const updateStoreSettings = async (newSettings: StoreSettings) => {
    setStoreSettings(newSettings);
    await updateSettingsInDb(newSettings);
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        loadingProducts,
        cart,
        cartCount,
        cartSubtotal,
        deliveryFee,
        cartTotal,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        isInWishlist,
        savedAddress,
        saveSavedAddress,
        customerOrders,
        placeOrder,
        storeSettings,
        updateStoreSettings,
        getProductById,
        getProductBySlug,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
