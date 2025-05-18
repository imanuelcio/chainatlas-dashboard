import { toast } from "react-hot-toast";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Membuat instance axios
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menambahkan token otentikasi
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor untuk menangani respons
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    toast.error(message);
    return Promise.reject(error);
  }
);

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

// Authentication API calls
export const authAPI = {
  generateNonce: (address: string) =>
    fetchFromAPI<{
      userId: any;
      success: boolean;
      nonce: string;
      message: string;
    }>("/auth/wallet/nonce/", {
      method: "POST",
      data: { address },
    }),

  verifySignature: (userId: string, address: string, signature: string) =>
    fetchFromAPI<{ success: boolean; token: string; user: any }>(
      "/auth/wallet/verify",
      {
        method: "POST",
        data: { address, userId, signature },
      }
    ),

  getDiscordRedirect: () =>
    fetchFromAPI<{ success: boolean; redirectUrl: string }>("/auth/discord"),

  getCurrentUser: () =>
    fetchFromAPI<{ success: boolean; user: any }>("/auth/me"),

  logout: () =>
    fetchFromAPI<{ success: boolean; message: string }>("/logout", {
      method: "POST",
    }),
};

// Users API calls
export const usersAPI = {
  getAllUsers: () => fetchFromAPI<{ success: boolean; users: any[] }>("/users"),

  getUserProfile: () =>
    fetchFromAPI<{
      user: any;
      success: boolean;
      profile: any;
    }>("/profile"),

  updateUserProfile: (profileData: any) =>
    fetchFromAPI<{ success: boolean; user: any }>("/users/profile", {
      method: "PUT",
      data: profileData,
    }),

  connectPlatform: (platformData: any) =>
    fetchFromAPI<{ success: boolean; connection: any }>(
      "/users/connect-platform",
      {
        method: "POST",
        data: platformData,
      }
    ),

  getUserBadges: () =>
    fetchFromAPI<{ success: boolean; badges: any[] }>("/badges"),

  getUserStats: () =>
    fetchFromAPI<{ success: boolean; stats: any }>("/users/stats"),

  getUserConnections: () =>
    fetchFromAPI<{ success: boolean; connections: any[] }>(
      "/users/connections"
    ),

  getUserEvents: () =>
    fetchFromAPI<{ success: boolean; events: any[] }>("/users/events"),

  getLeaderboard: (limit?: number) =>
    fetchFromAPI<{ success: boolean; leaderboard: any[] }>(
      `/stats/leaderboard${limit ? `?limit=${limit}` : ""}`
    ),
};

export const loginWithDiscord = () => {
  const redirectUri = encodeURIComponent(
    // "https://dashboard.atlashubs-bot.xyz/api/auth/discord/callback"
    "http://localhost:5000/api/auth/discord/callback"
  );
  const clientId = "1371822985115074650";
  const scope = encodeURIComponent("identify guilds");

  const discordOauthUrl = `https://discord.com/oauth2/authorize?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`;

  window.location.href = discordOauthUrl;
};

// Events API calls
export const eventsAPI = {
  getAllPublishedEvents: (params?: {
    page?: number;
    limit?: number;
    type?: string;
  }) => {
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

  getEventById: (id: string) =>
    fetchFromAPI<{ success: boolean; event: any }>(`/events/${id}`),

  createEvent: (eventData: any) =>
    fetchFromAPI<{ success: boolean; event: any }>("/events", {
      method: "POST",
      data: eventData,
    }),

  updateEvent: (id: string, eventData: any) =>
    fetchFromAPI<{ success: boolean; event: any }>(`/events/${id}`, {
      method: "PUT",
      data: eventData,
    }),

  deleteEvent: (id: string) =>
    fetchFromAPI<{ success: boolean; message: string }>(`/events/${id}`, {
      method: "DELETE",
    }),

  registerForEvent: (id: string) =>
    fetchFromAPI<{ success: boolean; message: string }>(
      `/events/${id}/register`,
      {
        method: "POST",
      }
    ),

  getEventParticipants: (id: string) =>
    fetchFromAPI<{ success: boolean; participants: any[] }>(
      `/events/${id}/participants`
    ),

  markUserAttendance: (id: string, userId: string, attended: boolean) =>
    fetchFromAPI<{ success: boolean; message: string }>(
      `/events/${id}/attendance`,
      {
        method: "POST",
        data: { user_id: userId, attended },
      }
    ),
};

// Badges API calls
export const badgesAPI = {
  getAllBadges: (category?: string) =>
    fetchFromAPI<{ success: boolean; badges: any[] }>(
      `/badges${category ? `?category=${category}` : ""}`
    ),

  getBadgeById: (id: string) =>
    fetchFromAPI<{ success: boolean; badge: any }>(`/badges/${id}`),

  createBadge: (badgeData: any) =>
    fetchFromAPI<{ success: boolean; badge: any }>("/badges", {
      method: "POST",
      data: badgeData,
    }),

  updateBadge: (id: string, badgeData: any) =>
    fetchFromAPI<{ success: boolean; badge: any }>(`/badges/${id}`, {
      method: "PUT",
      data: badgeData,
    }),

  deleteBadge: (id: string) =>
    fetchFromAPI<{ success: boolean; message: string }>(`/badges/${id}`, {
      method: "DELETE",
    }),

  awardBadgeToUser: (userId: string, badgeId: string) =>
    fetchFromAPI<{ success: boolean; user_badge: any }>("/badges/award", {
      method: "POST",
      data: { user_id: userId, badge_id: badgeId },
    }),
};
