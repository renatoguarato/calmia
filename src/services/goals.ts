import { supabase } from '@/lib/supabase/client'
import { WellbeingGoal } from '@/types/db'
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isAfter,
  isBefore,
  parseISO,
} from 'date-fns'

export type GoalProgress = {
  current: number
  target: number
  percentage: number
  status: 'Active' | 'Completed' | 'Expired'
}

export const goalsService = {
  async getGoals() {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('wellbeing_goals')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as WellbeingGoal[]
  },

  async getGoalById(id: string) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('wellbeing_goals')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (error) throw error
    return data as WellbeingGoal
  },

  async createGoal(
    goal: Omit<WellbeingGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
  ) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('wellbeing_goals')
      .insert({
        ...goal,
        user_id: session.user.id,
      })
      .select()
      .single()

    if (error) throw error
    return data as WellbeingGoal
  },

  async updateGoal(id: string, updates: Partial<WellbeingGoal>) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('wellbeing_goals')
      .update(updates)
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) throw error
    return data as WellbeingGoal
  },

  async deleteGoal(id: string) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('wellbeing_goals')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (error) throw error
  },

  async calculateProgress(goal: WellbeingGoal): Promise<GoalProgress> {
    const now = new Date()
    let startDate = parseISO(goal.start_date)
    let endDate = goal.end_date ? parseISO(goal.end_date) : null

    // Determine window based on time_period
    if (goal.time_period === 'daily') {
      startDate = startOfDay(now)
      endDate = endOfDay(now)
    } else if (goal.time_period === 'weekly') {
      startDate = startOfWeek(now)
      endDate = endOfWeek(now)
    } else if (goal.time_period === 'monthly') {
      startDate = startOfMonth(now)
      endDate = endOfMonth(now)
    } else {
      // Custom: use goal dates. If now is after end_date, use end_date as limit
      if (endDate && isAfter(now, endDate)) {
        // Logic: if expired, we still calculate what was done in the window
      }
    }

    // Ensure we don't look before goal start date even for periods
    const goalStart = parseISO(goal.start_date)
    if (isBefore(startDate, goalStart)) {
      startDate = goalStart
    }

    // If goal hasn't started yet
    if (isBefore(now, goalStart)) {
      return {
        current: 0,
        target: goal.target_value,
        percentage: 0,
        status: 'Active',
      }
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session)
      return {
        current: 0,
        target: goal.target_value,
        percentage: 0,
        status: 'Active',
      }

    let count = 0

    if (goal.goal_type === 'actions_completed') {
      const query = supabase
        .from('suggested_actions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .eq('is_completed', true)
        .gte('completed_at', startDate.toISOString())

      if (endDate) {
        query.lte('completed_at', endDate.toISOString())
      }

      const { count: c } = await query
      count = c || 0
    } else if (goal.goal_type === 'feelings') {
      // We need to check category. Since category might be in JSON, we fetch and filter
      // Optimization: filter by time first
      const query = supabase
        .from('feelings_log')
        .select('feeling_category, ai_response')
        .eq('user_id', session.user.id)
        .gte('created_at', startDate.toISOString())

      if (endDate) {
        query.lte('created_at', endDate.toISOString())
      }

      const { data: logs } = await query

      if (logs) {
        count = logs.filter((log) => {
          // Check direct category
          if (
            log.feeling_category?.toLowerCase() ===
            goal.feeling_category_target?.toLowerCase()
          )
            return true

          // Check AI response
          const aiMeta = (log.ai_response as any)?.metadata?.primary_categories
          if (Array.isArray(aiMeta)) {
            return aiMeta.some(
              (c: string) =>
                c.toLowerCase() === goal.feeling_category_target?.toLowerCase(),
            )
          }
          return false
        }).length
      }
    }

    const percentage = Math.min(
      Math.round((count / goal.target_value) * 100),
      100,
    )

    let status: 'Active' | 'Completed' | 'Expired' = 'Active'
    if (count >= goal.target_value) {
      status = 'Completed'
    } else if (
      goal.end_date &&
      isAfter(now, parseISO(goal.end_date)) &&
      goal.time_period === 'custom'
    ) {
      status = 'Expired'
    }

    return {
      current: count,
      target: goal.target_value,
      percentage,
      status,
    }
  },
}
