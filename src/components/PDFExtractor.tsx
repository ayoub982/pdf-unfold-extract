import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Table, Image, Download, Check, Star, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { extractPDFContent, ExtractedContent } from '@/utils/pdfExtractor';

interface ExtractionOptions {
  text: boolean;
  tables: boolean;
  images: boolean;
}

const PDFExtractor = () => {
  const [dragActive, setDragActive] = useState(false);
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

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setExtractedContent(null); // Clear previous results
        setError(null);
        toast({
          title: "PDF uploaded successfully!",
          description: `${droppedFile.name} is ready for extraction.`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file only.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setExtractedContent(null); // Clear previous results
        setError(null);
        toast({
          title: "PDF uploaded successfully!",
          description: `${selectedFile.name} is ready for extraction.`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file only.",
          variant: "destructive",
        });
      }
    }
  };

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
    URL.revokeObjectURL(url); // Clean up immediately
  };

  const toggleOption = (option: keyof ExtractionOptions) => {
    setExtractionOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

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
            <Card className="p-8">
              <div
                className={`upload-area border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive ? 'dragover' : 'border-gray-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {file ? file.name : 'Drop your PDF here'}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {file ? 'File ready for extraction' : 'or click to browse files'}
                    </p>
                  </div>
                  {!file && (
                    <div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload">
                        <Button variant="outline" className="cursor-pointer">
                          Browse Files
                        </Button>
                      </label>
                    </div>
                  )}
                  {file && (
                    <div className="flex items-center justify-center space-x-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        Ready
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFile(null);
                          setExtractedContent(null);
                          setError(null);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Extraction Options */}
            {file && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">What would you like to extract?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div
                    className={`feature-card p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      extractionOptions.text ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleOption('text')}
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
                    onClick={() => toggleOption('tables')}
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
                    onClick={() => toggleOption('images')}
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
                  onClick={handleExtraction}
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
            )}

            {/* Error Display */}
            {error && (
              <Card className="p-6 border-red-200 bg-red-50">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-900">Extraction Failed</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Results */}
            {extractedContent && (
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
                          onClick={() => downloadContent(extractedContent.text!, `${file?.name || 'extracted'}-text.txt`, 'text/plain')}
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
                            `${file?.name || 'extracted'}-tables.csv`,
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
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Privacy Notice */}
            <Card className="p-6 bg-green-50 border-green-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-green-900">100% Private & Secure</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your PDFs are processed locally in your browser. No data is stored or sent to servers.
                  </p>
                </div>
              </div>
            </Card>

            {/* Upgrade Card */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-blue-50 border-primary/20">
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Upgrade to Pro</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Batch processing, Excel export, and advanced OCR
                  </p>
                </div>
                <Button className="w-full">
                  Start Free Trial
                </Button>
                <p className="text-xs text-gray-500">No credit card required</p>
              </div>
            </Card>

            {/* Features */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Free Features</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Text extraction</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Image detection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Basic table extraction</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Local processing</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFExtractor;
