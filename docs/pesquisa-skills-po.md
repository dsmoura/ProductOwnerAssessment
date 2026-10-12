# Pesquisa: skills e avaliação realistas para Product Owners

Outubro de 2026. Este documento registra a pesquisa usada para revisar o catálogo de skills do app
(`src/domain/skills.ts`) e explica cada mudança feita.

## Objetivo e método

**Objetivo:** confirmar se as 86 skills e as 10 áreas do app correspondem ao que o mercado e a literatura esperam
de um Product Owner, e ajustar o catálogo onde houver lacunas ou sobreposição.

**Método:** foram consultados cinco tipos de fonte e o resultado foi cruzado com as áreas do app.

1. **Definições oficiais e certificações:** Scrum Guide, Scrum.org (PSPO, PSPO-A, EBM), Scrum Alliance (CSPO),
   SAFe (POPM) e ICAgile (ICP-PDM).
2. **Frameworks de competência de produto:** Ravi Mehta/Reforge, Marty Cagan/SVPG, Roman Pichler, GitLab,
   Product-Led Alliance.
3. **Vagas de emprego:** dados agregados dos EUA (Lightcast, via NCSU) e anúncios do Brasil (Glassdoor,
   Empregos.com.br, Empregando Brasil).
4. **Pesquisas de mercado:** PM3 Panorama (Brasil), ProductPlan, Productboard, Pragmatic Institute, General
   Assembly, Qarera.
5. **Livros e literatura sobre autoavaliação.**

**Limites:** fontes de fornecedores e recrutadores tendem a exagerar requisitos e foram usadas só como indício. A
maior parte dos dados quantitativos de vagas é dos EUA. Não foi encontrado um estudo de grande escala só com
vagas de PO no Brasil.

## O que dizem as fontes

### Definições oficiais e certificações

| Fonte | O que define para o PO | Leitura para o app |
|---|---|---|
| **Scrum Guide 2020** | O PO é responsável por maximizar o valor do produto. Responde pelo backlog: desenvolver e comunicar o **Product Goal**, criar e comunicar os itens, ordenar e garantir transparência. | Product Goal e Sprint Goal não estavam no catálogo; ficaram cobertos pela skill Scrum. |
| **Scrum.org PSPO** | Tópicos do curso: Agile Product Management, Value-Driven Development, Scrum e empirismo, framework Scrum, Product Backlog Management. | Já coberto pelas áreas Métodos Ágeis, Estratégia e Backlog. |
| **Scrum.org PSPO-A: "stances" do PO** | Posturas recomendadas: Customer Representative, Visionary, **Experimenter**, Decision Maker, Influencer, Collaborator. Posturas a evitar: Clerk, Story Writer, Project Manager, Subject Matter Expert, Gatekeeper, Manager. | "Experimenter" mostra que faltava uma skill de hipóteses e experimentos. |
| **Scrum.org Evidence-Based Management (EBM)** | Quatro áreas de valor: Current Value, Unrealized Value, Time to Market, Ability to Innovate. | Coberto pelas skills de métricas que já existem. Fica como referência para Métricas de Produto. |
| **Scrum Alliance CSPO (2022)** | Categorias: competências centrais do PO, metas e planejamento, entender clientes e usuários, **validar premissas do produto**, trabalhar o backlog. | Reforça experimentos e a qualidade dos itens do backlog (INVEST). |
| **SAFe POPM** | Backlog priorizado economicamente (WSJF), decomposição de épicos em features e histórias, PI Planning, riscos e dependências. | Já coberto: Cost of Delay & WSJF, Ágil em Escala, Gestão de Riscos e de Dependências. |
| **ICAgile ICP-PDM** | Ciclo de vida do produto, estratégia, visão, roadmap, métricas que importam, hipóteses e experimentos. | Já coberto, mais Hipóteses & Experimentos. |

### Frameworks de competência

