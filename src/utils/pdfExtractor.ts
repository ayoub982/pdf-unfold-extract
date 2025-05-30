
import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ExtractedContent {
  text: string | null;
  tables: string[][] | null;
  images: string[] | null;
  pageCount: number;
}

export const extractPDFContent = async (
  file: File,
  options: { text: boolean; tables: boolean; images: boolean }
): Promise<ExtractedContent> => {
  console.log('Starting PDF extraction for:', file.name);
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    console.log('PDF loaded, pages:', pdf.numPages);
    
    let extractedText = '';
    const extractedImages: string[] = [];
    const extractedTables: string[][] = [];
    
    // Extract content from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      console.log('Processing page:', pageNum);
      const page = await pdf.getPage(pageNum);
      
      // Extract text if requested
      if (options.text) {
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        extractedText += pageText + '\n\n';
      }
      
      // Extract images if requested (basic implementation)
      if (options.images) {
        try {
          const operatorList = await page.getOperatorList();
          const imageCount = operatorList.fnArray.filter((fn: number) => fn === pdfjsLib.OPS.paintImageXObject).length;
          if (imageCount > 0) {
            extractedImages.push(`Page ${pageNum}: ${imageCount} image(s) found`);
          }
        } catch (error) {
          console.log('Error extracting images from page', pageNum, error);
        }
      }
      
      // Basic table detection (simplified - looks for tabular text patterns)
      if (options.tables && options.text) {
        const textContent = await page.getTextContent();
        const lines = textContent.items
          .map((item: any) => item.str)
          .join(' ')
          .split('\n');
        
        // Simple heuristic: if we find lines with multiple spaces/tabs, treat as table rows
        const tableRows = lines
          .filter(line => line.includes('  ') || line.includes('\t'))
          .slice(0, 5) // Limit to first 5 potential table rows per page
          .map(row => row.split(/\s{2,}|\t/).filter(cell => cell.trim()));
        
        if (tableRows.length > 0) {
          extractedTables.push(...tableRows);
        }
      }
    }
    
    console.log('Extraction completed successfully');
    
    return {
      text: options.text ? extractedText.trim() || 'No text content found' : null,
      tables: options.tables && extractedTables.length > 0 ? extractedTables : null,
      images: options.images && extractedImages.length > 0 ? extractedImages : null,
      pageCount: pdf.numPages
    };
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract content from PDF. Please ensure the file is a valid PDF.');
  }
};
