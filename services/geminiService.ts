import { GoogleGenAI } from "@google/genai";
import type { UserData, GeneratedContent } from '../types';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY as string });

const callGemini = async (prompt: string, expectJson: boolean = false): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: expectJson ? { responseMimeType: "application/json" } : {},
  });
  return response.text;
};

export const generateNicheAnalysis = async (brandName: string, niche: string): Promise<string> => {
  const prompt = `
    Como um estrategista de marca sênior, realize uma análise completa do nicho "${niche}" para a marca "${brandName}".
    Sua análise deve ser profunda e acionável. Formate a resposta em Markdown, com as seguintes seções bem definidas:

    ### Análise de Nicho: ${niche}

    **1. Visão Geral do Cenário:**
    * Descreva o estado atual do mercado para este nicho.
    * Qual o tamanho estimado e potencial de crescimento?

    **2. Principais Concorrentes:**
    * Liste de 3 a 5 concorrentes diretos e indiretos.
    * Para cada um, descreva seus pontos fortes e fracos.

    **3. Tendências Mais Relevantes:**
    * Identifique 3-5 tendências de mercado, tecnologia, design ou comportamento do consumidor que impactam este nicho.
    * Explique brevemente cada tendência.

    **4. Preferências do Público-Alvo:**
    * Descreva o perfil geral do consumidor neste nicho.
    * O que eles valorizam? (Ex: preço, qualidade, sustentabilidade, conveniência).
    * Quais são suas principais "dores" ou necessidades não atendidas?

    **5. Plataformas e Canais Populares:**
    * Onde o público-alvo deste nicho passa tempo online? (Ex: Instagram, TikTok, blogs específicos, fóruns).
    * Liste sites, blogs e influenciadores de referência.
  `;
  return callGemini(prompt);
};

