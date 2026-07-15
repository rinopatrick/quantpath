'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Globe,
  Filter,
  MapPin,
  Briefcase,
  ExternalLink,
  Brain,
  Code,
  BarChart3,
  Zap,
  Target,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import networkingData from '@/data/networking.json';

const tierColors: Record<string, string> = {
  elite: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  top: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  high: 'bg-green-500/20 text-green-400 border-green-500/30',
  mid: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

const difficultyColors: Record<string, string> = {
  legendary: 'bg-amber-500/20 text-amber-400',
  extreme: 'bg-red-500/20 text-red-400',
  'very-hard': 'bg-orange-500/20 text-orange-400',
  hard: 'bg-yellow-500/20 text-yellow-400',
};

const typeLabels: Record<string, string> = {
  'prop-trading': 'Prop Trading',
  'hedge-fund': 'Hedge Fund',
  bank: 'Bank',
};

const focusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  probability: Zap,
  'market-microstructure': BarChart3,
  cpp: Code,
  ml: Brain,
  statistics: BarChart3,
  'financial-markets': Target,
  'data-science': BarChart3,
  python: Code,
  'low-latency': Zap,
  options: Target,
  derivatives: Target,
  'risk-management': Shield,
  'alpha-research': BarChart3,
  'signal-processing': Zap,
};

function Shield(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

export default function NetworkingPage() {
  const [tierFilter, setTierFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredFirms = networkingData.targetFirms.filter((firm) => {
    if (tierFilter !== 'all' && firm.tier !== tierFilter) return false;
    if (typeFilter !== 'all' && firm.type !== typeFilter) return false;
    return true;
  });

  const clearFilters = () => {
    setTierFilter('all');
    setTypeFilter('all');
  };

  const hasFilters = tierFilter !== 'all' || typeFilter !== 'all';

  const tierCounts = networkingData.targetFirms.reduce(
    (acc, firm) => {
      acc[firm.tier] = (acc[firm.tier] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-lg bg-gradient-to-r from-blue-900 to-slate-900 border border-blue-800">
        <h1 className="text-2xl font-bold text-white">Target Firms</h1>
        <p className="text-slate-300 mt-2">
          Research and track target firms for quantitative finance roles. Filter by tier and firm type.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{networkingData.targetFirms.length}</p>
                <p className="text-xs text-slate-400">Total Firms</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-amber-400" />
              <div>
                <p className="text-2xl font-bold text-white">{tierCounts['elite'] || 0}</p>
                <p className="text-xs text-slate-400">Elite Tier</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{tierCounts['top'] || 0}</p>
                <p className="text-xs text-slate-400">Top Tier</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">{tierCounts['high'] || 0}</p>
                <p className="text-xs text-slate-400">High Tier</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </CardTitle>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-slate-400 hover:text-white"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">Tier</label>
              <Select value={tierFilter} onValueChange={(v) => setTierFilter(v || 'all')}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="All Tiers" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="elite">Elite</SelectItem>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="mid">Mid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">Type</label>
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v || 'all')}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="prop-trading">Prop Trading</SelectItem>
                  <SelectItem value="hedge-fund">Hedge Fund</SelectItem>
                  <SelectItem value="bank">Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Firms Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredFirms.map((firm) => (
          <Card key={firm.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    {firm.name}
                    {firm.verified ? (
                      <Badge variant="outline" className="text-green-400 border-green-500/30 bg-green-500/10 text-[10px] h-4 px-1.5 gap-0.5">
                        <CheckCircle className="h-2.5 w-2.5" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-yellow-400 border-yellow-500/30 bg-yellow-500/10 text-[10px] h-4 px-1.5 gap-0.5">
                        <AlertCircle className="h-2.5 w-2.5" />
                        Needs Verification
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={tierColors[firm.tier]}>
                      {firm.tier}
                    </Badge>
                    <Badge variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600">
                      {typeLabels[firm.type]}
                    </Badge>
                  </div>
                </div>
                <Badge className={difficultyColors[firm.difficulty]}>
                  {firm.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Locations */}
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  Locations
                </div>
                <div className="flex flex-wrap gap-1">
                  {firm.locations.map((loc) => (
                    <Badge key={loc} variant="outline" className="text-xs bg-slate-800 text-slate-300 border-slate-700">
                      {loc}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Roles */}
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
                  <Briefcase className="h-3.5 w-3.5" />
                  Roles
                </div>
                <div className="flex flex-wrap gap-1">
                  {firm.roles.map((role) => (
                    <Badge key={role} variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/20">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Focus Areas */}
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
                  <Brain className="h-3.5 w-3.5" />
                  Focus Areas
                </div>
                <div className="flex flex-wrap gap-1">
                  {firm.focusAreas.map((area) => (
                    <Badge key={area} variant="outline" className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/20">
                      {area.replace(/-/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {firm.notes && (
                <p className="text-xs text-slate-400 italic">{firm.notes}</p>
              )}

              {/* Apply Button */}
              <a
                href={firm.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full gap-2 rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View Careers
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredFirms.length === 0 && (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-8 text-center">
            <Globe className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No firms found</h3>
            <p className="text-sm text-slate-400 mb-4">Try adjusting your filters.</p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Interview Types */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-400" />
            Interview Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {networkingData.interviewTypes.map((interview) => (
              <Card key={interview.type} className="bg-slate-800 border-slate-700">
                <CardContent className="p-4 space-y-2">
                  <h4 className="font-medium text-white capitalize">
                    {interview.type.replace(/-/g, ' ')}
                  </h4>
                  <p className="text-xs text-slate-400">{interview.description}</p>
                  <div>
                    <p className="text-xs font-medium text-slate-300 mb-1">Preparation:</p>
                    <div className="flex flex-wrap gap-1">
                      {interview.preparation.map((prep) => (
                        <Badge key={prep} variant="outline" className="text-xs bg-slate-700 text-slate-300 border-slate-600">
                          {prep}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">Prep time: {interview.timeToPrepare}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
