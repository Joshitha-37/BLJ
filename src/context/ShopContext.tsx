import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Product,
  CartItem,
  ApparelSize,
  DeliveryAddress,
  Order,
  PaymentMethod,
  StoreSettings,
  CustomerProfile,
  CustomerRegistrationData,
} from '../types/ecommerce';
import { INITIAL_PRODUCTS, DEFAULT_STORE_SETTINGS } from '../data/products';
import {
  subscribeToProducts,
  createOrderInFirestore,
  getStoreSettings,
  updateStoreSettings as updateSettingsInDb,
  signInCustomerWithGoogle,
  signInCustomerWithEmail,
  signUpCustomer,
  updateCustomerProfileInDb,
  subscribeToCustomerOrders,
  signOutCustomer,
  auth,
} from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

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

  // Customer Authentication & Profile
  currentUser: CustomerProfile | null;
  isCustomerLoggedIn: boolean;
  loginWithGoogle: () => Promise<CustomerProfile>;
  loginWithEmail: (email: string, pass: string) => Promise<CustomerProfile>;
  registerCustomer: (data: CustomerRegistrationData) => Promise<CustomerProfile>;
  logoutCustomer: () => Promise<void>;
  updateCustomerProfile: (data: Partial<CustomerProfile>) => Promise<void>;

  // Global Auth Modal controls
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  authPromptReason: string | null;
  openLoginModal: (reason?: any) => void;
  openSignUpModal: (reason?: any) => void;
  closeAuthModal: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'blj_cart_v2';
const WISHLIST_STORAGE_KEY = 'blj_wishlist_v2';
const ADDRESS_STORAGE_KEY = 'blj_address_v2';
const ORDERS_STORAGE_KEY = 'blj_orders_v2';
const CUSTOMER_USER_KEY = 'blj_customer_user_v2';

export function ShopProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Customer Auth State
  const [currentUser, setCurrentUser] = useState<CustomerProfile | null>(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [authPromptReason, setAuthPromptReason] = useState<string | null>(null);

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

  // Listen to Customer Orders for the logged in user
  useEffect(() => {
    if (!currentUser || !currentUser.email) {
      // Load orders from local storage for guest
      try {
        const local = localStorage.getItem(ORDERS_STORAGE_KEY);
        if (local) setCustomerOrders(JSON.parse(local));
      } catch {
        // ignore
      }
      return;
    }

    const unsub = subscribeToCustomerOrders(
      currentUser.email,
      (orders) => {
        // Orders filtered to only this customer
        setCustomerOrders(orders);
        // Also persist locally as cache
        try {
          localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
        } catch {
          // ignore
        }
      },
      (err) => {
        console.warn('Customer orders subscription notice:', err);
      }
    );

    return () => unsub();
  }, [currentUser]);

  // Sync Firebase Auth state for customer
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        // Check if there is already a customer user session
        const currentSaved = localStorage.getItem(CUSTOMER_USER_KEY);
        if (!currentSaved) {
          const profile: CustomerProfile = {
            uid: user.uid,
            email: user.email.toLowerCase().trim(),
            fullName: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL || undefined,
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            provider: 'google',
          };
          setCurrentUser(profile);
          localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(profile));
        }
      }
    });

    return () => unsub();
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

  // Save Current User to LocalStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(currentUser));
        if (currentUser.address && !savedAddress) {
          setSavedAddress(currentUser.address);
          localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(currentUser.address));
        }
      } else {
        localStorage.removeItem(CUSTOMER_USER_KEY);
      }
    } catch (e) {
      console.warn('Could not save user:', e);
    }
  }, [currentUser, savedAddress]);

  const saveSavedAddress = (addr: DeliveryAddress) => {
    setSavedAddress(addr);
    try {
      localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(addr));
    } catch (e) {
      console.warn('Could not save address:', e);
    }

    if (currentUser) {
      const updatedUser = { ...currentUser, address: addr };
      setCurrentUser(updatedUser);
      updateCustomerProfileInDb(updatedUser);
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
    // 1. Account Requirement Verification
    if (!currentUser) {
      openLoginModal('Please log in or create an account to finalize your order.');
      return {
        success: false,
        error: 'Account required: Please log in or create an account before placing your order.',
      };
    }

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
      userId: currentUser?.uid,
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

  // Customer Auth Methods
  const loginWithGoogle = async (): Promise<CustomerProfile> => {
    const profile = await signInCustomerWithGoogle();
    setCurrentUser(profile);
    localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(profile));
    if (profile.address) {
      setSavedAddress(profile.address);
      localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(profile.address));
    }
    setAuthModalOpen(false);
    return profile;
  };

  const loginWithEmail = async (email: string, pass: string): Promise<CustomerProfile> => {
    const profile = await signInCustomerWithEmail(email, pass);
    setCurrentUser(profile);
    localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(profile));
    if (profile.address) {
      setSavedAddress(profile.address);
      localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(profile.address));
    }
    setAuthModalOpen(false);
    return profile;
  };

  const registerCustomer = async (data: CustomerRegistrationData): Promise<CustomerProfile> => {
    const profile = await signUpCustomer(data);
    setCurrentUser(profile);
    localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(profile));
    if (profile.address) {
      setSavedAddress(profile.address);
      localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(profile.address));
    }
    setAuthModalOpen(false);
    return profile;
  };

  const logoutCustomer = async (): Promise<void> => {
    await signOutCustomer();
    setCurrentUser(null);
    localStorage.removeItem(CUSTOMER_USER_KEY);
    // Keep cart and products intact
  };

  const updateCustomerProfile = async (data: Partial<CustomerProfile>): Promise<void> => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(updated));
    await updateCustomerProfileInDb(updated);
  };

  const openLoginModal = (reason?: any) => {
    setAuthPromptReason(typeof reason === 'string' ? reason : null);
    setAuthModalMode('login');
    setAuthModalOpen(true);
  };

  const openSignUpModal = (reason?: any) => {
    setAuthPromptReason(typeof reason === 'string' ? reason : null);
    setAuthModalMode('signup');
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setAuthPromptReason(null);
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

        // Customer Auth
        currentUser,
        isCustomerLoggedIn: Boolean(currentUser),
        loginWithGoogle,
        loginWithEmail,
        registerCustomer,
        logoutCustomer,
        updateCustomerProfile,

        // Modal
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        authPromptReason,
        openLoginModal,
        openSignUpModal,
        closeAuthModal,
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