| Framework | Estrutura | Leitura para o app |
|---|---|---|
| **Ravi Mehta / Reforge (12 competências)** | *Product Execution:* especificação, entrega, qualidade. *Customer Insight:* **fluência com dados**, voz do cliente, UX. *Product Strategy:* responsabilidade por resultado de negócio, visão e roadmap, impacto estratégico. *Influencing People:* stakeholders, liderança de time, gestão para cima. | Dados é competência central, não diferencial: Product Analytics passa a Essencial. Comunicação e influência estavam implícitas e viraram skill. |
| **Marty Cagan / SVPG (INSPIRED)** | Quatro riscos: valor, usabilidade, viabilidade de negócio, factibilidade. O PM responde por valor e viabilidade. Alerta para o anti-padrão do "PO só de backlog". | Mantém o peso de Negócio & Mercado (Business Case, Precificação, Go-to-Market) para o PO não ficar só no backlog. |
| **Roman Pichler** | Seis áreas centrais e seis de apoio. Hard skills (pesquisa de mercado, roadmap) não bastam; liderança, confiança, escuta e buy-in são necessários. | Reforça Comunicação. |
| **GitLab CDF, Product-Led Alliance (12 skills em Execution, Insights, Strategy, Influence)** | Matrizes com expectativas por nível. | Confirma que as quatro famílias (execução, cliente, estratégia, pessoas) estão nas 10 áreas do app. |

### Vagas de emprego

**EUA: Lightcast via NCSU, cerca de 24 mil vagas de Product Owner por ano.** Percentual de vagas que citam cada
skill:

| Grupo | Skills (% das vagas) |
|---|---|
| Comportamentais | Comunicação 67%, Priorização 45%, Gestão 40%, Liderança 40%, Planejamento 32%, Resolução de problemas 26%, Inovação 24%, Influência 23% |
| Definidoras do cargo | Scrum 90%, Agile 75%, User Story 65%, Product Management 54%, Jira 30%, Roadmap 30%, UX 26%, Computer Science 25%, Requisitos de negócio 23%, Gerenciamento de projetos 19% |
| Necessárias | Sprint Planning 30%, Estratégia de produto 28%, KPIs 17%, API 16%, Retrospectiva 15%, Ciclo de vida 14%, Análise de negócio 13%, Análise de dados 13%, Marketing 11%, Teste de aceitação 11%, Serviços financeiros 11%, SQL 9% |

**Brasil (Glassdoor, Empregos.com.br e anúncios individuais, cerca de 1.700 vagas abertas):**
- Núcleo: priorizar e manter o backlog; escrever épicos, histórias, requisitos funcionais e não funcionais e
  critérios de aceite; Scrum e Kanban.
- Comportamentais: comunicação, negociação, gestão de stakeholders, autonomia para decidir.
- Ferramentas: Jira (em quase todas as vagas), Azure DevOps, Confluence.
- Diferenciais: domínio do setor (financeiro, pagamentos, reforma tributária), análise de dados e métricas,
  inglês, background técnico.
- Faixas de referência (2026): Júnior R$ 4–7 mil, Pleno R$ 7–12 mil, Sênior R$ 12–18 mil.

**O que isso significa para o app:**
- **Comunicação** é a skill mais pedida e não existia no catálogo.
- **Conhecimento do domínio de negócio** aparece como requisito ou diferencial nos dois mercados.
- **APIs** aparece em 16% das vagas e continua Essencial. **Arquitetura de Software** é um diferencial
  (Computer Science aparece em 25%) e passa a Avançada.

### Pesquisas de mercado e IA

- **PM3 Panorama 2024-25** (Brasil, 1.664 respostas, dados processados pela Bain): as skills mais importantes
  para aprender nos próximos dois anos são **IA (34%)**, Liderança de Produto (19%) e **Data Analytics (17%)**.
- **ProductPlan 2026 / Productboard (out/2025):** 94–96% dos profissionais de produto usam IA com frequência.
  Só cerca de 1 em 4 trabalha em empresa com estratégia de IA (Productside).
- **General Assembly (2025):** só 39% receberam treinamento específico em IA e 66% usam ferramentas não
  aprovadas. Isso reforça IA Responsável & Ética.
- **Vagas de "AI Product Owner" (2026):** pedem fundamentos de LLM, engenharia de prompt, agentes e governança de
  IA, e "avaliar criticamente o output da IA". O termo "evals" quase não aparece.
- **Qarera (360 mil vagas, todos os cargos):** IA é a skill mais citada em vagas de Product Manager (37%).

**Leitura para o app:** a área de IA está bem coberta. "IA Generativa" e "Fundamentos de IA & LLMs" se
sobrepunham e foram fundidas.

### Livros de referência

