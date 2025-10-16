
import type { Step } from './types';

export enum StepId {
  NicheAnalysis = 'nicheAnalysis',
  AudienceResearch = 'audienceResearch',
  CompetitiveAnalysis = 'competitiveAnalysis',
  BrandDifferentiation = 'brandDifferentiation',
  SiteDevelopment = 'siteDevelopment',
  FinalReport = 'finalReport',
  ImplementationPlan = 'implementationPlan',
}

export const STEPS: Step[] = [
  {
    id: StepId.NicheAnalysis,
    name: 'Análise de Nicho',
    description: 'Entenda o cenário do seu negócio, concorrentes, tendências e preferências do público.',
    inputLabel: 'Qual é o seu nicho de mercado e o nome da sua marca?',
    inputPlaceholder: 'Ex: "Marca: Café Estelar, Nicho: cafés especiais e artesanais"',
    inputType: 'textarea',
    userDataKey: 'niche',
  },
  {
    id: StepId.AudienceResearch,
    name: 'Pesquisa de Público-Alvo',
    description: 'Defina seu público-alvo com personas detalhadas para engajar e converter visitantes.',
    inputLabel: 'Descreva seu público-alvo em poucas palavras',
    inputPlaceholder: 'Ex: "Jovens profissionais, urbanos, que apreciam produtos de alta qualidade e sustentáveis."',
    inputType: 'textarea',
    userDataKey: 'targetAudience',
  },
  {
    id: StepId.CompetitiveAnalysis,
    name: 'Pesquisa Competitiva',
    description: 'Analise sites de sucesso no seu nicho para extrair insights e melhores práticas.',
    inputLabel: 'Qual sub-nicho ou concorrentes específicos você gostaria de analisar?',
    inputPlaceholder: 'Ex: "Marcas de café que focam em assinatura mensal" ou "Café do Ponto, Starbucks"',
    inputType: 'textarea',
    userDataKey: 'subNiche',
  },
  {
    id: StepId.BrandDifferentiation,
    name: 'Diferenciação da Marca',
    description: 'Desenvolva uma identidade de marca clara e convincente para se destacar da concorrência.',
    inputLabel: 'Descreva a personalidade e os valores centrais da sua marca',
    inputPlaceholder: 'Ex: "Nossa marca é sofisticada, mas acessível. Valorizamos a sustentabilidade, a comunidade e a arte do café."',
    inputType: 'textarea',
    userDataKey: 'brandIdentity',
  },
  {
    id: StepId.SiteDevelopment,
    name: 'Desenvolvimento do Site',
    description: 'Planeje a estrutura, layout e funcionalidades essenciais para seu site.',
    inputLabel: 'Esta etapa sintetiza as informações anteriores para gerar um plano.',
    inputPlaceholder: '',
    inputType: 'textarea',
    userDataKey: 'brandName', // Not used for input
  },
  {
    id: StepId.FinalReport,
    name: 'Relatório e Recomendações',
    description: 'Receba um relatório completo com achados, oportunidades e sugestões passo a passo.',
    inputLabel: 'Esta etapa gera um relatório completo com base em toda a análise.',
    inputPlaceholder: '',
    inputType: 'textarea',
    userDataKey: 'brandName', // Not used for input
  },
  {
    id: StepId.ImplementationPlan,
    name: 'Plano de Implementação',
    description: 'Obtenha um plano de ação detalhado para implementar todas as melhorias sugeridas.',
    inputLabel: 'Gere um plano de implementação acionável a partir do relatório.',
    inputPlaceholder: '',
    inputType: 'textarea',
    userDataKey: 'brandName', // Not used for input
  },
];