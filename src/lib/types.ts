export type ProductCategory = "Tempered" | "Curries";

export interface NutritionFacts {
  servingSize: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  sodium: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Sinhala product name (as shown on the can). */
  nameSi?: string;
  /** Tamil product name (as shown on the can). */
  nameTa?: string;
  /** Short evocative one-liner shown under the name. */
  tagline: string;
  /** Product photo URL (falls back to the SVG can visual when absent). */
  image?: string;
  category: ProductCategory;
  /** Price in LKR (no decimals). */
  price: number;
  /** Net weight label, e.g. "400g". */
  weight: string;
  shortDescription: string;
  description: string;
  ingredients: string[];
  nutrition: NutritionFacts;
  badges: string[];
  /** Brand accent hex used by the product visual + detail page. */
  accent: string;
  /** Steps for the "Ready in minutes" section. */
  prepSteps: string[];
  servingSuggestion: string;
  featured: boolean;
  inStock: boolean;
  rating: number;
  reviews: number;
  /** DB-only fields (optional on the seed catalogue). */
  active?: boolean;
  sortOrder?: number;
}

export interface CartItem {
  slug: string;
  name: string;
  price: number;
  weight: string;
  accent: string;
  image?: string;
  category: ProductCategory;
  quantity: number;
}

export type OrderStatus = "pending" | "paid" | "failed" | "cancelled";

/** How the customer chose to pay. */
export type PaymentMethod = "cod" | "bank" | "payhere";

export interface OrderRecord {
  id: string;
  order_ref: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  /** For bank transfers: which owner account the customer paid to. */
  bank_account: string | null;
  /** For bank transfers: storage path of the uploaded receipt (private bucket). */
  receipt_path: string | null;
  payhere_payment_id: string | null;
  created_at: string;
}
