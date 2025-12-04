// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      action_feedback: {
        Row: {
          created_at: string | null
          feedback_details: string | null
          feedback_type: string
          id: string
          suggested_action_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          feedback_details?: string | null
          feedback_type: string
          id?: string
          suggested_action_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          feedback_details?: string | null
          feedback_type?: string
          id?: string
          suggested_action_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "action_feedback_suggested_action_id_fkey"
            columns: ["suggested_action_id"]
            isOneToOne: false
            referencedRelation: "suggested_actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_requests: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      feelings_log: {
        Row: {
          ai_response: Json | null
          created_at: string | null
          feeling_category: string | null
          feeling_description: string
          id: string
          log_type: string
          user_id: string
        }
        Insert: {
          ai_response?: Json | null
          created_at?: string | null
          feeling_category?: string | null
          feeling_description: string
          id?: string
          log_type?: string
          user_id: string
        }
        Update: {
          ai_response?: Json | null
          created_at?: string | null
          feeling_category?: string | null
          feeling_description?: string
          id?: string
          log_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feelings_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entry_goals: {
        Row: {
          created_at: string | null
          feeling_log_id: string
          id: string
          wellbeing_goal_id: string
        }
        Insert: {
          created_at?: string | null
          feeling_log_id: string
          id?: string
          wellbeing_goal_id: string
        }
        Update: {
          created_at?: string | null
          feeling_log_id?: string
          id?: string
          wellbeing_goal_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entry_goals_feeling_log_id_fkey"
            columns: ["feeling_log_id"]
            isOneToOne: false
            referencedRelation: "feelings_log"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_entry_goals_wellbeing_goal_id_fkey"
            columns: ["wellbeing_goal_id"]
            isOneToOne: false
            referencedRelation: "wellbeing_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          ai_data_consent: boolean
          avatar_url: string | null
          created_at: string | null
          date_of_birth: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_notification_consent: boolean
          existing_diseases: string | null
          gender: string | null
          id: string
          medications: string | null
          name: string
          profession: string | null
          time_in_company: string | null
        }
        Insert: {
          ai_data_consent?: boolean
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_notification_consent?: boolean
          existing_diseases?: string | null
          gender?: string | null
          id: string
          medications?: string | null
          name: string
          profession?: string | null
          time_in_company?: string | null
        }
        Update: {
          ai_data_consent?: boolean
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_notification_consent?: boolean
          existing_diseases?: string | null
          gender?: string | null
          id?: string
          medications?: string | null
          name?: string
          profession?: string | null
          time_in_company?: string | null
        }
        Relationships: []
      }
      suggested_actions: {
        Row: {
          action_category: string | null
          action_description: string
          action_type: string | null
          completed_at: string | null
          created_at: string | null
          estimated_time: string | null
          feeling_log_id: string | null
          id: string
          is_completed: boolean
          steps: Json | null
          title: string | null
          user_id: string
          why_it_helps: string | null
        }
        Insert: {
          action_category?: string | null
          action_description: string
          action_type?: string | null
          completed_at?: string | null
          created_at?: string | null
          estimated_time?: string | null
          feeling_log_id?: string | null
          id?: string
          is_completed?: boolean
          steps?: Json | null
          title?: string | null
          user_id: string
          why_it_helps?: string | null
        }
        Update: {
          action_category?: string | null
          action_description?: string
          action_type?: string | null
          completed_at?: string | null
          created_at?: string | null
          estimated_time?: string | null
          feeling_log_id?: string | null
          id?: string
          is_completed?: boolean
          steps?: Json | null
          title?: string | null
          user_id?: string
          why_it_helps?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suggested_actions_feeling_log_id_fkey"
            columns: ["feeling_log_id"]
            isOneToOne: false
            referencedRelation: "feelings_log"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggested_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          created_at: string
          id: string
          is_dismissed: boolean
          is_read: boolean
          message: string
          notification_type: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_dismissed?: boolean
          is_read?: boolean
          message: string
          notification_type: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_dismissed?: boolean
          is_read?: boolean
          message?: string
          notification_type?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wellbeing_goals: {
        Row: {
          created_at: string | null
          end_date: string | null
          feeling_category_target: string | null
          goal_type: string
          id: string
          name: string
          start_date: string
          target_value: number
          time_period: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          feeling_category_target?: string | null
          goal_type: string
          id?: string
          name: string
          start_date?: string
          target_value: number
          time_period: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          feeling_category_target?: string | null
          goal_type?: string
          id?: string
          name?: string
          start_date?: string
          target_value?: number
          time_period?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wellbeing_goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

