export type UserRole = 'freelancer' | 'client' | 'both';

export type GigCategory = 
  | 'coding' 
  | 'web_dev' 
  | 'design' 
  | 'writing' 
  | 'video_editing' 
  | 'tutoring' 
  | 'other';

export type GigStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
export type ProposalStatus = 'pending' | 'accepted' | 'rejected';
export type OrderStatus = 'active' | 'delivered' | 'completed' | 'disputed' | 'cancelled';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  college_name: string;
  branch: string;
  year: string; // '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'Postgrad'
  avatar_url: string;
  skills: string[];
  role: UserRole;
  bio?: string;
  portfolio_links?: { title: string; url: string }[];
  verified_student: boolean;
  rating_average: number;
  rating_count: number;
  total_earned: number;
  total_spent: number;
  wallet_balance: number; // in INR ₹
  nav_coins: number; // In-game Nav Coins (100,000 Nav Coins = 1 INR ₹)
  created_at: string;
}

export interface Gig {
  id: string;
  client_id: string;
  client?: UserProfile;
  title: string;
  description: string;
  category: GigCategory;
  required_skills: string[];
  budget: number;
  currency: string;
  deadline: string; // ISO date
  turnaround_time: string;
  status: GigStatus;
  proposals_count?: number;
  created_at: string;
}

export interface Proposal {
  id: string;
  gig_id: string;
  freelancer_id: string;
  freelancer?: UserProfile;
  cover_message: string;
  bid_amount: number;
  estimated_days: number;
  status: ProposalStatus;
  created_at: string;
}

export interface OrderMessage {
  id: string;
  order_id: string;
  sender_id: string;
  sender?: UserProfile;
  message: string;
  attachment_url?: string;
  attachment_name?: string;
  created_at: string;
}

export interface Order {
  id: string;
  gig_id: string;
  gig?: Gig;
  client_id: string;
  client?: UserProfile;
  freelancer_id: string;
  freelancer?: UserProfile;
  proposal_id?: string;
  amount: number;
  status: OrderStatus;
  deliverable_note?: string;
  deliverable_links?: { title: string; url: string }[];
  submitted_at?: string;
  completed_at?: string;
  messages?: OrderMessage[];
  created_at: string;
}

export interface Review {
  id: string;
  order_id: string;
  reviewer_id: string;
  reviewer?: UserProfile;
  reviewee_id: string;
  rating: number; // 1 to 5
  comment: string;
  created_at: string;
}

export type MilestoneStatus = 
  | 'pending_approval' 
  | 'in_progress' 
  | 'submitted_for_review' 
  | 'completed';

export interface Milestone {
  id: string;
  gig_id: string;
  order_id?: string;
  title: string;
  description: string;
  amount: number;
  deadline: string;
  status: MilestoneStatus;
  deliverable_url?: string;
  submission_notes?: string;
  revision_feedback?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  gig_id?: string;
  client_id: string;
  client?: UserProfile;
  freelancer_id: string;
  freelancer?: UserProfile;
  created_at: string;
  updated_at: string;
  last_message_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender?: UserProfile;
  content: string;
  attachment_url?: string;
  attachment_name?: string;
  is_read: boolean;
  created_at: string;
}

export interface SkillMatchResult {
  score: number; // 0 - 100
  matchedSkills: string[];
  missingSkills: string[];
  fitLevel: 'Exceptional' | 'Strong' | 'Moderate' | 'Low';
  academicAffinity: boolean;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  order_id?: string;
  amount: number;
  type: 'credit' | 'debit' | 'escrow_hold' | 'escrow_release' | 'refund';
  description: string;
  created_at: string;
}
