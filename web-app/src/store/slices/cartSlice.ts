import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  mealId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  vendorName: string;
  specialInstructions?: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
  isOpen: boolean;
  deliveryAddress?: string;
  deliveryInstructions?: string;
}

// Load cart items from localStorage if available
const loadCartFromStorage = (): CartItem[] => {
  const cartItemsJson = localStorage.getItem('cartItems');
  return cartItemsJson ? JSON.parse(cartItemsJson) : [];
};

// Calculate total from items
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const initialState: CartState = {
  items: loadCartFromStorage(),
  total: calculateTotal(loadCartFromStorage()),
  isOpen: false,
  deliveryAddress: '',
  deliveryInstructions: '',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'> & { quantity?: number }>) => {
      const existingItem = state.items.find(item => item.mealId === action.payload.mealId);
      const quantity = action.payload.quantity || 1;
      
      if (existingItem) {
        existingItem.quantity += quantity;
        // Update special instructions if provided
        if (action.payload.specialInstructions) {
          existingItem.specialInstructions = action.payload.specialInstructions;
        }
      } else {
        state.items.push({
          ...action.payload,
          quantity: quantity
        });
      }
      
      state.total = calculateTotal(state.items);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.mealId !== action.payload);
      state.total = calculateTotal(state.items);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    updateQuantity: (state, action: PayloadAction<{ mealId: number; quantity: number }>) => {
      const item = state.items.find(item => item.mealId === action.payload.mealId);
      
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i.mealId !== action.payload.mealId);
        }
      }
      
      state.total = calculateTotal(state.items);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    updateSpecialInstructions: (state, action: PayloadAction<{ mealId: number; instructions: string }>) => {
      const item = state.items.find(item => item.mealId === action.payload.mealId);
      
      if (item) {
        item.specialInstructions = action.payload.instructions;
        localStorage.setItem('cartItems', JSON.stringify(state.items));
      }
    },
    setDeliveryDetails: (state, action: PayloadAction<{ address?: string; instructions?: string }>) => {
      if (action.payload.address !== undefined) {
        state.deliveryAddress = action.payload.address;
      }
      if (action.payload.instructions !== undefined) {
        state.deliveryInstructions = action.payload.instructions;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      localStorage.removeItem('cartItems');
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    openCart: (state) => {
      state.isOpen = true;
    },
  },
});

export const {
  addToCart,
  removeItem,
  updateQuantity,
  updateSpecialInstructions,
  setDeliveryDetails,
  clearCart,
  toggleCart,
  closeCart,
  openCart,
} = cartSlice.actions;

export default cartSlice.reducer;
