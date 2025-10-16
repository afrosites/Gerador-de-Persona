import React, { useState } from 'react';
import type { UserData, GeneratedContent } from '../types';
import { generatePdfReport } from '../services/documentGenerator';
import { PdfIcon, LoadingSpinner, TrashIcon, WhatsAppIcon } from './IconComponents';

interface DownloadButtonsProps {
  userData: UserData;
  generatedContent: GeneratedContent;
  isJourneyComplete: boolean;
  onReset: () => void;
}

const DownloadButtons: React.FC<DownloadButtonsProps> = ({ userData, generatedContent, isJourneyComplete, onReset }) => {
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownloadPdf = async () => {
    setError(null);
    setIsPdfLoading(true);
    try {
      await generatePdfReport(userData, generatedContent);
    } catch (err) {
      console.error('Failed to generate PDF report:', err);
      setError('Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.');
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleShareWhatsApp = () => {
    const brandName = userData.brandName || "minha marca";
    const text = `Confira o relatório estratégico que criei para a marca "${brandName}" usando o Gerador de Persona da Afro Sites! Saiba mais em: https://afrosites.com.br`;
    const encodedText = encodeURIComponent(text);
    const url = `https://api.whatsapp.com/send?text=${encodedText}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mt-8">
      <div className="bg-[#1e1f1f] border border-gray-700 rounded-xl p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-white">{isJourneyComplete ? 'Jornada Concluída!' : 'Seu Relatório Estratégico está Pronto!'}</h3>
          <p className="mt-2 text-gray-400">
            {isJourneyComplete
              ? 'Sua análise estratégica está completa. Faça o download do relatório consolidado ou compartilhe seu progresso.'
              : 'Você chegou a um marco importante. Faça o download do relatório consolidado com todas as análises até agora ou compartilhe. O próximo passo é gerar um plano de implementação.'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-start items-center gap-4 pt-2">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isPdfLoading}
            className="inline-flex items-center justify-center gap-x-2 rounded-md bg-rose-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPdfLoading ? (
                <LoadingSpinner className="h-5 w-5" />
            ) : (
                <PdfIcon className="h-5 w-5" />
            )}
            {isPdfLoading ? 'Gerando PDF...' : 'Baixar Relatório em PDF'}
          </button>
          <button
            type="button"
            onClick={handleShareWhatsApp}
            disabled={isPdfLoading}
            className="inline-flex items-center justify-center gap-x-2 rounded-md bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Compartilhar no WhatsApp
          </button>
          <button
            type="button"
            onClick={onReset}
            disabled={isPdfLoading}
            className="inline-flex items-center justify-center gap-x-2 rounded-md bg-gray-800 px-4 py-3 text-sm font-semibold text-gray-300 shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrashIcon className="h-5 w-5" />
            Resetar Pesquisa
          </button>
        </div>
        {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default DownloadButtons;