| Livro | Autor | Áreas do app |
|---|---|---|
| *Inspired* (2ª ed.) | Marty Cagan | Estratégia, Discovery, Negócio |
| *Empowered* | Marty Cagan | Pessoas, Estratégia |
| *Continuous Discovery Habits* | Teresa Torres | Discovery (Opportunity Solution Tree, entrevistas) |
| *Escaping the Build Trap* | Melissa Perri | Estratégia, Métricas (resultado em vez de entrega) |
| *Outcomes Over Output* | Josh Seiden | Métricas, Roadmap orientado a resultados |
| *User Story Mapping* | Jeff Patton | Backlog (mapeamento e fatiamento) |
| *User Stories Applied* | Mike Cohn | Backlog (INVEST, critérios de aceitação) |
| *Agile Product Management with Scrum* / *Strategize* | Roman Pichler | Estratégia, Backlog |
| *Advanced Agile Product Management: The Stances of the Product Owner* | Chris Lukassen, Robbin Schuurman | Pessoas, papel do PO |
| *Product Mastery* | Geoff Watts | Papel do PO |
| *The Mom Test* | Rob Fitzpatrick | Discovery (entrevistas) |
| *The Lean Product Playbook* | Dan Olsen | Discovery, MVP |
| *Lean Inception* | Paulo Caroli | Estratégia (Inception de Produto, Visão, MVP), Discovery (Personas) |
| *Lean Analytics* | Alistair Croll, Benjamin Yoskovitz | Métricas |

### Autoavaliação: o que torna a nota realista

- Autoavaliação sozinha é uma evidência fraca. Estudos encontram viés nos dois sentidos: quem sabe menos tende a
  se superestimar (Dunning-Kruger, efeito "acima da média") e especialistas tendem a se subestimar.
- O que melhora a qualidade:
  - âncoras observáveis por nível ("aplico com autonomia", em vez de "bom");
  - comparar a nota com critérios objetivos;
  - comparar com a visão de outras pessoas (360°).
- O app já usa âncoras comportamentais (0 Desconheço → 9–10 Aplico com maestria). O feedback 360° continua no
  roadmap do README.

## Lacunas e sobreposições encontradas

| Área do app | Lacuna | Sobreposição |
|---|---|---|
| Métodos Ágeis | Product Goal e Sprint Goal (Scrum Guide 2020) | — |
| Backlog & Requisitos | Qualidade dos itens: INVEST (CSPO, vagas: histórias e critérios de aceite) | INVEST × Histórias de Usuário (incorporado ao nome) |
| Usuário & Discovery | Hipóteses e experimentos (CSPO, stance Experimenter, ICAgile, Cagan) | — |
| Pessoas & Liderança | Comunicação (67% das vagas, Mehta, Pichler) | — |
| Negócio & Mercado | Conhecimento do domínio (vagas nos dois mercados) | Precificação × Unit Economics; Go-to-Market × Product-Led Growth; Análise de Mercado × Benchmarking |
| Engenharia & Entrega | — | Cloud × Observabilidade |
| CX & Métricas | Dados como competência essencial (Mehta, PM3, vagas) | NPS × CSAT & CES |
| Inteligência Artificial | — | Fundamentos de IA & LLMs × IA Generativa |

## Mudanças aplicadas no catálogo

O catálogo passou de 86 para **78 skills**: 45 da planilha e 33 adicionadas, sendo 44 Essenciais e 34 Avançadas.
Das skills da planilha, CNV, Sprint Retrospective e Lean Inception foram removidas; as renomeadas guardam o nome original em `sheetName`, porque o import
do `.xlsx` depende dele. O app ainda não tinha usuários, então os ids removidos não foram migrados.

**Adicionadas** (Essenciais, exceto Comunicação & Storytelling e Liderança e Influência, que são Avançadas por decisão de produto):

| Skill | Área | Por quê |
|---|---|---|
| Hipóteses & Experimentos | Usuário & Discovery | "Validar premissas" (CSPO), stance Experimenter (PSPO-A), riscos de Cagan |
| Comunicação & Storytelling | Pessoas & Liderança | Skill mais citada em vagas (67%); influência e "managing up" (Mehta) |
| Liderança e Influência | Pessoas & Liderança | Liderança (40%) e Influência (23%) nas vagas; stance Influencer (PSPO-A); Team Leadership e Managing Up (Mehta). O PO lidera sem autoridade formal |
| Conhecimento do Domínio de Negócio | Negócio & Mercado | Requisito ou diferencial frequente (serviços financeiros 11% nos EUA; fintech e pagamentos no Brasil) |

**Fundidas (a primeira absorve a segunda):**

