"use client"

import { useState } from "react"
import {
  Store,
  Search,
  Download,
  Star,
  Filter,
  Check,
  ChevronRight,
  Tag,
  User,
  Sparkles,
  TrendingUp,
  Clock,
  Bot,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { mockMarketplaceAgents } from "@/lib/store"
import type { MarketplaceAgent } from "@/lib/types"

const categories = [
  { id: "all", label: "All" },
  { id: "productivity", label: "Productivity" },
  { id: "development", label: "Development" },
  { id: "marketing", label: "Marketing" },
  { id: "sales", label: "Sales" },
  { id: "research", label: "Research" },
]

export function MarketplaceView() {
  const [agents] = useState<MarketplaceAgent[]>(mockMarketplaceAgents)
  const [selectedAgent, setSelectedAgent] = useState<MarketplaceAgent | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [installedAgents, setInstalledAgents] = useState<string[]>([])

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      searchQuery === "" ||
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" ||
      agent.tags.some((tag) => tag.toLowerCase().includes(selectedCategory.toLowerCase()))
    return matchesSearch && matchesCategory
  })

  const handleInstall = (agentId: string) => {
    if (installedAgents.includes(agentId)) {
      setInstalledAgents(installedAgents.filter((id) => id !== agentId))
    } else {
      setInstalledAgents([...installedAgents, agentId])
    }
  }

  const featuredAgents = agents.slice(0, 3)
  const trendingAgents = [...agents].sort((a, b) => b.downloads - a.downloads).slice(0, 5)

  return (
    <div className="pb-24 space-y-6">
      {/* Search Header */}
      <div className="px-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search marketplace..."
            className="pl-10 bg-secondary border-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories */}
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Featured Section */}
      {searchQuery === "" && selectedCategory === "all" && (
        <div className="space-y-3">
          <div className="px-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Featured</h2>
            <Button variant="ghost" size="sm">
              See all
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <ScrollArea className="w-full">
            <div className="flex gap-3 px-4">
              {featuredAgents.map((agent) => (
                <Card
                  key={agent.id}
                  className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 min-w-[280px] cursor-pointer hover:border-primary/40 transition-colors"
                  onClick={() => setSelectedAgent(agent)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium truncate">{agent.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {agent.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs">{agent.rating}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {agent.price === "free" ? "Free" : `$${agent.price}`}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}

      {/* Trending Section */}
      {searchQuery === "" && selectedCategory === "all" && (
        <div className="px-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Trending</h2>
            </div>
          </div>
          <div className="space-y-2">
            {trendingAgents.slice(0, 3).map((agent, index) => (
              <Card
                key={agent.id}
                className="bg-card/50 hover:bg-card/70 transition-colors cursor-pointer"
                onClick={() => setSelectedAgent(agent)}
              >
                <CardContent className="p-3 flex items-center gap-3">
                  <span className="text-lg font-bold text-muted-foreground w-6">
                    {index + 1}
                  </span>
                  <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{agent.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {agent.downloads.toLocaleString()} downloads
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {agent.price === "free" ? "Free" : `$${agent.price}`}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Agents Grid */}
      <div className="px-4 space-y-3">
        <h2 className="text-lg font-semibold">
          {searchQuery ? "Search Results" : "All Agents"}
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {filteredAgents.map((agent) => {
            const isInstalled = installedAgents.includes(agent.id)
            return (
              <Card
                key={agent.id}
                className="bg-card/50 hover:bg-card/70 transition-colors cursor-pointer"
                onClick={() => setSelectedAgent(agent)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                      <Bot className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium truncate">{agent.name}</h3>
                        {isInstalled && (
                          <Badge className="bg-green-500/10 text-green-500 shrink-0">
                            <Check className="h-3 w-3 mr-1" />
                            Installed
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {agent.description}
                      </p>
                      <div className="flex items-center gap-3 pt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs">{agent.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Download className="h-3 w-3" />
                          {agent.downloads.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          {agent.author}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        {agent.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Agent Detail Sheet */}
      <Sheet open={!!selectedAgent} onOpenChange={() => setSelectedAgent(null)}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
          {selectedAgent && (
            <>
              <SheetHeader className="mb-4">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <SheetTitle className="text-xl">{selectedAgent.name}</SheetTitle>
                    <SheetDescription className="line-clamp-2">
                      {selectedAgent.description}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-xl bg-secondary/50">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold">{selectedAgent.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-secondary/50">
                    <p className="font-bold">{selectedAgent.downloads.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Downloads</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-secondary/50">
                    <p className="font-bold">
                      {selectedAgent.price === "free" ? "Free" : `$${selectedAgent.price}`}
                    </p>
                    <p className="text-xs text-muted-foreground">Price</p>
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{selectedAgent.author}</p>
                      <p className="text-xs text-muted-foreground">Publisher</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgent.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Capabilities</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Pre-configured prompts and workflows</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Built-in tool integrations</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Customizable parameters</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className={`w-full ${
                    installedAgents.includes(selectedAgent.id)
                      ? "bg-green-500 hover:bg-green-600"
                      : "glow-primary"
                  }`}
                  size="lg"
                  onClick={() => handleInstall(selectedAgent.id)}
                >
                  {installedAgents.includes(selectedAgent.id) ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Installed
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5 mr-2" />
                      {selectedAgent.price === "free"
                        ? "Install Free"
                        : `Purchase for $${selectedAgent.price}`}
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
