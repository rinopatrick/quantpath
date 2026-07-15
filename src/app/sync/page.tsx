'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  Download, 
  Upload, 
  QrCode, 
  Copy, 
  Check,
  Smartphone,
  Monitor,
  AlertCircle
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function SyncPage() {
  const [progressData, setProgressData] = useState<string>('');
  const [importData, setImportData] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load current progress
    const saved = localStorage.getItem('quantpath-progress');
    if (saved) {
      setProgressData(saved);
    }
  }, []);

  const exportProgress = () => {
    const saved = localStorage.getItem('quantpath-progress');
    if (saved) {
      setProgressData(saved);
      // Also copy to clipboard
      navigator.clipboard.writeText(saved);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const importProgress = () => {
    try {
      if (!importData.trim()) {
        setError('Please paste your progress data first');
        return;
      }
      
      const parsed = JSON.parse(importData);
      localStorage.setItem('quantpath-progress', JSON.stringify(parsed));
      setImportSuccess(true);
      setError(null);
      setTimeout(() => setImportSuccess(false), 3000);
    } catch (e) {
      setError('Invalid data format. Please check and try again.');
    }
  };

  const downloadProgress = () => {
    const saved = localStorage.getItem('quantpath-progress');
    if (saved) {
      const blob = new Blob([saved], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quantpath-progress-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        localStorage.setItem('quantpath-progress', JSON.stringify(parsed));
        setImportSuccess(true);
        setError(null);
        setTimeout(() => setImportSuccess(false), 3000);
      } catch (err) {
        setError('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  const generateShareableLink = () => {
    const saved = localStorage.getItem('quantpath-progress');
    if (saved) {
      // Encode progress as base64
      const encoded = btoa(saved);
      const link = `${window.location.origin}/sync?data=${encoded}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Check for data in URL on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (data) {
      try {
        const decoded = atob(data);
        const parsed = JSON.parse(decoded);
        localStorage.setItem('quantpath-progress', JSON.stringify(parsed));
        setImportSuccess(true);
        // Clear URL params
        window.history.replaceState({}, '', window.location.pathname);
      } catch (e) {
        // Invalid data in URL
      }
    }
  }, []);

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-cyan-700 to-blue-800 p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <RefreshCw className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Sync Progress</h1>
              <p className="text-cyan-100 text-sm">Sync your progress across devices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-500">Why is my progress not syncing?</p>
              <p className="text-xs text-muted-foreground mt-1">
                Progress is saved in your browser&apos;s localStorage, which is device-specific. 
                To sync between phone and laptop, use the methods below:
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sync Methods */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Method 1: QR Code */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              Method 1: QR Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Scan this QR code from your other device to sync progress.
              </p>
              
              {/* QR Code */}
              {progressData && (
                <div className="flex justify-center p-4 bg-white rounded-lg">
                  <QRCodeSVG 
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/sync?data=${btoa(progressData)}`}
                    size={200}
                    level="M"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={exportProgress} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate QR
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                <strong>How to use:</strong> Generate QR on one device, scan with the other device&apos;s camera. 
                The link will open and auto-import the progress.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Method 2: Copy/Paste */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Copy className="h-5 w-5 text-primary" />
              Method 2: Copy & Paste
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Copy your progress data and paste it on the other device.
              </p>

              {/* Export */}
              <div>
                <label className="text-sm font-medium mb-2 block">Export (this device)</label>
                <div className="flex gap-2">
                  <Button onClick={exportProgress} className="flex-1">
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Progress
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Import */}
              <div>
                <label className="text-sm font-medium mb-2 block">Import (other device)</label>
                <textarea
                  placeholder="Paste your progress data here..."
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  className="w-full h-24 p-3 rounded-lg border border-input bg-background text-sm resize-none"
                />
                <Button onClick={importProgress} className="w-full mt-2" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Progress
                </Button>
                {importSuccess && (
                  <p className="text-sm text-green-500 mt-2">Progress imported successfully!</p>
                )}
                {error && (
                  <p className="text-sm text-red-500 mt-2">{error}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Method 3: Download/Upload File */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Method 3: Download & Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Download a backup file and upload it on the other device.
              </p>

              <Button onClick={downloadProgress} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Progress File
              </Button>

              <div>
                <label className="text-sm font-medium mb-2 block">Upload Progress File</label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {importSuccess && (
                  <p className="text-sm text-green-500 mt-2">Progress imported successfully!</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Method 4: Shareable Link */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              Method 4: Shareable Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Generate a link that includes your progress. Open it on any device.
              </p>

              <Button onClick={generateShareableLink} className="w-full">
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Generate & Copy Link
                  </>
                )}
              </Button>

              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">
                  <strong>Note:</strong> The link contains your progress encoded in the URL. 
                  Open it on any device and it will auto-import the progress.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">How to Sync Between Phone & Laptop</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <p className="font-medium">From Laptop → Phone</p>
                <p className="text-sm text-muted-foreground">
                  Click &quot;Generate QR&quot; on laptop, scan with phone camera. 
                  The link will open and import progress automatically.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <p className="font-medium">From Phone → Laptop</p>
                <p className="text-sm text-muted-foreground">
                  On phone, click &quot;Copy Progress&quot;. Send the data to yourself (email, message). 
                  On laptop, paste in the Import box and click Import.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <p className="font-medium">Backup</p>
                <p className="text-sm text-muted-foreground">
                  Download the progress file regularly as a backup. 
                  You can upload it anytime to restore your progress.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
