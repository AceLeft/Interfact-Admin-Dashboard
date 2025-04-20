"use client"

import { Switch } from "@/components/ui/switch"

type Props = {
  checked: boolean
  onCheckedChange: (value: boolean) => void
}

export function ChartToggleSwitch({ checked, onCheckedChange }: Props) {
  return (
    <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm w-full max-w-md">
      <div className="space-y-0.5">
        <p className="text-sm font-medium">Switch View</p>
        <p className="text-sm text-muted-foreground">
          Toggle between hourly and daily block percentages.
        </p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}
