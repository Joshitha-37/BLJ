export type ApparelCategory =
  | 't-shirts'
  | 'shirts'
  | 'hoodies'
  | 'sweatshirts'
  | 'tops'
  | 'other';

export type ApparelSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export const ALL_SIZES: ApparelSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ApparelCategory;
  categoryLabel: string;
  description: string;
  features: string[];
  fabric: string;
  gsm: number;
  fit: string;
  price: number; // in ₹ INR
  mrp: number; // in ₹ INR
  images: string[];
  availableSizes: ApparelSize[];
  stock: Record<ApparelSize, number>;
  badge?: string;
  rating: number;
  reviewsCount: number;
  tags: string[];
  isFeatured?: boolean;
}

export interface CartItem {
  id: string; // unique cart line item id, e.g. `${productId}-${size}`
  productId: string;
  product: Product;
  selectedSize: ApparelSize;
  quantity: number;
  price: number;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  email: string;
  doorNo: string;
  street: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
  landmark?: string;
}

export type PaymentMethod = 'bank_transfer' | 'cod';

export type PaymentStatus =
  | 'Pending'
  | 'Verified'
  | 'Bank Transfer – Verification Pending'
  | 'Paid'
  | 'Failed';

export type OrderStatus =
  | 'ORDER PLACED'
  | 'PAYMENT PENDING'
  | 'PAYMENT VERIFIED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'OUT FOR DELIVERY'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'RETURN REQUESTED'
  | 'RETURN APPROVED'
  | 'RETURN COMPLETED'
  | 'CANCELLED';

export interface ReturnRequest {
  reason: string;
  notes: string;
  requestedAt: string;
  status: 'RETURN REQUESTED' | 'RETURN APPROVED' | 'RETURN COMPLETED' | 'REJECTED';
  adminNotes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  size: ApparelSize;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  createdAt: string;
  deliveredAt?: string;
  customer: DeliveryAddress;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  utrNumber?: string;
  orderStatus: OrderStatus;
  agreedToPolicies: boolean;
  returnRequest?: ReturnRequest;
  userId?: string;
}

export interface CustomerProfile {
  uid: string;
  email: string;
  fullName: string;
  phone?: string;
  photoURL?: string;
  address?: DeliveryAddress;
  createdAt: string;
  lastLoginAt: string;
  provider: 'google' | 'email';
}

export interface CustomerRegistrationData {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  doorNo?: string;
  street?: string;
  city?: string;
  district?: string;
  state?: string;
  pinCode?: string;
  landmark?: string;
}

export interface BankDetails {
  accountName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
}

export interface StoreSettings {
  companyEmail: string;
  companyPhone: string;
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
  bankDetails: BankDetails;
  adminPasscode?: string;
}
