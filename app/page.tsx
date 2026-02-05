"use client"

import { useState } from "react"
import { MobileNav } from "@/components/mobile-nav"
import { AppHeader } from "@/components/app-header"
import { DashboardView } from "@/components/dashboard-view"
import { AgentBuilderView } from "@/components/agent-builder-view"
import { InstanceManagerView } from "@/components/instance-manager-view"
import { ConnectionHubView } from "@/components/connection-hub-view"
import { MarketplaceView } from "@/components/marketplace-view"

const titles: Record<string, string> = {
  dashboard: "AgentForge",
  builder: "Agent Builder",
  instances: "Instances",
  connections: "Connections",
  marketplace: "Marketplace",
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-background gradient-bg">
      <AppHeader title={titles[activeTab]} />
      
      <main className="pt-2">
        {activeTab === "dashboard" && <DashboardView />}
        {activeTab === "builder" && <AgentBuilderView />}
        {activeTab === "instances" && <InstanceManagerView />}
        {activeTab === "connections" && <ConnectionHubView />}
        {activeTab === "marketplace" && <MarketplaceView />}
      </main>

      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