export const generateAudienceResearch = async (niche: string, targetAudience: string, detailLevel: 'brief' | 'detailed'): Promise<string> => {
  const promptDetailed = `
    Como um pesquisador de mercado especialista, crie uma análise detalhada do público-alvo para uma marca no nicho de "${niche}", com base na descrição inicial: "${targetAudience}".
    Crie 2 personas detalhadas e acionáveis, incluindo dados demográficos específicos e a jornada do cliente. Formate a resposta em Markdown.

    ### Pesquisa de Público-Alvo

    **Descrição Geral:**
    * Expanda a descrição inicial do público-alvo, adicionando mais nuances.

    ---

    ### Persona 1: [Dê um nome arquetípico, ex: "A Entusiasta Conectada"]

    *   **Nome:** [Nome fictício]
    *   **Idade:** [Faixa etária]
    *   **Profissão:** [Profissão]
    *   **Localização:** [Ex: Urbano, Suburbano]
    *   **Dados Demográficos:**
        *   **Faixa de Renda:** [Ex: R$ 4.000 - R$ 7.000]
        *   **Nível de Escolaridade:** [Ex: Ensino Superior Completo]
        *   [Outros dados relevantes como situação familiar]
    *   **Interesses e Hobbies:** [Liste interesses relevantes para o nicho]
    *   **Motivações:** O que a impulsiona a procurar produtos/serviços em "${niche}"?
    *   **Dores e Frustrações:** Quais são seus principais desafios ou problemas que a sua marca pode resolver?
    *   **Comportamento Online:** Quais redes sociais usa? Como pesquisa por produtos? Que tipo de conteúdo consome?
    *   **Canais de Comunicação Preferidos:** Com base em seus hábitos, profissão e no nicho "${niche}", determine e justifique os 3 canais mais eficazes para a marca se comunicar com esta persona. (Ex: Instagram Stories para conteúdo visual e rápido, E-mail marketing para novidades e promoções exclusivas, Blog para artigos aprofundados que demonstram autoridade).
    *   **Jornada do Cliente:**
        *   **Descoberta:** Como ela descobre novas marcas como a sua? (Ex: Indicação de amigos, anúncios em redes sociais).
        *   **Consideração:** O que ela valoriza ao comparar opções? (Ex: Reviews de outros clientes, transparência sobre ingredientes/processos).
        *   **Decisão:** Qual fator a faz escolher uma marca em detrimento de outra? (Ex: Qualidade percebida, alinhamento com seus valores).
        *   **Pós-compra:** O que a tornaria uma cliente fiel? (Ex: Suporte atencioso, programa de fidelidade).
    *   **Citação:** [Uma frase curta que resume sua perspectiva]

    ---

    ### Persona 2: [Dê um nome arquetípico, ex: "A Pragmática Consciente"]

    *   **Nome:** [Nome fictício]
    *   **Idade:** [Faixa etária]
    *   **Profissão:** [Profissão]
    *   **Localização:** [Ex: Urbano, Suburbano]
    *   **Dados Demográficos:**
        *   **Faixa de Renda:** [Ex: R$ 8.000 - R$ 12.000]
        *   **Nível de Escolaridade:** [Ex: Pós-graduação]
        *   [Outros dados relevantes]
    *   **Interesses e Hobbies:** [Liste interesses relevantes para o nicho]
    *   **Motivações:** O que a impulsiona a procurar produtos/serviços em "${niche}"?
    *   **Dores e Frustrações:** Quais são seus principais desafios ou problemas que a sua marca pode resolver?
    *   **Comportamento Online:** Quais redes sociais usa? Como pesquisa por produtos? Que tipo de conteúdo consome?
    *   **Canais de Comunicação Preferidos:** Com base em seus hábitos, profissão e no nicho "${niche}", determine e justifique os 3 canais mais eficazes para a marca se comunicar com esta persona. (Ex: LinkedIn para networking profissional, Artigos aprofundados para demonstrar expertise, Webinars para educação).
    *   **Jornada do Cliente:**
        *   **Descoberta:** Como ela descobre novas marcas como a sua? (Ex: Pesquisa aprofundada no Google, recomendação de especialistas).
        *   **Consideração:** O que ela valoriza ao comparar opções? (Ex: Estudos de caso, especificações técnicas claras).
        *   **Decisão:** Qual fator a faz escolher uma marca em detrimento de outra? (Ex: Reputação da marca, suporte técnico qualificado).
        *   **Pós-compra:** O que a tornaria uma cliente fiel? (Ex: Atualizações relevantes, bom relacionamento com o gerente de contas).
    *   **Citação:** [Uma frase curta que resume sua perspectiva]
  `;
  
  const promptBrief = `
    Como um pesquisador de mercado especialista, crie uma análise resumida do público-alvo para uma marca no nicho de "${niche}", com base na descrição inicial: "${targetAudience}".
    Crie 2 personas breves, focando nos pontos essenciais. Formate a resposta em Markdown.

    ### Pesquisa de Público-Alvo (Resumo)

    ---

    ### Persona 1: [Dê um nome arquetípico, ex: "O Profissional Ocupado"]

    *   **Perfil:** Descreva brevemente quem é essa pessoa (idade, profissão, faixa de renda, nível de escolaridade).
    *   **Motivações Principais:** O que a impulsiona a procurar produtos/serviços em "${niche}"? (2-3 pontos)
    *   **Principais Dores:** Quais são seus desafios ou problemas mais urgentes que sua marca pode resolver? (2-3 pontos)
    *   **Canais Chave:** Liste os 2-3 canais mais eficazes para alcançá-la, com uma breve justificativa, considerando seu perfil. (Ex: Instagram para visuais, Blog para conteúdo).
    *   **Jornada Simplificada:**
        *   **Como descobre:** [Ex: Pesquisa no Google, Influenciadores]
        *   **O que a convence:** [Ex: Preço justo, Prova social]
    
    ---

    ### Persona 2: [Dê um nome arquetípico, ex: "O Pesquisador Criterioso"]

    *   **Perfil:** Descreva brevemente quem é essa pessoa (idade, profissão, faixa de renda, nível de escolaridade).
    *   **Motivações Principais:** O que a impulsiona a procurar produtos/serviços em "${niche}"? (2-3 pontos)
    *   **Principais Dores:** Quais são seus desafios ou problemas mais urgentes que sua marca pode resolver? (2-3 pontos)
    *   **Canais Chave:** Liste os 2-3 canais mais eficazes para alcançá-la, com uma breve justificativa, considerando seu perfil. (Ex: LinkedIn para networking, Artigos técnicos para credibilidade).
    *   **Jornada Simplificada:**
        *   **Como descobre:** [Ex: Fóruns especializados, Recomendações]
        *   **O que o convence:** [Ex: Qualidade superior, Depoimentos detalhados]
  `;

  const prompt = detailLevel === 'brief' ? promptBrief : promptDetailed;
  return callGemini(prompt);
};


