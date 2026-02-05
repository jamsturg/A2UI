export interface Agent {
  id: string
  name: string
  description: string
  model: string
  systemPrompt: string
  tools: Tool[]
  triggers: Trigger[]
  status: "draft" | "active" | "paused" | "archived"
  createdAt: Date
  updatedAt: Date
}

export interface Tool {
  id: string
  name: string
  type: "api" | "function" | "webhook" | "database"
  config: Record<string, unknown>
  description: string
}

export interface Trigger {
  id: string
  type: "schedule" | "webhook" | "event" | "manual"
  config: Record<string, unknown>
}

export interface Instance {
  id: string
  agentId: string
  agentName: string
  status: "running" | "stopped" | "error" | "pending"
  startedAt: Date
  logs: LogEntry[]
  metrics: InstanceMetrics
  connections: Connection[]
}

export interface LogEntry {
  id: string
  timestamp: Date
  level: "info" | "warn" | "error" | "debug"
  message: string
  metadata?: Record<string, unknown>
}

export interface InstanceMetrics {
  requestsPerMinute: number
  avgLatency: number
  errorRate: number
  tokensUsed: number
  uptime: number
}

export interface Connection {
  id: string
  sourceInstanceId: string
  targetInstanceId: string
  type: "data" | "trigger" | "bidirectional"
  status: "active" | "inactive" | "error"
  config: ConnectionConfig
}

export interface ConnectionConfig {
  dataMapping?: Record<string, string>
  filterConditions?: string[]
  transformations?: string[]
}

export interface MarketplaceAgent {
  id: string
  name: string
  description: string
  author: string
  downloads: number
  rating: number
  tags: string[]
  price: number | "free"
  previewImage?: string
}

export interface WorkflowNode {
  id: string
  type: "agent" | "trigger" | "condition" | "action" | "output"
  position: { x: number; y: number }
  data: Record<string, unknown>
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  type: "default" | "conditional"
  label?: string
}
