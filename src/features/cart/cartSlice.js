import { createSlice } from '@reduxjs/toolkit';

// Get cart from localStorage
const storedCart = localStorage.getItem('cart');
const parsedCart = storedCart ? JSON.parse(storedCart) : null;

const initialState = {
  items: parsedCart?.items || [],
  coupon: parsedCart?.coupon || null,
  subtotal: parsedCart?.subtotal || 0,
  discount: parsedCart?.discount || 0,
  deliveryFee: parsedCart?.deliveryFee || 0,
  tax: parsedCart?.tax || 0,
  total: parsedCart?.total || 0,
};

const calculateTotals = (items, coupon) => {
  const subtotal = items.reduce((sum, item) => {
    const price = item.product.discountedPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);
  
  let discount = 0;
  if (coupon) {
    if (coupon.type === 'percentage') {
      discount = (subtotal * coupon.value) / 100;
    } else {
      discount = coupon.value;
    }
  }
  
  const deliveryFee = subtotal >= 500 ? 0 : 40;
  const taxableAmount = subtotal - discount;
  const tax = Math.round(taxableAmount * 0.05); // 5% tax
  const total = taxableAmount + deliveryFee + tax;
  
  return { subtotal, discount, deliveryFee, tax, total };
};

const saveToLocalStorage = (state) => {
  localStorage.setItem('cart', JSON.stringify({
    items: state.items,
    coupon: state.coupon,
    subtotal: state.subtotal,
    discount: state.discount,
    deliveryFee: state.deliveryFee,
    tax: state.tax,
    total: state.total,
  }));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
      
      const totals = calculateTotals(state.items, state.coupon);
      Object.assign(state, totals);
      saveToLocalStorage(state);
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.product.id !== productId);
      
      const totals = calculateTotals(state.items, state.coupon);
      Object.assign(state, totals);
      saveToLocalStorage(state);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.product.id === productId);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.product.id !== productId);
        } else {
          item.quantity = quantity;
        }
      }
      
      const totals = calculateTotals(state.items, state.coupon);
      Object.assign(state, totals);
      saveToLocalStorage(state);
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload;
      const totals = calculateTotals(state.items, state.coupon);
      Object.assign(state, totals);
      saveToLocalStorage(state);
    },
    removeCoupon: (state) => {
      state.coupon = null;
      const totals = calculateTotals(state.items, null);
      Object.assign(state, totals);
      saveToLocalStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.coupon = null;
      state.subtotal = 0;
      state.discount = 0;
      state.deliveryFee = 0;
      state.tax = 0;
      state.total = 0;
      localStorage.removeItem('cart');
    },
    syncCart: (state, action) => {
      // Sync with server cart
      const serverCart = action.payload;
      state.items = serverCart.items || [];
      state.coupon = serverCart.coupon || null;
      const totals = calculateTotals(state.items, state.coupon);
      Object.assign(state, totals);
      saveToLocalStorage(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  removeCoupon,
  clearCart,
  syncCart,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotal = (state) => state.cart.total;
export const selectCartSubtotal = (state) => state.cart.subtotal;
export const selectCartTotals = (state) => ({
  subtotal: state.cart.subtotal,
  discount: state.cart.discount,
  deliveryFee: state.cart.deliveryFee,
  tax: state.cart.tax,
  total: state.cart.total,
  coupon: state.cart.coupon,
});

export default cartSlice.reducer;
