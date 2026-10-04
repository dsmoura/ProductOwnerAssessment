export type Tier = 'E' | 'A'
export type Localized = { pt: string; en: string }

export const DOMAIN_IDS = [
  'agile',
  'strategy',
  'backlog',
  'discovery',
  'people',
  'business',
  'change',
  'delivery',
  'metrics',
  'ai',
] as const
export type DomainId = (typeof DOMAIN_IDS)[number]

export type Domain = { id: DomainId; name: Localized; profile: Localized }

// The 10 areas and the Essential/Advanced balance per area are the app's proposal; the original spreadsheet only
// splits Essenciais / Diferenciais and has no areas.
export const DOMAINS: Record<DomainId, Domain> = {
  agile: { id: 'agile', name: { pt: 'Métodos Ágeis', en: 'Agile Methods' }, profile: { pt: 'Guardião do Fluxo', en: 'Flow Keeper' } },
  strategy: { id: 'strategy', name: { pt: 'Estratégia de Produto', en: 'Product Strategy' }, profile: { pt: 'Estrategista de Produto', en: 'Product Strategist' } },
  backlog: { id: 'backlog', name: { pt: 'Backlog & Requisitos', en: 'Backlog & Requirements' }, profile: { pt: 'Arquiteto de Backlog', en: 'Backlog Architect' } },
  discovery: { id: 'discovery', name: { pt: 'Usuário & Discovery', en: 'Users & Discovery' }, profile: { pt: 'Explorador do Usuário', en: 'User Explorer' } },
  people: { id: 'people', name: { pt: 'Pessoas & Colaboração', en: 'People & Collaboration' }, profile: { pt: 'Conector', en: 'Connector' } },
  business: { id: 'business', name: { pt: 'Negócio & Mercado', en: 'Business & Market' }, profile: { pt: 'Visão de Mercado', en: 'Market Thinker' } },
  change: { id: 'change', name: { pt: 'Projetos & Mudança', en: 'Projects & Change' }, profile: { pt: 'Agente de Mudança', en: 'Change Agent' } },
  delivery: { id: 'delivery', name: { pt: 'Engenharia & Entrega', en: 'Engineering & Delivery' }, profile: { pt: 'Parceiro da Engenharia', en: 'Engineering Partner' } },
  metrics: { id: 'metrics', name: { pt: 'CX & Métricas', en: 'CX & Metrics' }, profile: { pt: 'Orientado a Resultados', en: 'Outcome Driver' } },
  ai: { id: 'ai', name: { pt: 'Inteligência Artificial', en: 'Artificial Intelligence' }, profile: { pt: 'Construtor com IA', en: 'AI Builder' } },
}

export type Skill = { id: string; tier: Tier; domain: DomainId; name: Localized }

const s = (id: string, tier: Tier, domain: DomainId, pt: string, en: string): Skill => ({
  id,
  tier,
  domain,
  name: { pt, en },
})

