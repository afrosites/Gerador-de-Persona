import React, { useRef, useState } from 'react';
import { STEPS, StepId } from '../constants';
import type { UserData, HistoryItem } from '../types';
import GeneratedContentDisplay from './GeneratedContentDisplay';
import { SparklesIcon, ArrowRightIcon, UploadIcon, RevertIcon } from './IconComponents';
import { parseFile } from '../services/fileParser';

interface StepRendererProps {
  stepId: StepId;
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  loading: boolean;
  generatedContentHistory: HistoryItem[] | null;
  handleGenerate: () => void;
  canProceed: boolean;
  handleNext: () => void;
  handleRevert: (index: number) => void;
  error: string | null;
}

const HistoryPane: React.FC<{ history: HistoryItem[], onRevert: (index: number) => void }> = ({ history, onRevert }) => {
    const reversedHistory = [...history].slice(0, -1).reverse(); // All but the active one, newest first

    return (
        <div className="mt-10">
            <h3 className="text-lg font-semibold text-gray-200">Histórico de Gerações</h3>
            <div className="mt-4 space-y-3">
                {reversedHistory.map((item, revIndex) => {
                    const originalIndex = history.length - 2 - revIndex;
                    const date = new Date(item.timestamp);
                    const formattedDate = `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
                    
                    return (
                        <div key={item.timestamp} className="bg-black/20 p-4 rounded-lg border border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-300">Versão de {formattedDate}</p>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                    {item.content.substring(0, 150).replace(/###/g, '').replace(/\*\*/g, '')}...
                                </p>
                            </div>
                            <button
                                onClick={() => onRevert(originalIndex)}
                                className="inline-flex items-center justify-center gap-x-2 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20 transition-colors flex-shrink-0"
                            >
                                <RevertIcon className="h-4 w-4" />
                                Restaurar
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}


const StepRenderer: React.FC<StepRendererProps> = ({
  stepId,
  userData,
  setUserData,
  loading,
  generatedContentHistory,
  handleGenerate,
  canProceed,
  handleNext,
  handleRevert,
  error,
}) => {
  const currentStepInfo = STEPS.find(s => s.id === stepId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  
  if (!currentStepInfo) return null;

  const {
    name,
    description,
    inputLabel,
    inputPlaceholder,
    inputType,
    userDataKey,
  } = currentStepInfo;
  
  const isGenerativeStep = ![StepId.SiteDevelopment, StepId.FinalReport, StepId.ImplementationPlan].includes(stepId);
  const currentContent = generatedContentHistory && generatedContentHistory.length > 0 ? generatedContentHistory[generatedContentHistory.length - 1].content : null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (stepId === StepId.NicheAnalysis) {
      const value = e.target.value;
      // We store the raw value in `niche` and parse `brandName` out of it on the fly.
      const brandMatch = value.match(/Marca:\s*([^,]*)/i);
      setUserData(prev => ({
        ...prev,
        brandName: brandMatch ? brandMatch[1].trim() : '',
        niche: value, // Store raw input value in 'niche' field for this step
      }));
    } else {
       setUserData(prev => ({ ...prev, [userDataKey]: e.target.value }));
    }
  };

  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData(prev => ({ ...prev, personaDetailLevel: e.target.value as 'brief' | 'detailed' }));
  };

  const getInputValue = () => {
    // For the special case of NicheAnalysis, the 'niche' field holds the raw input.
    if (stepId === StepId.NicheAnalysis) {
        return userData.niche;
    }
    return userData[userDataKey];
  }

  const handleImportClick = () => {
    setImportError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }

    try {
      const text = await parseFile(file);
      if (stepId === StepId.NicheAnalysis) {
        const brandMatch = text.match(/Marca:\s*([^,]*)/i);
        setUserData(prev => ({
          ...prev,
          brandName: brandMatch ? brandMatch[1].trim() : '',
          niche: text,
        }));
      } else {
         setUserData(prev => ({ ...prev, [userDataKey]: text }));
      }
    } catch (err) {
      if (err instanceof Error) {
        setImportError(err.message);
      } else {
        setImportError("Ocorreu um erro desconhecido ao importar o arquivo.");
      }
    }
  };


  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{name}</h2>
        <p className="mt-3 text-lg text-gray-400">{description}</p>
      </div>

      <div className="bg-[#1e1f1f] border border-gray-700 rounded-xl p-6 space-y-4">
        {isGenerativeStep ? (
          <>
            <label htmlFor={stepId} className="block text-sm font-medium text-gray-300">
              {inputLabel}
            </label>
            {inputType === 'textarea' ? (
              <textarea
                id={stepId}
                name={stepId}
                rows={4}
                className="block w-full rounded-md border-0 bg-white/5 p-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-[#D49929] sm:text-sm sm:leading-6 transition-all"
                placeholder={inputPlaceholder}
                value={getInputValue()}
                onChange={handleInputChange}
                disabled={loading}
              />
            ) : (
              <input
                type="text"
                id={stepId}
                name={stepId}
                className="block w-full rounded-md border-0 bg-white/5 p-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-[#D49929] sm:text-sm sm:leading-6 transition-all"
                placeholder={inputPlaceholder}
                value={getInputValue()}
                onChange={handleInputChange}
                disabled={loading}
              />
            )}
          </>
        ) : (
            <p className="text-gray-400">{inputLabel}</p>
        )}

        {stepId === StepId.AudienceResearch && (
          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nível de Detalhe da Persona
            </label>
            <fieldset className="flex flex-col sm:flex-row gap-4">
              <legend className="sr-only">Nível de detalhe</legend>
              <div className="flex items-center">
                <input
                  id="detailed"
                  name="persona-detail"
                  type="radio"
                  value="detailed"
                  checked={userData.personaDetailLevel === 'detailed'}
                  onChange={handleDetailChange}
                  className="h-4 w-4 border-gray-500 bg-white/5 text-[#D49929] focus:ring-[#BE8925] focus:ring-offset-black"
                  disabled={loading}
                />
                <label htmlFor="detailed" className="ml-3 block text-sm font-medium leading-6 text-gray-200">
                  Perfil Detalhado
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="brief"
                  name="persona-detail"
                  type="radio"
                  value="brief"
                  checked={userData.personaDetailLevel === 'brief'}
                  onChange={handleDetailChange}
                  className="h-4 w-4 border-gray-500 bg-white/5 text-[#D49929] focus:ring-[#BE8925] focus:ring-offset-black"
                  disabled={loading}
                />
                <label htmlFor="brief" className="ml-3 block text-sm font-medium leading-6 text-gray-200">
                  Resumo Breve
                </label>
              </div>
            </fieldset>
          </div>
        )}

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-2">
            <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="inline-flex items-center justify-center gap-x-2 rounded-md bg-[#D49929] px-4 py-3 text-sm font-semibold text-black shadow-sm hover:bg-[#BE8925] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D49929] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <SparklesIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Gerando...' : 'Gerar Análise'}
            </button>
            {isGenerativeStep && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.docx"
                />
                <button
                    type="button"
                    onClick={handleImportClick}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-x-2 rounded-md bg-white/10 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <UploadIcon className="h-5 w-5" />
                    Importar Arquivo
                </button>
              </>
            )}
            {canProceed && (
                 <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center justify-center gap-x-2 rounded-md bg-white/10 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
                >
                    Próximo Passo
                    <ArrowRightIcon className="h-5 w-5" />
                </button>
            )}
        </div>
        {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
        {importError && <p className="text-sm text-red-400 mt-2">{importError}</p>}
      </div>

      <GeneratedContentDisplay
        loading={loading}
        content={currentContent}
        stepName={name}
        isFinalReport={stepId === StepId.FinalReport}
      />

      {generatedContentHistory && generatedContentHistory.length > 1 && (
        <HistoryPane history={generatedContentHistory} onRevert={handleRevert} />
      )}
    </div>
  );
};

export default StepRenderer;