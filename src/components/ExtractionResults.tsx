
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, AlertCircle } from 'lucide-react';
import { ExtractedContent } from '@/utils/pdfExtractor';

interface ExtractionResultsProps {
  extractedContent: ExtractedContent | null;
  error: string | null;
  fileName?: string;
}

const ExtractionResults = ({ extractedContent, error, fileName }: ExtractionResultsProps) => {
  const downloadContent = (content: string, filename: string, type: string) => {
    console.log('Downloading content:', filename);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <Card className="p-6 border-red-200 bg-red-50">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-900">Extraction Failed</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!extractedContent) {
    return null;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Extraction Results</h3>
      <div className="space-y-4">
        {extractedContent.text && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">Text Content</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => downloadContent(extractedContent.text!, `${fileName || 'extracted'}-text.txt`, 'text/plain')}
              >
                <Download className="h-3 w-3 mr-1" />
                TXT
              </Button>
            </div>
            <div className="max-h-40 overflow-y-auto">
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{extractedContent.text}</p>
            </div>
          </div>
        )}
        
        {extractedContent.tables && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">Tables ({extractedContent.tables.length} rows)</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => downloadContent(
                  extractedContent.tables!.map(row => row.join(',')).join('\n'),
                  `${fileName || 'extracted'}-tables.csv`,
                  'text/csv'
                )}
              >
                <Download className="h-3 w-3 mr-1" />
                CSV
              </Button>
            </div>
            <div className="max-h-40 overflow-y-auto">
              <div className="text-sm text-gray-600">
                {extractedContent.tables.slice(0, 3).map((row, idx) => (
                  <div key={idx} className="border-b pb-1 mb-1">
                    {row.join(' | ')}
                  </div>
                ))}
                {extractedContent.tables.length > 3 && (
                  <p className="text-xs text-gray-500">... and {extractedContent.tables.length - 3} more rows</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {extractedContent.images && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">Images ({extractedContent.images.length} found)</p>
              <Button variant="outline" size="sm" disabled>
                <Download className="h-3 w-3 mr-1" />
                ZIP
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              {extractedContent.images.map((img, idx) => (
                <div key={idx}>{img}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ExtractionResults;
