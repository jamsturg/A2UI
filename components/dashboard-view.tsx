"use client"

import { Activity, Bot, GitBranch, Zap, TrendingUp, TrendingDown, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { mockAgents, mockInstances } from "../lib/store"

const stats = [
  {
    label: "Active Agents",
    value: mockAgents.filter((a) => a.status === "active").length,
    total: mockAgents.length,
    icon: Bot,
    trend: "+2",
    trendUp: true,
  },
  {
    label: "Running Instances",
    value: mockInstances.filter((i) => i.status === "running").length,
    total: mockInstances.length,
    icon: Activity,
    trend: "+5",
    trendUp: true,
  },
  {
    label: "Connections",
    value: 4,
    total: 10,
    icon: GitBranch,
    trend: "+1",
    trendUp: true,
  },
  {
    label: "API Calls Today",
    value: "12.4k",
    total: "15k",
    icon: Zap,
    trend: "-8%",
    trendUp: false,
  },
]

const recentActivity = [
  { id: 1, action: "Agent deployed", agent: "Customer Support Bot", time: "2 min ago", type: "success" },
  { id: 2, action: "Error detected", agent: "Data Analyzer", time: "15 min ago", type: "error" },
  { id: 3, action: "Connection established", agent: "Content Generator", time: "1 hour ago", type: "info" },
  { id: 4, action: "Instance scaled", agent: "Customer Support Bot", time: "3 hours ago", type: "success" },
]

export function DashboardView() {
  return (
    <div className="px-4 pb-24 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <Badge
                    variant="secondary"
                    className={stat.trendUp ? "text-green-500" : "text-red-500"}
                  >
                    {stat.trendUp ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {stat.trend}
                  </Badge>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card className="bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-2">
          <button className="flex flex-col items-center gap-2 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors">
            <Bot className="h-5 w-5 text-primary" />
            <span className="text-xs font-medium">New Agent</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
            <Activity className="h-5 w-5" />
            <span className="text-xs font-medium">Launch</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
            <GitBranch className="h-5 w-5" />
            <span className="text-xs font-medium">Connect</span>
          </button>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card className="bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">System Health</CardTitle>
          <CardDescription>Overall platform performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">CPU Usage</span>
              <span className="font-medium">42%</span>
            </div>
            <Progress value={42} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Memory</span>
              <span className="font-medium">68%</span>
            </div>
            <Progress value={68} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Token Quota</span>
              <span className="font-medium">83%</span>
            </div>
            <Progress value={83} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50"
            >
              <div
                className={`h-2 w-2 rounded-full ${
                  activity.type === "success"
                    ? "bg-green-500"
                    : activity.type === "error"
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.action}</p>
                <p className="text-xs text-muted-foreground truncate">{activity.agent}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {activity.time}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
