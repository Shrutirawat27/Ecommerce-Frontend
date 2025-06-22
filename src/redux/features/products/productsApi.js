import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../../utils/baseURL';

const productsApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/products`,
    credentials: "include"
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    // Fetch all products with filters
    fetchAllProducts: builder.query({
      query: ({ category, color, minPrice, maxPrice, page = 1, limit = 10 }) => {
        const queryParams = new URLSearchParams({
          category: category || "",
          color: color || "",
          minPrice: minPrice || 0,
          maxPrice: maxPrice || undefined,
          page: page.toString(),
          limit: limit.toString(),
        }).toString();
        return `/?${queryParams}`;
      },
      providesTags: ["Products"]
    }),

    // ✅ FIXED: Search Products API
    searchProducts: builder.query({
      query: (searchQuery) => {
        if (!searchQuery.trim()) return ""; // ✅ Prevents empty API call
        return `/search?searchQuery=${encodeURIComponent(searchQuery)}`;
      },
      providesTags: ["Products"]
    }),
    

    fetchProductById: builder.query({
      query: (_id) => `/${_id}`,
      providesTags: (result, error, _id) => [{ type: "Products", _id }]
    }),

    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/create-product",
        method: "POST",
        body: newProduct,
        credentials: "include"
      }),
      invalidatesTags: ["Products"]
    }),

    fetchRelatedProducts: builder.query({
      query: (_id) => `/related/${_id}`
    }),

    updateProduct: builder.mutation({
      query: ({ _id, ...rest }) => ({
        url: `/update-product/${_id}`,
        method: "PATCH",
        body: rest,
        credentials: "include",
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation({
      query: (_id) => ({
        url: `/${_id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: (result, error, _id) => [{ type: "Products", _id }]
    }),
  }),
});

export const {
  useFetchAllProductsQuery,
  useSearchProductsQuery, // ✅ Fixed search query
  useFetchProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useFetchRelatedProductsQuery
} = productsApi;

export default productsApi;
