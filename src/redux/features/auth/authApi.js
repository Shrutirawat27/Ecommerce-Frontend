import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/baseURL";

// Refresh token API call
const refreshToken = async () => {
  const storedRefreshToken = localStorage.getItem('refreshToken');
  if (!storedRefreshToken) return null;

  try {
    const response = await fetch(`${getBaseUrl()}/api/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: storedRefreshToken }),
    });

    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken || storedRefreshToken);
      return data.token;
    }
    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};


// Custom fetchBaseQuery with token refresh handling
const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/user`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem('token');
    console.log("Stored Access Token:", token);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    // If the token is expired, try refreshing it and retry the request
    if (result.error && result.error.status === 401 && result.error.data?.message === 'Token has expired') {
      console.warn("Token expired. Attempting refresh...");
      console.log("Current Refresh Token:", localStorage.getItem('refreshToken'));
      const newToken = await refreshToken();

      if (newToken) {
        console.log("Successfully refreshed token. Retrying request...");
        // Retry the original request with the new token
        return baseQuery(args, api, extraOptions);
      } else {
        console.error("Token refresh failed.");
      }
    }

    return result; // Return the original result if no need to refresh
  },
  tagTypes: ["User"],
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (newUser) => ({
        url: "/register",
        method: "POST",
        body: newUser,
      }),
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    getUser: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      refetchOnMountOrArgChange: true,
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/users/${userId}`,
        method: "PUT",
        body: { role },
      }),
      refetchOnMountOrArgChange: true,
      invalidatesTags: ["User"],
    }),
    editProfile: builder.mutation({
      query: (profileData) => {
        // Check if profileData is FormData (for file uploads)
        const isFormData = profileData instanceof FormData;
        console.log('Is FormData:', isFormData);
        
        return {
          url: `/edit-profile`,
          method: "PATCH",
          // Don't set Content-Type header for FormData, the browser will set it with the boundary
          headers: isFormData ? undefined : {
            'Content-Type': 'application/json',
          },
          body: profileData,
          formData: isFormData,
        };
      },
      // Add error handling
      transformErrorResponse: (response) => {
        console.log('Profile update error response:', response);
        return response;
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetUserQuery,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
  useEditProfileMutation,
} = authApi;

export default authApi;
