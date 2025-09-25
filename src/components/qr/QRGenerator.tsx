import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QrCode, RefreshCw, Shield, Clock, Play, Square } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface QRGeneratorProps {
  sessionId: string;
  subjectId: string;
  classId: string;
  teacherId: string;
  onSessionStart?: () => void;
  onSessionEnd?: () => void;
}

export default function QRGenerator({ 
  sessionId, 
  subjectId, 
  classId, 
  teacherId,
  onSessionStart,
  onSessionEnd 
}: QRGeneratorProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentQR, setCurrentQR] = useState('');
  const [timeLeft, setTimeLeft] = useState(15);
  const [scanCount, setScanCount] = useState(0);

  // Generate QR data with timestamp and validation info
  const generateQRData = () => {
    const timestamp = Date.now();
    const qrData = {
      sessionId,
      subjectId,
      classId,
      teacherId,
      timestamp,
      // Add a simple hash for validation (in real app, use proper signing)
      hash: btoa(`${sessionId}-${timestamp}-${subjectId}`).slice(0, 10)
    };
    return JSON.stringify(qrData);
  };

  // Start QR session
  const startSession = () => {
    setIsActive(true);
    setCurrentQR(generateQRData());
    setTimeLeft(15);
    setScanCount(0);
    onSessionStart?.();
  };

  // End QR session
  const endSession = () => {
    setIsActive(false);
    setCurrentQR('');
    setTimeLeft(15);
    onSessionEnd?.();
  };

  // QR refresh timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Refresh QR code
            setCurrentQR(generateQRData());
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, sessionId, subjectId, classId, teacherId]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            <CardTitle>Dynamic QR Code</CardTitle>
          </div>
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Security Notice */}
        <Alert className="border-primary/20 bg-primary/5">
          <Shield className="h-4 w-4" />
          <AlertDescription className="flex items-center gap-2">
            <strong>Security:</strong> QR codes expire every 15 seconds to prevent misuse
          </AlertDescription>
        </Alert>

        {/* QR Code Display */}
        <div className="text-center space-y-4">
          {isActive && currentQR ? (
            <div className="space-y-4">
              <div className="w-64 h-64 mx-auto bg-white p-4 rounded-lg border-2 border-primary/20 shadow-lg">
                <QRCodeSVG
                  value={currentQR}
                  size={224}
                  level="M"
                  includeMargin={false}
                  className="w-full h-full"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className={`h-4 w-4 text-primary ${timeLeft <= 5 ? 'animate-spin' : ''}`} />
                  <span className={`font-mono text-lg ${timeLeft <= 5 ? 'text-destructive' : 'text-primary'}`}>
                    {timeLeft}s
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Session ID: {sessionId}
                </p>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <span className="text-muted-foreground">Scans: {scanCount}</span>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Started: {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-64 h-64 mx-auto bg-muted/30 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <QrCode className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">
                  QR code will appear here when session starts
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2 justify-center">
          {!isActive ? (
            <Button 
              onClick={startSession}
              className="bg-gradient-to-r from-primary to-accent"
            >
              <Play className="h-4 w-4 mr-2" />
              Start QR Session
            </Button>
          ) : (
            <Button 
              onClick={endSession}
              variant="destructive"
            >
              <Square className="h-4 w-4 mr-2" />
              End Session
            </Button>
          )}
        </div>

        {/* Session Info */}
        {isActive && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-accent/10 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{scanCount}</p>
              <p className="text-sm text-muted-foreground">Scans</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {Math.floor((Date.now() - new Date().setSeconds(0)) / 60000)}m
              </p>
              <p className="text-sm text-muted-foreground">Duration</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}