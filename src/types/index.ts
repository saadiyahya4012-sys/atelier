export interface ProductImage {
  id: number;
  src: string;
  alt: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductAttribute {
  id?: number;
  name: string; // e.g. "Taille" or "Couleur"
  options: string[]; // e.g. ["XS", "S", "M", "L", "XL"]
}

export interface ProductVariant {
  id: number;
  size: string;
  color: string;
  price: number;
  stock_quantity: number;
  sku: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  regular_price: number;
  sale_price?: number | null;
  on_sale: boolean;
  sku: string;
  stock_quantity: number;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  status: 'publish' | 'draft';
  categories: ProductCategory[];
  images: ProductImage[];
  attributes: ProductAttribute[];
  variants?: ProductVariant[];
  material?: string;
  origin?: string;
  featured?: boolean;
  date_created: string;
}

export interface CartItem {
  id: string; // Composite key: `${productId}-${selectedSize}-${selectedColor}`
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface OrderCustomer {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_1: string;
  city: string;
  postcode: string;
  country: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  name: string;
  quantity: number;
  price: number;
  total: number;
  size?: string;
  color?: string;
  image?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'on-hold' | 'completed' | 'cancelled' | 'refunded';

export interface Order {
  id: number;
  number: string;
  status: OrderStatus;
  date_created: string;
  total: number;
  subtotal: number;
  shipping_total: number;
  discount_total: number;
  currency: string;
  billing: OrderCustomer;
  shipping: OrderCustomer;
  shipping_method: string;
  line_items: OrderItem[];
  payment_method: string;
  payment_method_title: string;
  notes?: string;
  stripe_session_id?: string;
  stripe_payment_intent?: string;
  is_test_payment?: boolean;
}

export interface DemoRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company?: string;
  preferred_date?: string;
  demo_type?: string;
  message?: string;
  status: 'new' | 'contacted' | 'completed';
  created_at: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalProducts: number;
  lowStockCount: number;
}

export interface WooCommerceSettings {
  url: string;
  consumerKey: string;
  consumerSecret: string;
  apiVersion: string;
  isConnected: boolean;
  lastSync?: string | null;
}
