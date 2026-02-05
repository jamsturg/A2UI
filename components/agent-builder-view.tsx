"use client"

import { useState } from "react"
import {
  Bot,
  Plus,
  Settings,
  Trash2,
  Play,
  Pause,
  MoreVertical,
  ChevronRight,
  Wand2,
  Code,
  Webhook,
  Database,
  Clock,
  Zap,
  X,
  Check,
  Sparkles,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { mockAgents } from "../lib/store"
import type { Agent, Tool, Trigger } from "../lib/types"

const modelOptions = [
  { value: "gpt-4-turbo", label: "GPT-4 Turbo", provider: "OpenAI" },
  { value: "gpt-4o", label: "GPT-4o", provider: "OpenAI" },
  { value: "claude-3-opus", label: "Claude 3 Opus", provider: "Anthropic" },
  { value: "claude-3-sonnet", label: "Claude 3 Sonnet", provider: "Anthropic" },
  { value: "gemini-pro", label: "Gemini Pro", provider: "Google" },
  { value: "llama-3-70b", label: "Llama 3 70B", provider: "Meta" },
]

const toolTypes = [
  { type: "api", icon: Code, label: "API Call", description: "Make HTTP requests to external services" },
  { type: "function", icon: Wand2, label: "Custom Function", description: "Execute custom code logic" },
  { type: "webhook", icon: Webhook, label: "Webhook", description: "Send/receive webhook events" },
  { type: "database", icon: Database, label: "Database", description: "Query and update databases" },
]

const triggerTypes = [
  { type: "schedule", icon: Clock, label: "Schedule", description: "Run on a cron schedule" },
  { type: "webhook", icon: Webhook, label: "Webhook", description: "Trigger via HTTP endpoint" },
  { type: "event", icon: Zap, label: "Event", description: "React to system events" },
  { type: "manual", icon: Play, label: "Manual", description: "Start manually" },
]

export function AgentBuilderView() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newAgent, setNewAgent] = useState({
    name: "",
    description: "",
    model: "gpt-4-turbo",
    systemPrompt: "",
  })

  const handleCreateAgent = () => {
    if (!newAgent.name) return
    const agent: Agent = {
      id: `agent-${Date.now()}`,
      name: newAgent.name,
      description: newAgent.description,
      model: newAgent.model,
      systemPrompt: newAgent.systemPrompt,
      tools: [],
      triggers: [],
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setAgents([agent, ...agents])
    setNewAgent({ name: "", description: "", model: "gpt-4-turbo", systemPrompt: "" })
    setIsCreating(false)
    setSelectedAgent(agent)
  }

  const handleStatusChange = (agentId: string, status: Agent["status"]) => {
    setAgents(agents.map((a) => (a.id === agentId ? { ...a, status, updatedAt: new Date() } : a)))
  }

  const handleDeleteAgent = (agentId: string) => {
    setAgents(agents.filter((a) => a.id !== agentId))
    if (selectedAgent?.id === agentId) setSelectedAgent(null)
  }

  const statusColors = {
    draft: "bg-yellow-500/10 text-yellow-500",
    active: "bg-green-500/10 text-green-500",
    paused: "bg-orange-500/10 text-orange-500",
    archived: "bg-gray-500/10 text-gray-500",
  }

  return (
    <div className="px-4 pb-24 space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Your Agents</h2>
          <p className="text-sm text-muted-foreground">{agents.length} agents configured</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="glow-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Agent
        </Button>
      </div>

      {/* Agent List */}
      <div className="space-y-3">
        {agents.map((agent) => (
          <Card
            key={agent.id}
            className="bg-card/50 hover:bg-card/70 transition-colors cursor-pointer"
            onClick={() => setSelectedAgent(agent)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{agent.name}</h3>
                      <Badge className={statusColors[agent.status]}>{agent.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {agent.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{agent.model}</span>
                      <span>•</span>
                      <span>{agent.tools.length} tools</span>
                      <span>•</span>
                      <span>{agent.triggers.length} triggers</span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {agent.status === "active" ? (
                      <DropdownMenuItem onClick={() => handleStatusChange(agent.id, "paused")}>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => handleStatusChange(agent.id, "active")}>
                        <Play className="h-4 w-4 mr-2" />
                        Activate
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => setSelectedAgent(agent)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteAgent(agent.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Agent Sheet */}
      <Sheet open={isCreating} onOpenChange={setIsCreating}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
          <SheetHeader className="mb-6">
            <SheetTitle>Create New Agent</SheetTitle>
            <SheetDescription>Configure your AI agent with a model, tools, and triggers</SheetDescription>
          </SheetHeader>
          <div className="space-y-6 overflow-y-auto pb-8">
            <div className="space-y-2">
              <Label htmlFor="name">Agent Name</Label>
              <Input
                id="name"
                placeholder="e.g., Customer Support Bot"
                value={newAgent.name}
                onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="What does this agent do?"
                value={newAgent.description}
                onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">AI Model</Label>
              <Select
                value={newAgent.model}
                onValueChange={(value) => setNewAgent({ ...newAgent, model: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      <div className="flex items-center gap-2">
                        <span>{model.label}</span>
                        <Badge variant="secondary" className="text-xs">
                          {model.provider}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="systemPrompt">System Prompt</Label>
              <Textarea
                id="systemPrompt"
                placeholder="Define your agent's behavior and capabilities..."
                className="min-h-[120px]"
                value={newAgent.systemPrompt}
                onChange={(e) => setNewAgent({ ...newAgent, systemPrompt: e.target.value })}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button className="flex-1 glow-primary" onClick={handleCreateAgent}>
                <Sparkles className="h-4 w-4 mr-2" />
                Create Agent
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Agent Detail Sheet */}
      <Sheet open={!!selectedAgent} onOpenChange={() => setSelectedAgent(null)}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
          {selectedAgent && (
            <>
              <SheetHeader className="mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <SheetTitle>{selectedAgent.name}</SheetTitle>
                    <SheetDescription>{selectedAgent.description}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <Tabs defaultValue="config" className="flex-1">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="config">Config</TabsTrigger>
                  <TabsTrigger value="tools">Tools</TabsTrigger>
                  <TabsTrigger value="triggers">Triggers</TabsTrigger>
                </TabsList>
                <TabsContent value="config" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Select defaultValue={selectedAgent.model}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {modelOptions.map((model) => (
                          <SelectItem key={model.value} value={model.value}>
                            {model.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>System Prompt</Label>
                    <Textarea
                      defaultValue={selectedAgent.systemPrompt}
                      className="min-h-[150px]"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary">
                    <div>
                      <p className="font-medium">Agent Status</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedAgent.status === "active" ? "Running" : "Inactive"}
                      </p>
                    </div>
                    <Switch checked={selectedAgent.status === "active"} />
                  </div>
                </TabsContent>
                <TabsContent value="tools" className="mt-4 space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Add tools to extend your agent&apos;s capabilities
                  </p>
                  {selectedAgent.tools.map((tool) => (
                    <Card key={tool.id} className="bg-secondary/50">
                      <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Code className="h-4 w-4 text-primary" />
                          <div>
                            <p className="font-medium text-sm">{tool.name}</p>
                            <p className="text-xs text-muted-foreground">{tool.description}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <X className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {toolTypes.map((tool) => {
                      const Icon = tool.icon
                      return (
                        <button
                          key={tool.type}
                          className="flex items-center gap-2 p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-left"
                        >
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{tool.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </TabsContent>
                <TabsContent value="triggers" className="mt-4 space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure how your agent is triggered
                  </p>
                  {selectedAgent.triggers.map((trigger) => (
                    <Card key={trigger.id} className="bg-secondary/50">
                      <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Webhook className="h-4 w-4 text-primary" />
                          <div>
                            <p className="font-medium text-sm capitalize">{trigger.type}</p>
                            <p className="text-xs text-muted-foreground">
                              {JSON.stringify(trigger.config)}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <X className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {triggerTypes.map((trigger) => {
                      const Icon = trigger.icon
                      return (
                        <button
                          key={trigger.type}
                          className="flex items-center gap-2 p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-left"
                        >
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{trigger.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
