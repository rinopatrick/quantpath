'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  BookOpen, 
  List,
  CheckCircle,
  Clock,
  ExternalLink,
  Loader2
} from 'lucide-react';

interface LearningMaterial {
  title: string;
  summary: string;
  keyPoints: string[];
  actionSteps: string[];
  estimatedTime: string;
  difficulty: string;
}

export default function MaterialPage() {
  const [inputText, setInputText] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [material, setMaterial] = useState<LearningMaterial | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processMaterial = async () => {
    if (!inputText && !inputUrl) return;

    setIsProcessing(true);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate learning material from input
    const generatedMaterial: LearningMaterial = {
      title: inputUrl ? `Learning: ${new URL(inputUrl).hostname}` : 'Custom Learning Material',
      summary: inputText.substring(0, 200) + '...',
      keyPoints: [
        'Key concept 1: Understand the fundamentals',
        'Key concept 2: Apply to real-world scenarios',
        'Key concept 3: Practice with examples',
        'Key concept 4: Review and reinforce',
      ],
      actionSteps: [
        'Read through the material carefully',
        'Take notes on key concepts',
        'Complete practice exercises',
        'Review and test understanding',
        'Apply to a mini-project',
      ],
      estimatedTime: '2-3 hours',
      difficulty: 'intermediate',
    };

    setMaterial(generatedMaterial);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800 p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Material Input</h1>
              <p className="text-blue-100 text-sm">Convert any material into structured learning content</p>
            </div>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Input Your Material
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* URL Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">URL (optional)</label>
              <input
                type="url"
                placeholder="https://example.com/article"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="w-full h-10 px-4 rounded-lg border border-input bg-background text-sm"
              />
            </div>

            {/* Text Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">Or paste your content</label>
              <textarea
                placeholder="Paste article, notes, documentation, or any text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-48 p-4 rounded-lg border border-input bg-background text-sm resize-none"
              />
            </div>

            {/* Process Button */}
            <Button 
              onClick={processMaterial}
              disabled={(!inputText && !inputUrl) || isProcessing}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Learning Material
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Material */}
      {material && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl font-bold">{material.title}</CardTitle>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">
                    {material.difficulty}
                  </Badge>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {material.estimatedTime}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Summary */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">Summary</h3>
                <p className="text-sm text-muted-foreground">{material.summary}</p>
              </div>

              {/* Key Points */}
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <List className="h-4 w-4" />
                  Key Points
                </h3>
                <ul className="space-y-2">
                  {material.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Steps */}
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Action Steps
                </h3>
                <ol className="space-y-2">
                  {material.actionSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Save Button */}
              <Button className="w-full" variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Save to My Learning Materials
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Tips for Best Results</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Paste complete articles or documentation for comprehensive summaries</li>
            <li>• Include code snippets if you&apos;re learning programming concepts</li>
            <li>• Add context about your current knowledge level</li>
            <li>• Specify what you want to learn from the material</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
