import { z } from 'zod';

// Auth Validators
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password is required'),
  role: z.enum(['customer', 'vendor']).default('customer'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

// Address Validators
export const addressSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit phone number'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
  isDefault: z.boolean().optional().default(false),
  type: z.enum(['home', 'work', 'other']).default('home'),
});

// Product Validators
export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required').max(100, 'Name must be less than 100 characters'),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().optional(),
  price: z.number().min(1, 'Price must be at least ₹1'),
  discountedPrice: z.number().min(0, 'Discounted price cannot be negative').optional(),
  stockQuantity: z.number().min(0, 'Stock cannot be negative'),
  unit: z.string().min(1, 'Unit is required'),
  shortDescription: z.string().max(200, 'Short description must be less than 200 characters').optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
}).refine((data) => {
  if (data.discountedPrice && data.discountedPrice >= data.price) {
    return false;
  }
  return true;
}, {
  message: 'Discounted price must be less than regular price',
  path: ['discountedPrice'],
});

// Category Validators
export const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  parentCategory: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
});

// Vendor Store Profile Validators
export const vendorProfileSchema = z.object({
  storeName: z.string().min(2, 'Store name is required').max(100, 'Store name must be less than 100 characters'),
  storeDescription: z.string().max(500, 'Description must be less than 500 characters').optional(),
  contactNumber: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit phone number'),
  address: z.string().min(10, 'Address is required'),
  logo: z.string().optional(),
});

// Checkout Validators
export const checkoutSchema = z.object({
  shippingAddress: addressSchema,
  paymentMethod: z.enum(['upi', 'netbanking', 'card', 'cod'], {
    required_error: 'Please select a payment method',
  }),
});

// UPI Validator
export const upiSchema = z.object({
  upiId: z.string().regex(/^[\w.-]+@[\w]+$/, 'Enter a valid UPI ID (e.g., name@upi)'),
});

// Card Validator
export const cardSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, 'Enter a valid 16-digit card number'),
  expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, 'Enter valid month (01-12)'),
  expiryYear: z.string().regex(/^\d{2}$/, 'Enter valid year'),
  cvv: z.string().regex(/^\d{3,4}$/, 'Enter valid CVV'),
  cardholderName: z.string().min(2, 'Cardholder name is required'),
});

// Coupon Validator
export const couponSchema = z.object({
  code: z.string().min(3, 'Enter a valid coupon code').max(20, 'Coupon code is too long'),
});

// Review Validator
export const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating is required').max(5, 'Rating must be between 1 and 5'),
  comment: z.string().max(500, 'Comment must be less than 500 characters').optional(),
});

// Profile Update Validator
export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit phone number'),
});

// Password Change Validator
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmNewPassword: z.string().min(6, 'Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ['confirmNewPassword'],
});
