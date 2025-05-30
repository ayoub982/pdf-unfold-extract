
import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Table, Image, Download, Check, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [extractedContent, setExtractedContent] = useState<any>(null);
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
    
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setExtractedContent({
        text: extractionOptions.text ? "Sample extracted text content..." : null,
        tables: extractionOptions.tables ? [["Header 1", "Header 2"], ["Data 1", "Data 2"]] : null,
        images: extractionOptions.images ? ["image1.jpg", "image2.jpg"] : null,
      });
      setIsProcessing(false);
      toast({
        title: "Extraction completed!",
        description: "Your content has been successfully extracted.",
      });
    }, 2000);
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
                        onClick={() => setFile(null)}
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

            {/* Results */}
            {extractedContent && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Extraction Results</h3>
                <div className="space-y-4">
                  {extractedContent.text && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">Text Content</p>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          TXT
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{extractedContent.text}</p>
                    </div>
                  )}
                  
                  {extractedContent.tables && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">Tables ({extractedContent.tables.length})</p>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          CSV
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">Structured data ready for export</p>
                    </div>
                  )}
                  
                  {extractedContent.images && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">Images ({extractedContent.images.length})</p>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          ZIP
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">All images extracted successfully</p>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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
                  <span className="text-sm">Image extraction</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Basic table extraction</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Secure processing</span>
                </div>
              </div>
            </Card>

            {/* Security Notice */}
            <Card className="p-6 bg-green-50 border-green-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-green-900">Secure & Private</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your documents are automatically deleted after processing. We never store your files.
                  </p>
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
