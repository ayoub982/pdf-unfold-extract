
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Star } from 'lucide-react';
import { usePDFExtraction } from '@/hooks/usePDFExtraction';
import PDFUploadArea from './PDFUploadArea';
import ExtractionOptions from './ExtractionOptions';
import ExtractionResults from './ExtractionResults';
import PDFExtractorSidebar from './PDFExtractorSidebar';

const PDFExtractor = () => {
  const {
    file,
    setFile,
    extractionOptions,
    isProcessing,
    extractedContent,
    error,
    handleExtraction,
    toggleOption,
    clearFile,
  } = usePDFExtraction();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PDF Extractor Pro</h1>
                <p className="text-sm text-gray-600">Extract text, tables & images instantly</p>
              </div>
            </div>
            <Button variant="outline" className="hidden md:flex">
              <Star className="h-4 w-4 mr-2" />
              Upgrade Pro
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Upload Area */}
          <div className="lg:col-span-2 space-y-6">
            <PDFUploadArea 
              file={file} 
              setFile={setFile} 
              onClearFile={clearFile} 
            />

            {/* Extraction Options */}
            {file && (
              <ExtractionOptions
                extractionOptions={extractionOptions}
                isProcessing={isProcessing}
                onToggleOption={toggleOption}
                onExtract={handleExtraction}
              />
            )}

            {/* Results */}
            <ExtractionResults
              extractedContent={extractedContent}
              error={error}
              fileName={file?.name}
            />
          </div>

          {/* Sidebar */}
          <PDFExtractorSidebar />
        </div>
      </div>
    </div>
  );
};

export default PDFExtractor;
