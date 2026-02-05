"use client"

import { useState } from "react"
import {
  Activity,
  Play,
  Square,
  RotateCcw,
  Trash2,
  MoreVertical,
  Terminal,
  ChevronDown,
  Clock,
  Cpu,
  HardDrive,
  Zap,
  AlertCircle,
  CheckCircle,
  XCircle,
  Copy,
  ExternalLink,
  Plus,
  Server,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockInstances, mockAgents } from "@/lib/store"
import type { Instance } from "@/lib/types"

export function InstanceManagerView() {
  const [instances, setInstances] = useState<Instance[]>(mockInstances)
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(null)
  const [isLaunching, setIsLaunching] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState<string>("")

  const handleStatusChange = (instanceId: string, status: Instance["status"]) => {
    setInstances(
      instances.map((i) => (i.id === instanceId ? { ...i, status } : i))
    )
    if (selectedInstance?.id === instanceId) {
      setSelectedInstance({ ...selectedInstance, status })
    }
  }

  const handleDelete = (instanceId: string) => {
    setInstances(instances.filter((i) => i.id !== instanceId))
    if (selectedInstance?.id === instanceId) setSelectedInstance(null)
  }

  const handleLaunchInstance = () => {
    if (!selectedAgentId) return
    const agent = mockAgents.find((a) => a.id === selectedAgentId)
    if (!agent) return

    const newInstance: Instance = {
      id: `inst-${Date.now()}`,
      agentId: agent.id,
      agentName: agent.name,
      status: "running",
      startedAt: new Date(),
      logs: [
        { id: "l1", timestamp: new Date(), level: "info", message: "Instance started successfully" },
      ],
      metrics: {
        requestsPerMinute: 0,
        avgLatency: 0,
        errorRate: 0,
        tokensUsed: 0,
        uptime: 100,
      },
      connections: [],
    }
    setInstances([newInstance, ...instances])
    setIsLaunching(false)
    setSelectedAgentId("")
  }

  const statusConfig = {
    running: { color: "bg-green-500", icon: Activity, label: "Running" },
    stopped: { color: "bg-gray-500", icon: Square, label: "Stopped" },
    error: { color: "bg-red-500", icon: AlertCircle, label: "Error" },
    pending: { color: "bg-yellow-500", icon: Clock, label: "Pending" },
  }

  const formatUptime = (startedAt: Date) => {
    const diff = Date.now() - startedAt.getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(hours / 24)
    if (days > 0) return `${days}d ${hours % 24}h`
    return `${hours}h`
  }

  return (
    <div className="px-4 pb-24 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Running Instances</h2>
          <p className="text-sm text-muted-foreground">
            {instances.filter((i) => i.status === "running").length} active of {instances.length}
          </p>
        </div>
        <Button onClick={() => setIsLaunching(true)} className="glow-primary">
          <Plus className="h-4 w-4 mr-2" />
          Launch
        </Button>
      </div>

      {/* Instance List */}
      <div className="space-y-3">
        {instances.map((instance) => {
          const status = statusConfig[instance.status]
          const StatusIcon = status.icon
          return (
            <Card
              key={instance.id}
              className="bg-card/50 hover:bg-card/70 transition-colors cursor-pointer"
              onClick={() => setSelectedInstance(instance)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
                        <Server className="h-5 w-5" />
                      </div>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ${status.color} ${
                          instance.status === "running" ? "pulse-ring" : ""
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{instance.agentName}</h3>
                        <Badge
                          variant="secondary"
                          className={`${
                            instance.status === "running"
                              ? "bg-green-500/10 text-green-500"
                              : instance.status === "error"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-gray-500/10 text-gray-500"
                          }`}
                        >
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">{instance.id}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatUptime(instance.startedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {instance.metrics.requestsPerMinute}/min
                        </span>
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
                      {instance.status === "running" ? (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(instance.id, "stopped")}
                        >
                          <Square className="h-4 w-4 mr-2" />
                          Stop
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(instance.id, "running")}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(instance.id, "pending")}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Restart
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(instance.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Terminate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Metrics Bar */}
                <div className="mt-3 pt-3 border-t border-border/50 grid grid-cols-4 gap-2">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Latency</p>
                    <p className="text-sm font-medium">{instance.metrics.avgLatency}ms</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Errors</p>
                    <p className="text-sm font-medium">{(instance.metrics.errorRate * 100).toFixed(1)}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Tokens</p>
                    <p className="text-sm font-medium">{(instance.metrics.tokensUsed / 1000).toFixed(0)}k</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Uptime</p>
                    <p className="text-sm font-medium">{instance.metrics.uptime}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Launch Instance Sheet */}
      <Sheet open={isLaunching} onOpenChange={setIsLaunching}>
        <SheetContent side="bottom" className="h-[50vh] rounded-t-3xl">
          <SheetHeader className="mb-6">
            <SheetTitle>Launch New Instance</SheetTitle>
            <SheetDescription>Select an agent to deploy as a new instance</SheetDescription>
          </SheetHeader>
          <div className="space-y-4">
            <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an agent..." />
              </SelectTrigger>
              <SelectContent>
                {mockAgents
                  .filter((a) => a.status === "active")
                  .map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setIsLaunching(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1 glow-primary"
                onClick={handleLaunchInstance}
                disabled={!selectedAgentId}
              >
                <Play className="h-4 w-4 mr-2" />
                Launch Instance
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Instance Detail Sheet */}
      <Sheet open={!!selectedInstance} onOpenChange={() => setSelectedInstance(null)}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
          {selectedInstance && (
            <>
              <SheetHeader className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                        <Server className="h-6 w-6" />
                      </div>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ${
                          statusConfig[selectedInstance.status].color
                        }`}
                      />
                    </div>
                    <div>
                      <SheetTitle>{selectedInstance.agentName}</SheetTitle>
                      <SheetDescription className="font-mono text-xs">
                        {selectedInstance.id}
                      </SheetDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {selectedInstance.status === "running" ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleStatusChange(selectedInstance.id, "stopped")}
                      >
                        <Square className="h-4 w-4 mr-1" />
                        Stop
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="glow-primary"
                        onClick={() => handleStatusChange(selectedInstance.id, "running")}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    )}
                  </div>
                </div>
              </SheetHeader>

              <Tabs defaultValue="metrics" className="flex-1">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                  <TabsTrigger value="logs">Logs</TabsTrigger>
                  <TabsTrigger value="config">Config</TabsTrigger>
                </TabsList>

                <TabsContent value="metrics" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="bg-secondary/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">Requests/min</span>
                        </div>
                        <p className="text-2xl font-bold">
                          {selectedInstance.metrics.requestsPerMinute}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">Avg Latency</span>
                        </div>
                        <p className="text-2xl font-bold">
                          {selectedInstance.metrics.avgLatency}
                          <span className="text-sm font-normal text-muted-foreground">ms</span>
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-muted-foreground">Error Rate</span>
                        </div>
                        <p className="text-2xl font-bold">
                          {(selectedInstance.metrics.errorRate * 100).toFixed(2)}%
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Cpu className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">Tokens Used</span>
                        </div>
                        <p className="text-2xl font-bold">
                          {(selectedInstance.metrics.tokensUsed / 1000).toFixed(1)}k
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  <Card className="bg-secondary/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground">Uptime</span>
                        <span className="font-bold text-green-500">
                          {selectedInstance.metrics.uptime}%
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all"
                          style={{ width: `${selectedInstance.metrics.uptime}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="logs" className="mt-4">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2 pr-4">
                      {selectedInstance.logs.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          No logs available
                        </p>
                      ) : (
                        selectedInstance.logs.map((log) => (
                          <div
                            key={log.id}
                            className={`p-3 rounded-lg text-sm font-mono ${
                              log.level === "error"
                                ? "bg-red-500/10 border border-red-500/20"
                                : log.level === "warn"
                                ? "bg-yellow-500/10 border border-yellow-500/20"
                                : "bg-secondary/50"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                variant="secondary"
                                className={`text-xs ${
                                  log.level === "error"
                                    ? "bg-red-500/20 text-red-500"
                                    : log.level === "warn"
                                    ? "bg-yellow-500/20 text-yellow-500"
                                    : "bg-blue-500/20 text-blue-500"
                                }`}
                              >
                                {log.level.toUpperCase()}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {log.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-xs">{log.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="config" className="mt-4 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <div>
                        <p className="font-medium text-sm">Instance ID</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {selectedInstance.id}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <div>
                        <p className="font-medium text-sm">Agent ID</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {selectedInstance.agentId}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <div>
                        <p className="font-medium text-sm">Started At</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedInstance.startedAt.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <div>
                        <p className="font-medium text-sm">Connections</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedInstance.connections.length} active
                        </p>
                      </div>
                    </div>
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
