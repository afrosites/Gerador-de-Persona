
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { STEPS, StepId } from './constants';
import type { UserData, GeneratedContent, LoadingStates, HistoryItem } from './types';
import { generateNicheAnalysis, generateAudienceResearch, generateCompetitiveAnalysis, generateBrandDifferentiation, generateSiteDevelopmentPlan, generateFinalReport, generateImplementationPlan } from './services/geminiService';
import Stepper from './components/Stepper';
import StepRenderer from './components/StepRenderer';
import { SankofaIcon } from './components/IconComponents';
import DownloadButtons from './components/DownloadButtons';

const LOCAL_STORAGE_KEY = 'afroSitesProgress';

const App: React.FC = () => {
  const loadInitialState = () => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!item) return undefined;
      
      const savedState = JSON.parse(item);

      // Migration for old data structure
      if (savedState.generatedContent) {
        for (const key in savedState.generatedContent) {
          const stepId = key as StepId;
          const value = savedState.generatedContent[stepId];
          if (typeof value === 'string') {
            // Convert old string content to new history array structure
            savedState.generatedContent[stepId] = [{ content: value, timestamp: Date.now() }];
          }
        }
      }
      return savedState;

    } catch (error) {
      console.warn(`Error reading localStorage key “${LOCAL_STORAGE_KEY}”:`, error);
      return undefined;
    }
  };

  const savedState = loadInitialState();

  const [currentStep, setCurrentStep] = useState<StepId>(savedState?.currentStep || StepId.NicheAnalysis);
  const [userData, setUserData] = useState<UserData>(savedState?.userData || {
    brandName: '',
    niche: '',
    targetAudience: '',
    subNiche: '',
    brandIdentity: '',
    personaDetailLevel: 'detailed',
  });
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>(savedState?.generatedContent || {
    nicheAnalysis: null,
    audienceResearch: null,
    competitiveAnalysis: null,
    brandDifferentiation: null,
    siteDevelopment: null,
    finalReport: null,
    implementationPlan: null,
  });
  const [loading, setLoading] = useState<LoadingStates>({
    nicheAnalysis: false,
    audienceResearch: false,
    competitiveAnalysis: false,
    brandDifferentiation: false,
    siteDevelopment: false,
    finalReport: false,
    implementationPlan: false,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stateToSave = {
        currentStep,
        userData,
        generatedContent,
      };
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.warn(`Error writing to localStorage key “${LOCAL_STORAGE_KEY}”:`, error);
    }
  }, [currentStep, userData, generatedContent]);

  const handleNext = () => {
    const currentIndex = STEPS.findIndex(step => step.id === currentStep);
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1].id);
    }
  };

  const isStepCompleted = useCallback((stepId: StepId) => {
    const contentHistory = generatedContent[stepId];
    return contentHistory !== null && contentHistory.length > 0;
  }, [generatedContent]);

  const handleGenerate = async () => {
    setError(null);
    setLoading(prev => ({ ...prev, [currentStep]: true }));

    try {
      let result = null;
      switch (currentStep) {
        case StepId.NicheAnalysis:
          const rawInput = userData.niche;
          const nicheMatch = rawInput.match(/Nicho:\s*(.*)/i);
          let nicheForApi = rawInput; // Default to the whole string
          if (nicheMatch) {
              nicheForApi = nicheMatch[1].trim(); // If "Nicho:" exists, use its value
          } else if (rawInput.toLowerCase().includes('marca:')) {
              // If "Marca:" exists but "Nicho:" doesn't, the niche is likely empty or not specified
              nicheForApi = '';
          }
          result = await generateNicheAnalysis(userData.brandName, nicheForApi);
          break;
        case StepId.AudienceResearch:
          result = await generateAudienceResearch(userData.niche, userData.targetAudience, userData.personaDetailLevel);
          break;
        case StepId.CompetitiveAnalysis:
          result = await generateCompetitiveAnalysis(userData.niche, userData.subNiche);
          break;
        case StepId.BrandDifferentiation:
          result = await generateBrandDifferentiation(userData.niche, userData.brandIdentity);
          break;
        case StepId.SiteDevelopment:
          result = await generateSiteDevelopmentPlan(userData, generatedContent);
          break;
        case StepId.FinalReport:
          result = await generateFinalReport(userData, generatedContent);
          break;
        case StepId.ImplementationPlan:
          const latestReport = generatedContent.finalReport?.[generatedContent.finalReport.length - 1]?.content ?? "";
          result = await generateImplementationPlan(latestReport);
          break;
      }
      
      if (result) {
        const newHistoryItem: HistoryItem = { content: result, timestamp: Date.now() };
        setGeneratedContent(prev => {
          const existingHistory = prev[currentStep] || [];
          return { ...prev, [currentStep]: [...existingHistory, newHistoryItem] };
        });
      }
    } catch (e) {
      console.error(e);
      setError("Ocorreu um erro ao gerar o conteúdo. Por favor, tente novamente.");
    } finally {
      setLoading(prev => ({ ...prev, [currentStep]: false }));
    }
  };
  
  const canProceed = useMemo(() => isStepCompleted(currentStep), [currentStep, isStepCompleted]);

  const handleReset = () => {
    if (window.confirm("Tem certeza que deseja apagar todo o seu progresso? Esta ação não pode ser desfeita.")) {
        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
        // Reset state
        setCurrentStep(StepId.NicheAnalysis);
        setUserData({
            brandName: '',
            niche: '',
            targetAudience: '',
            subNiche: '',
            brandIdentity: '',
            personaDetailLevel: 'detailed',
        });
        setGeneratedContent({
            nicheAnalysis: null,
            audienceResearch: null,
            competitiveAnalysis: null,
            brandDifferentiation: null,
            siteDevelopment: null,
            finalReport: null,
            implementationPlan: null,
        });
        window.scrollTo(0, 0);
    }
  };

  const handleRevert = (stepId: StepId, index: number) => {
    setGeneratedContent(prev => {
      const history = prev[stepId];
      if (!history || index < 0 || index >= history.length) {
        return prev;
      }
      const newHistory = [...history];
      const [revertedItem] = newHistory.splice(index, 1);
      newHistory.push(revertedItem); // Move to the end to make it the active version
      return { ...prev, [stepId]: newHistory };
    });
  };

  return (
    <div className="min-h-screen bg-[#191919] text-gray-100 flex flex-col md:flex-row font-sans">
      <header className="md:hidden p-4 bg-[#1e1f1f] border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#D49929] p-2 rounded-lg">
                <SankofaIcon className="h-6 w-6 text-black" />
            </div>
            <h1 className="text-xl font-bold text-white">Afro Sites</h1>
          </div>
      </header>

      <aside className="w-full md:w-80 bg-[#1e1f1f] p-6 border-r border-gray-700 hidden md:flex md:flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-[#D49929] p-3 rounded-lg">
                <SankofaIcon className="h-8 w-8 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-white">Afro Sites</h1>
          </div>
          <Stepper 
            steps={STEPS} 
            currentStepId={currentStep} 
            isStepCompleted={isStepCompleted}
            onStepClick={setCurrentStep}
          />
      </aside>

      <main className="flex-1 p-4 sm:p-6 md:p-10 flex flex-col">
        <div className="max-w-4xl mx-auto w-full flex-grow">
          <StepRenderer
            stepId={currentStep}
            userData={userData}
            setUserData={setUserData}
            loading={loading[currentStep]}
            generatedContentHistory={generatedContent[currentStep]}
            handleGenerate={handleGenerate}
            canProceed={canProceed}
            handleNext={handleNext}
            handleRevert={(index) => handleRevert(currentStep, index)}
            error={error}
          />
          {generatedContent.finalReport && generatedContent.finalReport.length > 0 && (
            <DownloadButtons
                userData={userData}
                generatedContent={generatedContent}
                isJourneyComplete={!!generatedContent.implementationPlan && generatedContent.implementationPlan.length > 0}
                onReset={handleReset}
            />
          )}
        </div>

        <footer className="text-center text-gray-500 text-sm mt-8 pb-4">
          Feito com amor 🖤{' '}
          <a
            href="https://afrosites.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-400 hover:underline"
          >
            Afro Sites
          </a>
        </footer>
      </main>
    </div>
  );
};

export default App;