export const generateCompetitiveAnalysis = async (niche: string, subNiche: string): Promise<string> => {
  const prompt = `
    Como um analista competitivo e de UX, analise 3 sites de sucesso no nicho de "${niche}", com foco específico em "${subNiche}".
    Para cada site, forneça uma análise concisa e estratégica. Use seu conhecimento pré-existente sobre marcas e padrões de web design.
    Formate a resposta em Markdown.

    ### Análise Competitiva: Foco em ${subNiche}

    ---

    **Concorrente 1: [Nome do Concorrente ou Exemplo Representativo]**

    *   **Análise Geral:** Qual é a primeira impressão e a proposta de valor clara do site?
    *   **Estrutura e Navegação:** A navegação é intuitiva? Como a informação está organizada?
    *   **Design e UI:** O design é moderno? A paleta de cores e tipografia são eficazes?
    *   **Conteúdo e Mensagem:** Qual o tom de voz? O conteúdo é engajante e persuasivo?
    *   **Experiência do Usuário (UX):** O site é rápido? É fácil encontrar o que se procura e completar uma ação (ex: comprar, contatar)?
    *   **Principal Insight Acionável:** Qual é a principal lição ou tática que podemos aprender e adaptar deste concorrente?

    ---

    **Concorrente 2: [Nome do Concorrente ou Exemplo Representativo]**
    
    *   **Análise Geral:** Qual é a primeira impressão e a proposta de valor clara do site?
    *   **Estrutura e Navegação:** A navegação é intuitiva? Como a informação está organizada?
    *   **Design e UI:** O design é moderno? A paleta de cores e tipografia são eficazes?
    *   **Conteúdo e Mensagem:** Qual o tone de voz? O conteúdo é engajante e persuasivo?
    *   **Experiência do Usuário (UX):** O site é rápido? É fácil encontrar o que se procura e completar uma ação (ex: comprar, contatar)?
    *   **Principal Insight Acionável:** Qual é a principal lição ou tática que podemos aprender e adaptar deste concorrente?
    
    ---

    **Concorrente 3: [Nome do Concorrente ou Exemplo Representativo]**
    
    *   **Análise Geral:** Qual é a primeira impressão e a proposta de valor clara do site?
    *   **Estrutura e Navegação:** A navegação é intuitiva? Como a informação está organizada?
    *   **Design e UI:** O design é moderno? A paleta de cores e tipografia são eficazes?
    *   **Conteúdo e Mensagem:** Qual o tom de voz? O conteúdo é engajante e persuasivo?
    *   **Experiência do Usuário (UX):** O site é rápido? É fácil encontrar o que se procura e completar uma ação (ex: comprar, contatar)?
    *   **Principal Insight Acionável:** Qual é a principal lição ou tática que podemos aprender e adaptar deste concorrente?
  `;
  return callGemini(prompt);
};

export const generateBrandDifferentiation = async (niche: string, brandIdentity: string): Promise<string> => {
  const prompt = `
    Como um diretor de branding, desenvolva uma estratégia de diferenciação para uma marca no nicho de "${niche}", baseada na seguinte identidade central: "${brandIdentity}".
    Crie uma proposta de valor única e uma narrativa de marca convincente. Formate a resposta em Markdown.

    ### Estratégia de Diferenciação da Marca

    **1. Proposta de Valor Única (PVU):**
    *   **Declaração Principal:** Crie uma frase clara e concisa que resuma por que um cliente deve escolher esta marca em vez da concorrência.
    *   **Pilares de Suporte (3 a 4):** Liste os principais benefícios ou características que sustentam a PVU. (Ex: Qualidade Superior, Design Exclusivo, Experiência Personalizada, Compromisso com a Sustentabilidade). Para cada pilar, escreva uma breve explicação.

    **2. Narrativa da Marca (Brand Story):**
    *   Escreva um parágrafo curto e envolvente que conte a história da marca. Deve conectar-se emocionalmente com o público-alvo e transmitir a personalidade e os valores descritos. Pense em "Por que existimos?" e "O que defendemos?".

    **3. Tom de Voz e Personalidade:**
    *   **Arquétipo da Marca:** (Ex: O Sábio, O Herói, O Mago, O Rebelde).
    *   **Atributos de Personalidade:** Liste 5 adjetivos que descrevem a marca (Ex: Confiante, Inovadora, Acessível, Elegante, Ousada).
    *   **Diretrizes de Comunicação:** Forneça exemplos de "Fale assim" vs. "Não fale assim" para guiar a criação de conteúdo.

    **4. Identidade Visual (Direcionamento):**
    *   **Paleta de Cores:** Sugira uma paleta de cores (primária, secundária, acentos) que reflita a personalidade da marca.
    *   **Tipografia:** Recomende estilos de fontes (títulos, corpo de texto) que se alinhem com a marca.
    *   **Estilo de Imagem:** Descreva o tipo de fotografia ou ilustração que deve ser usado (Ex: Minimalista, vibrante, documental, luxuoso).
  `;
  return callGemini(prompt);
};