// Same order as the original spreadsheet (sheet "1. Assessment", rows 8–66). `name.pt` must match it exactly for the xlsx import.
// Tiers follow the spreadsheet (Diferenciais = 'A') except where an area needed both levels: dual-track moved to
// Advanced; facilitation, business-model-canvas, lean-startup, project-management, agile-testing, data-driven and
// outcome-metrics moved to Essential.
export const SHEET_SKILLS: Skill[] = [
  s('agile-manifesto', 'E', 'agile', 'Manifesto Ágil', 'Agile Manifesto'),
  s('product-development', 'E', 'strategy', 'Desenvolvimento de Produto', 'Product Development'),
  s('product-lifecycle', 'E', 'strategy', 'Ciclo de Vida de Produto', 'Product Lifecycle'),
  s('dual-track', 'A', 'strategy', 'Dual Track Development (Discovery & Delivery)', 'Dual Track Development (Discovery & Delivery)'),
  s('scrum', 'E', 'agile', 'Scrum, Valores, Pilares, Artefatos, Papéis, Eventos', 'Scrum: Values, Pillars, Artifacts, Roles, Events'),
  s('sprint', 'E', 'agile', 'Sprint', 'Sprint'),
  s('sprint-planning', 'E', 'agile', 'Sprint Planning', 'Sprint Planning'),
  s('daily', 'E', 'agile', 'Daily', 'Daily Scrum'),
  s('sprint-review', 'E', 'agile', 'Sprint Review', 'Sprint Review'),
  s('sprint-retrospective', 'E', 'agile', 'Sprint Retrospective', 'Sprint Retrospective'),
  s('backlog-refinement', 'E', 'agile', 'Backlog Refinement', 'Backlog Refinement'),
  s('working-with-developers', 'E', 'people', 'Trabalhando com Desenvolvedores de Produto', 'Working with Product Developers'),
  s('stakeholder-management', 'E', 'people', 'Gestão de Stakeholders', 'Stakeholder Management'),
  s('product-vision', 'E', 'strategy', 'Visão de Produto', 'Product Vision'),
  s('product-inception', 'E', 'strategy', 'Inception de Produto', 'Product Inception'),
  s('product-roadmap', 'E', 'strategy', 'Roadmap de Produto', 'Product Roadmap'),
  s('release-plan', 'E', 'strategy', 'Release Plan', 'Release Plan'),
  s('mvp', 'E', 'strategy', 'MVP Produto Mínimo Viável', 'MVP Minimum Viable Product'),
  s('ux', 'E', 'discovery', 'User eXperience', 'User eXperience'),
  s('personas', 'E', 'discovery', 'Personas', 'Personas'),
  s('backlog-management', 'E', 'backlog', 'Gestão de Backlog', 'Backlog Management'),
  s('backlog-prioritization', 'E', 'backlog', 'Técnicas de Priorização de Backlog', 'Backlog Prioritization Techniques'),
  s('user-stories', 'E', 'backlog', 'Histórias de Usuário', 'User Stories'),
  s('acceptance-criteria', 'E', 'backlog', 'Critérios de Aceitação', 'Acceptance Criteria'),
  s('technical-debt', 'E', 'backlog', 'Dívida Técnica', 'Technical Debt'),
  s('user-feedback', 'E', 'discovery', 'Gestão de Feedback de Usuários', 'User Feedback Management'),
  s('dor', 'E', 'backlog', 'DoR Definition of Ready', 'DoR Definition of Ready'),
  s('dod', 'E', 'backlog', 'DoD Definition of Done', 'DoD Definition of Done'),

  s('negotiation', 'A', 'people', 'Negociação', 'Negotiation'),
  s('conflict-resolution', 'A', 'people', 'Resolução de Conflitos', 'Conflict Resolution'),
  s('nvc', 'A', 'people', 'CNV Comunicação Não-Violenta', 'NVC Nonviolent Communication'),
  s('facilitation', 'E', 'people', 'Facilitação', 'Facilitation'),
  s('business-agility', 'A', 'business', 'Business Agility', 'Business Agility'),
  s('lean-startup', 'E', 'business', 'Lean Startup', 'Lean Startup'),
  s('business-model-canvas', 'E', 'business', 'Business Model Canvas', 'Business Model Canvas'),
  s('data-driven', 'E', 'metrics', 'Cultura Data-Driven', 'Data-Driven Culture'),
  s('okrs', 'A', 'business', 'OKRs Objectives and Key Results', 'OKRs Objectives and Key Results'),
  s('ab-testing', 'A', 'metrics', 'Testes A/B', 'A/B Testing'),
  s('agile-at-scale', 'A', 'change', 'Ágil em Escala', 'Agile at Scale'),
  s('project-management', 'E', 'change', 'Gerenciamento de Projetos', 'Project Management'),
  s('change-management', 'A', 'change', 'Change Management', 'Change Management'),
  s('adkar', 'A', 'change', 'ADKAR', 'ADKAR'),
  s('lean-change', 'A', 'change', 'Lean Change Management', 'Lean Change Management'),
  s('design-thinking', 'A', 'discovery', 'Design Thinking', 'Design Thinking'),
  s('design-sprint', 'A', 'discovery', 'Design Sprint', 'Design Sprint'),
  s('lean-inception', 'A', 'discovery', 'Lean Inception', 'Lean Inception'),
  s('agile-testing', 'E', 'delivery', 'Agile Testing', 'Agile Testing'),
  s('bdd', 'A', 'delivery', 'BDD Behaviour-Driven Development', 'BDD Behaviour-Driven Development'),
  s('outcome-metrics', 'E', 'metrics', 'Métricas de Eficácia, Produto e Usuário', 'Effectiveness, Product and User Metrics'),
  s('efficiency-metrics', 'A', 'metrics', 'Métricas de Eficiência', 'Efficiency Metrics'),
  s('planning-poker', 'A', 'agile', 'Planning Poker', 'Planning Poker'),
  s('kanban', 'A', 'agile', 'Método Kanban', 'Kanban Method'),
  s('xp', 'A', 'agile', 'eXtreme Programming', 'eXtreme Programming'),
  s('management-30', 'A', 'agile', 'Management 3.0', 'Management 3.0'),
  s('lean', 'A', 'agile', 'Lean', 'Lean'),
  s('devops', 'A', 'delivery', 'DevOps', 'DevOps'),
  s('continuous-delivery', 'A', 'delivery', 'Entrega Contínua', 'Continuous Delivery'),
  s('feature-toggles', 'A', 'delivery', 'Feature Toggles', 'Feature Toggles'),
]

