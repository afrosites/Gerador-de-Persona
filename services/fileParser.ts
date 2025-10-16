// @ts-nocheck - This is needed because these libraries are loaded from a CDN.
declare const pdfjsLib: any;
declare const mammoth: any;

export const parseFile = async (file: File): Promise<string> => {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'pdf') {
    return parsePdf(file);
  } else if (extension === 'docx') {
    return parseDocx(file);
  } else {
    throw new Error('Tipo de arquivo não suportado. Por favor, use .pdf ou .docx.');
  }
};

const parsePdf = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event.target?.result) {
        return reject(new Error('Falha ao ler o arquivo PDF.'));
      }
      try {
        const pdf = await pdfjsLib.getDocument({ data: event.target.result }).promise;
        let textContent = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const text = await page.getTextContent();
          textContent += text.items.map((item: any) => item.str).join(' ');
          textContent += '\n'; // Add newline between pages
        }
        resolve(textContent);
      } catch (error) {
        console.error('Error parsing PDF:', error);
        reject(new Error('Não foi possível extrair o texto do PDF.'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

const parseDocx = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event.target?.result) {
        return reject(new Error('Falha ao ler o arquivo DOCX.'));
      }
      try {
        const result = await mammoth.extractRawText({ arrayBuffer: event.target.result });
        resolve(result.value);
      } catch (error) {
        console.error('Error parsing DOCX:', error);
        reject(new Error('Não foi possível extrair o texto do DOCX.'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
