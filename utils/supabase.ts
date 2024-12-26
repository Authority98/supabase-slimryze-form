import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Form = {
  id: string;
  title: string;
  description?: string;
  has_disqualifier: boolean;
  permalink: string;
  user_id: string;
  created_at: string;
};

export type Question = {
  id: string;
  form_id: string;
  question_text: string;
  subtitle?: string;
  question_type: "text" | "single_choice" | "multiple_choice" | "disqualifier";
  is_required: boolean;
  question_order: number;
  options?: string[];
  created_at: string;
};

export type Response = {
  id: string;
  form_id: string;
  answers: Record<string, any>;
  created_at: string;
  is_disqualified: boolean;
};