// Skills added by the app (not in the spreadsheet, so the xlsx import leaves them unrated).
export const NEW_SKILLS: Skill[] = [
  s('product-strategy', 'A', 'strategy', 'Estratégia e Posicionamento de Produto', 'Product Strategy & Positioning'),
  s('outcome-roadmap', 'A', 'strategy', 'Roadmap Orientado a Resultados (Now/Next/Later)', 'Outcome-Based Roadmap (Now/Next/Later)'),

  s('story-mapping', 'A', 'backlog', 'User Story Mapping', 'User Story Mapping'),
  s('cost-of-delay', 'A', 'backlog', 'Cost of Delay & WSJF', 'Cost of Delay & WSJF'),

  s('user-interviews', 'E', 'discovery', 'Entrevistas com Usuários', 'User Interviews'),
  s('usability-testing', 'E', 'discovery', 'Testes de Usabilidade', 'Usability Testing'),
  s('jtbd', 'A', 'discovery', 'Jobs to Be Done', 'Jobs to Be Done'),
  s('continuous-discovery', 'A', 'discovery', 'Continuous Discovery & Opportunity Solution Tree', 'Continuous Discovery & Opportunity Solution Tree'),

  s('business-case', 'E', 'business', 'Business Case & ROI', 'Business Case & ROI'),
  s('market-analysis', 'E', 'business', 'Análise de Mercado e Concorrência', 'Market & Competitive Analysis'),
  s('pricing', 'A', 'business', 'Precificação & Monetização', 'Pricing & Monetization'),
  s('go-to-market', 'A', 'business', 'Go-to-Market', 'Go-to-Market'),
  s('plg', 'A', 'business', 'Product-Led Growth', 'Product-Led Growth'),
  s('unit-economics', 'A', 'business', 'Unit Economics (CAC, LTV, Margem)', 'Unit Economics (CAC, LTV, Margin)'),

  s('risk-management', 'E', 'change', 'Gestão de Riscos', 'Risk Management'),
  s('dependency-management', 'E', 'change', 'Gestão de Dependências', 'Dependency Management'),
  s('forecasting', 'A', 'change', 'Estimativas & Forecasting (Monte Carlo)', 'Estimation & Forecasting (Monte Carlo)'),

  s('nfr', 'E', 'delivery', 'Requisitos Não Funcionais', 'Non-Functional Requirements'),
  s('software-architecture', 'E', 'delivery', 'Fundamentos de Arquitetura de Software', 'Software Architecture Fundamentals'),
  s('apis', 'E', 'delivery', 'APIs & Integrações', 'APIs & Integrations'),
  s('security-privacy', 'E', 'delivery', 'Segurança & Privacidade (LGPD)', 'Security & Privacy (GDPR/LGPD)'),
  s('cloud', 'A', 'delivery', 'Cloud & Arquitetura Escalável', 'Cloud & Scalable Architecture'),
  s('observability', 'A', 'delivery', 'Observabilidade & Confiabilidade (SLI/SLO)', 'Observability & Reliability (SLI/SLO)'),

  s('nps', 'E', 'metrics', 'NPS Net Promoter Score', 'NPS Net Promoter Score'),
  s('csat-ces', 'E', 'metrics', 'CSAT & CES', 'CSAT & CES'),
  s('customer-journey', 'E', 'metrics', 'Jornada do Cliente', 'Customer Journey'),
  s('north-star', 'A', 'metrics', 'North Star Metric', 'North Star Metric'),
  s('metric-frameworks', 'A', 'metrics', 'Frameworks de Métricas (AARRR, HEART)', 'Metric Frameworks (AARRR, HEART)'),
  s('retention-churn', 'A', 'metrics', 'Retenção, Churn & Coortes', 'Retention, Churn & Cohorts'),
  s('product-analytics', 'A', 'metrics', 'Product Analytics (funis, eventos, SQL)', 'Product Analytics (funnels, events, SQL)'),

  s('ai-fundamentals', 'E', 'ai', 'Fundamentos de IA & LLMs', 'AI & LLM Fundamentals'),
  s('genai-po', 'E', 'ai', 'IA Generativa no Trabalho do PO', 'Generative AI in PO Work'),
  s('responsible-ai', 'E', 'ai', 'IA Responsável & Ética', 'Responsible AI & Ethics'),
  s('ai-products', 'A', 'ai', 'Produtos com IA (casos de uso, UX de IA)', 'AI-Powered Products (use cases, AI UX)'),
  s('ai-agents', 'A', 'ai', 'Agentes de IA & Automação', 'AI Agents & Automation'),
]

