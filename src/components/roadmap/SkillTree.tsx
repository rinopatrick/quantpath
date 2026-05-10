'use client';

import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Position,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle, Clock, Lock } from 'lucide-react';
import skillsData from '@/data/skills.json';

interface SkillNodeData {
  label: string;
  difficulty: string;
  estimatedHours: number;
  nuclearStrength: boolean;
  status: 'completed' | 'in_progress' | 'not_started' | 'locked';
  description: string;
  [key: string]: unknown;
}

const statusColors = {
  completed: '#22c55e',
  in_progress: '#3b82f6',
  not_started: '#64748b',
  locked: '#374151',
};

const statusIcons = {
  completed: CheckCircle,
  in_progress: Clock,
  not_started: BookOpen,
  locked: Lock,
};

export function SkillTree() {
  // Create nodes from skills data
  const initialNodes: Node<SkillNodeData>[] = useMemo(() => {
    const nodes: Node<SkillNodeData>[] = [];
    const categoryPositions: Record<string, { x: number; y: number }> = {
      math: { x: 0, y: 0 },
      programming: { x: 400, y: 0 },
      finance: { x: 0, y: 300 },
      ml: { x: 400, y: 300 },
      tools: { x: 200, y: 600 },
    };

    skillsData.categories.forEach((category) => {
      const basePos = categoryPositions[category.id] || { x: 0, y: 0 };
      
      category.skills.forEach((skill, index) => {
        const status = skill.nuclearStrength ? 'in_progress' : 'not_started';
        nodes.push({
          id: skill.id,
          type: 'default',
          position: {
            x: basePos.x + (index % 2) * 180,
            y: basePos.y + Math.floor(index / 2) * 100,
          },
          data: {
            label: skill.name,
            difficulty: skill.difficulty,
            estimatedHours: skill.estimatedHours,
            nuclearStrength: skill.nuclearStrength,
            status: status,
            description: skill.description,
          },
          style: {
            background: statusColors[status],
            color: '#fff',
            border: `2px solid ${statusColors[status]}`,
            borderRadius: '8px',
            padding: '10px',
            width: 160,
          },
        });
      });
    });

    return nodes;
  }, []);

  // Create edges from prerequisites
  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];

    skillsData.categories.forEach((category) => {
      category.skills.forEach((skill) => {
        skill.prerequisites.forEach((prereqId) => {
          edges.push({
            id: `${prereqId}-${skill.id}`,
            source: prereqId,
            target: skill.id,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#64748b', strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#64748b',
            },
          });
        });
      });
    });

    return edges;
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node<SkillNodeData>) => {
    // Update node status on click
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === node.id) {
          const newStatus = n.data.status === 'completed' ? 'not_started' : 
                           n.data.status === 'not_started' ? 'in_progress' : 
                           n.data.status === 'in_progress' ? 'completed' : 'locked';
          return {
            ...n,
            data: { ...n.data, status: newStatus },
            style: {
              ...n.style,
              background: statusColors[newStatus],
              border: `2px solid ${statusColors[newStatus]}`,
            },
          };
        }
        return n;
      })
    );
  }, [setNodes]);

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg text-white">Skill Tree</CardTitle>
        <div className="flex gap-2 mt-2">
          <Badge variant="secondary" className="bg-green-600 text-white">Completed</Badge>
          <Badge variant="secondary" className="bg-blue-600 text-white">In Progress</Badge>
          <Badge variant="secondary" className="bg-slate-600 text-white">Not Started</Badge>
          <Badge variant="secondary" className="bg-slate-800 text-white">Locked</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] w-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            fitView
            attributionPosition="bottom-left"
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
        <div className="mt-4 p-4 rounded-lg bg-slate-800 border border-slate-700">
          <h4 className="font-medium text-white mb-2">Legend</h4>
          <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-600" />
              <span>Completed - Skill mastered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-600" />
              <span>In Progress - Currently learning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-600" />
              <span>Not Started - Ready to learn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-800" />
              <span>Locked - Prerequisites needed</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
