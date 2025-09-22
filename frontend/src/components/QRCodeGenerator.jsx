import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Download, Share2, Copy, Check } from 'lucide-react';
import QRCode from 'qrcode';

const QRCodeGenerator = ({ data, size = 200, className = '' }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  // Generate QR code using the qrcode library
  useEffect(() => {
    if (data) {
      QRCode.toDataURL(data, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      .then(url => {
        setQrCodeUrl(url);
      })
      .catch(err => {
        console.error('Error generating QR code:', err);
        // Fallback to simple pattern if QRCode library fails
        generateFallbackQR();
      });
    }
  }, [data, size]);

  const generateFallbackQR = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = size;
      canvas.height = size;
      
      // Clear canvas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      
      // Create QR-like pattern
      ctx.fillStyle = '#000000';
      const moduleSize = size / 25;
      
      // Generate a pattern based on the data
      const pattern = Array.from(data).map(char => char.charCodeAt(0) % 2);
      let patternIndex = 0;
      
      for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 25; j++) {
          if (pattern[patternIndex % pattern.length]) {
            ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
          }
          patternIndex++;
        }
      }
      
      // Add corner squares (QR code positioning markers)
      const cornerSize = moduleSize * 7;
      
      // Top-left corner
      ctx.fillRect(0, 0, cornerSize, cornerSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(moduleSize, moduleSize, cornerSize - 2 * moduleSize, cornerSize - 2 * moduleSize);
      ctx.fillStyle = '#000000';
      ctx.fillRect(2 * moduleSize, 2 * moduleSize, cornerSize - 4 * moduleSize, cornerSize - 4 * moduleSize);
      
      // Top-right corner
      ctx.fillStyle = '#000000';
      ctx.fillRect(size - cornerSize, 0, cornerSize, cornerSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(size - cornerSize + moduleSize, moduleSize, cornerSize - 2 * moduleSize, cornerSize - 2 * moduleSize);
      ctx.fillStyle = '#000000';
      ctx.fillRect(size - cornerSize + 2 * moduleSize, 2 * moduleSize, cornerSize - 4 * moduleSize, cornerSize - 4 * moduleSize);
      
      // Bottom-left corner
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, size - cornerSize, cornerSize, cornerSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(moduleSize, size - cornerSize + moduleSize, cornerSize - 2 * moduleSize, cornerSize - 2 * moduleSize);
      ctx.fillStyle = '#000000';
      ctx.fillRect(2 * moduleSize, size - cornerSize + 2 * moduleSize, cornerSize - 4 * moduleSize, cornerSize - 4 * moduleSize);
      
      setQrCodeUrl(canvas.toDataURL());
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `qr-code-${data}.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AgriChain Product QR Code',
          text: `Track this product: ${data}`,
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <div className={`bg-white rounded-xl p-4 border border-gray-200 shadow-sm ${className}`}>
      <div className="text-center mb-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">Product QR Code</h4>
        <p className="text-sm text-gray-600">Scan to trace this product</p>
      </div>
      
      <div className="flex justify-center mb-4">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="border-2 border-gray-200 rounded-lg"
            style={{ width: size, height: size }}
          />
          {!qrCodeUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
              <QrCode className="text-gray-400" size={size / 4} />
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center mb-4">
        <p className="text-xs text-gray-500 font-mono break-all bg-gray-50 p-2 rounded">
          {data}
        </p>
      </div>
      
      <div className="flex justify-center space-x-2">
        <button
          onClick={handleDownload}
          className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          disabled={!qrCodeUrl}
        >
          <Download size={16} />
          <span className="text-sm">Download</span>
        </button>
        
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span className="text-sm">{copied ? 'Copied!' : 'Copy ID'}</span>
        </button>
        
        {navigator.share && (
          <button
            onClick={handleShare}
            className="flex items-center space-x-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
          >
            <Share2 size={16} />
            <span className="text-sm">Share</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default QRCodeGenerator;