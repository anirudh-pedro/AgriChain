import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RotateCcw, Flashlight, Upload, AlertCircle, CheckCircle } from 'lucide-react';

const QRCodeScanner = ({ onScanSuccess, onClose, isOpen }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [flashOn, setFlashOn] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      initializeCamera();
    } else {
      cleanup();
    }

    return cleanup;
  }, [isOpen]);

  const initializeCamera = async () => {
    try {
      setError('');
      
      // Get available devices
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = mediaDevices.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);

      // Prefer back camera if available
      const backCamera = videoDevices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear')
      );
      
      const deviceId = backCamera ? backCamera.deviceId : videoDevices[0]?.deviceId;
      setSelectedDevice(deviceId);

      if (deviceId) {
        await startCamera(deviceId);
      } else {
        setError('No camera found on this device.');
      }
    } catch (err) {
      console.error('Error initializing camera:', err);
      setError('Failed to access camera. Please check permissions.');
      setHasPermission(false);
    }
  };

  const startCamera = async (deviceId) => {
    try {
      const constraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          facingMode: deviceId ? undefined : { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsScanning(true);
        setHasPermission(true);
        startScanning();
      }
    } catch (err) {
      console.error('Error starting camera:', err);
      setError('Failed to start camera. Please ensure camera permissions are granted.');
      setHasPermission(false);
    }
  };

  const startScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }

    scanIntervalRef.current = setInterval(() => {
      if (videoRef.current && canvasRef.current && isScanning) {
        scanQRCode();
      }
    }, 500);
  };

  const scanQRCode = () => {
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        // In a real implementation, you would use a QR code scanning library here
        // For this demo, we'll simulate QR code detection
        simulateQRCodeDetection();
      }
    } catch (err) {
      console.error('Error scanning QR code:', err);
    }
  };

  const simulateQRCodeDetection = () => {
    // This is a simulation - in a real app, you'd use a library like jsQR
    // For demo purposes, we'll randomly "detect" a QR code after some time
    const randomDetection = Math.random() < 0.1; // 10% chance per scan
    
    if (randomDetection) {
      const mockProduceId = 'PROD-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0') + '-2024';
      handleScanSuccess(mockProduceId);
    }
  };

  const handleScanSuccess = (result) => {
    setScanResult(result);
    setIsScanning(false);
    
    // Extract produce ID from URL if it's a full URL
    let produceId = result;
    if (result.includes('/trace/')) {
      produceId = result.split('/trace/')[1];
    }
    
    setTimeout(() => {
      onScanSuccess && onScanSuccess(produceId);
      cleanup();
    }, 1500);
  };

  const cleanup = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setIsScanning(false);
    setScanResult(null);
  };

  const switchCamera = async () => {
    const currentIndex = devices.findIndex(device => device.deviceId === selectedDevice);
    const nextIndex = (currentIndex + 1) % devices.length;
    const nextDevice = devices[nextIndex];
    
    cleanup();
    setSelectedDevice(nextDevice.deviceId);
    await startCamera(nextDevice.deviceId);
  };

  const toggleFlash = async () => {
    try {
      if (streamRef.current) {
        const track = streamRef.current.getVideoTracks()[0];
        if (track && track.getCapabilities().torch) {
          await track.applyConstraints({
            advanced: [{ torch: !flashOn }]
          });
          setFlashOn(!flashOn);
        }
      }
    } catch (err) {
      console.error('Error toggling flash:', err);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // In a real implementation, you would process the uploaded image
      // and extract QR code data from it
      const mockProduceId = 'PROD-UPLOAD-' + Math.floor(Math.random() * 1000);
      handleScanSuccess(mockProduceId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-md mx-auto bg-black">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50 p-4">
          <div className="flex items-center justify-between text-white">
            <h3 className="text-lg font-semibold">Scan QR Code</h3>
            <button
              onClick={() => { cleanup(); onClose(); }}
              className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Camera View */}
        <div className="relative w-full h-full">
          {hasPermission === false ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white p-6">
                <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
                <h3 className="text-lg font-semibold mb-2">Camera Permission Required</h3>
                <p className="text-gray-300 mb-4">Please grant camera permission to scan QR codes.</p>
                <button
                  onClick={initializeCamera}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white p-6">
                <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
                <h3 className="text-lg font-semibold mb-2">Camera Error</h3>
                <p className="text-gray-300 mb-4">{error}</p>
                <div className="space-y-2">
                  <button
                    onClick={initializeCamera}
                    className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Retry Camera
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="block w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Upload Image
                  </button>
                </div>
              </div>
            </div>
          ) : scanResult ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white p-6">
                <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-400" />
                <h3 className="text-lg font-semibold mb-2">QR Code Detected!</h3>
                <p className="text-gray-300 mb-2">Product ID: {scanResult}</p>
                <p className="text-sm text-gray-400">Redirecting to product trace...</p>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              
              {/* Scanning Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Scanning Frame */}
                  <div className="w-64 h-64 border-2 border-white border-opacity-50 relative">
                    {/* Corner indicators */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-white"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-white"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-white"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-white"></div>
                    
                    {/* Scanning line animation */}
                    {isScanning && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-white animate-pulse"></div>
                    )}
                  </div>
                  
                  <p className="text-white text-center mt-4">
                    Position QR code within the frame
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Controls */}
        {hasPermission && !error && !scanResult && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
            <div className="flex items-center justify-center space-x-6">
              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors text-white"
                title="Upload Image"
              >
                <Upload className="h-6 w-6" />
              </button>

              {/* Flash Toggle */}
              <button
                onClick={toggleFlash}
                className={`p-3 rounded-full transition-colors text-white ${
                  flashOn ? 'bg-yellow-600' : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                }`}
                title="Toggle Flash"
              >
                <Flashlight className="h-6 w-6" />
              </button>

              {/* Switch Camera */}
              {devices.length > 1 && (
                <button
                  onClick={switchCamera}
                  className="p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors text-white"
                  title="Switch Camera"
                >
                  <RotateCcw className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Hidden Canvas for Processing */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

export default QRCodeScanner;