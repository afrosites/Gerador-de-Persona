// @ts-nocheck
import { STEPS } from '../constants';
import type { UserData, GeneratedContent } from '../types';

declare const jsPDF: any;
declare const html2canvas: any;
declare const docx: any;
declare const saveAs: any;

const markdownToHtml = (content: string): string => {
    if (!content) return '';
    let html = '';
    const lines = content.split('\n');
    let inList = false;

    for (const line of lines) {
        if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
            if (!inList) {
                inList = true;
                html += '<ul>';
            }
            html += `<li>${line.trim().substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`;
        } else {
            if (inList) {
                inList = false;
                html += '</ul>';
            }
            if (line.startsWith('### ')) {
                html += `<h3>${line.substring(4)}</h3>`;
            } else if (line.startsWith('## ')) {
                html += `<h2>${line.substring(3)}</h2>`;
            } else if (line.trim() === '') {
                 html += '<br />';
            } else {
                html += `<p>${line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
            }
        }
    }

    if (inList) {
        html += '</ul>';
    }
    return html;
};


export const generatePdfReport = async (userData: UserData, generatedContent: GeneratedContent): Promise<void> => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let cursorY = margin;

    // --- Cover Page ---
    doc.setFillColor('#1e1f1f');
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#EAC16A');
    doc.text('Afro Sites', pageWidth / 2, 60, { align: 'center' });
    
    doc.setFontSize(22);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#FFFFFF');
    doc.text('Relatório Estratégico de Website', pageWidth / 2, 80, { align: 'center' });

    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#FFFFFF');
    doc.text(userData.brandName || "Sua Marca", pageWidth / 2, 120, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor('#9CA3AF');
    const date = new Date().toLocaleDateString('pt-BR');
    doc.text(`Gerado em: ${date}`, pageWidth / 2, pageHeight - 40, { align: 'center' });


    // --- Table of Contents ---
    doc.addPage();
    cursorY = margin;
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#000000');
    doc.text('Sumário', margin, cursorY);
    cursorY += 15;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const tocEntries = [];
    let pageCounter = 3; // Starts after cover and TOC

    STEPS.forEach(step => {
        const contentHistory = generatedContent[step.id];
        const latestContent = contentHistory && contentHistory.length > 0 ? contentHistory[contentHistory.length - 1].content : null;

        if (latestContent) {
            tocEntries.push({ name: step.name, page: pageCounter });
            
            // Simple estimation of page count per section
            const lines = latestContent.split('\n').length;
            pageCounter += Math.ceil(lines / 45) || 1; // Estimate ~45 lines per page
        }
    });

    tocEntries.forEach((entry, index) => {
        doc.setTextColor('#0000EE');
        doc.textWithLink(entry.name, margin, cursorY, { pageNumber: entry.page, });
        cursorY += 8;
    });


    // --- Content Pages ---
    STEPS.forEach(step => {
        const contentHistory = generatedContent[step.id];
        const content = contentHistory && contentHistory.length > 0 ? contentHistory[contentHistory.length - 1].content : null;

        if (content) {
            doc.addPage();
            cursorY = margin;

            // Header
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#000000');
            const titleLines = doc.splitTextToSize(step.name, contentWidth);
            doc.text(titleLines, margin, cursorY);
            cursorY += (titleLines.length * 7) + 5;

            doc.setDrawColor('#EAC16A');
            doc.setLineWidth(0.5);
            doc.line(margin, cursorY, pageWidth - margin, cursorY);
            cursorY += 10;
            
            // Body
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor('#374151');

            const lines = content.split('\n');
            for (const line of lines) {
                if (cursorY > pageHeight - margin - 5) {
                    doc.addPage();
                    cursorY = margin;
                }

                let textToRender = line;
                let isBold = false;
                let isH3 = false;
                let isListItem = false;

                if (line.startsWith('### ')) {
                    textToRender = line.substring(4);
                    isH3 = true;
                } else if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                    textToRender = '• ' + line.trim().substring(2);
                    isListItem = true;
                }
                
                if(line.includes('**')){
                    textToRender = line.replace(/\*\*/g, '');
                    isBold = true;
                }

                if(isH3) {
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor('#D49929');
                    cursorY += 4;
                } else if(isBold) {
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor('#1f2937');
                }

                const splitText = doc.splitTextToSize(textToRender, contentWidth - (isListItem ? 5 : 0));
                doc.text(splitText, margin + (isListItem ? 5 : 0), cursorY);
                cursorY += splitText.length * 5.5;

                // Reset styles
                doc.setFont('helvetica', 'normal');
                doc.setTextColor('#374151');
                if(isH3) cursorY += 2;
            }
        }
    });

    // --- Add Page Numbers ---
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor('#9CA3AF');
        
        const footerText = `Relatório Afro Sites para ${userData.brandName || "Sua Marca"}`;
        doc.text(footerText, margin, pageHeight - 10);
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    }

    doc.save(`relatorio-estrategico-${userData.brandName || 'afrosites'}.pdf`);
};

const markdownToDocx = (markdown) => {
    // This function assumes `window.docx` is available, checked by the caller.
    const { Paragraph, TextRun, HeadingLevel } = window.docx;

    /**
     * Parses a single line of text containing Markdown-style bold tags (**)
     * into an array of TextRun objects for the docx library.
     * @param {string} line The line of text to parse.
     * @returns {docx.TextRun[]} An array of TextRun objects.
     */
    const parseLineToTextRuns = (line) => {
        const parts = line.split('**');
        // If there are no bold markers, return a single TextRun.
        if (parts.length <= 1) {
            return [new TextRun(line)];
        }
        
        // Map parts to TextRuns, alternating bold style.
        return parts.map((part, index) => {
            const isBold = index % 2 === 1;
            return new TextRun({ text: part, bold: isBold });
        // Filter out empty TextRuns that can be created if the line starts/ends with **
        }).filter(run => run.text && run.text.length > 0);
    };

    const children = [];
    const lines = markdown.split('\n');

    lines.forEach(line => {
        const trimmedLine = line.trim();
        // Handle headings
        if (line.startsWith('### ')) {
            children.push(new Paragraph({ text: line.substring(4), heading: HeadingLevel.HEADING_3 }));
        } else if (line.startsWith('## ')) {
            children.push(new Paragraph({ text: line.substring(3), heading: HeadingLevel.HEADING_2 }));
        // Handle bullet points
        } else if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
            const content = trimmedLine.substring(2);
            children.push(new Paragraph({
                children: parseLineToTextRuns(content),
                bullet: { level: 0 }
            }));
        // Handle empty lines as spacers
        } else if (trimmedLine === '') {
            children.push(new Paragraph({ text: '' }));
        // Handle regular paragraphs
        } else {
            children.push(new Paragraph({ children: parseLineToTextRuns(line) }));
        }
    });

    return children;
};

const waitForGlobal = (name, property = null, timeout = 10000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const check = () => {
      const lib = window[name];
      if (lib && (property ? lib[property] !== undefined : true)) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error(`Timed out waiting for global variable '${name}'.`));
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
};

export const generateWordReport = async (userData: UserData, generatedContent: GeneratedContent): Promise<void> => {
    try {
        await waitForGlobal('docx', 'Document');
    } catch (e) {
        console.error(e);
        throw new Error(
            'A biblioteca de geração de DOCX (Word) não foi carregada a tempo. Verifique sua conexão com a internet ou tente recarregar a página.'
        );
    }
    
    const { Document, Packer, Paragraph, HeadingLevel, AlignmentType } = window.docx;

    const sections = [];

    STEPS.forEach(step => {
        const contentHistory = generatedContent[step.id];
        const content = contentHistory && contentHistory.length > 0 ? contentHistory[contentHistory.length - 1].content : null;

        if(content) {
            sections.push(
                new Paragraph({ text: step.name, heading: HeadingLevel.HEADING_1 })
            );
            sections.push(...markdownToDocx(content));
            sections.push(new Paragraph({ text: '' })); // Spacer
        }
    });
    
    const doc = new Document({
        sections: [{
            children: [
                new Paragraph({ text: 'Relatório Estratégico de Website', heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }),
                new Paragraph({ text: `Marca: ${userData.brandName}`, heading: HeadingLevel.HEADING_2, alignment: AlignmentType.CENTER }),
                new Paragraph({ text: '' }),
                ...sections
            ]
        }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `relatorio-estrategico-${userData.brandName || 'afrosites'}.docx`);
};