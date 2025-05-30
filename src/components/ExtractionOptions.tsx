
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Table, Image, Download } from 'lucide-react';

interface ExtractionOptionsProps {
  extractionOptions: {
    text: boolean;
    tables: boolean;
    images: boolean;
  };
  isProcessing: boolean;
  onToggleOption: (option: 'text' | 'tables' | 'images') => void;
  onExtract: () => void;
}

const ExtractionOptions = ({ 
  extractionOptions, 
  isProcessing, 
  onToggleOption, 
  onExtract 
}: ExtractionOptionsProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">What would you like to extract?</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div
          className={`feature-card p-4 rounded-lg border-2 cursor-pointer transition-all ${
            extractionOptions.text ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onToggleOption('text')}
        >
          <div className="flex items-center space-x-3">
            <FileText className={`h-6 w-6 ${extractionOptions.text ? 'text-primary' : 'text-gray-400'}`} />
            <div>
              <p className="font-medium">Text</p>
              <p className="text-sm text-gray-600">Extract all text content</p>
            </div>
          </div>
        </div>
        
        <div
          className={`feature-card p-4 rounded-lg border-2 cursor-pointer transition-all ${
            extractionOptions.tables ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onToggleOption('tables')}
        >
          <div className="flex items-center space-x-3">
            <Table className={`h-6 w-6 ${extractionOptions.tables ? 'text-primary' : 'text-gray-400'}`} />
            <div>
              <p className="font-medium">Tables</p>
              <p className="text-sm text-gray-600">Extract structured data</p>
            </div>
          </div>
        </div>
        
        <div
          className={`feature-card p-4 rounded-lg border-2 cursor-pointer transition-all ${
            extractionOptions.images ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onToggleOption('images')}
        >
          <div className="flex items-center space-x-3">
            <Image className={`h-6 w-6 ${extractionOptions.images ? 'text-primary' : 'text-gray-400'}`} />
            <div>
              <p className="font-medium">Images</p>
              <p className="text-sm text-gray-600">Extract all images</p>
            </div>
          </div>
        </div>
      </div>
      
      <Button
        onClick={onExtract}
        disabled={isProcessing || (!extractionOptions.text && !extractionOptions.tables && !extractionOptions.images)}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Extract Content
          </>
        )}
      </Button>
    </Card>
  );
};

export default ExtractionOptions;
