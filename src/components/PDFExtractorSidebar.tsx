
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';

const PDFExtractorSidebar = () => {
  return (
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
  );
};

export default PDFExtractorSidebar;
