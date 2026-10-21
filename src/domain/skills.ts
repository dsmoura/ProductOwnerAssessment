export type Tier = 'E' | 'A'
export type Localized = { pt: string; en: string }

// Order = the steps of the rating flow and the axes of the radar: market and strategy, the user and how success is
// measured, then building and delivering, then the cross-cutting areas (AI, people).
export const DOMAIN_IDS = [
  'business',
  'strategy',
  'discovery',
  'metrics',
  'backlog',
  'agile',
  'delivery',
  'ai',
  'people',
] as const
export type DomainId = (typeof DOMAIN_IDS)[number]

export type Domain = { id: DomainId; name: Localized }

// The 9 areas and the Essential/Advanced balance per area are the app's proposal; the original spreadsheet only
// splits Essenciais / Diferenciais and has no areas.
export const DOMAINS: Record<DomainId, Domain> = {
  business: { id: 'business', name: { pt: 'Negócio & Mercado', en: 'Business & Market' } },
  strategy: { id: 'strategy', name: { pt: 'Estratégia de Produto', en: 'Product Strategy' } },
  discovery: { id: 'discovery', name: { pt: 'Usuário & Discovery', en: 'Users & Discovery' } },
  metrics: { id: 'metrics', name: { pt: 'CX & Métricas', en: 'CX & Metrics' } },
  backlog: { id: 'backlog', name: { pt: 'Backlog & Requisitos', en: 'Backlog & Requirements' } },
  agile: { id: 'agile', name: { pt: 'Métodos Ágeis & Scrum', en: 'Agile Methods & Scrum' } },
  delivery: { id: 'delivery', name: { pt: 'Engenharia & Entrega', en: 'Engineering & Delivery' } },
  ai: { id: 'ai', name: { pt: 'Inteligência Artificial', en: 'Artificial Intelligence' } },
  people: { id: 'people', name: { pt: 'Pessoas & Liderança', en: 'People & Leadership' } },
}

export type Skill = {
  id: string
  tier: Tier
  domain: DomainId
  name: Localized
  /** Row label in the original spreadsheet, when the app shows a different Portuguese name. */
  sheetName?: string
  /** A row of the original spreadsheet; added skills are left unrated by the xlsx import. */
  fromSheet: boolean
}

const skill =
  (fromSheet: boolean) =>
  (id: string, tier: Tier, domain: DomainId, pt: string, en: string, sheetName?: string): Skill => ({
    id,
    tier,
    domain,
    name: { pt, en },
    ...(sheetName && { sheetName }),
    fromSheet,
  })
/** A skill from the spreadsheet (sheet "1. Assessment"): `name.pt` (or `sheetName`, when renamed) must match its row exactly. */
const s = skill(true)
/** A skill added by the app. */
const n = skill(false)

/** The label the xlsx import matches against. */
export const sheetLabel = (skill: Skill) => skill.sheetName ?? skill.name.pt

