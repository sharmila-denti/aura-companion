import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ScanLine, Copy, ExternalLink, X } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { toast } from 'sonner';

export default function QRScanner() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerRef = useRef<HTMLDivElement>(null);

  const startScanner = async () => {
    setError(null);
    setResult(null);
    try {
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          setResult(decodedText);
          scanner.stop().catch(() => {});
          setScanning(false);
        },
        () => {}
      );
      setScanning(true);
    } catch (err) {
      setError('Camera access denied or not available. Please allow camera permissions.');
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop().catch(() => {});
      setScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      scannerRef.current?.stop().catch(() => {});
    };
  }, []);

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      toast.success('Copied to clipboard!');
    }
  };

  const isUrl = result?.startsWith('http://') || result?.startsWith('https://');

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-warm px-5 pt-10 pb-6 rounded-b-[2rem]">
        <div className="flex items-center gap-3">
          <button onClick={() => { stopScanner(); navigate(-1); }} className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <ArrowLeft size={20} className="text-primary-foreground" />
          </button>
          <h1 className="text-xl font-bold font-display text-primary-foreground">QR Scanner</h1>
        </div>
      </div>

      <div className="px-5 mt-6 space-y-4">
        {/* Scanner viewport */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl overflow-hidden"
        >
          <div
            id="qr-reader"
            ref={readerRef}
            className="w-full min-h-[300px] bg-muted/30 flex items-center justify-center"
          >
            {!scanning && !result && (
              <div className="text-center p-8">
                <ScanLine size={48} className="text-primary mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">Tap the button below to start scanning</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <div className="glass-card rounded-2xl p-4 border border-destructive/30">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold font-display text-foreground">Scanned Result</h3>
              <button onClick={() => setResult(null)} className="text-muted-foreground">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-muted-foreground break-all mb-3">{result}</p>
            <div className="flex gap-2">
              <button onClick={copyResult} className="flex-1 h-10 rounded-xl bg-secondary flex items-center justify-center gap-2 text-sm font-medium text-foreground">
                <Copy size={16} /> Copy
              </button>
              {isUrl && (
                <a href={result} target="_blank" rel="noopener noreferrer" className="flex-1 h-10 rounded-xl gradient-warm flex items-center justify-center gap-2 text-sm font-medium text-primary-foreground">
                  <ExternalLink size={16} /> Open
                </a>
              )}
            </div>
          </motion.div>
        )}

        {/* Scan button */}
        <button
          onClick={scanning ? stopScanner : startScanner}
          className={`w-full h-14 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 ${
            scanning
              ? 'bg-destructive text-destructive-foreground'
              : 'gradient-warm text-primary-foreground'
          }`}
        >
          <ScanLine size={20} />
          {scanning ? 'Stop Scanning' : 'Start Scanner'}
        </button>
      </div>
    </div>
  );
}
