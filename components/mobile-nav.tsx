"use client"

import { cn } from "@/lib/utils"
import {
  Bot,
  Boxes,
  GitBranch,
  LayoutDashboard,
  Store,
} from "lucide-react"

interface MobileNavProps {
  activeView: string
  onViewChange: (view: string) => void
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "builder", label: "Builder", icon: Bot },
  { id: "instances", label: "Instances", icon: Boxes },
  { id: "connections", label: "Connect", icon: GitBranch },
  { id: "marketplace", label: "Market", icon: Store },
]

export function MobileNav({ activeView, onViewChange }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass safe-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "glow-primary")} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
