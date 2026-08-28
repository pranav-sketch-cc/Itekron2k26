export type EventCategory = 'Technical' | 'Non-Technical' | string;
export type TeamType = 'individual' | 'team';
export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'exempt';

export interface Event {
  id: string;
  name: string;
  category: EventCategory;
  type?: string;
  description: string;
  team_type: TeamType;
  team_size: string; // e.g., "1" or "2-4"
  date_time: string;
  venue: string;
  registration_deadline: string;
  rules_regulations: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Registration {
  id: string;
  registration_id: string;
  event_id: string;
  registration_type: TeamType;
  status: RegistrationStatus;
  payment_required: boolean;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at?: string;
  participant_email: string;
  user_id: string;
  checked_in_at: string | null;
  checked_in_by: string | null;
  
  // Joined relation fields for convenience
  events?: Event;
  participants?: Participant[];
  teams?: Team[];
}

export interface Participant {
  id: string;
  registration_id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  food_preference: 'Vegetarian' | 'Non-Vegetarian';
  created_at?: string;
  updated_at?: string;
}

export interface Team {
  id: string;
  registration_id: string;
  team_name: string;
  college: string;
  created_at?: string;
  updated_at?: string;
  team_members?: TeamMember[];
}

export interface TeamMember {
  id: string;
  team_id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  food_preference: 'Vegetarian' | 'Non-Vegetarian';
  is_team_leader: boolean;
  created_at?: string;
  updated_at?: string;
}