export const generateSiteDevelopmentPlan = async (userData: UserData, generatedContent: GeneratedContent): Promise<string> => {
  const context = `
    **Nicho:** ${userData.niche}
    **Análise de Nicho:** ${generatedContent.nicheAnalysis?.[generatedContent.nicheAnalysis.length - 1]?.content ?? 'N/A'}
    **Público-Alvo:** ${generatedContent.audienceResearch?.[generatedContent.audienceResearch.length - 1]?.content ?? 'N/A'}
    **Análise Competitiva:** ${generatedContent.competitiveAnalysis?.[generatedContent.competitiveAnalysis.length - 1]?.content ?? 'N/A'}
    **Identidade da Marca:** ${generatedContent.brandDifferentiation?.[generatedContent.brandDifferentiation.length - 1]?.content ?? 'N/A'}
  `;

  const prompt = `
    Como um arquiteto de informação e estrategista de UX/UI, crie um plano de desenvolvimento de site detalhado com base no seguinte contexto:
    ${context}

    Sua tarefa é traduzir toda essa estratégia em um plano de site tangível. Formate a resposta em Markdown.

    ### Plano de Desenvolvimento do Site

    **1. Estratégia Central do Site:**
    *   **Objetivo Principal:** Qual é o objetivo número 1 do site? (Ex: Gerar leads, vender produtos, construir autoridade).
    *   **Público-Alvo Primário:** Quem estamos tentando atrair e converter?
    *   **Ação Chave do Usuário (CTA):** Qual é a principal ação que queremos que os visitantes realizem?

    **2. Sitemap (Estrutura de Páginas):**
    *   Apresente um sitemap claro em formato de lista aninhada. Inclua todas as páginas essenciais.
        * Exemplo:
        * - Home
        * - Sobre Nós
        *   - Nossa História
        *   - Nossa Equipe
        * - Produtos/Serviços
        *   - Categoria 1
        *   - Categoria 2
        * - Blog
        * - Contato

    **3. Wireframes (Descrição de Layouts Principais):**
    *   Para cada página principal (Home, Sobre, Serviços/Produtos, Contato), descreva a estrutura e os blocos de conteúdo em ordem de importância.

    *   **Página Home:**
        *   **Bloco 1 (Acima da Dobra):** Hero com título impactante (usando a PVU), subtítulo, e CTA principal.
        *   **Bloco 2:** Prova social (logos de clientes, depoimentos curtos).
        *   **Bloco 3:** Apresentação dos principais produtos/serviços com links.
        *   **Bloco 4:** Seção sobre os diferenciais da marca.
        *   ...e assim por diante.

    *   **Página Sobre Nós:**
        *   **Bloco 1:** Título e a narrativa da marca.
        *   **Bloco 2:** Seção sobre missão, visão e valores.
        *   ...

    **4. Estratégia de Conteúdo:**
    *   Quais tipos de conteúdo serão necessários? (Ex: Páginas de serviço detalhadas, posts de blog, estudos de caso, vídeos).
    *   Como o Tom de Voz definido será aplicado?

    **5. Elementos de Conversão:**
    *   Liste os elementos que serão usados para converter visitantes. (Ex: Formulários de contato, pop-ups de newsletter, botões de "Compre Agora", chat online).

    **6. KPIs e Métricas de Sucesso:**
    *   Com base no objetivo principal do site, sugira 3-5 KPIs (Key Performance Indicators) para medir o sucesso.
    *   Para cada KPI, explique o que é e sugira uma meta inicial realista.
    *   **Exemplos de KPIs por Objetivo:**
        *   **Para Geração de Leads:** Taxa de conversão de formulários (Meta: 2-5%), Custo por Lead (CPL), Número de MQLs (Marketing Qualified Leads).
        *   **Para Vendas (E-commerce):** Taxa de conversão de vendas (Meta: 1-3%), Ticket Médio, Taxa de abandono de carrinho (Meta: abaixo de 60%).
        *   **Para Construção de Autoridade:** Tráfego orgânico (Meta: +20% no trimestre), Tempo na página (Meta: > 2 min), Taxa de rejeição (Meta: < 50%).

  `;
  return callGemini(prompt);
};

