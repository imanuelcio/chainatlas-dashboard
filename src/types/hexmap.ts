export interface HexLocation {
  id: string;
  hex_id: string;
  coordinates: {
    q: number;
    r: number;
    s: number;
  };
  name?: string;
  claimed_at: string;
  owner?: {
    id: string;
    username: string;
    profile_image_url?: string;
  };
}