| Skill resultante | Absorveu |
|---|---|
| Métricas de Satisfação (NPS, CSAT, CES) | CSAT & CES |
| Análise de Mercado, Concorrência & Benchmarking | Benchmarking & Pesquisa |
| Precificação, Monetização & Unit Economics | Unit Economics (CAC, LTV, Margem) |
| Go-to-Market & Product-Led Growth | Product-Led Growth |
| Cloud, Escalabilidade & Observabilidade | Observabilidade & Confiabilidade |
| Fundamentos de IA Generativa & LLMs | IA Generativa |
| MVP & Release Plan (planilha: "MVP Produto Mínimo Viável") | Release Plan (linha da planilha passa a ser ignorada pelo import) |

**Mudança de nível:**
- **Análise de Dados & Product Analytics** (antes "Product Analytics") passou de Avançada para **Essencial**.
  Motivos: Fluency with Data (Mehta), Data Analytics entre as skills a aprender (PM3), análise de dados e KPIs nas
  vagas.
- **Arquitetura de Software** passou de Essencial para **Avançada**. Para um PO, profundidade técnica é
  diferencial. Engenharia & Entrega mantém como Essenciais Agile Testing, Requisitos Não Funcionais, APIs &
  Integrações e Segurança & Privacidade.
- **Dívida Técnica** e **Gestão de Riscos** passaram de Essencial para **Avançada** (decisão de produto).
- **Negociação** passou de Avançada para **Essencial**. As vagas no Brasil citam comunicação, negociação e gestão
  de stakeholders como trio básico, e o PO negocia escopo e prioridade continuamente.

**Mudança de área:** Ágil em Escala saiu de Projetos & Mudança e foi para **Métodos Ágeis**.

**Área renomeada:** Pessoas & Colaboração passou a **Pessoas & Liderança**, com a entrada de Liderança e Influência.

**Renomeadas** (o nome original da planilha continua em `sheetName` para o import):
- Planning Poker passou a **Estimativas Ágeis e Planning Poker**.
- Visão de Produto passou a **Visão e Estratégia de Produto**, absorvendo o tema da skill removida Estratégia e
  Posicionamento de Produto (Product Strategy está em 28% das vagas e é um dos quatro pilares de Mehta).
- Histórias de Usuário passou a **Histórias de Usuário & INVEST**. INVEST, o critério de qualidade das histórias
  (CSPO, Mike Cohn), foi incorporado aqui em vez de virar uma skill separada.
- Time de Desenvolvedores de Produto (na planilha, "Trabalhando com Desenvolvedores de Produto") passou a
  **Cultura de Time de Produto**.

**Removidas da planilha** (decisão de produto; as linhas passam a ser ignoradas pelo import):
- CNV Comunicação Não-Violenta: sobrepunha-se a Resolução de Conflitos e a Comunicação & Storytelling.
- Sprint Retrospective.
- Lean Inception: suas técnicas seguem cobertas por Inception de Produto, Visão de Produto, Personas, Jornada do
  Cliente e MVP.

**Removidas das adicionadas pelo app** (decisão de produto): Continuous Discovery & Opportunity Solution Tree;
Estratégia e Posicionamento de Produto; Product Goal & Sprint Goal (coberto pela skill Scrum).

## Considerado e não aplicado

| Ideia | Decisão |
|---|---|
| Tomada de Decisão & Dizer Não (stance Decision Maker) | Removida por decisão de produto. |
| Avaliação de Qualidade de IA (Evals) | Removida por decisão de produto. Fica como tendência a acompanhar. |
| Evidence-Based Management como skill própria | Já coberto pelas métricas existentes. |
| Remover APIs & Integrações | Mantida por decisão de produto (16% das vagas). |
| Jira / Azure DevOps / Confluence | São ferramentas, não competências. |
| Análise de negócio / BPMN | Mais típico de analista de negócios; aparece em 13% das vagas. |
| Liderança de pessoas (gestão de time) | Não é responsabilidade do PO como contribuidor individual. |
| Perfis de referência por senioridade (Júnior, Pleno, Sênior) | Bom próximo passo: mostraria nos resultados a faixa esperada por área para cada nível. |
| Indicadores por skill (o que é um "7" em Priorização) | Tornaria a autoavaliação mais objetiva; pode vir junto do conteúdo por skill do roadmap. |

## Fontes