export const generateFinalReport = async (userData: UserData, generatedContent: GeneratedContent): Promise<string> => {
    const context = `
    **Dados Iniciais:**
    * Marca: ${userData.brandName}
    * Nicho: ${userData.niche}
    * Público-Alvo (Descrição): ${userData.targetAudience}
    * Foco Competitivo: ${userData.subNiche}
    * Identidade da Marca (Descrição): ${userData.brandIdentity}
    
    **Análises Geradas pela IA:**
    * Análise de Nicho: ${generatedContent.nicheAnalysis?.[generatedContent.nicheAnalysis.length - 1]?.content ?? 'N/A'}
    * Pesquisa de Público-Alvo: ${generatedContent.audienceResearch?.[generatedContent.audienceResearch.length - 1]?.content ?? 'N/A'}
    * Análise Competitiva: ${generatedContent.competitiveAnalysis?.[generatedContent.competitiveAnalysis.length - 1]?.content ?? 'N/A'}
    * Diferenciação da Marca: ${generatedContent.brandDifferentiation?.[generatedContent.brandDifferentiation.length - 1]?.content ?? 'N/A'}
    * Plano de Desenvolvimento do Site: ${generatedContent.siteDevelopment?.[generatedContent.siteDevelopment.length - 1]?.content ?? 'N/A'}
  `;

  const prompt = `
    Você é um consultor estratégico sênior. Sua tarefa é sintetizar todas as informações a seguir em um relatório final coeso, profissional e acionável. O objetivo é fornecer ao cliente um documento único que guie toda a estratégia de seu novo site.

    **Contexto Completo:**
    ${context}

    Estruture o relatório em Markdown da seguinte forma:

    # Relatório Estratégico de Website para ${userData.brandName}

    ## 1. Sumário Executivo
    *   Faça um resumo conciso (2-3 parágrafos) dos principais achados e da direção estratégica recomendada. Destaque a principal oportunidade de mercado para a marca.

    ## 2. Diagnóstico do Cenário Atual
    *   **Nicho de Mercado:** Resuma os pontos mais importantes da análise de nicho (tamanho, tendências, concorrentes).
    *   **Público-Alvo:** Descreva o perfil do cliente ideal com base nas personas desenvolvidas.
    *   **Posicionamento Competitivo:** Qual é o espaço que a ${userData.brandName} pode ocupar no mercado, com base na análise da concorrência?

    ## 3. A Estratégia da Marca
    *   **Identidade e Proposta de Valor:** Apresente a Proposta de Valor Única (PVU) final e a narrativa da marca.
    *   **Tom de Voz e Comunicação:** Reafirme a personalidade da marca e como ela deve se comunicar.

    ## 4. O Plano do Website
    *   **Objetivos e KPIs:** Quais são os objetivos claros do site (ex: 20% de aumento em leads) e como serão medidos?
    *   **Arquitetura e Experiência do Usuário (UX):** Resuma a estrutura do site (Sitemap) e a filosofia por trás da experiência do usuário planejada. Destaque como o site atenderá às necessidades do público-alvo.
    *   **Estratégia de Conteúdo e SEO:** Recomende os principais temas de conteúdo e uma abordagem inicial para SEO on-page.

    ## 5. Recomendações Passo a Passo
    *   Crie uma lista numerada de 5 a 7 recomendações prioritárias e de alto impacto para a construção do site. Cada recomendação deve ser clara e justificada.
    *   Exemplo: "1. Focar a página inicial na Proposta de Valor Única com um CTA claro para [Ação Chave], pois isso irá capturar a atenção do [Público-Alvo] imediatamente."

    ## 6. Próximos Passos
    *   Sugira as próximas etapas lógicas, como briefing de design, desenvolvimento do conteúdo e escolha da plataforma tecnológica.
  `;
  return callGemini(prompt);
};

