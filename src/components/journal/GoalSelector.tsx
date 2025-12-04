import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { WellbeingGoal } from '@/types/db'
import { Badge } from '@/components/ui/badge'

interface GoalSelectorProps {
  goals: WellbeingGoal[]
  selectedGoalIds: string[]
  onSelect: (goalIds: string[]) => void
}

export function GoalSelector({
  goals,
  selectedGoalIds,
  onSelect,
}: GoalSelectorProps) {
  const [open, setOpen] = React.useState(false)

  const toggleGoal = (goalId: string) => {
    if (selectedGoalIds.includes(goalId)) {
      onSelect(selectedGoalIds.filter((id) => id !== goalId))
    } else {
      onSelect([...selectedGoalIds, goalId])
    }
  }

  const selectedGoals = goals.filter((g) => selectedGoalIds.includes(g.id))

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedGoalIds.length > 0
              ? `${selectedGoalIds.length} meta(s) selecionada(s)`
              : 'Vincular a metas (opcional)'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar metas..." />
            <CommandList>
              <CommandEmpty>Nenhuma meta encontrada.</CommandEmpty>
              <CommandGroup>
                {goals.map((goal) => (
                  <CommandItem
                    key={goal.id}
                    value={goal.name}
                    onSelect={() => toggleGoal(goal.id)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedGoalIds.includes(goal.id)
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    {goal.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedGoals.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedGoals.map((goal) => (
            <Badge key={goal.id} variant="secondary" className="px-2 py-1">
              {goal.name}
              <button
                type="button"
                className="ml-2 hover:text-destructive focus:outline-none"
                onClick={() => toggleGoal(goal.id)}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