**Definições e certificações**
- [Scrum Guide 2020](https://scrumguides.org/scrum-guide.html)
- [Scrum.org – Professional Scrum Product Owner](https://www.scrum.org/courses/professional-scrum-product-owner-2026-01-21-99660)
- [Scrum.org – The Stances of a Product Owner](https://www.scrum.org/resources/blog/stances-product-owner)
- [Scrum.org – Advanced Product Owner strategies](https://www.scrum.org/resources/blog/excelling-your-product-management-advanced-product-owner-strategies)
- [Scrum.org – Evidence-Based Management](https://www.scrum.org/ebm)
- [Scrum Alliance – CSPO Learning Objectives 2022](https://assets.scrumalliance.org/media/certifications/los/cspo_learning_objectives_2022.pdf)
- [Scaled Agile – Product Owner](https://www.scaledagile.com/role/product-owner)
- [ICAgile – ICP Product Management](https://www.icagile.com/class/49802)

**Frameworks de competência**
- [Reforge – Product Manager Skills (Ravi Mehta)](https://www.reforge.com/blog/product-manager-skills)
- [SVPG – Product Risk Taxonomies](https://svpg.com/product-risk-taxonomies)
- [SVPG – The Four Big Risks](https://svpg.com/four-big-risks/)
- [Roman Pichler – Product Management Framework](https://www.romanpichler.com/tools/product-management-framework/)
- [GitLab – Product Management CDF and Competencies](https://handbook.gitlab.com/handbook/product/product-management/product-cdf-competencies/)
- [Product-Led Alliance – Product Management Skills Framework](https://www.productledalliance.com/product-management-skills-framework/)
- [Lenny's Newsletter – Product Management Career Ladders](https://www.lennysnewsletter.com/p/product-management-career-ladders)

**Vagas de emprego**
- [NCSU – Product Owner (dados Lightcast)](https://online-distance.ncsu.edu/career/product-owner/)
- [Glassdoor Brasil – vagas de Product Owner](https://www.glassdoor.com.br/Vaga/brasil-product-owner-vagas-SRCH_IL.0,6_KO7,20.htm)
- [Empregos.com.br – Product Owner](https://www.empregos.com.br/vagas/product-owner)
- [Empregando Brasil – Product Owner Sênior](https://empregandobrasil.com.br/vagas/product-owner-senior-sao-paulo-sp-bb534f/)
- [Interview Kickstart – Product Owner Job Description 2026](https://interviewkickstart.com/job-description/product-owner)
- [Neatstack – Product Owner Salary Guide 2026](https://www.neatstack.studio/salary-guide/product-owner)
- [Guia da Carreira – Product Owner](https://www.guiadacarreira.com.br/blog/product-owner-o-que-faz-como-ser-um-e-o-salario-de-um-po)
- [Dice – Product Owner (requisitos de IA)](https://www.dice.com/job-detail/494ecb65-4d87-4ba2-821b-cd15bfd21197)
- [Insight Global – AI Product Owner](https://jobs.insightglobal.com/find_a_job/florida/job-487574)

**Pesquisas de mercado e IA**
- [PM3 – Panorama do Mercado de Produto 2024-2025](https://pm3.com.br/blog/panorama-de-produto-2024/)
- [PM3 – Panorama do Mercado de Product Management 2021-22](https://pm3.com.br/blog/panorama-do-mercado-de-product-management-no-brasil-2021/)
- [ProductPlan – 2025 State of Product Management](https://www.productplan.com/2025-state-of-product-management-report/)
- [Pragmatic Institute – State of the Product Industry](https://www.pragmaticinstitute.com/product/annual-survey/)
- [General Assembly via Business Wire – PMs, AI e skills gaps](https://www.businesswire.com/news/home/20251106279129/en/Product-Managers-Are-All-in-on-AI-but-Skills-Gaps-and-Shadow-AI-Pose-Risks-New-Report-Finds)
- [Koji – Product Management Statistics 2026](https://www.koji.so/blog/product-management-statistics-2026)
- [Userpilot – Product Management Trends 2026](https://userpilot.com/blog/product-management-trends/)
- [Qarera – Most In-Demand Skills 2026](https://www.qarera.com/reports/most-in-demand-skills-2026)
- [Product School – AI Product Owner](https://productschool.com/blog/artificial-intelligence/ai-product-owner)

**Livros**
- [ADPList – 11 books every product manager must read](https://adplist.org/blog/11-books-that-every-product-manager-must-read)
- [Product Compass – Top Product Discovery Books](https://www.productcompass.pm/p/at-least-half-of-your-ideas-will)
- [Pearson – The Stances of the Product Owner](https://pearson.com/store/p/advanced-agile-product-management-the-stances-of-the-product-owner/P200000007287/9780137947003)

**Autoavaliação**
- [PMC – Self-assessment vs. peer and performance ratings](https://pmc.ncbi.nlm.nih.gov/articles/PMC10431333)
- [Merca.team – How to build a skills self-assessment grid](https://merca.team/en/competency-self-assessment-grid/)
