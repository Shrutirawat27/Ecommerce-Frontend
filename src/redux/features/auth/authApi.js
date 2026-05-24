import {
  createApi,
  fetchBaseQuery
} from "@reduxjs/toolkit/query/react";

import { getBaseUrl }
from "../../../utils/baseURL";

const authApi = createApi({

  reducerPath: "authApi",

  baseQuery: fetchBaseQuery({

    baseUrl: `${getBaseUrl()}/api/user`,

    credentials: "include"
  }),

  tagTypes: ["User"],

  endpoints: (builder) => ({

    registerUser: builder.mutation({

      query: (newUser) => ({

        url: "/register",

        method: "POST",

        body: newUser
      })
    }),

    loginUser: builder.mutation({

      query: (credentials) => ({

        url: "/login",

        method: "POST",

        body: credentials
      })
    }),

    logoutUser: builder.mutation({

      query: () => ({

        url: "/logout",

        method: "POST"
      })
    }),

    getUser: builder.query({

      query: () => ({

        url: "/current",

        method: "GET"
      }),

      providesTags: ["User"],

      refetchOnMountOrArgChange: true
    }),

    deleteUser: builder.mutation({

      query: (userId) => ({

        url: `/users/${userId}`,

        method: "DELETE"
      }),

      invalidatesTags: ["User"]
    }),

    updateUserRole: builder.mutation({

      query: ({ userId, role }) => ({

        url: `/users/${userId}`,

        method: "PUT",

        body: { role }
      }),

      invalidatesTags: ["User"]
    }),

    editProfile: builder.mutation({

      query: (profileData) => {

        const isFormData =
          profileData instanceof FormData;

        return {

          url: "/edit-profile",

          method: "PATCH",

          headers: isFormData
            ? undefined
            : {
                "Content-Type":
                  "application/json"
              },

          body: profileData
        };
      }
    })
  })
});

export const {

  useRegisterUserMutation,

  useLoginUserMutation,

  useLogoutUserMutation,

  useGetUserQuery,

  useDeleteUserMutation,

  useUpdateUserRoleMutation,

  useEditProfileMutation

} = authApi;

export default authApi;