'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Target,
  Plus,
  ChevronRight,
  Calendar,
  Briefcase,
  FileText,
  BarChart3,
  CheckCircle2,
  Clock,
  XCircle,
  Trash2,
} from 'lucide-react';
import networkingData from '@/data/networking.json';

interface Application {
  id: string;
  firm: string;
  role: string;
  date: string;
  notes: string;
  stage: string;
}

const stages = [
  { id: 'researching', label: 'Researching', icon: FileText, color: 'text-slate-400' },
  { id: 'applied', label: 'Applied', icon: Calendar, color: 'text-blue-400' },
  { id: 'phone-screen', label: 'Phone Screen', icon: Clock, color: 'text-yellow-400' },
  { id: 'technical-interview', label: 'Technical Interview', icon: Briefcase, color: 'text-orange-400' },
  { id: 'final-round', label: 'Final Round', icon: Target, color: 'text-purple-400' },
  { id: 'offer', label: 'Offer', icon: CheckCircle2, color: 'text-green-400' },
  { id: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-400' },
];

export default function PipelinePage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newApp, setNewApp] = useState({ firm: '', role: '', date: '', notes: '' });

  useEffect(() => {
    const saved = localStorage.getItem('quantpath-pipeline');
    if (saved) {
      setApplications(JSON.parse(saved));
    }
  }, []);

  const saveApplications = (apps: Application[]) => {
    setApplications(apps);
    localStorage.setItem('quantpath-pipeline', JSON.stringify(apps));
  };

  const addApplication = () => {
    if (!newApp.firm || !newApp.role) return;
    const app: Application = {
      id: Date.now().toString(),
      ...newApp,
      stage: 'researching',
    };
    saveApplications([...applications, app]);
    setNewApp({ firm: '', role: '', date: '', notes: '' });
    setDialogOpen(false);
  };

  const moveApplication = (id: string, newStage: string) => {
    const updated = applications.map((app) =>
      app.id === id ? { ...app, stage: newStage } : app
    );
    saveApplications(updated);
  };

  const deleteApplication = (id: string) => {
    saveApplications(applications.filter((app) => app.id !== id));
  };

  const stageCounts = stages.reduce(
    (acc, stage) => {
      acc[stage.id] = applications.filter((app) => app.stage === stage.id).length;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalApps = applications.length;
  const activeApps = applications.filter(
    (app) => !['offer', 'rejected'].includes(app.stage)
  ).length;
  const offerCount = stageCounts['offer'] || 0;

  const weeklyGoals = networkingData.pipeline.weeklyGoals;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-lg bg-gradient-to-r from-blue-900 to-slate-900 border border-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Application Pipeline</h1>
            <p className="text-slate-300 mt-2">
              Track your job applications through each stage of the hiring process.
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger className="bg-blue-600 hover:bg-blue-700 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors">
              <Plus className="h-4 w-4" />
              Add Application
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Application</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1 block">Firm</label>
                  <Select
                    value={newApp.firm}
                    onValueChange={(value) => setNewApp({ ...newApp, firm: value || '' })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select a firm" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {networkingData.targetFirms.map((firm) => (
                        <SelectItem key={firm.id} value={firm.name}>
                          {firm.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1 block">Role</label>
                  <Input
                    value={newApp.role}
                    onChange={(e) => setNewApp({ ...newApp, role: e.target.value })}
                    placeholder="e.g. Quantitative Researcher"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1 block">Date Applied</label>
                  <Input
                    type="date"
                    value={newApp.date}
                    onChange={(e) => setNewApp({ ...newApp, date: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1 block">Notes</label>
                  <Textarea
                    value={newApp.notes}
                    onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
                    placeholder="Any notes about this application..."
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <Button onClick={addApplication} className="w-full bg-blue-600 hover:bg-blue-700">
                  Add Application
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{totalApps}</p>
                <p className="text-xs text-slate-400">Total Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-white">{activeApps}</p>
                <p className="text-xs text-slate-400">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{offerCount}</p>
                <p className="text-xs text-slate-400">Offers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {totalApps > 0 ? Math.round((offerCount / totalApps) * 100) : 0}%
                </p>
                <p className="text-xs text-slate-400">Offer Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Goals */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Target className="h-4 w-4" />
            Weekly Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
              <div>
                <p className="text-xs text-slate-400">Applications</p>
                <p className="text-lg font-bold text-white">{weeklyGoals.applications}</p>
              </div>
              <Briefcase className="h-5 w-5 text-blue-400" />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
              <div>
                <p className="text-xs text-slate-400">LinkedIn Connections</p>
                <p className="text-lg font-bold text-white">{weeklyGoals.linkedinConnections}</p>
              </div>
              <Target className="h-5 w-5 text-green-400" />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
              <div>
                <p className="text-xs text-slate-400">Coffee Chats</p>
                <p className="text-lg font-bold text-white">{weeklyGoals.coffeeChats}</p>
              </div>
              <Calendar className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
              <div>
                <p className="text-xs text-slate-400">Competition Submissions</p>
                <p className="text-lg font-bold text-white">{weeklyGoals.competitionSubmissions}</p>
              </div>
              <BarChart3 className="h-5 w-5 text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {stages.map((stage) => {
            const stageApps = applications.filter((app) => app.stage === stage.id);
            const StageIcon = stage.icon;
            return (
              <div key={stage.id} className="w-72 flex-shrink-0">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-white flex items-center gap-2">
                        <StageIcon className={`h-4 w-4 ${stage.color}`} />
                        {stage.label}
                      </CardTitle>
                      <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-700">
                        {stageApps.length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {stageApps.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">No applications</p>
                    ) : (
                      stageApps.map((app) => (
                        <Card key={app.id} className="bg-slate-800 border-slate-700">
                          <CardContent className="p-3 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-white text-sm">{app.firm}</p>
                                <p className="text-xs text-slate-400">{app.role}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteApplication(app.id)}
                                className="h-6 w-6 p-0 text-slate-500 hover:text-red-400"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            {app.date && (
                              <p className="text-xs text-slate-500 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(app.date).toLocaleDateString()}
                              </p>
                            )}
                            {app.notes && (
                              <p className="text-xs text-slate-400 line-clamp-2">{app.notes}</p>
                            )}
                            {/* Move buttons */}
                            <div className="flex gap-1 pt-1">
                              {stage.id !== 'researching' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const idx = stages.findIndex((s) => s.id === stage.id);
                                    if (idx > 0) moveApplication(app.id, stages[idx - 1].id);
                                  }}
                                  className="h-6 text-xs text-slate-400 hover:text-white px-2"
                                >
                                  ←
                                </Button>
                              )}
                              {stage.id !== 'rejected' && stage.id !== 'offer' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const idx = stages.findIndex((s) => s.id === stage.id);
                                    if (idx < stages.length - 1) moveApplication(app.id, stages[idx + 1].id);
                                  }}
                                  className="h-6 text-xs text-slate-400 hover:text-white px-2 ml-auto"
                                >
                                  →
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
