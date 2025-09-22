// src/components/UI/QRGenerator.jsx
import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { useNotifications } from '../../context/NotificationContext';

const QRGenerator = ({ 
  data, 
  size = 256,
  errorCorrectionLevel = 'M',
  margin = 4,
  color = { dark: '#000000', light: '#FFFFFF' },
  format = 'png',
  includeText = true,
  downloadable = true,
  className = ''
}) => {
  const canvasRef = useRef(null);
  const [qrDataURL, setQrDataURL] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useNotifications();

  const generateQR = async () => {
    if (!data) return;

    try {
      setLoading(true);
      
      // Convert data to string if it's an object
      const qrData = typeof data === 'object' ? JSON.stringify(data) : String(data);
      
      const options = {
        errorCorrectionLevel,
        width: size,
        margin,
        color
      };

      if (format === 'svg') {
        const svgString = await QRCode.toString(qrData, { 
          ...options, 
          type: 'svg' 
        });
        setQrDataURL(`data:image/svg+xml;base64,${btoa(svgString)}`);
      } else {
        // Generate as canvas/PNG
        const canvas = canvasRef.current;
        if (canvas) {
          await QRCode.toCanvas(canvas, qrData, options);
          const dataURL = canvas.toDataURL(`image/${format}`);
          setQrDataURL(dataURL);
        }
      }
    } catch (error) {
      console.error('QR generation error:', error);
      showError('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrDataURL) return;

    try {
      const link = document.createElement('a');
      link.download = `agrichain-qr-${Date.now()}.${format}`;
      link.href = qrDataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showSuccess('QR code downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      showError('Failed to download QR code');
    }
  };

  const copyToClipboard = async () => {
    try {
      if (format === 'svg') {
        // For SVG, copy the data as text
        const qrData = typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);
        await navigator.clipboard.writeText(qrData);
        showSuccess('QR data copied to clipboard!');
      } else {
        // For images, copy as blob
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.toBlob(async (blob) => {
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
              ]);
              showSuccess('QR code copied to clipboard!');
            } catch (err) {
              // Fallback: copy data as text
              const qrData = typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);
              await navigator.clipboard.writeText(qrData);
              showSuccess('QR data copied to clipboard!');
            }
          });
        }
      }
    } catch (error) {
      console.error('Copy error:', error);
      showError('Failed to copy to clipboard');
    }
  };

  useEffect(() => {
    generateQR();
  }, [data, size, errorCorrectionLevel, margin, color, format]);

  if (!data) {
    return (
      <div className={`qr-generator-placeholder ${className}`}>
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          <p className="text-lg font-medium">No Data to Generate QR</p>
          <p className="text-sm">Provide data to generate QR code</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`qr-generator ${className}`}>
      <div className="flex flex-col items-center">
        {loading ? (
          <div className="flex items-center justify-center" style={{ width: size, height: size }}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {format === 'svg' && qrDataURL ? (
              <img 
                src={qrDataURL} 
                alt="QR Code"
                style={{ width: size, height: size }}
                className="border border-gray-200 rounded-lg"
              />
            ) : (
              <canvas
                ref={canvasRef}
                className="border border-gray-200 rounded-lg"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            )}
          </>
        )}

        {includeText && !loading && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg max-w-xs">
            <p className="text-xs text-gray-600 break-all">
              {typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data)}
            </p>
          </div>
        )}

        {!loading && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </button>

            {downloadable && (
              <button
                onClick={downloadQR}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Predefined QR generators for AgriChain use cases
export const ProduceQRGenerator = ({ produce, ...props }) => {
  const qrData = {
    type: 'produce',
    id: produce.id,
    name: produce.name,
    farmer: produce.farmer,
    harvestDate: produce.harvestDate,
    location: produce.location,
    certification: produce.certification,
    verifyUrl: `${window.location.origin}/verify/${produce.id}`
  };

  return <QRGenerator data={qrData} {...props} />;
};

export const TransactionQRGenerator = ({ transaction, ...props }) => {
  const qrData = {
    type: 'transaction',
    id: transaction.id,
    txHash: transaction.txHash,
    from: transaction.from,
    to: transaction.to,
    timestamp: transaction.timestamp,
    verifyUrl: `${window.location.origin}/verify/transaction/${transaction.id}`
  };

  return <QRGenerator data={qrData} {...props} />;
};

export const FarmQRGenerator = ({ farm, ...props }) => {
  const qrData = {
    type: 'farm',
    id: farm.id,
    name: farm.name,
    owner: farm.owner,
    location: farm.location,
    certification: farm.certification,
    profileUrl: `${window.location.origin}/farm/${farm.id}`
  };

  return <QRGenerator data={qrData} {...props} />;
};

export default QRGenerator;