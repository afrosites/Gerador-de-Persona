// @ts-nocheck
import React, { useRef } from 'react';
import { LoadingSpinner, DownloadIcon } from './IconComponents';

declare const jsPDF: any;
declare const html2canvas: any;

interface GeneratedContentDisplayProps {
  loading: boolean;
  content: string | null;
  stepName: string;
  isFinalReport?: boolean;
}

const Markdown: React.FC<{ content: string }> = ({ content }) => {
    let html = '';
    let inList = false;

    const lines = content.split('\n');

    for (const line of lines) {
        const isListItem = line.trim().startsWith('* ') || line.trim().startsWith('- ');

        if (isListItem && !inList) {
            inList = true;
            html += '<ul class="space-y-2 list-disc pl-5">';
        }
        if (!isListItem && inList) {
            inList = false;
            html += '</ul>';
        }

        let processedLine = line;
        // Bold must be processed before other tags to avoid conflicts
        processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-200">$1</strong>');

        if (processedLine.startsWith('# ')) {
            html += `<h1>${processedLine.substring(2)}</h1>`;
        } else if (processedLine.startsWith('## ')) {
            html += `<h2 class="text-2xl font-semibold text-white mt-6 mb-3">${processedLine.substring(3)}</h2>`;
        } else if (processedLine.startsWith('### ')) {
            html += `<h3 class="text-xl font-semibold text-[#EAC16A] mt-5 mb-2">${processedLine.substring(4)}</h3>`;
        } else if (isListItem) {
            html += `<li>${processedLine.trim().substring(2)}</li>`;
        } else if (processedLine.trim() === '') {
            html += '<br />';
        } else {
            html += `<p class="text-gray-300 leading-relaxed">${processedLine}</p>`;
        }
    }

    if (inList) {
        html += '</ul>';
    }

    return <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
};


const GeneratedContentDisplay: React.FC<GeneratedContentDisplayProps> = ({ loading, content, stepName, isFinalReport = false }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  let summaryContent: string | null = null;
  if (isFinalReport && content) {
    // This regex looks for the executive summary section and captures its content
    // It stops at the next `## ` which marks the beginning of the next section.
    const summaryRegex = /## 1\. Sumário Executivo([\s\S]*?)(?=## 2\.)/;
    const match = content.match(summaryRegex);

    if (match && match[1]) {
      summaryContent = `### Sumário Executivo\n\n${match[1].trim()}`;
    }
  }


  const handleDownloadPdf = async () => {
    const input = contentRef.current;
    if (!input) {
      return;
    }
    
    try {
        const canvas = await html2canvas(input, {
            scale: 2,
            backgroundColor: '#1e1f1f',
            useCORS: true,
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;

        const pdf = new jsPDF('p', 'mm', 'a4');
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        const fileName = `${stepName.toLowerCase().replace(/ /g, '-')}-afro-sites.pdf`;
        pdf.save(fileName);
    } catch (error) {
        console.error("Failed to generate PDF:", error);
        alert("Desculpe, ocorreu um erro ao gerar o PDF.");
    }
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center bg-[#1e1f1f] border border-gray-700 rounded-xl p-10 min-h-[300px]">
        <LoadingSpinner className="h-12 w-12 text-[#D49929]" />
        <p className="mt-4 text-lg text-gray-300">Afro Sites está trabalhando na sua estratégia...</p>
        <p className="text-sm text-gray-500">Isso pode levar alguns segundos.</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center bg-[#1e1f1f]/50 border-2 border-dashed border-gray-700 rounded-xl p-10 min-h-[300px]">
        <p className="text-gray-500">O conteúdo gerado aparecerá aqui.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={contentRef} className="bg-[#1e1f1f] border border-gray-700 rounded-xl p-6 sm:p-8">
        {summaryContent && (
            <div className="bg-black/20 border border-gray-700 rounded-lg p-6 mb-8 ring-1 ring-[#D49929]/50">
                <Markdown content={summaryContent} />
            </div>
        )}
        <div className="space-y-4 text-gray-300">
          <Markdown content={content} />
        </div>
      </div>
      <button
        onClick={handleDownloadPdf}
        className="absolute top-4 right-4 bg-gray-600/50 hover:bg-gray-600/80 text-gray-300 hover:text-white p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1e1f1f] focus:ring-white"
        aria-label="Baixar como PDF"
        title="Baixar como PDF"
      >
        <DownloadIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default GeneratedContentDisplay;