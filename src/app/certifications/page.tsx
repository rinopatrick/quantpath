'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  ExternalLink, 
  Clock, 
  Filter,
  BookOpen,
  Atom,
  TrendingUp,
  Sparkles,
  CheckCircle,
  DollarSign
} from 'lucide-react';
import certificationsData from '@/data/certifications.json';

type Category = 'all' | 'AI' | 'Quant' | 'Nuclear';
type Difficulty = 'all' | 'beginner' | 'intermediate' | 'advanced';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  AI: Sparkles,
  Quant: TrendingUp,
  Nuclear: Atom,
};

const categoryColors: Record<string, string> = {
  AI: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  Quant: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  Nuclear: 'bg-green-500/10 text-green-500 border-green-500/20',
};

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-500/10 text-green-500',
  intermediate: 'bg-yellow-500/10 text-yellow-500',
  advanced: 'bg-red-500/10 text-red-500',
};

export default function CertificationsPage() {
  const [categoryFilter, setCategoryFilter] = useState<Category>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty>('all');
  const [showFreeOnly, setShowFreeOnly] = useState(true);

  const filteredCerts = certificationsData.certifications.filter((cert) => {
    if (categoryFilter !== 'all' && cert.category !== categoryFilter) return false;
    if (difficultyFilter !== 'all' && cert.difficulty !== difficultyFilter) return false;
    if (showFreeOnly && !cert.free) return false;
    return true;
  });

  const freeCount = certificationsData.certifications.filter((c) => c.free).length;
  const paidCount = certificationsData.certifications.filter((c) => !c.free).length;

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-800 p-6 md:p-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Certifications</h1>
              <p className="text-purple-100 text-sm">Boost your CV with industry-recognized credentials</p>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              <CheckCircle className="h-3 w-3 mr-1" />
              {freeCount} Free
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white/80 border-0">
              <DollarSign className="h-3 w-3 mr-1" />
              {paidCount} Paid
            </Badge>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            
            {/* Category Filter */}
            <div className="flex gap-2">
              {(['all', 'AI', 'Quant', 'Nuclear'] as Category[]).map((cat) => (
                <Button
                  key={cat}
                  variant={categoryFilter === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategoryFilter(cat)}
                  className="text-xs"
                >
                  {cat === 'all' ? 'All' : cat}
                </Button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div className="flex gap-2">
              {(['all', 'beginner', 'intermediate', 'advanced'] as Difficulty[]).map((diff) => (
                <Button
                  key={diff}
                  variant={difficultyFilter === diff ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDifficultyFilter(diff)}
                  className="text-xs capitalize"
                >
                  {diff === 'all' ? 'All Levels' : diff}
                </Button>
              ))}
            </div>

            {/* Free Only Toggle */}
            <Button
              variant={showFreeOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowFreeOnly(!showFreeOnly)}
              className="text-xs"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Free Only
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{certificationsData.certifications.filter((c) => c.category === 'AI').length}</p>
                <p className="text-xs text-muted-foreground">AI Certifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{certificationsData.certifications.filter((c) => c.category === 'Quant').length}</p>
                <p className="text-xs text-muted-foreground">Quant Certifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Atom className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{certificationsData.certifications.filter((c) => c.category === 'Nuclear').length}</p>
                <p className="text-xs text-muted-foreground">Nuclear Certifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certifications Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCerts.map((cert, index) => {
          const CategoryIcon = categoryIcons[cert.category] || Award;
          const categoryColor = categoryColors[cert.category] || 'bg-gray-500/10 text-gray-500';
          const difficultyColor = difficultyColors[cert.difficulty] || 'bg-gray-500/10 text-gray-500';

          return (
            <Card 
              key={cert.id} 
              className={`card-hover animate-in stagger-${(index % 7) + 1}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-lg ${categoryColor} flex items-center justify-center`}>
                    <CategoryIcon className="h-5 w-5" />
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className={difficultyColor}>
                      {cert.difficulty}
                    </Badge>
                    {cert.free ? (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                        Free
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">
                        {cert.price}
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-base font-bold mt-3">{cert.title}</CardTitle>
                <p className="text-xs text-muted-foreground">{cert.provider}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{cert.description}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {cert.hours} hours
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {cert.category}
                  </span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {cert.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {cert.free ? 'Start Free Course' : 'View Details'}
                </a>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCerts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No certifications found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your filters
            </p>
            <Button variant="outline" onClick={() => {
              setCategoryFilter('all');
              setDifficultyFilter('all');
              setShowFreeOnly(true);
            }}>
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
