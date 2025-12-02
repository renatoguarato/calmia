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
}

export interface ActionFeedback {
  id: string
  user_id: string
  suggested_action_id: string
  created_at: string
  feedback_type: string
  feedback_details: string | null
}