export const SKILLS: Skill[] = [...SHEET_SKILLS, ...NEW_SKILLS]

export const SKILL_IDS = new Set(SKILLS.map((sk) => sk.id))

// Within each area, essentials come before advanced skills; the stable sort keeps catalogue order inside a tier.
export const SKILLS_ESSENTIALS_FIRST = [...SKILLS].sort((a, b) => Number(a.tier === 'A') - Number(b.tier === 'A'))

export type Level = { min: number; max: number; title: Localized; action: Localized }

// Behavioural anchors for the 0–10 scale, so a "6" means the same thing to everyone.
export const LEVELS: Level[] = [
  {
    min: 0,
    max: 0,
    title: { pt: 'Desconheço', en: 'Unfamiliar' },
    action: {
      pt: 'Comece pelo básico: um artigo ou vídeo introdutório e um resumo de uma página.',
      en: 'Start with the basics: an introductory article or video and a one-page summary.',
    },
  },
  {
    min: 1,
    max: 2,
    title: { pt: 'Já ouvi falar', en: 'Heard of it' },
    action: {
      pt: 'Estude os conceitos e explique-os com suas palavras para alguém do time.',
      en: 'Study the concepts and explain them in your own words to someone on the team.',
    },
  },
  {
    min: 3,
    max: 4,
    title: { pt: 'Conheço a teoria', en: 'Know the theory' },
    action: {
      pt: 'Aplique em uma situação real na próxima sprint, mesmo que pequena.',
      en: 'Apply it to a real situation in the next sprint, even a small one.',
    },
  },
  {
    min: 5,
    max: 6,
    title: { pt: 'Aplico com apoio', en: 'Apply with support' },
    action: {
      pt: 'Pratique sem apoio e peça feedback ao time após cada uso.',
      en: 'Practise without support and ask the team for feedback after each use.',
    },
  },
  {
    min: 7,
    max: 8,
    title: { pt: 'Aplico com autonomia', en: 'Apply independently' },
    action: {
      pt: 'Compartilhe: facilite uma sessão ou mentore alguém nesse tema.',
      en: 'Share it: facilitate a session or mentor someone on this topic.',
    },
  },
  {
    min: 9,
    max: 10,
    title: { pt: 'Ensino e influencio', en: 'Teach and influence' },
    action: {
      pt: 'Referência no tema. Mantenha e ajude a organização a evoluir.',
      en: 'You are a reference on this. Keep it up and help the organisation grow.',
    },
  },
]
