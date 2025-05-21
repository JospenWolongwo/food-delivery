export interface NutritionalInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface Vendor {
  id: number;
  name: string;
  description?: string;
  logoUrl?: string;
  rating?: number;
  reviewCount?: number;
  location?: string;
}

export interface Meal {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  isAvailable: boolean;
  isPopular?: boolean;
  isFeatured?: boolean;
  preparationTime?: number; // in minutes
  servingSize?: string;
  ingredients?: string[];
  allergens?: string[];
  nutritionalInfo?: NutritionalInfo;
  tags?: string[];
  vendorId: number;
  vendor?: Vendor;
  rating?: number;
  reviewCount?: number;
}

export interface MealInCart {
  mealId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  vendorName: string;
  specialInstructions?: string;
}
