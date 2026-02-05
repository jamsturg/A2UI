import type { Agent, Instance, Connection, MarketplaceAgent } from "./types"

// Mock data for demonstration
export const mockAgents: Agent[] = [
  {
    id: "agent-1",
    name: "Customer Support Bot",
    description: "Handles customer inquiries and routes complex issues to human agents",
    model: "gpt-4-turbo",
    systemPrompt: "You are a helpful customer support agent...",
    tools: [
      { id: "t1", name: "Search KB", type: "api", config: {}, description: "Search knowledge base" },
      { id: "t2", name: "Create Ticket", type: "webhook", config: {}, description: "Create support ticket" },
    ],
    triggers: [{ id: "tr1", type: "webhook", config: { endpoint: "/api/chat" } }],
    status: "active",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "agent-2",
    name: "Data Analyzer",
    description: "Analyzes incoming data streams and generates insights",
    model: "claude-3-opus",
    systemPrompt: "You are a data analysis expert...",
    tools: [
      { id: "t3", name: "Query Database", type: "database", config: {}, description: "Run SQL queries" },
      { id: "t4", name: "Generate Report", type: "function", config: {}, description: "Generate PDF reports" },
    ],
    triggers: [{ id: "tr2", type: "schedule", config: { cron: "0 * * * *" } }],
    status: "active",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-25"),
  },
  {
    id: "agent-3",
    name: "Content Generator",
    description: "Creates marketing content based on product updates",
    model: "gpt-4-turbo",
    systemPrompt: "You are a creative content writer...",
    tools: [
      { id: "t5", name: "Image Gen", type: "api", config: {}, description: "Generate images with DALL-E" },
    ],
    triggers: [{ id: "tr3", type: "event", config: { event: "product.updated" } }],
    status: "paused",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-05"),
  },
]

export const mockInstances: Instance[] = [
  {
    id: "inst-1",
    agentId: "agent-1",
    agentName: "Customer Support Bot",
    status: "running",
    startedAt: new Date(Date.now() - 3600000 * 24),
    logs: [
      { id: "l1", timestamp: new Date(), level: "info", message: "Processing customer query..." },
      { id: "l2", timestamp: new Date(), level: "info", message: "Response generated successfully" },
    ],
    metrics: {
      requestsPerMinute: 45,
      avgLatency: 234,
      errorRate: 0.02,
      tokensUsed: 125000,
      uptime: 99.8,
    },
    connections: [],
  },
  {
    id: "inst-2",
    agentId: "agent-2",
    agentName: "Data Analyzer",
    status: "running",
    startedAt: new Date(Date.now() - 3600000 * 48),
    logs: [
      { id: "l3", timestamp: new Date(), level: "info", message: "Scheduled analysis started" },
      { id: "l4", timestamp: new Date(), level: "warn", message: "High memory usage detected" },
    ],
    metrics: {
      requestsPerMinute: 12,
      avgLatency: 1523,
      errorRate: 0.01,
      tokensUsed: 89000,
      uptime: 99.95,
    },
    connections: [],
  },
  {
    id: "inst-3",
    agentId: "agent-1",
    agentName: "Customer Support Bot (Staging)",
    status: "stopped",
    startedAt: new Date(Date.now() - 3600000 * 72),
    logs: [],
    metrics: {
      requestsPerMinute: 0,
      avgLatency: 0,
      errorRate: 0,
      tokensUsed: 45000,
      uptime: 0,
    },
    connections: [],
  },
]

export const mockConnections: Connection[] = [
  {
    id: "conn-1",
    sourceInstanceId: "inst-1",
    targetInstanceId: "inst-2",
    type: "data",
    status: "active",
    config: {
      dataMapping: { customerQuery: "analysisInput" },
    },
  },
]

export const mockMarketplaceAgents: MarketplaceAgent[] = [
  {
    id: "mp-1",
    name: "Email Assistant Pro",
    description: "Automated email drafting and response suggestions with smart categorization",
    author: "AgentForge Team",
    downloads: 12500,
    rating: 4.8,
    tags: ["email", "productivity", "automation"],
    price: "free",
  },
  {
    id: "mp-2",
    name: "Code Review Bot",
    description: "AI-powered code review with security scanning and best practice suggestions",
    author: "DevTools Inc",
    downloads: 8900,
    rating: 4.6,
    tags: ["development", "code-review", "security"],
    price: 29,
  },
  {
    id: "mp-3",
    name: "Social Media Manager",
    description: "Schedule, create, and analyze social media content across platforms",
    author: "SocialAI Labs",
    downloads: 15200,
    rating: 4.7,
    tags: ["social-media", "marketing", "content"],
    price: 49,
  },
  {
    id: "mp-4",
    name: "Research Assistant",
    description: "Deep research capabilities with source verification and citation generation",
    author: "Academic Tools",
    downloads: 6700,
    rating: 4.9,
    tags: ["research", "academic", "writing"],
    price: "free",
  },
  {
    id: "mp-5",
    name: "Sales Pipeline Agent",
    description: "Automate lead qualification, follow-ups, and CRM data entry",
    author: "SalesForce Pro",
    downloads: 4300,
    rating: 4.5,
    tags: ["sales", "crm", "automation"],
    price: 79,
  },
  {
    id: "mp-6",
    name: "Document Processor",
    description: "Extract, classify, and process documents with OCR and NLP",
    author: "DocuAI",
    downloads: 9800,
    rating: 4.4,
    tags: ["documents", "ocr", "processing"],
    price: 39,
  },
]
