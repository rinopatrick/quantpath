'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  ResponsiveContainer 
} from 'recharts';

interface SkillRadarProps {
  skills: {
    math: number;
    programming: number;
    finance: number;
    ml: number;
    tools: number;
  };
}

export function SkillRadar({ skills }: SkillRadarProps) {
  const data = [
    {
      subject: 'Mathematics',
      value: skills.math,
      fullMark: 100,
    },
    {
      subject: 'Programming',
      value: skills.programming,
      fullMark: 100,
    },
    {
      subject: 'Finance',
      value: skills.finance,
      fullMark: 100,
    },
    {
      subject: 'Machine Learning',
      value: skills.ml,
      fullMark: 100,
    },
    {
      subject: 'Tools',
      value: skills.tools,
      fullMark: 100,
    },
  ];

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg text-white">Skill Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={{ fill: '#64748b', fontSize: 10 }}
              />
              <Radar
                name="Skills"
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
