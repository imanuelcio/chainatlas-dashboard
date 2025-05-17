import { Badge } from "./badges";

export interface Event {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  event_type: string;
  start_time: string;
  end_time: string;
  location?: string;
  is_virtual: boolean;
  special_reward?: string;
  reward_badge_id?: string;
  is_published: boolean;
  max_participants?: number;
  registration_deadline?: string;
  created_at: string;
  updated_at?: string;
}

export interface EventWithDetails extends Event {
  participant_count: number;
  is_registered: boolean;
  badges?: Badge[];
}

export interface EventParticipant {
  id: string;
  registration_date: string;
  attended: boolean;
  user: {
    id: string;
    username: string;
    wallet_address?: string;
    discord_id?: string;
    profile_image_url?: string;
  };
}

export interface UserEvent {
  registration_id: string;
  registration_date: string;
  attended: boolean;
  event: Event;
}
