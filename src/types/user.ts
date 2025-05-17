import { Badge } from "./badges";

export interface User {
  id: string;
  username: string;
  email?: string;
  wallet_address?: string;
  discord_id?: string;
  role: "admin" | "user";
  profile_image_url?: string;
  total_achievements: number;
  created_at: string;
  updated_at?: string;
}

export interface UserProfile extends User {
  stats: UserStats;
  connections: UserConnection[];
}

export interface UserStats {
  user_id: string;
  total_events_joined: number;
  total_points: number;
  achievement_progress: {
    [category: string]: {
      completed: number;
      total: number;
    };
  };
  account_completion: number;
}

export interface UserConnection {
  id: string;
  user_id: string;
  platform: "twitter" | "telegram" | "portal_wallet" | "matrica" | "discord";
  platform_username: string;
  platform_id: string;
  is_verified: boolean;
  connected_at: string;
}

export interface UserBadge {
  id: string;
  earned_at: string;
  badge: Badge;
}
