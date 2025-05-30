
import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PDFUploadAreaProps {
  file: File | null;
  setFile: (file: File | null) => void;
  onClearFile: () => void;
}

const PDFUploadArea = ({ file, setFile, onClearFile }: PDFUploadAreaProps) => {
  const [dragActive, setDragActive] = useState(false);
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
  }, [setFile, toast]);

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

  return (
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
                onClick={onClearFile}
              >
                Remove
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PDFUploadArea;
