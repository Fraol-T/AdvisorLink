
"use client";

import type { CSSProperties } from 'react';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, type TooltipPayload } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Task } from '@/app/(app)/workspace/components/kanban-board';

const getTaskColor = (status: string | undefined) => {
  switch (status) {
    case 'todo': return 'hsl(var(--chart-5))'; 
    case 'inprogress': return 'hsl(var(--chart-2))'; 
    case 'review': return 'hsl(var(--chart-4))'; 
    case 'done': return 'hsl(var(--chart-1))'; 
    default: return 'hsl(var(--chart-3))'; 
  }
};

interface GanttChartDataItem {
  name: string; 
  range: [number, number]; 
  fill: string;
  id: string;
  status?: string; 
  description?: string;
}

export function GanttChart() {
  const [chartData, setChartData] = useState<GanttChartDataItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      const savedTasksString = localStorage.getItem('kanbanTasks');
      const tasks: Task[] = savedTasksString ? JSON.parse(savedTasksString) : [];

      if (tasks.length > 0) {
        const statusOrder: { [key: string]: number } = { done: 1, review: 2, inprogress: 3, todo: 4 };
        
        tasks.sort((a, b) => {
            const orderA = statusOrder[a.columnId] || 5;
            const orderB = statusOrder[b.columnId] || 5;
            if (orderA !== orderB) return orderA - orderB;
            return a.id.localeCompare(b.id);
        });

        let currentTimelineEnd = 0;
        const processedData: GanttChartDataItem[] = tasks.map((task) => {
            const taskDuration = 5; 
            
            const startDay = currentTimelineEnd;
            const endDay = startDay + taskDuration;
            currentTimelineEnd = endDay + 1; 

            return {
              id: task.id,
              name: task.title,
              range: [startDay, endDay],
              fill: getTaskColor(task.columnId),
              status: task.columnId,
              description: task.description,
            };
          });
        setChartData(processedData);
      } else {
        setChartData([]);
      }
    }
  }, [isMounted]);

  if (!isMounted) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Project Timeline</CardTitle>
          <CardDescription>Visualizing task durations and sequence.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">Loading chart data...</p>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Project Timeline</CardTitle>
          <CardDescription>Visualizing task durations and sequence.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">No tasks found. Add tasks in the Workspace to see them here.</p>
        </CardContent>
      </Card>
    );
  }
  
  const maxEndDay = Math.max(...chartData.map(d => d.range[1]), 0);
  const chartHeightStyle: CSSProperties = {
    height: `calc( (2.5rem * ${Math.max(chartData.length, 1)}) + 120px )`, 
    minHeight: '300px',
    maxHeight: '80vh', 
  };


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Project Timeline</CardTitle>
        <CardDescription>Illustrative Gantt-style view of workspace tasks. Durations are examples.</CardDescription>
      </CardHeader>
      <CardContent style={chartHeightStyle} className="pr-4 md:pr-6"> 
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 20, bottom: 20 }} 
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
                type="number" 
                domain={[0, maxEndDay + 5]} 
                tickFormatter={(value) => `Day ${value}`} 
                stroke="hsl(var(--foreground))" 
                dy={10} 
            />
            <YAxis 
                dataKey="name" 
                type="category" 
                width={150} 
                tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }} 
                interval={0} 
                className="truncate" 
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow-lg)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}
              formatter={(
                value: [number, number], 
                name: string,           
                entry: TooltipPayload<[number, number], string> 
              ) => {
                const taskData = entry.payload as GanttChartDataItem; 
                if (name === 'range' && taskData && typeof taskData.status === 'string') {
                  const { status, description } = taskData;
                  const formattedDescription = description
                    ? `<br/><em>${description.substring(0, 100)}${description.length > 100 ? '...' : ''}</em>`
                    : '';
                  return [`Status: ${status}${formattedDescription}`, null];
                }
                return [`${value[0]} - ${value[1]}`, name]; 
              }}
              labelFormatter={(label: string) => `Task: ${label}`}
            />
            <Bar dataKey="range" barSize={20} radius={[4, 4, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

