import { baseApi } from '../../api/baseApi';

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: '/products',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({ type: 'Products', id })),
              { type: 'Products', id: 'LIST' },
            ]
          : [{ type: 'Products', id: 'LIST' }],
    }),
    getProductBySlug: builder.query({
      query: (slug) => `/products/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Product', id: slug }],
    }),
    getFeaturedProducts: builder.query({
      query: () => '/products/featured',
      providesTags: [{ type: 'Products', id: 'FEATURED' }],
    }),
    getBestSellers: builder.query({
      query: () => '/products/best-sellers',
      providesTags: [{ type: 'Products', id: 'BEST_SELLERS' }],
    }),
    getFlashDeals: builder.query({
      query: () => '/products/flash-deals',
      providesTags: [{ type: 'Products', id: 'FLASH_DEALS' }],
    }),
    searchProducts: builder.query({
      query: (searchTerm) => ({
        url: '/products/search',
        params: { q: searchTerm },
      }),
    }),
    getRelatedProducts: builder.query({
      query: (productId) => `/products/${productId}/related`,
      providesTags: (result, error, productId) => [
        { type: 'Products', id: `RELATED_${productId}` },
      ],
    }),
    // Vendor product endpoints
    getVendorProducts: builder.query({
      query: (params) => ({
        url: '/vendor/products',
        params,
      }),
      providesTags: [{ type: 'Products', id: 'VENDOR_LIST' }],
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: '/products',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }, { type: 'Products', id: 'VENDOR_LIST' }],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Products', id },
        { type: 'Product', id },
        { type: 'Products', id: 'LIST' },
        { type: 'Products', id: 'VENDOR_LIST' },
      ],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }, { type: 'Products', id: 'VENDOR_LIST' }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetFeaturedProductsQuery,
  useGetBestSellersQuery,
  useGetFlashDealsQuery,
  useSearchProductsQuery,
  useGetRelatedProductsQuery,
  useGetVendorProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
