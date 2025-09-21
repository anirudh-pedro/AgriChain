import React, { useState, useEffect } from 'react';
import { QrCode, Download, Copy, Check, Package, Info } from 'lucide-react';

const QRCodeGenerator = ({ produceId, produceData, onSuccess }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (produceId) {
      generateQRCode();
    }
  }, [produceId]);

  const generateQRCode = async () => {
    setGenerating(true);
    try {
      // Create the traceability URL
      const baseUrl = window.location.origin;
      const traceUrl = `${baseUrl}/trace/${produceId}`;
      
      // Using QR Server API for QR code generation
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(traceUrl)}`;
      
      setQrCodeUrl(qrApiUrl);
      onSuccess && onSuccess({ qrCodeUrl: qrApiUrl, traceUrl });
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const downloadQRCode = async () => {
    if (!qrCodeUrl) return;

    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qrcode-${produceId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  const traceUrl = `${window.location.origin}/trace/${produceId}`;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <QrCode className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">QR Code Generator</h2>
        </div>
        <p className="text-gray-600">Generate a QR code for produce traceability</p>
      </div>

      {/* Produce Information */}
      {produceData && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Package className="h-5 w-5 mr-2 text-green-600" />
            Produce Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Product:</span>
              <span className="ml-2 font-medium text-gray-900">
                {produceData.produceType} {produceData.variety && `- ${produceData.variety}`}
              </span>
            </div>
            <div>
              <span className="text-gray-600">ID:</span>
              <span className="ml-2 font-medium text-gray-900">{produceId}</span>
            </div>
            <div>
              <span className="text-gray-600">Farm:</span>
              <span className="ml-2 font-medium text-gray-900">{produceData.farmName}</span>
            </div>
            <div>
              <span className="text-gray-600">Quality:</span>
              <span className="ml-2 font-medium text-gray-900">{produceData.quality?.grade}</span>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Display */}
      <div className="text-center mb-6">
        {generating ? (
          <div className="w-72 h-72 mx-auto border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-3"></div>
              <p className="text-gray-600">Generating QR Code...</p>
            </div>
          </div>
        ) : qrCodeUrl ? (
          <div className="w-72 h-72 mx-auto border border-gray-200 rounded-lg overflow-hidden">
            <img 
              src={qrCodeUrl} 
              alt={`QR Code for ${produceId}`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-72 h-72 mx-auto border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <QrCode className="h-16 w-16 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">QR Code will appear here</p>
            </div>
          </div>
        )}
      </div>

      {/* Trace URL */}
      {produceId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center">
            <Info className="h-4 w-4 mr-2" />
            Traceability URL
          </h4>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={traceUrl}
              readOnly
              className="flex-1 px-3 py-2 bg-white border border-blue-300 rounded-lg text-sm"
            />
            <button
              onClick={() => copyToClipboard(traceUrl)}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span className="text-sm">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span className="text-sm">Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-blue-700 mt-2">
            Consumers can scan this QR code or visit this URL to trace the produce journey.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={generateQRCode}
          disabled={!produceId || generating}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          <QrCode className="h-4 w-4" />
          <span>{generating ? 'Generating...' : 'Regenerate QR Code'}</span>
        </button>

        <button
          onClick={downloadQRCode}
          disabled={!qrCodeUrl}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Download PNG</span>
        </button>
      </div>

      {/* Usage Instructions */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">How to Use This QR Code</h4>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-start space-x-2">
            <span className="font-medium text-purple-600">1.</span>
            <span>Print this QR code and attach it to your produce packaging.</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-medium text-purple-600">2.</span>
            <span>Consumers can scan the code with their smartphone camera or QR code scanner app.</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-medium text-purple-600">3.</span>
            <span>The scan will redirect them to a webpage showing the complete journey of this produce.</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-medium text-purple-600">4.</span>
            <span>They can view farm details, quality inspections, and supply chain history.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;