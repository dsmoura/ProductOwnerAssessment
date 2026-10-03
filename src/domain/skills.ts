export type Tier = 'E' | 'D'
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
] as const
export type DomainId = (typeof DOMAIN_IDS)[number]

export type Domain = { id: DomainId; name: Localized; profile: Localized }

// Grouping into 8 areas is the app's proposal; the original spreadsheet only splits Essenciais / Diferenciais.
export const DOMAINS: Record<DomainId, Domain> = {
  agile: { id: 'agile', name: { pt: 'Métodos Ágeis', en: 'Agile Methods' }, profile: { pt: 'Guardião do Fluxo', en: 'Flow Keeper' } },
  strategy: { id: 'strategy', name: { pt: 'Estratégia de Produto', en: 'Product Strategy' }, profile: { pt: 'Estrategista de Produto', en: 'Product Strategist' } },
  backlog: { id: 'backlog', name: { pt: 'Backlog & Requisitos', en: 'Backlog & Requirements' }, profile: { pt: 'Arquiteto de Backlog', en: 'Backlog Architect' } },
  discovery: { id: 'discovery', name: { pt: 'Usuário & Discovery', en: 'Users & Discovery' }, profile: { pt: 'Explorador do Usuário', en: 'User Explorer' } },
  people: { id: 'people', name: { pt: 'Pessoas & Colaboração', en: 'People & Collaboration' }, profile: { pt: 'Conector', en: 'Connector' } },
  business: { id: 'business', name: { pt: 'Negócio & Dados', en: 'Business & Data' }, profile: { pt: 'Orientado a Resultados', en: 'Outcome Driver' } },
  change: { id: 'change', name: { pt: 'Escala & Mudança', en: 'Scale & Change' }, profile: { pt: 'Agente de Mudança', en: 'Change Agent' } },
  delivery: { id: 'delivery', name: { pt: 'Qualidade & Entrega', en: 'Quality & Delivery' }, profile: { pt: 'Parceiro da Engenharia', en: 'Engineering Partner' } },
}

export type Skill = { id: string; tier: Tier; domain: DomainId; name: Localized }

const s = (id: string, tier: Tier, domain: DomainId, pt: string, en: string): Skill => ({
  id,
  tier,
  domain,
  name: { pt, en },
})

// Same order as the original spreadsheet (sheet "1. Assessment", rows 8–66). `name.pt` must match it exactly for the xlsx import.
export const SKILLS: Skill[] = [
  s('agile-manifesto', 'E', 'agile', 'Manifesto Ágil', 'Agile Manifesto'),
  s('product-development', 'E', 'strategy', 'Desenvolvimento de Produto', 'Product Development'),
  s('product-lifecycle', 'E', 'strategy', 'Ciclo de Vida de Produto', 'Product Lifecycle'),
  s('dual-track', 'E', 'strategy', 'Dual Track Development (Discovery & Delivery)', 'Dual Track Development (Discovery & Delivery)'),
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

  s('negotiation', 'D', 'people', 'Negociação', 'Negotiation'),
  s('conflict-resolution', 'D', 'people', 'Resolução de Conflitos', 'Conflict Resolution'),
  s('nvc', 'D', 'people', 'CNV Comunicação Não-Violenta', 'NVC Nonviolent Communication'),
  s('facilitation', 'D', 'people', 'Facilitação', 'Facilitation'),
  s('business-agility', 'D', 'business', 'Business Agility', 'Business Agility'),
  s('lean-startup', 'D', 'business', 'Lean Startup', 'Lean Startup'),
  s('business-model-canvas', 'D', 'business', 'Business Model Canvas', 'Business Model Canvas'),
  s('data-driven', 'D', 'business', 'Cultura Data-Driven', 'Data-Driven Culture'),
  s('okrs', 'D', 'business', 'OKRs Objectives and Key Results', 'OKRs Objectives and Key Results'),
  s('ab-testing', 'D', 'business', 'Testes A/B', 'A/B Testing'),
  s('agile-at-scale', 'D', 'change', 'Ágil em Escala', 'Agile at Scale'),
  s('project-management', 'D', 'change', 'Gerenciamento de Projetos', 'Project Management'),
  s('change-management', 'D', 'change', 'Change Management', 'Change Management'),
  s('adkar', 'D', 'change', 'ADKAR', 'ADKAR'),
  s('lean-change', 'D', 'change', 'Lean Change Management', 'Lean Change Management'),
  s('design-thinking', 'D', 'discovery', 'Design Thinking', 'Design Thinking'),
  s('design-sprint', 'D', 'discovery', 'Design Sprint', 'Design Sprint'),
  s('lean-inception', 'D', 'discovery', 'Lean Inception', 'Lean Inception'),
  s('agile-testing', 'D', 'delivery', 'Agile Testing', 'Agile Testing'),
  s('bdd', 'D', 'delivery', 'BDD Behaviour-Driven Development', 'BDD Behaviour-Driven Development'),
  s('outcome-metrics', 'D', 'business', 'Métricas de Eficácia, Produto e Usuário', 'Effectiveness, Product and User Metrics'),
  s('efficiency-metrics', 'D', 'business', 'Métricas de Eficiência', 'Efficiency Metrics'),
  s('planning-poker', 'D', 'agile', 'Planning Poker', 'Planning Poker'),
  s('kanban', 'D', 'agile', 'Método Kanban', 'Kanban Method'),
  s('xp', 'D', 'agile', 'eXtreme Programming', 'eXtreme Programming'),
  s('management-30', 'D', 'agile', 'Management 3.0', 'Management 3.0'),
  s('lean', 'D', 'agile', 'Lean', 'Lean'),
  s('devops', 'D', 'delivery', 'DevOps', 'DevOps'),
  s('continuous-delivery', 'D', 'delivery', 'Entrega Contínua', 'Continuous Delivery'),
  s('feature-toggles', 'D', 'delivery', 'Feature Toggles', 'Feature Toggles'),
]

export const SKILL_IDS = new Set(SKILLS.map((sk) => sk.id))

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
