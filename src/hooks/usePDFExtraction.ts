
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { extractPDFContent, ExtractedContent } from '@/utils/pdfExtractor';

interface ExtractionOptions {
  text: boolean;
  tables: boolean;
  images: boolean;
}

export const usePDFExtraction = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractionOptions, setExtractionOptions] = useState<ExtractionOptions>({
    text: true,
    tables: false,
    images: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedContent, setExtractedContent] = useState<ExtractedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleExtraction = async () => {
    if (!file) return;
    
    console.log('Starting extraction process...');
    setIsProcessing(true);
    setError(null);
    setExtractedContent(null);
    
    try {
      const content = await extractPDFContent(file, extractionOptions);
      console.log('Extraction result:', content);
      
      setExtractedContent(content);
      toast({
        title: "Extraction completed!",
        description: `Successfully extracted content from ${content.pageCount} page(s).`,
      });
    } catch (err) {
      console.error('Extraction failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast({
        title: "Extraction failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleOption = (option: keyof ExtractionOptions) => {
    setExtractionOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const clearFile = () => {
    setFile(null);
    setExtractedContent(null);
    setError(null);
  };

  return {
    file,
    setFile,
    extractionOptions,
    isProcessing,
    extractedContent,
    error,
    handleExtraction,
    toggleOption,
    clearFile,
  };
};
