"use client"

import { useState, useCallback } from "react"
import {
  GitBranch,
  Plus,
  ArrowRight,
  ArrowLeftRight,
  Zap,
  Database,
  Trash2,
  Settings,
  MoreVertical,
  Link,
  Unlink,
  RefreshCw,
  Check,
  X,
  Filter,
  ChevronRight,
  Server,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { mockInstances, mockConnections } from "@/lib/store"
import type { Connection, Instance } from "@/lib/types"

const connectionTypeConfig = {
  data: { icon: Database, label: "Data Flow", color: "text-blue-500" },
  trigger: { icon: Zap, label: "Trigger", color: "text-yellow-500" },
  bidirectional: { icon: ArrowLeftRight, label: "Bidirectional", color: "text-purple-500" },
}

export function ConnectionHubView() {
  const [connections, setConnections] = useState<Connection[]>(mockConnections)
  const [instances] = useState<Instance[]>(mockInstances)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null)
  const [newConnection, setNewConnection] = useState({
    sourceInstanceId: "",
    targetInstanceId: "",
    type: "data" as Connection["type"],
  })

  const getInstanceById = useCallback(
    (id: string) => instances.find((i) => i.id === id),
    [instances]
  )

  const handleCreateConnection = () => {
    if (!newConnection.sourceInstanceId || !newConnection.targetInstanceId) return
    
    const connection: Connection = {
      id: `conn-${Date.now()}`,
      sourceInstanceId: newConnection.sourceInstanceId,
      targetInstanceId: newConnection.targetInstanceId,
      type: newConnection.type,
      status: "active",
      config: {},
    }
    setConnections([...connections, connection])
    setNewConnection({ sourceInstanceId: "", targetInstanceId: "", type: "data" })
    setIsCreating(false)
  }

  const handleToggleStatus = (connectionId: string) => {
    setConnections(
      connections.map((c) =>
        c.id === connectionId
          ? { ...c, status: c.status === "active" ? "inactive" : "active" }
          : c
      )
    )
  }

  const handleDelete = (connectionId: string) => {
    setConnections(connections.filter((c) => c.id !== connectionId))
    if (selectedConnection?.id === connectionId) setSelectedConnection(null)
  }

  return (
    <div className="px-4 pb-24 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Connection Hub</h2>
          <p className="text-sm text-muted-foreground">
            {connections.filter((c) => c.status === "active").length} active connections
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="glow-primary">
          <Plus className="h-4 w-4 mr-2" />
          Connect
        </Button>
      </div>

      {/* Visual Network Overview */}
      <Card className="bg-card/50 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Network Overview</CardTitle>
          <CardDescription>Visual representation of instance connections</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="relative h-48 bg-secondary/30 rounded-xl overflow-hidden">
            {/* Network visualization placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-8">
                {instances.slice(0, 3).map((instance, index) => (
                  <div key={instance.id} className="relative">
                    <div
                      className={`h-14 w-14 rounded-xl flex items-center justify-center ${
                        instance.status === "running"
                          ? "bg-primary/20 border-2 border-primary"
                          : "bg-secondary border-2 border-border"
                      }`}
                    >
                      <Server className="h-6 w-6" />
                    </div>
                    <p className="text-xs text-center mt-2 truncate max-w-[80px]">
                      {instance.agentName.split(" ")[0]}
                    </p>
                    {index < instances.slice(0, 3).length - 1 && (
                      <div className="absolute top-6 -right-6 w-4 h-0.5 bg-primary/50" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-2 right-2">
              <Badge variant="secondary" className="text-xs">
                {instances.length} nodes
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connection List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">All Connections</h3>
          <Button variant="ghost" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        
        {connections.length === 0 ? (
          <Card className="bg-card/50">
            <CardContent className="p-8 text-center">
              <GitBranch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No connections configured yet</p>
              <Button onClick={() => setIsCreating(true)} variant="secondary">
                <Plus className="h-4 w-4 mr-2" />
                Create First Connection
              </Button>
            </CardContent>
          </Card>
        ) : (
          connections.map((connection) => {
            const sourceInstance = getInstanceById(connection.sourceInstanceId)
            const targetInstance = getInstanceById(connection.targetInstanceId)
            const typeConfig = connectionTypeConfig[connection.type]
            const TypeIcon = typeConfig.icon

            return (
              <Card
                key={connection.id}
                className="bg-card/50 hover:bg-card/70 transition-colors cursor-pointer"
                onClick={() => setSelectedConnection(connection)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Source */}
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                            sourceInstance?.status === "running"
                              ? "bg-green-500/10"
                              : "bg-secondary"
                          }`}
                        >
                          <Server className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium truncate">
                          {sourceInstance?.agentName.split(" ")[0] || "Unknown"}
                        </span>
                      </div>

                      {/* Connection Type */}
                      <div className="flex items-center gap-1 px-2">
                        <div className="h-px w-4 bg-border" />
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center bg-secondary ${typeConfig.color}`}
                        >
                          <TypeIcon className="h-4 w-4" />
                        </div>
                        <div className="h-px w-4 bg-border" />
                      </div>

                      {/* Target */}
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                            targetInstance?.status === "running"
                              ? "bg-green-500/10"
                              : "bg-secondary"
                          }`}
                        >
                          <Server className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium truncate">
                          {targetInstance?.agentName.split(" ")[0] || "Unknown"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-2">
                      <Badge
                        variant="secondary"
                        className={
                          connection.status === "active"
                            ? "bg-green-500/10 text-green-500"
                            : connection.status === "error"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-gray-500/10 text-gray-500"
                        }
                      >
                        {connection.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleToggleStatus(connection.id)}>
                            {connection.status === "active" ? (
                              <>
                                <Unlink className="h-4 w-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Link className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedConnection(connection)}>
                            <Settings className="h-4 w-4 mr-2" />
                            Configure
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(connection.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Create Connection Sheet */}
      <Sheet open={isCreating} onOpenChange={setIsCreating}>
        <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
          <SheetHeader className="mb-6">
            <SheetTitle>Create Connection</SheetTitle>
            <SheetDescription>
              Link two instances to enable data flow or event triggers
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Source Instance</Label>
              <Select
                value={newConnection.sourceInstanceId}
                onValueChange={(value) =>
                  setNewConnection({ ...newConnection, sourceInstanceId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source..." />
                </SelectTrigger>
                <SelectContent>
                  {instances.map((instance) => (
                    <SelectItem
                      key={instance.id}
                      value={instance.id}
                      disabled={instance.id === newConnection.targetInstanceId}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            instance.status === "running" ? "bg-green-500" : "bg-gray-500"
                          }`}
                        />
                        {instance.agentName}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ArrowRight className="h-5 w-5 text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Target Instance</Label>
              <Select
                value={newConnection.targetInstanceId}
                onValueChange={(value) =>
                  setNewConnection({ ...newConnection, targetInstanceId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select target..." />
                </SelectTrigger>
                <SelectContent>
                  {instances.map((instance) => (
                    <SelectItem
                      key={instance.id}
                      value={instance.id}
                      disabled={instance.id === newConnection.sourceInstanceId}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            instance.status === "running" ? "bg-green-500" : "bg-gray-500"
                          }`}
                        />
                        {instance.agentName}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Connection Type</Label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(connectionTypeConfig).map(([type, config]) => {
                  const Icon = config.icon
                  return (
                    <button
                      key={type}
                      onClick={() =>
                        setNewConnection({ ...newConnection, type: type as Connection["type"] })
                      }
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-colors ${
                        newConnection.type === type
                          ? "border-primary bg-primary/10"
                          : "border-border bg-secondary hover:bg-secondary/80"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${config.color}`} />
                      <span className="text-xs font-medium">{config.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1 glow-primary"
                onClick={handleCreateConnection}
                disabled={!newConnection.sourceInstanceId || !newConnection.targetInstanceId}
              >
                <Link className="h-4 w-4 mr-2" />
                Create Connection
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Connection Detail Sheet */}
      <Sheet open={!!selectedConnection} onOpenChange={() => setSelectedConnection(null)}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
          {selectedConnection && (
            <>
              <SheetHeader className="mb-4">
                <SheetTitle>Connection Settings</SheetTitle>
                <SheetDescription className="font-mono text-xs">
                  {selectedConnection.id}
                </SheetDescription>
              </SheetHeader>

              <Tabs defaultValue="overview" className="flex-1">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="mapping">Mapping</TabsTrigger>
                  <TabsTrigger value="filters">Filters</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4 space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Source</p>
                      <p className="font-medium">
                        {getInstanceById(selectedConnection.sourceInstanceId)?.agentName}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    <div className="space-y-1 text-right">
                      <p className="text-sm text-muted-foreground">Target</p>
                      <p className="font-medium">
                        {getInstanceById(selectedConnection.targetInstanceId)?.agentName}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Card className="bg-secondary/50">
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground mb-1">Type</p>
                        <p className="font-medium capitalize">{selectedConnection.type}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary/50">
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground mb-1">Status</p>
                        <Badge
                          className={
                            selectedConnection.status === "active"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-gray-500/10 text-gray-500"
                          }
                        >
                          {selectedConnection.status}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => handleToggleStatus(selectedConnection.id)}
                    >
                      {selectedConnection.status === "active" ? (
                        <>
                          <Unlink className="h-4 w-4 mr-2" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Link className="h-4 w-4 mr-2" />
                          Activate
                        </>
                      )}
                    </Button>
                    <Button variant="secondary">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Test
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="mapping" className="mt-4 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Configure how data is mapped between instances
                  </p>
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-secondary/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Field Mapping</Label>
                        <Button variant="ghost" size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input placeholder="source.field" className="flex-1" />
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="target.field" className="flex-1" />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="filters" className="mt-4 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Add conditions to filter data passing through this connection
                  </p>
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-secondary/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Filter Conditions</Label>
                        <Button variant="ghost" size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      <Textarea
                        placeholder="e.g., data.type === 'important'"
                        className="font-mono text-sm"
                      />
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
