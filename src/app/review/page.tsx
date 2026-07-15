'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  PenLine, 
  Plus, 
  Trash2, 
  Save,
  Clock,
  BookOpen,
  Target,
  Lightbulb,
  Calendar
} from 'lucide-react';

interface WeeklyReview {
  id: string;
  weekNumber: number;
  date: string;
  learned: string;
  difficult: string;
  takeaways: string;
  nextGoals: string;
  hoursStudied: number;
}

export default function ReviewPage() {
  const [reviews, setReviews] = useState<WeeklyReview[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    weekNumber: 1,
    learned: '',
    difficult: '',
    takeaways: '',
    nextGoals: '',
    hoursStudied: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem('quantpath-weeklyReviews');
    if (saved) {
      setReviews(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('quantpath-weeklyReviews', JSON.stringify(reviews));
  }, [reviews]);

  const saveReview = () => {
    const newReview: WeeklyReview = {
      id: Date.now().toString(),
      weekNumber: form.weekNumber,
      date: new Date().toISOString(),
      learned: form.learned,
      difficult: form.difficult,
      takeaways: form.takeaways,
      nextGoals: form.nextGoals,
      hoursStudied: form.hoursStudied,
    };
    setReviews([newReview, ...reviews]);
    setForm({ weekNumber: form.weekNumber + 1, learned: '', difficult: '', takeaways: '', nextGoals: '', hoursStudied: 0 });
    setShowForm(false);
  };

  const deleteReview = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
  };

  const totalHours = reviews.reduce((sum, r) => sum + r.hoursStudied, 0);

  return (
    <div className="space-y-6 page-enter">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 p-6 md:p-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <PenLine className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Weekly Review</h1>
              <p className="text-purple-100 text-sm">Reflect on your progress and plan ahead</p>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              {reviews.length} Reviews
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              {totalHours} Hours Logged
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Track your weekly learning, reflect on challenges, and set goals.
        </p>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            New Review
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Week {form.weekNumber} Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-primary" />
                Week Number
              </label>
              <input
                type="number"
                value={form.weekNumber}
                onChange={(e) => setForm({ ...form, weekNumber: parseInt(e.target.value) || 1 })}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
                min={1}
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                What I Learned This Week
              </label>
              <textarea
                value={form.learned}
                onChange={(e) => setForm({ ...form, learned: e.target.value })}
                className="w-full h-24 p-3 rounded-lg border border-input bg-background text-sm resize-none"
                placeholder="Key concepts, skills, or knowledge acquired..."
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-red-500" />
                What Was Difficult
              </label>
              <textarea
                value={form.difficult}
                onChange={(e) => setForm({ ...form, difficult: e.target.value })}
                className="w-full h-24 p-3 rounded-lg border border-input bg-background text-sm resize-none"
                placeholder="Challenges, blockers, or areas needing more work..."
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                Key Takeaways
              </label>
              <textarea
                value={form.takeaways}
                onChange={(e) => setForm({ ...form, takeaways: e.target.value })}
                className="w-full h-24 p-3 rounded-lg border border-input bg-background text-sm resize-none"
                placeholder="Main insights or lessons learned..."
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-500" />
                Goals for Next Week
              </label>
              <textarea
                value={form.nextGoals}
                onChange={(e) => setForm({ ...form, nextGoals: e.target.value })}
                className="w-full h-24 p-3 rounded-lg border border-input bg-background text-sm resize-none"
                placeholder="What you plan to accomplish next week..."
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-purple-500" />
                Hours Studied
              </label>
              <input
                type="number"
                value={form.hoursStudied}
                onChange={(e) => setForm({ ...form, hoursStudied: parseFloat(e.target.value) || 0 })}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
                min={0}
                step={0.5}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={saveReview} className="bg-primary hover:bg-primary/90" disabled={!form.learned.trim()}>
                <Save className="h-4 w-4 mr-2" />
                Save Review
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <Card key={review.id} className={`card-hover animate-in stagger-${(index % 6) + 1}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <PenLine className="h-5 w-5 text-violet-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Week {review.weekNumber} Review</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(review.date).toLocaleDateString()} · {review.hoursStudied}h studied
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteReview(review.id)}
                    className="h-8 w-8 p-0 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-blue-500 flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> Learned
                    </p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{review.learned}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-red-500 flex items-center gap-1">
                      <Target className="h-3 w-3" /> Difficult
                    </p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{review.difficult}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-yellow-500 flex items-center gap-1">
                      <Lightbulb className="h-3 w-3" /> Takeaways
                    </p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{review.takeaways}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-green-500 flex items-center gap-1">
                      <Target className="h-3 w-3" /> Next Goals
                    </p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{review.nextGoals}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !showForm ? (
        <Card>
          <CardContent className="p-8 text-center">
            <PenLine className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start your weekly reflection practice
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Write First Review
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
