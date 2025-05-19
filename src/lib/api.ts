// api.ts - Modified with TanStack React Query
import { toast } from "react-hot-toast";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth token interceptor
apiClient.interceptors.request.use((config) => {
  // Using localStorage is not SSR-friendly, consider using a cookie or other approach
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response error interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    toast.error(message);
    return Promise.reject(error);
  }
);

// Create QueryClient to be used in _app.tsx
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Base API fetcher
export async function fetchFromAPI<T>(
  endpoint: string,
  options?: AxiosRequestConfig
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await apiClient({
      url: endpoint,
      ...options,
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// ----- Authentication API Hooks -----
export const useGenerateNonce = () => {
  return useMutation({
    mutationFn: (address: string) =>
      fetchFromAPI<{
        userId: any;
        success: boolean;
        nonce: string;
        message: string;
      }>("/auth/wallet/nonce/", {
        method: "POST",
        data: { address },
      }),
  });
};

export const useVerifySignature = () => {
  return useMutation({
    mutationFn: ({
      userId,
      address,
      signature,
    }: {
      userId: string;
      address: string;
      signature: string;
    }) =>
      fetchFromAPI<{ success: boolean; token: string; user: any }>(
        "/auth/wallet/verify",
        {
          method: "POST",
          data: { address, userId, signature },
        }
      ),
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      }
    },
  });
};

export const useGetDiscordRedirect = () => {
  return useQuery({
    queryKey: ["discordRedirect"],
    queryFn: () =>
      fetchFromAPI<{ success: boolean; redirectUrl: string }>("/auth/discord"),
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => fetchFromAPI<{ success: boolean; user: any }>("/auth/me"),
    retry: 1,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: () =>
      fetchFromAPI<{ success: boolean; message: string }>("/logout", {
        method: "POST",
      }),
    onSuccess: () => {
      localStorage.removeItem("auth_token");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.clear();
    },
  });
};

// ----- Users API Hooks -----
export const useAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => fetchFromAPI<{ success: boolean; users: any[] }>("/users"),
  });
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: () =>
      fetchFromAPI<{
        user: any;
        success: boolean;
        profile: any;
      }>("/profile"),
  });
};