// Display order: grouped by area in DOMAIN_IDS order, essentials first, each tier sorted by Portuguese name. The xlsx
// import matches by label, so the order is free.
// Tiers follow the spreadsheet (Diferenciais = 'A') except where an area needed both levels or by product decision:
// product-inception, mvp, dual-track and technical-debt moved to Advanced; facilitation, business-model-canvas, okrs,
// agile-testing and negotiation moved to Essential. Management 3.0, Lean, ADKAR, Lean Change Management, Métricas de
// Eficiência, Métricas de Eficácia, Produto e Usuário, Cultura Data-Driven, Gestão de Feedback de Usuários, CNV
// Comunicação Não-Violenta, Desenvolvimento de Produto, Gestão de Backlog, Gerenciamento de Projetos, Sprint, Sprint
// Retrospective, Daily, Business Agility and Release Plan were dropped; Lean Inception was merged into
// product-inception, Entrega Contínua into devops and Resolução de Conflitos into negotiation (their rows are ignored
// by the import).
export const SKILLS: Skill[] = [
  s('business-model-canvas', 'E', 'business', 'Business Model Canvas', 'Business Model Canvas'),
  n('domain-knowledge', 'E', 'business', 'Conhecimento do Domínio de Negócio', 'Business Domain Knowledge'),
  s('okrs', 'E', 'business', 'OKRs Objectives and Key Results', 'OKRs Objectives and Key Results'),
  n('market-analysis', 'A', 'business', 'Análise de Mercado, Concorrência & Benchmarking', 'Market, Competitive Analysis & Benchmarking'),
  n('business-case', 'A', 'business', 'Business Case & ROI', 'Business Case & ROI'),
  n('go-to-market', 'A', 'business', 'Go-to-Market & Product-Led Growth', 'Go-to-Market & Product-Led Growth'),
  s('lean-startup', 'A', 'business', 'Lean Startup', 'Lean Startup'),
  n('pricing', 'A', 'business', 'Precificação & Monetização', 'Pricing & Monetization'),
  n('unit-economics', 'A', 'business', 'Unit Economics', 'Unit Economics'),

  s('product-lifecycle', 'E', 'strategy', 'Ciclo de Vida de Produto', 'Product Lifecycle'),
  s('product-roadmap', 'E', 'strategy', 'Roadmap de Produto', 'Product Roadmap'),
  s('product-vision', 'E', 'strategy', 'Visão e Estratégia de Produto', 'Product Vision & Strategy', 'Visão de Produto'),
  s('dual-track', 'A', 'strategy', 'Discovery & Delivery / Dual Track Development', 'Discovery & Delivery / Dual Track Development', 'Dual Track Development (Discovery & Delivery)'),
  s('mvp', 'A', 'strategy', 'Estratégias MVP, POCs e Pilotos', 'MVP, POC & Pilot Strategies', 'MVP Produto Mínimo Viável'),
  s('product-inception', 'A', 'strategy', 'Inception de Produto', 'Product Inception'),

  n('user-interviews', 'E', 'discovery', 'Entrevistas com Usuários', 'User Interviews'),
  n('hypotheses-experiments', 'E', 'discovery', 'Hipóteses & Experimentos', 'Hypotheses & Experiments'),
  s('personas', 'E', 'discovery', 'Personas', 'Personas'),
  s('ux', 'E', 'discovery', 'User eXperience', 'User eXperience'),
  s('design-sprint', 'A', 'discovery', 'Design Sprint', 'Design Sprint'),
  s('design-thinking', 'A', 'discovery', 'Design Thinking', 'Design Thinking'),
  n('jtbd', 'A', 'discovery', 'Jobs to Be Done', 'Jobs to Be Done'),
  n('prototyping', 'A', 'discovery', 'Prototipação', 'Prototyping'),
  s('ab-testing', 'A', 'discovery', 'Testes A/B', 'A/B Testing'),
  n('usability-testing', 'A', 'discovery', 'Testes de Usabilidade', 'Usability Testing'),

  n('product-analytics', 'E', 'metrics', 'Análise de Dados & Product Analytics', 'Data & Product Analytics'),
  n('customer-journey', 'E', 'metrics', 'Jornada do Cliente', 'Customer Journey'),
  n('nps', 'E', 'metrics', 'Métricas de Satisfação (NPS, CSAT, CES)', 'Satisfaction Metrics (NPS, CSAT, CES)'),
  n('metric-frameworks', 'A', 'metrics', 'Métricas de Funil / AARRR', 'Funnel Metrics / AARRR'),
  n('north-star', 'A', 'metrics', 'North Star Metric', 'North Star Metric'),
  n('retention-churn', 'A', 'metrics', 'Retenção, Churn & Coortes', 'Retention, Churn & Cohorts'),

  s('acceptance-criteria', 'E', 'backlog', 'Critérios de Aceitação', 'Acceptance Criteria'),
  s('dod', 'E', 'backlog', 'DoD Definition of Done', 'DoD Definition of Done'),
  s('dor', 'E', 'backlog', 'DoR Definition of Ready', 'DoR Definition of Ready'),
  s('user-stories', 'E', 'backlog', 'Histórias de Usuário & INVEST', 'User Stories & INVEST', 'Histórias de Usuário'),
  n('nfr', 'E', 'backlog', 'Requisitos Não Funcionais', 'Non-Functional Requirements'),
  n('requirements-elicitation', 'E', 'backlog', 'Técnicas de Elicitação de Requisitos', 'Requirements Elicitation Techniques'),
  s('backlog-prioritization', 'E', 'backlog', 'Técnicas de Priorização de Backlog', 'Backlog Prioritization Techniques'),
  s('technical-debt', 'A', 'backlog', 'Gestão de Dívida Técnica', 'Technical Debt Management', 'Dívida Técnica'),
  n('story-mapping', 'A', 'backlog', 'User Story Mapping', 'User Story Mapping'),

  s('scrum', 'E', 'agile', 'Framework Scrum', 'Scrum Framework', 'Scrum, Valores, Pilares, Artefatos, Papéis, Eventos'),
  s('agile-manifesto', 'E', 'agile', 'Manifesto Ágil', 'Agile Manifesto'),
  s('sprint-planning', 'E', 'agile', 'Sprint Planning', 'Sprint Planning'),
  s('backlog-refinement', 'E', 'agile', 'Sprint Refinement', 'Sprint Refinement', 'Backlog Refinement'),
  s('sprint-review', 'E', 'agile', 'Sprint Review', 'Sprint Review'),
  s('agile-at-scale', 'A', 'agile', 'Ágil em Escala, Scrum of Scrums, SAFe', 'Agile at Scale, Scrum of Scrums, SAFe', 'Ágil em Escala'),
  s('bdd', 'A', 'agile', 'BDD Behaviour-Driven Development', 'BDD Behaviour-Driven Development'),
  s('planning-poker', 'A', 'agile', 'Estimativas Ágeis e Planning Poker', 'Agile Estimation & Planning Poker', 'Planning Poker'),
  s('kanban', 'A', 'agile', 'Lean & Método Kanban', 'Lean & Kanban Method', 'Método Kanban'),

  s('agile-testing', 'E', 'delivery', 'Agile Testing', 'Agile Testing'),
  n('apis', 'E', 'delivery', 'APIs & Integrações', 'APIs & Integrations'),
  n('dependency-management', 'E', 'delivery', 'Gestão de Dependências', 'Dependency Management'),
  n('software-architecture', 'A', 'delivery', 'Arquitetura de Solução', 'Solution Architecture'),
  n('cloud', 'A', 'delivery', 'Cloud, Escalabilidade & Observabilidade', 'Cloud, Scalability & Observability'),
  s('devops', 'A', 'delivery', 'DevOps & Entrega Contínua', 'DevOps & Continuous Delivery', 'DevOps'),
  s('xp', 'A', 'delivery', 'eXtreme Programming', 'eXtreme Programming'),
  s('feature-toggles', 'A', 'delivery', 'Feature Toggles', 'Feature Toggles'),

  n('prompt-engineering', 'E', 'ai', 'Engenharia de Prompt', 'Prompt Engineering'),
  n('ai-fundamentals', 'E', 'ai', 'IA Generativa & LLMs', 'Generative AI & LLMs'),
  n('ai-agents', 'A', 'ai', 'Agentes de IA & Automação', 'AI Agents & Automation'),
  n('responsible-ai', 'A', 'ai', 'IA Responsável & Ética', 'Responsible AI & Ethics'),
  n('ai-products', 'A', 'ai', 'Soluções com IA, Assistentes', 'AI Solutions, Assistants'),

  s('facilitation', 'E', 'people', 'Facilitação', 'Facilitation'),
  s('stakeholder-management', 'E', 'people', 'Gestão de Stakeholders', 'Stakeholder Management'),
  s('working-with-developers', 'E', 'people', 'Liderança de Time de Produto', 'Product Team Leadership', 'Trabalhando com Desenvolvedores de Produto'),
  s('negotiation', 'E', 'people', 'Negociação & Resolução de Conflitos', 'Negotiation & Conflict Resolution', 'Negociação'),
  s('change-management', 'A', 'people', 'Change Management', 'Change Management'),
  n('communication', 'A', 'people', 'Comunicação Assertiva', 'Assertive Communication'),
  n('leadership-influence', 'A', 'people', 'Liderança e Influência', 'Leadership & Influence'),
]

