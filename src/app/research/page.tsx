'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Copy, 
  CheckCircle,
  Lightbulb,
  BookOpen,
  Target,
  BarChart3,
  AlertTriangle,
  Download
} from 'lucide-react';

const sections = [
  {
    id: 'abstract',
    title: 'Abstract',
    icon: FileText,
    description: '2-3 sentence summary of your research question, method, and key finding.',
    template: `This paper investigates [RESEARCH QUESTION] using [METHOD/APPROACH]. Using [DATA SOURCE] spanning [TIME PERIOD], we find that [KEY FINDING]. Our results suggest [IMPLICATION].`,
    tips: [
      'Write this LAST, after you finish everything else',
      'Keep it under 200 words',
      'Include the key quantitative result (e.g., "Sharpe ratio of 1.8")',
      'No jargon — a recruiter should understand it'
    ]
  },
  {
    id: 'introduction',
    title: '1. Introduction & Motivation',
    icon: Lightbulb,
    description: 'Why should anyone care about this research? What gap does it fill?',
    template: `## 1. Introduction

### 1.1 Background
[2-3 paragraphs on the broader context — what market/phenomenon are you studying?]

### 1.2 Research Question
Clearly state your question: "Does [X] predict [Y] under [conditions]?"

### 1.3 Motivation
Why does this matter? What's the practical implication for trading/risk management/portfolio construction?

### 1.4 Contribution
How does your work differ from existing research? What's novel about your approach?`,
    tips: [
      'Start broad, narrow down to your specific question',
      'Cite 3-5 relevant papers or industry sources',
      'Make the "so what" clear — why should a hiring manager care?',
      'State your hypothesis explicitly'
    ]
  },
  {
    id: 'literature',
    title: '2. Literature Review',
    icon: BookOpen,
    description: 'What has already been done? How does your work build on it?',
    template: `## 2. Literature Review

### 2.1 Previous Work
Summarize 3-5 key papers or approaches related to your topic.

### 2.2 Gap in Literature
What hasn't been done? What's your unique angle?

### 2.3 Theoretical Framework
What theory/model underpins your approach? (e.g., "We rely on the Fama-French three-factor model as our theoretical foundation...")`,
    tips: [
      'Shows you understand the broader landscape',
      'Don\'t just list papers — synthesize and critique',
      'Connect previous work to YOUR approach',
      '3-5 references is enough for a portfolio project'
    ]
  },
  {
    id: 'data',
    title: '3. Data & Methodology',
    icon: Target,
    description: 'What data did you use? How did you analyze it? This is the CORE of your paper.',
    template: `## 3. Data & Methodology

### 3.1 Data Sources
- Source: [e.g., Yahoo Finance, CRSP, Bloomberg]
- Period: [e.g., Jan 2010 - Dec 2024]
- Frequency: [e.g., daily, hourly]
- Assets: [e.g., S&P 500 constituents]

### 3.2 Data Cleaning
- How did you handle missing data?
- Survivorship bias treatment?
- Outlier handling?

### 3.3 Feature Engineering
List each feature with justification:
| Feature | Formula | Financial Rationale |
|---------|---------|-------------------|
| Momentum_20d | Return over 20 days | Price continuation effect |
| Volatility_60d | 60-day rolling std | Risk premium |

### 3.4 Model Specification
Describe your model mathematically:
- [Model equation]
- [Loss function]
- [Optimization method]

### 3.5 Validation Strategy
- Walk-forward validation: train on [X], test on [Y]
- No look-ahead bias: [explain how you ensured this]
- Cross-validation: [method]`,
    tips: [
      'THIS IS THE MOST IMPORTANT SECTION',
      'Be specific about data sources and time periods',
      'Explain every feature — why did you include it?',
      'Address survivorship bias explicitly',
      'Show you understand look-ahead bias',
      'Include mathematical notation where relevant'
    ]
  },
  {
    id: 'results',
    title: '4. Results',
    icon: BarChart3,
    description: 'What did you find? Present results clearly with tables and charts.',
    template: `## 4. Results

### 4.1 Summary Statistics
Table: Mean, Std, Min, Max, Skewness, Kurtosis for all variables

### 4.2 Main Results
Table: Model performance metrics
| Metric | Strategy | Benchmark | Difference |
|--------|----------|-----------|------------|
| Sharpe Ratio | X.XX | X.XX | +X.XX |
| Max Drawdown | -XX% | -XX% | +XX% |
| Annual Return | XX% | XX% | +XX% |
| Win Rate | XX% | XX% | +XX% |

### 4.3 Visualization
- Equity curve vs benchmark
- Drawdown chart
- Monthly returns heatmap
- Rolling Sharpe ratio

### 4.4 Robustness Checks
- Does it work across different time periods?
- Different asset universes?
- Sensitivity to key parameters?`,
    tips: [
      'Tables > prose for presenting numbers',
      'Always compare against a benchmark',
      'Include statistical significance (t-stats, p-values)',
      'Show equity curve AND drawdown chart',
      'Be honest about periods where strategy underperforms'
    ]
  },
  {
    id: 'discussion',
    title: '5. Discussion & Limitations',
    icon: AlertTriangle,
    description: 'What does it mean? What are the caveats? HONESTY here is what separates good from great.',
    template: `## 5. Discussion

### 5.1 Interpretation
Why did you get these results? What's the economic intuition?

### 5.2 Practical Implications
How would a portfolio manager use this? What are the implementation considerations?

### 5.3 Limitations (BE HONEST)
- Transaction costs: [Did you model them? How?]
- Capacity: [Does strategy work at scale?]
- Regime dependence: [Does it work in all market conditions?]
- Data snooping: [Did you try many things and report the best?]
- Execution: [Can you actually trade this in real-time?]

### 5.4 Future Work
What would you do next with more time/data/resources?`,
    tips: [
      'THIS SECTION SHOWS MATURITY — hiring managers love honest self-assessment',
      'Address transaction costs and slippage',
      'Discuss capacity constraints',
      'Acknowledge what you DIDN\'T test',
      'Suggest specific improvements'
    ]
  },
  {
    id: 'conclusion',
    title: '6. Conclusion',
    icon: CheckCircle,
    description: 'Wrap up. Restate key finding and its significance.',
    template: `## 6. Conclusion

This paper investigated [QUESTION] using [METHOD]. Our key finding is [RESULT].

Specifically:
- [Finding 1 with number]
- [Finding 2 with number]
- [Finding 3 with number]

These results suggest [IMPLICATION]. Future research could [NEXT STEPS].`,
    tips: [
      'Keep it short — 1 paragraph max',
      'Restate the key quantitative result',
      'Don\'t introduce new information',
      'End with a forward-looking statement'
    ]
  }
];