export const useUpdateUserProfile = () => {
  return useMutation({
    mutationFn: (profileData: any) =>
      fetchFromAPI<{ success: boolean; user: any }>("/users/profile", {
        method: "PUT",
        data: profileData,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

export const useConnectPlatform = () => {
  return useMutation({
    mutationFn: (platformData: any) =>
      fetchFromAPI<{ success: boolean; connection: any }>(
        "/users/connect-platform",
        {
          method: "POST",
          data: platformData,
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userConnections"] });
    },
  });
};

export const useUserBadges = () => {
  return useQuery({
    queryKey: ["userBadges"],
    queryFn: () => fetchFromAPI<{ success: boolean; badges: any[] }>("/badges"),
  });
};

export const useUserStats = () => {
  return useQuery({
    queryKey: ["userStats"],
    queryFn: () =>
      fetchFromAPI<{ success: boolean; stats: any }>("/users/stats"),
  });
};

export const useUserConnections = () => {
  return useQuery({
    queryKey: ["userConnections"],
    queryFn: () =>
      fetchFromAPI<{ success: boolean; connections: any[] }>(
        "/users/connections"
      ),
  });
};

export const useUserEvents = () => {
  return useQuery({
    queryKey: ["userEvents"],
    queryFn: () =>
      fetchFromAPI<{ success: boolean; events: any[] }>("/users/events"),
  });
};

export const useLeaderboard = (limit?: number) => {
  return useQuery({
    queryKey: ["leaderboard", limit],
    queryFn: () =>
      fetchFromAPI<{ success: boolean; leaderboard: any[] }>(
        `/stats/leaderboard${limit ? `?limit=${limit}` : ""}`
      ),
  });
};

// Discord login helper
export const loginWithDiscord = () => {
  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;
  const redirectUri = encodeURIComponent(
    process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI as string
  );
  const scope = encodeURIComponent("identify guilds");

  const discordOauthUrl = `https://discord.com/oauth2/authorize?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`;

  window.location.href = discordOauthUrl;
};

// ----- Events API Hooks -----
export const usePublishedEvents = (params?: {
  page?: number;
  limit?: number;
  type?: string;
}) => {
  return useQuery({
    queryKey: ["events", params],
    queryFn: () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.type) queryParams.append("type", params.type);

      return fetchFromAPI<{
        success: boolean;
        events: any[];
        pagination: {
          total: number;
          page: number;
          limit: number;
          pages: number;
        };
      }>(`/events?${queryParams.toString()}`);
    },
  });
};

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () =>
      fetchFromAPI<{ success: boolean; event: any }>(`/events/${id}`),
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  return useMutation({
    mutationFn: (eventData: any) =>
      fetchFromAPI<{ success: boolean; event: any }>("/events", {
        method: "POST",
        data: eventData,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useUpdateEvent = () => {
  return useMutation({
    mutationFn: ({ id, eventData }: { id: string; eventData: any }) =>
      fetchFromAPI<{ success: boolean; event: any }>(`/events/${id}`, {
        method: "PUT",
        data: eventData,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", variables.id] });
    },
  });
};

export const useDeleteEvent = () => {
  return useMutation({
    mutationFn: (id: string) =>
      fetchFromAPI<{ success: boolean; message: string }>(`/events/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useRegisterForEvent = () => {
  return useMutation({
    mutationFn: (id: string) =>
      fetchFromAPI<{ success: boolean; message: string }>(
        `/events/${id}/register`,
        {
          method: "POST",
        }
      ),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      queryClient.invalidateQueries({ queryKey: ["userEvents"] });
    },
  });
};

export const useEventParticipants = (id: string) => {
  return useQuery({
    queryKey: ["eventParticipants", id],
    queryFn: () =>
      fetchFromAPI<{ success: boolean; participants: any[] }>(
        `/events/${id}/participants`
      ),
    enabled: !!id,
  });
};

export const useMarkUserAttendance = () => {
  return useMutation({
    mutationFn: ({
      id,
      userId,
      attended,
    }: {
      id: string;
      userId: string;
      attended: boolean;
    }) =>
      fetchFromAPI<{ success: boolean; message: string }>(
        `/events/${id}/attendance`,
        {
          method: "POST",
          data: { user_id: userId, attended },
        }
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["eventParticipants", variables.id],
      });
    },
  });
};

// ----- Badges API Hooks -----
export const useAllBadges = (category?: string) => {
  return useQuery({
    queryKey: ["allBadges", category],
    queryFn: () =>
      fetchFromAPI<{ success: boolean; badges: any[] }>(
        `/badges${category ? `?category=${category}` : ""}`
      ),
  });
};

export const useBadge = (id: string) => {
  return useQuery({
    queryKey: ["badge", id],
    queryFn: () =>
      fetchFromAPI<{ success: boolean; badge: any }>(`/badges/${id}`),
    enabled: !!id,
  });
};

export const useCreateBadge = () => {
  return useMutation({
    mutationFn: (badgeData: any) =>
      fetchFromAPI<{ success: boolean; badge: any }>("/badges", {
        method: "POST",
        data: badgeData,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBadges"] });
    },
  });
};

export const useUpdateBadge = () => {
  return useMutation({
    mutationFn: ({ id, badgeData }: { id: string; badgeData: any }) =>
      fetchFromAPI<{ success: boolean; badge: any }>(`/badges/${id}`, {
        method: "PUT",
        data: badgeData,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["allBadges"] });
      queryClient.invalidateQueries({ queryKey: ["badge", variables.id] });
    },
  });
};

export const useDeleteBadge = () => {
  return useMutation({
    mutationFn: (id: string) =>
      fetchFromAPI<{ success: boolean; message: string }>(`/badges/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBadges"] });
    },
  });
};

export const useAwardBadgeToUser = () => {
  return useMutation({
    mutationFn: ({ userId, badgeId }: { userId: string; badgeId: string }) =>
      fetchFromAPI<{ success: boolean; user_badge: any }>("/badges/award", {
        method: "POST",
        data: { user_id: userId, badge_id: badgeId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userBadges"] });
    },
  });
};
