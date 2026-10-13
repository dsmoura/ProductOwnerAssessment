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

// Display order: grouped by area in DOMAIN_IDS order, essentials first, from fundamentals to applied practice, with each
// advanced skill next to the essential it builds on. The xlsx import matches by label, so the order is free.
// Tiers follow the spreadsheet (Diferenciais = 'A') except where an area needed both levels or by product decision: dual-track and technical-debt moved to
// Advanced; facilitation, business-model-canvas, lean-startup, agile-testing and negotiation moved
// to Essential. Management 3.0, Lean, ADKAR, Lean Change Management, Métricas de Eficiência, Métricas de Eficácia,
// Produto e Usuário, Cultura Data-Driven, Gestão de Feedback de Usuários, CNV Comunicação Não-Violenta, Desenvolvimento
// de Produto, Gestão de Backlog, Gerenciamento de Projetos, Sprint, Sprint Retrospective, Daily and Business Agility were
// dropped; Release Plan was merged into mvp, Lean Inception into product-inception and Resolução de Conflitos into
// negotiation (their rows are ignored by the import).
export const SKILLS: Skill[] = [
  n('domain-knowledge', 'E', 'business', 'Conhecimento do Domínio de Negócio', 'Business Domain Knowledge'),
  n('market-analysis', 'E', 'business', 'Análise de Mercado, Concorrência & Benchmarking', 'Market, Competitive Analysis & Benchmarking'),
  s('business-model-canvas', 'E', 'business', 'Business Model Canvas', 'Business Model Canvas'),
  s('lean-startup', 'E', 'business', 'Lean Startup', 'Lean Startup'),
  n('business-case', 'E', 'business', 'Business Case & ROI', 'Business Case & ROI'),
  n('pricing', 'A', 'business', 'Precificação & Monetização', 'Pricing & Monetization'),
  n('unit-economics', 'A', 'business', 'Unit Economics', 'Unit Economics'),
  n('go-to-market', 'A', 'business', 'Go-to-Market & Product-Led Growth', 'Go-to-Market & Product-Led Growth'),
  s('okrs', 'A', 'business', 'OKRs Objectives and Key Results', 'OKRs Objectives and Key Results'),

  s('product-lifecycle', 'E', 'strategy', 'Ciclo de Vida de Produto', 'Product Lifecycle'),
  s('product-vision', 'E', 'strategy', 'Visão e Estratégia de Produto', 'Product Vision & Strategy', 'Visão de Produto'),
  s('product-inception', 'E', 'strategy', 'Inception de Produto / Lean Inception', 'Product Inception / Lean Inception', 'Inception de Produto'),
  s('mvp', 'E', 'strategy', 'MVP & Release Plan', 'MVP & Release Plan', 'MVP Produto Mínimo Viável'),
  s('product-roadmap', 'E', 'strategy', 'Roadmap de Produto', 'Product Roadmap'),
  s('dual-track', 'A', 'strategy', 'Discovery & Delivery / Dual Track Development', 'Discovery & Delivery / Dual Track Development', 'Dual Track Development (Discovery & Delivery)'),

  s('ux', 'E', 'discovery', 'User eXperience', 'User eXperience'),
  s('personas', 'E', 'discovery', 'Personas', 'Personas'),
  n('user-interviews', 'E', 'discovery', 'Entrevistas com Usuários', 'User Interviews'),
  n('hypotheses-experiments', 'E', 'discovery', 'Hipóteses & Experimentos', 'Hypotheses & Experiments'),
  n('prototyping', 'E', 'discovery', 'Prototipação', 'Prototyping'),
  n('usability-testing', 'E', 'discovery', 'Testes de Usabilidade', 'Usability Testing'),
  n('jtbd', 'A', 'discovery', 'Jobs to Be Done', 'Jobs to Be Done'),
  s('design-thinking', 'A', 'discovery', 'Design Thinking', 'Design Thinking'),
  s('design-sprint', 'A', 'discovery', 'Design Sprint', 'Design Sprint'),

  n('customer-journey', 'E', 'metrics', 'Jornada do Cliente', 'Customer Journey'),
  n('nps', 'E', 'metrics', 'Métricas de Satisfação (NPS, CSAT, CES)', 'Satisfaction Metrics (NPS, CSAT, CES)'),
  n('product-analytics', 'E', 'metrics', 'Análise de Dados & Product Analytics', 'Data & Product Analytics'),
  n('north-star', 'A', 'metrics', 'North Star Metric', 'North Star Metric'),
  n('metric-frameworks', 'A', 'metrics', 'Métricas de Funil / AARRR', 'Funnel Metrics / AARRR'),
  n('retention-churn', 'A', 'metrics', 'Retenção, Churn & Coortes', 'Retention, Churn & Cohorts'),
  s('ab-testing', 'A', 'metrics', 'Testes A/B', 'A/B Testing'),

  s('backlog-prioritization', 'E', 'backlog', 'Técnicas de Priorização de Backlog', 'Backlog Prioritization Techniques'),
  s('user-stories', 'E', 'backlog', 'Histórias de Usuário & INVEST', 'User Stories & INVEST', 'Histórias de Usuário'),
  s('acceptance-criteria', 'E', 'backlog', 'Critérios de Aceitação', 'Acceptance Criteria'),
  s('dor', 'E', 'backlog', 'DoR Definition of Ready', 'DoR Definition of Ready'),
  s('dod', 'E', 'backlog', 'DoD Definition of Done', 'DoD Definition of Done'),
  n('story-mapping', 'A', 'backlog', 'User Story Mapping', 'User Story Mapping'),
  s('technical-debt', 'A', 'backlog', 'Gestão de Dívida Técnica', 'Technical Debt Management', 'Dívida Técnica'),

  s('agile-manifesto', 'E', 'agile', 'Manifesto Ágil', 'Agile Manifesto'),
  s('scrum', 'E', 'agile', 'Scrum', 'Scrum', 'Scrum, Valores, Pilares, Artefatos, Papéis, Eventos'),
  s('sprint-planning', 'E', 'agile', 'Sprint Planning', 'Sprint Planning'),
  s('backlog-refinement', 'E', 'agile', 'Sprint Refinement', 'Sprint Refinement', 'Backlog Refinement'),
  s('sprint-review', 'E', 'agile', 'Sprint Review', 'Sprint Review'),
  s('kanban', 'A', 'agile', 'Lean & Método Kanban', 'Lean & Kanban Method', 'Método Kanban'),
  s('planning-poker', 'A', 'agile', 'Estimativas Ágeis e Planning Poker', 'Agile Estimation & Planning Poker', 'Planning Poker'),
  s('bdd', 'A', 'agile', 'BDD Behaviour-Driven Development', 'BDD Behaviour-Driven Development'),
  s('agile-at-scale', 'A', 'agile', 'Ágil em Escala', 'Agile at Scale'),

  n('nfr', 'E', 'delivery', 'Requisitos Não Funcionais', 'Non-Functional Requirements'),
  n('apis', 'E', 'delivery', 'APIs & Integrações', 'APIs & Integrations'),
  n('security-privacy', 'E', 'delivery', 'Segurança & Privacidade', 'Security & Privacy'),
  s('agile-testing', 'E', 'delivery', 'Agile Testing', 'Agile Testing'),
  n('dependency-management', 'E', 'delivery', 'Gestão de Dependências', 'Dependency Management'),
  n('software-architecture', 'A', 'delivery', 'Arquitetura de Software', 'Software Architecture'),
  s('xp', 'A', 'delivery', 'eXtreme Programming', 'eXtreme Programming'),
  s('devops', 'A', 'delivery', 'DevOps', 'DevOps'),
  s('continuous-delivery', 'A', 'delivery', 'Entrega Contínua', 'Continuous Delivery'),
  s('feature-toggles', 'A', 'delivery', 'Feature Toggles', 'Feature Toggles'),
  n('cloud', 'A', 'delivery', 'Cloud, Escalabilidade & Observabilidade', 'Cloud, Scalability & Observability'),

  n('ai-fundamentals', 'E', 'ai', 'Fundamentos de IA Generativa & LLMs', 'Generative AI & LLM Fundamentals'),
  n('prompt-engineering', 'E', 'ai', 'Engenharia de Prompt', 'Prompt Engineering'),
  n('ai-products', 'A', 'ai', 'Produtos com IA, Assistentes', 'AI-Powered Products, Assistants'),
  n('ai-agents', 'A', 'ai', 'Agentes de IA & Automação', 'AI Agents & Automation'),
  n('responsible-ai', 'A', 'ai', 'IA Responsável & Ética', 'Responsible AI & Ethics'),

  s('working-with-developers', 'E', 'people', 'Cultura de Time de Produto', 'Product Team Culture', 'Trabalhando com Desenvolvedores de Produto'),
  s('stakeholder-management', 'E', 'people', 'Gestão de Stakeholders', 'Stakeholder Management'),
  s('facilitation', 'E', 'people', 'Facilitação', 'Facilitation'),
  s('negotiation', 'E', 'people', 'Negociação & Resolução de Conflitos', 'Negotiation & Conflict Resolution', 'Negociação'),
  n('communication', 'A', 'people', 'Comunicação & Storytelling', 'Communication & Storytelling'),
  n('leadership-influence', 'A', 'people', 'Liderança e Influência', 'Leadership & Influence'),
  s('change-management', 'A', 'people', 'Change Management', 'Change Management'),
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
