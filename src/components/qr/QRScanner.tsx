import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, CheckCircle, AlertCircle, QrCode, X } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export default function QRScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const { toast } = useToast();
  const { profile } = useAuth();

  const startScanning = () => {
    setIsScanning(true);
    setError(null);
    setScanResult(null);

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        // Success callback
        setScanResult(decodedText);
        setIsScanning(false);
        scanner.clear();
        handleAttendance(decodedText);
      },
      (error) => {
        // Error callback - only log significant errors
        if (error.includes('No MultiFormat')) return;
        console.warn('QR Scan error:', error);
      }
    );

    scannerRef.current = scanner;
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleAttendance = async (qrData: string) => {
    setIsLoading(true);
    try {
      // Parse QR code data - expected format: session_id
      const sessionId = qrData;
      
      // Mock attendance marking - in real app, this would call Supabase
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      toast({
        title: "Attendance Marked!",
        description: "Your attendance has been successfully recorded.",
        variant: "default"
      });

      // Mock successful response
      setScanResult(`Successfully marked attendance for session: ${sessionId}`);
      
    } catch (error) {
      console.error('Error marking attendance:', error);
      setError('Failed to mark attendance. Please try again.');
      toast({
        title: "Attendance Failed",
        description: "Could not mark your attendance. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          <QrCode className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          QR Code Scanner
        </h1>
        <p className="text-muted-foreground mt-2">
          Scan the QR code displayed by your teacher to mark attendance
        </p>
      </div>

      {/* Scanner Card */}
      <Card className="max-w-2xl mx-auto border-0 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Camera Scanner
          </CardTitle>
          <CardDescription>
            Position the QR code within the scanner frame
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scanner Area */}
          <div className="relative">
            {!isScanning && !scanResult && (
              <div className="aspect-square max-w-sm mx-auto bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl flex items-center justify-center border-2 border-dashed border-primary/30">
                <div className="text-center p-8">
                  <QrCode className="h-16 w-16 text-primary/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Click "Start Scanner" to begin
                  </p>
                </div>
              </div>
            )}
            
            {isScanning && (
              <div className="relative">
                <div id="qr-reader" className="max-w-sm mx-auto"></div>
                <div className="mt-4 text-center">
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    Scanning for QR codes...
                  </Badge>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="aspect-square max-w-sm mx-auto bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-primary font-medium">
                    Marking attendance...
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            {!isScanning && !isLoading ? (
              <Button
                onClick={startScanning}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg"
                size="lg"
              >
                <Camera className="h-5 w-5 mr-2" />
                Start Scanner
              </Button>
            ) : isScanning ? (
              <Button
                onClick={stopScanning}
                variant="outline"
                size="lg"
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <X className="h-5 w-5 mr-2" />
                Stop Scanner
              </Button>
            ) : null}
          </div>

          {/* Results */}
          {scanResult && (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                <strong>Success!</strong> {scanResult}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                <strong>Error:</strong> {error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="max-w-2xl mx-auto border-0 shadow-lg bg-gradient-to-br from-accent/5 to-primary/5">
        <CardHeader>
          <CardTitle className="text-lg">How to use QR Scanner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Start Scanner</h3>
              <p className="text-sm text-muted-foreground">
                Click the "Start Scanner" button to activate your camera
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Scan QR Code</h3>
              <p className="text-sm text-muted-foreground">
                Point your camera at the QR code displayed by your teacher
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Attendance Marked</h3>
              <p className="text-sm text-muted-foreground">
                Your attendance will be automatically recorded
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}