import { supabase } from '@/lib/supabase/client'
import { WellbeingGoal, FeelingLog } from '@/types/db'
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
  eachDayOfInterval,
  format,
  isSameDay,
  addDays,
} from 'date-fns'

export type GoalProgress = {
  current: number
  target: number
  percentage: number
  status: 'Active' | 'Completed' | 'Expired'
}

export type GoalHistoryPoint = {
  date: string
  dateObj: Date
  value: number
  cumulative: number
  linkedEntries: FeelingLog[]
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
      .select(
        `
        *,
        journal_entry_goals (
          feeling_log_id,
          feelings_log (
            id,
            created_at,
            feeling_description,
            feeling_category,
            log_type,
            ai_response
          )
        )
      `,
      )
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (error) throw error

    // Transform data to include linked entries directly
    const goal = data as any
    if (goal.journal_entry_goals) {
      goal.linked_entries = goal.journal_entry_goals
        .map((item: any) => item.feelings_log)
        .filter(Boolean)
        .sort(
          (a: FeelingLog, b: FeelingLog) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        ) as FeelingLog[]
      delete goal.journal_entry_goals
    }

    return goal as WellbeingGoal
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

  async getGoalHistory(goal: WellbeingGoal): Promise<GoalHistoryPoint[]> {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error('User not authenticated')

    // Determine chart range (from start_date to end_date or today)
    const startDate = parseISO(goal.start_date)
    const endDate = goal.end_date ? parseISO(goal.end_date) : new Date()
    const now = new Date()
    const chartEndDate = isAfter(endDate, now) ? now : endDate

    // Create dates array
    const dates = eachDayOfInterval({ start: startDate, end: chartEndDate })

    // Fetch events
    let events: { date: Date }[] = []

    if (goal.goal_type === 'actions_completed') {
      const { data } = await supabase
        .from('suggested_actions')
        .select('completed_at')
        .eq('user_id', session.user.id)
        .eq('is_completed', true)
        .gte('completed_at', startDate.toISOString())
        .lte('completed_at', endOfDay(chartEndDate).toISOString())

      if (data) {
        events = data.map((d) => ({ date: parseISO(d.completed_at!) }))
      }
    } else if (goal.goal_type === 'feelings') {
      const { data } = await supabase
        .from('feelings_log')
        .select('created_at, feeling_category, ai_response')
        .eq('user_id', session.user.id)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endOfDay(chartEndDate).toISOString())

      if (data) {
        events = data
          .filter((log) => {
            if (
              log.feeling_category?.toLowerCase() ===
              goal.feeling_category_target?.toLowerCase()
            )
              return true
            const aiMeta = (log.ai_response as any)?.metadata
              ?.primary_categories
            if (Array.isArray(aiMeta)) {
              return aiMeta.some(
                (c: string) =>
                  c.toLowerCase() ===
                  goal.feeling_category_target?.toLowerCase(),
              )
            }
            return false
          })
          .map((d) => ({ date: parseISO(d.created_at!) }))
      }
    }

    // Build History Points
    let cumulative = 0
    const history: GoalHistoryPoint[] = dates.map((date) => {
      // Count events for this day
      const dailyEvents = events.filter((e) => isSameDay(e.date, date))
      const dailyCount = dailyEvents.length
      cumulative += dailyCount

      // Find linked journal entries for this day
      const linkedEntries =
        goal.linked_entries?.filter((entry) =>
          isSameDay(parseISO(entry.created_at), date),
        ) || []

      return {
        date: format(date, 'yyyy-MM-dd'),
        dateObj: date,
        value: dailyCount,
        cumulative: cumulative,
        linkedEntries,
      }
    })

    return history
  },
}
