import { baseApi } from '../../api/baseApi';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Dashboard
    getAdminDashboard: builder.query({
      query: () => '/admin/dashboard',
      providesTags: ['Dashboard'],
    }),
    
    // Users Management
    getAllUsers: builder.query({
      query: (params) => ({
        url: '/admin/users',
        params,
      }),
      providesTags: ['Users'],
    }),
    getUserById: builder.query({
      query: (id) => `/admin/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),
    updateUserStatus: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `/admin/users/${id}/status`,
        method: 'PUT',
        body: { isActive },
      }),
      invalidatesTags: ['Users'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
    
    // Vendors Management
    getAllVendors: builder.query({
      query: (params) => ({
        url: '/admin/vendors',
        params,
      }),
      providesTags: ['Vendors'],
    }),
    getPendingVendors: builder.query({
      query: () => '/admin/vendors/pending',
      providesTags: ['Vendors'],
    }),
    approveVendor: builder.mutation({
      query: (id) => ({
        url: `/admin/vendors/${id}/approve`,
        method: 'PUT',
      }),
      invalidatesTags: ['Vendors', 'Dashboard'],
    }),
    rejectVendor: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/admin/vendors/${id}/reject`,
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: ['Vendors', 'Dashboard'],
    }),
    
    // Products Management
    getAllProducts: builder.query({
      query: (params) => ({
        url: '/admin/products',
        params,
      }),
      providesTags: [{ type: 'Products', id: 'ADMIN_LIST' }],
    }),
    approveProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/products/${id}/approve`,
        method: 'PUT',
      }),
      invalidatesTags: ['Products'],
    }),
    rejectProduct: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/admin/products/${id}/reject`,
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: ['Products'],
    }),
    
    // Categories Management
    getAdminCategories: builder.query({
      query: () => '/admin/categories',
      providesTags: ['Categories'],
    }),
    
    // Orders Management
    getAdminOrders: builder.query({
      query: (params) => ({
        url: '/admin/orders',
        params,
      }),
      providesTags: ['Orders'],
    }),
    
    // Reports
    getRevenueReport: builder.query({
      query: (params) => ({
        url: '/admin/reports/revenue',
        params,
      }),
    }),
    getCategorySalesReport: builder.query({
      query: (params) => ({
        url: '/admin/reports/category-sales',
        params,
      }),
    }),
    getVendorPerformanceReport: builder.query({
      query: (params) => ({
        url: '/admin/reports/vendor-performance',
        params,
      }),
    }),
    getUserGrowthReport: builder.query({
      query: (params) => ({
        url: '/admin/reports/user-growth',
        params,
      }),
    }),
    
    // Settings
    getSettings: builder.query({
      query: () => '/admin/settings',
    }),
    updateSettings: builder.mutation({
      query: (data) => ({
        url: '/admin/settings',
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAdminDashboardQuery,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  useGetAllVendorsQuery,
  useGetPendingVendorsQuery,
  useApproveVendorMutation,
  useRejectVendorMutation,
  useGetAllProductsQuery,
  useApproveProductMutation,
  useRejectProductMutation,
  useGetAdminCategoriesQuery,
  useGetAdminOrdersQuery,
  useGetRevenueReportQuery,
  useGetCategorySalesReportQuery,
  useGetVendorPerformanceReportQuery,
  useGetUserGrowthReportQuery,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} = adminApi;
