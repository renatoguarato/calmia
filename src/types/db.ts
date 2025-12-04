export interface Profile {
  id: string
  created_at: string
  name: string
  profession: string | null
  time_in_company: string | null
  date_of_birth: string | null
  gender: string | null
  existing_diseases: string | null
  medications: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  ai_data_consent: boolean
  avatar_url: string | null
}

export interface FeelingLog {
  id: string
  user_id: string
  created_at: string
  feeling_description: string
  feeling_category: string | null
  ai_response: AIRecommendationResponse | null
}

export interface SuggestedAction {
  id: string
  user_id: string
  feeling_log_id: string | null
  created_at: string
  action_description: string
  action_category: string | null
  is_completed: boolean
  completed_at: string | null
  title?: string
  estimated_time?: string
  steps?: string[]
  why_it_helps?: string
  action_type?: 'immediate' | 'routine'
}

export interface ActionFeedback {
  id: string
  user_id: string
  suggested_action_id: string
  created_at: string
  feedback_type: string
  feedback_details: string | null
}

export interface UserNotification {
  id: string
  user_id: string
  notification_type: string
  title: string
  message: string
  is_read: boolean
  is_dismissed: boolean
  created_at: string
}

export interface WellbeingGoal {
  id: string
  user_id: string
  name: string
  goal_type: 'feelings' | 'actions_completed'
  target_value: number
  time_period: 'daily' | 'weekly' | 'monthly' | 'custom'
  feeling_category_target: string | null
  start_date: string
  end_date: string | null
  created_at: string
  updated_at: string
}

// AI Response Types
export interface AIRecommendationResponse {
  empathy: string
  immediate_actions: AIActionItem[]
  routine_adjustments: AIRoutineItem[]
  leader_conversation: {
    is_appropriate: boolean
    suggested_message: string | null
    context: string | null
  }
  risk_assessment: {
    level: 'low' | 'medium' | 'high'
    requires_emergency: boolean
    emergency_instructions: string | null
    emergency_consent_request: string | null
    referral_needed: boolean
    referral_message: string | null
  }
  metadata: {
    word_count: number
    primary_categories: string[]
  }
}

export interface AIActionItem {
  title: string
  category: string
  estimated_time: string
  steps: string[]
  why_it_helps: string
}

export interface AIRoutineItem {
  title: string
  category: string
  timeframe: string
  instructions: string
}
