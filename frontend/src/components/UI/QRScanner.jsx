// src/components/UI/QRScanner.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNotifications } from '../../context/NotificationContext';

const QRScanner = ({ 
  onScanSuccess, 
  onScanError,
  width = 300,
  height = 300,
  fps = 10,
  qrbox = 250,
  showToggle = true,
  className = ''
}) => {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanner, setScanner] = useState(null);
  const { showError, showSuccess } = useNotifications();

  const handleScanSuccess = (decodedText, decodedResult) => {
    try {
      // Try to parse as JSON for AgriChain QR codes
      let data;
      try {
        data = JSON.parse(decodedText);
      } catch {
        // If not JSON, treat as plain text
        data = { text: decodedText };
      }

      showSuccess(`QR Code scanned successfully!`);
      onScanSuccess?.(data, decodedResult);
    } catch (error) {
      console.error('Scan success handler error:', error);
      showError('Error processing scanned QR code');
    }
  };

  const handleScanError = (error) => {
    // Don't show errors for common scanning issues
    if (!error.includes('No QR code found')) {
      console.warn('QR Scan error:', error);
      onScanError?.(error);
    }
  };

  const startScanning = async () => {
    try {
      const qrScanner = new Html5QrcodeScanner(
        'qr-scanner-container',
        {
          fps,
          qrbox: { width: qrbox, height: qrbox },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true,
          defaultZoomValueIfSupported: 2,
        }
      );

      qrScanner.render(handleScanSuccess, handleScanError);
      setScanner(qrScanner);
      setIsScanning(true);
    } catch (error) {
      console.error('Failed to start QR scanner:', error);
      showError('Failed to access camera. Please check permissions.');
    }
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.clear();
      setScanner(null);
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [scanner]);

  return (
    <div className={`qr-scanner-wrapper ${className}`}>
      {showToggle && (
        <div className="mb-4 flex justify-center">
          {!isScanning ? (
            <button
              onClick={startScanning}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Start QR Scanner
            </button>
          ) : (
            <button
              onClick={stopScanning}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Stop Scanner
            </button>
          )}
        </div>
      )}

      <div className="flex justify-center">
        <div 
          id="qr-scanner-container"
          className="max-w-full"
          style={{ width: `${width}px`, height: isScanning ? 'auto' : '0' }}
        />
      </div>

      {!isScanning && (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          <p className="text-lg font-medium">Ready to Scan QR Code</p>
          <p className="text-sm">Click "Start QR Scanner" to begin</p>
        </div>
      )}
    </div>
  );
};

export default QRScanner;