export default function ResearchPage() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 p-6 md:p-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Research Report Template</h1>
              <p className="text-teal-100 text-sm">Write quant research reports that impress hiring managers</p>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              7 Sections
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              Copy-Paste Templates
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              Pro Tips Included
            </Badge>
          </div>
        </div>
      </div>

      {/* Why Research Reports Matter */}
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-500">Why Research Reports Matter</p>
              <p className="text-xs text-muted-foreground mt-1">
                Quant hiring managers want to see that you can <strong>think</strong>, not just code. A well-written research report demonstrates:
                your ability to formulate hypotheses, design rigorous methodology, interpret results honestly, and communicate clearly.
                Most candidates skip this — doing it gives you a massive edge.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section, index) => {
          const Icon = section.icon;
          const isCopied = copiedSection === section.id;

          return (
            <Card key={section.id} className={`card-hover animate-in stagger-${(index % 7) + 1}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(section.template, section.id)}
                    className="flex-shrink-0"
                  >
                    {isCopied ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy Template
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Template */}
                <div className="relative">
                  <pre className="bg-muted/50 rounded-lg p-4 text-sm overflow-x-auto whitespace-pre-wrap font-mono">
                    {section.template}
                  </pre>
                </div>

                {/* Tips */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-emerald-500 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Pro Tips
                  </p>
                  <ul className="space-y-1">
                    {section.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">&#8226;</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Full Template Download */}
      <Card className="border-emerald-500/20">
        <CardContent className="p-6 text-center">
          <Download className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Full Research Report Template</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Copy all sections into your project and fill in each part. 
            Aim for 5-10 pages with charts and tables.
          </p>
          <Button
            onClick={() => {
              const fullTemplate = sections.map((s) => s.template).join('\n\n---\n\n');
              copyToClipboard(fullTemplate, 'full');
            }}
          >
            {copiedSection === 'full' ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Copied Full Template!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Full Template
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