export const SHEET_SKILLS = SKILLS.filter((sk) => sk.fromSheet)
export const NEW_SKILLS = SKILLS.filter((sk) => !sk.fromSheet)

export const SKILL_IDS = new Set(SKILLS.map((sk) => sk.id))

// Within each area, essentials come before advanced skills; the stable sort keeps catalogue order inside a tier.
export const SKILLS_ESSENTIALS_FIRST = [...SKILLS].sort((a, b) => Number(a.tier === 'A') - Number(b.tier === 'A'))

export type Level = { min: number; max: number; title: Localized }

// Behavioural anchors for the 0–10 scale, so a "6" means the same thing to everyone.
export const LEVELS: Level[] = [
  {
    min: 0,
    max: 0,
    title: { pt: 'Desconheço', en: 'Unfamiliar' },
  },
  {
    min: 1,
    max: 2,
    title: { pt: 'Já ouvi falar', en: 'Heard of it' },
  },
  {
    min: 3,
    max: 4,
    title: { pt: 'Conheço a teoria', en: 'Know the theory' },
  },
  {
    min: 5,
    max: 6,
    title: { pt: 'Aplico com apoio', en: 'Apply with support' },
  },
  {
    min: 7,
    max: 8,
    title: { pt: 'Aplico com autonomia', en: 'Apply independently' },
  },
  {
    min: 9,
    max: 10,
    title: { pt: 'Aplico com maestria', en: 'Apply with mastery' },
  },
]
