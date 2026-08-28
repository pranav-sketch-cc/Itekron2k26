export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Event {
  id: string;
  name: string;
  description: string;
  category: string;
  event_type?: 'individual' | 'team' | 'both' | string;
  team_type?: 'individual' | 'team' | 'both' | string;
  team_size?: number | string;
  max_team_size?: number | string;
  min_team_size?: number | string;
  date_time: string;
  venue: string;
  registration_deadline: string;
  is_registration_open?: boolean;
  rules_regulations?: string[] | string | null;
  instructions?: string[] | string | null;
  eligibility?: string;
  image_url?: string;
  created_at?: string;
}

export interface Team {
  id?: string;
  registration_id?: string;
  team_name?: string;
  college?: string;
  created_at?: string;
}

export interface Registration {
  id: string;
  registration_id: string;
  event_id: string;
  user_id: string;
  registration_type: 'individual' | 'team';
  team_name?: string | null;
  participant_email?: string | null;
  status: 'confirmed' | 'cancelled' | 'pending' | string;
  checked_in: boolean;
  checked_in_at?: string | null;
  checked_in_by?: string | null;
  created_at?: string;
  events?: Event;
  participants?: Participant[];
  teams?: Team[];
}

export interface Participant {
  id?: string;
  registration_id: string;
  user_id?: string | null;
  name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  student_id?: string | null;
  food_preference?: string;
  is_team_leader?: boolean;
  created_at?: string;
}

export interface Database {
  public: {
    Tables: {
      events: {
        Row: Event;
        Insert: Omit<Event, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Event>;
      };
      registrations: {
        Row: Registration;
        Insert: Omit<Registration, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Registration>;
      };
      participants: {
        Row: Participant;
        Insert: Omit<Participant, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Participant>;
      };
      teams: {
        Row: Team;
        Insert: Omit<Team, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Team>;
      };
    };
  };
}