export const generateImplementationPlan = async (finalReport: string): Promise<string> => {
  const prompt = `
    Com base no relatório estratégico a seguir, crie um plano de implementação detalhado e prático. Transforme as recomendações em uma checklist acionável, dividida por fases, e inclua uma seção dedicada ao monitoramento de sucesso.

    **Relatório Estratégico:**
    ${finalReport}

    Formate a resposta em Markdown como uma checklist.

    # Plano de Implementação do Website

    ## Fase 1: Fundação e Estratégia (Semana 1-2)

    - [ ] **Definição de Requisitos Técnicos:** Escolher plataforma (WordPress, Shopify, etc.), provedor de hospedagem e registrar domínio.
    - [ ] **Briefing de Design:** Criar um documento detalhado para o designer com base na identidade visual sugerida no relatório.
    - [ ] **Calendário de Conteúdo:** Planejar os primeiros 10 posts de blog e as páginas essenciais.
    - [ ] **Setup de Ferramentas:** Instalar Google Analytics, Google Search Console e outras ferramentas de marketing. Configurar as metas de conversão principais.

    ## Fase 2: Design e Conteúdo (Semana 3-6)

    - [ ] **Design UI/UX:** Desenvolver wireframes de baixa fidelidade e depois mockups de alta fidelidade para as páginas principais.
    - [ ] **Criação de Conteúdo (Copywriting):** Escrever todo o texto para as páginas do site (Home, Sobre, Serviços, etc.), aplicando o tom de voz definido.
    - [ ] **Criação de Conteúdo (Visual):** Produzir ou selecionar fotografias e outros elementos visuais alinhados à marca.
    - [ ] **Otimização de Conteúdo (SEO On-Page):** Pesquisar e aplicar palavras-chave, otimizar títulos, meta descrições e URLs.

    ## Fase 3: Desenvolvimento e Lançamento (Semana 7-10)

    - [ ] **Desenvolvimento Front-end:** Codificar o design do site, garantindo responsividade para dispositivos móveis.
    - [ ] **Desenvolvimento Back-end / CMS Setup:** Configurar o sistema de gerenciamento de conteúdo e funcionalidades dinâmicas.
    - [ ] **Integração de Ferramentas:** Conectar formulários a serviços de e-mail marketing, configurar pixels de rastreamento.
    - [ ] **Testes de Qualidade (QA):** Realizar testes completos de links, formulários, velocidade e compatibilidade entre navegadores.
    - [ ] **Lançamento:** Migrar o site para o servidor de produção e torná-lo público.

    ## Fase 4: Pós-Lançamento e Otimização (Contínuo)

    - [ ] **Monitoramento e Análise:** Acompanhar semanalmente os KPIs definidos no painel do Google Analytics e ajustar a estratégia com base nos dados.
    - [ ] **Plano de Marketing de Conteúdo:** Executar o calendário de conteúdo, publicando e promovendo novos posts.
    - [ ] **Otimização de Conversão (CRO):** Realizar testes A/B em CTAs, títulos e layouts para melhorar as taxas de conversão.
    - [ ] **Manutenção Técnica:** Realizar backups regulares, atualizar plugins e garantir a segurança do site.

    ## Monitoramento de Sucesso: KPIs e Metas

    Com base nos objetivos definidos no relatório, estas são as métricas chave para acompanhar o sucesso do seu site. Crie um painel personalizado no Google Analytics para monitorar estes KPIs.

    *   **KPI 1: [Ex: Taxa de Conversão de Leads]**
        *   **Descrição:** Percentual de visitantes que preenchem um formulário de contato ou realizam a ação de conversão principal.
        *   **Meta Inicial (Primeiro Trimestre):** [Ex: Atingir 2% de taxa de conversão].
        *   **Como Medir:** Configurar meta de conversão no Google Analytics para o envio de formulários ou clique em botões chave.

    *   **KPI 2: [Ex: Tráfego Orgânico Qualificado]**
        *   **Descrição:** Número de visitantes que chegam ao site através de buscas não pagas e que demonstram engajamento (ex: visitam mais de uma página, tempo de sessão alto).
        *   **Meta Inicial (Primeiro Trimestre):** [Ex: Aumentar o tráfego orgânico em 20%].
        *   **Como Medir:** Analisar o relatório de Aquisição > Todo o tráfego > Canais no Google Analytics, segmentando por 'Organic Search' e observando métricas como 'Páginas/Sessão' e 'Duração Média da Sessão'.

    *   **KPI 3: [Ex: Engajamento com Conteúdo]**
        *   **Descrição:** Mede o quão interessante e relevante o conteúdo é para os visitantes.
        *   **Meta Inicial (Primeiro Trimestre):** [Ex: Atingir um tempo médio na página de 2 minutos para posts de blog].
        *   **Como Medir:** Analisar o relatório de Comportamento > Conteúdo do site > Todas as páginas. Usar o Google Tag Manager para rastrear eventos como profundidade de rolagem.
  `;
  return callGemini(prompt);
};