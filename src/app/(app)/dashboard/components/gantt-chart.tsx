
"use client";

import type { CSSProperties } from 'react';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import type { TooltipProps } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Task } from '@/app/(app)/workspace/components/kanban-board';
import { addDays, format, differenceInDays, startOfDay } from 'date-fns';

interface GanttChartDataItem {
  name: string; // Task title
  range: [number, number]; // [start_timestamp, end_timestamp]
  status: string; // e.g., 'To Do', 'In Progress', 'Done'
  color: string;
  description?: string;
  durationDays: number; // Duration in days
  actualStartDate: Date;
  actualEndDate: Date;
}

// Dummy task data similar to what might come from kanban-board or an API
// In a real app, you'd fetch this or pass it as props.
const mockTasks: Task[] = [
  { id: 'task-1', title: 'Project Proposal Draft', description: 'Complete the first draft of the project proposal document, including scope, objectives, and methodology.', columnId: 'todo', priority: 'high', tags: ['writing', 'planning'] },
  { id: 'task-2', title: 'Literature Review - Phase 1', description: 'Gather and review 10 key academic papers related to the project topic.', columnId: 'todo', priority: 'medium', tags: ['research'] },
  { id: 'task-3', title: 'Setup Dev Environment', description: 'Install all necessary software, libraries, and tools for development.', columnId: 'inprogress', priority: 'high', tags: ['setup', 'dev'] },
  { id: 'task-4', title: 'Initial UI Mockups', description: 'Create basic wireframes for main screens.', columnId: 'review', priority: 'medium', tags: ['design', 'ux'] },
  { id: 'task-5', title: 'User Persona Definition', description: 'Define 2-3 target user personas.', columnId: 'done', priority: 'low', tags: ['research', 'ux'] },
  { id: 'task-6', title: 'API Endpoint Spec', description: 'Document required API endpoints.', columnId: 'inprogress', priority: 'medium', tags: ['api', 'dev'] },
];


// Helper to get a color based on task status
const getStatusColor = (statusKey: string): string => {
  switch (statusKey.toLowerCase()) {
    case 'todo': return 'hsl(var(--chart-1))'; 
    case 'inprogress': return 'hsl(var(--chart-2))'; 
    case 'review': return 'hsl(var(--chart-4))'; 
    case 'done': return 'hsl(var(--chart-3))'; 
    default: return 'hsl(var(--muted))'; 
  }
};

const statusMapping: { [key: string]: string } = {
  todo: 'To Do',
  inprogress: 'In Progress',
  review: 'In Review',
  done: 'Done',
};

export function GanttChart() {
  const [ganttData, setGanttData] = useState<GanttChartDataItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [dateDomain, setDateDomain] = useState<[number, number]>([0,0]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return; 

    const today = startOfDay(new Date());
    let overallMinDate = today;
    let overallMaxDate = addDays(today, 7); 

    const processedData: GanttChartDataItem[] = mockTasks.map((task, index) => {
      let startDate: Date;
      let endDate: Date;
      const baseDuration = Math.max(1, (index % 3) + 2); 

      switch (task.columnId) {
        case 'done':
          endDate = addDays(today, - (index % 4) -1); 
          startDate = addDays(endDate, -baseDuration);
          break;
        case 'review':
          startDate = addDays(today, (index % 2) -1 ); 
          endDate = addDays(startDate, baseDuration -1);
          break;
        case 'inprogress':
          startDate = addDays(today, -(index % 3)); 
          endDate = addDays(startDate, baseDuration + 1);
          break;
        case 'todo':
        default:
          startDate = addDays(today, (index % 3)); 
          endDate = addDays(startDate, baseDuration);
          break;
      }

      if (startDate < overallMinDate) overallMinDate = startDate;
      if (endDate > overallMaxDate) overallMaxDate = endDate;
      
      const statusDisplay = statusMapping[task.columnId] || task.columnId;

      return {
        name: task.title,
        range: [startDate.getTime(), endDate.getTime()],
        status: statusDisplay,
        color: getStatusColor(task.columnId),
        description: task.description,
        durationDays: differenceInDays(endDate, startDate) +1,
        actualStartDate: startDate,
        actualEndDate: endDate,
      };
    }).sort((a,b) => a.range[0] - b.range[0]); 

    setGanttData(processedData);
    
    const paddedMinDate = addDays(overallMinDate, -2).getTime();
    const paddedMaxDate = addDays(overallMaxDate, 2).getTime();
    setDateDomain([paddedMinDate, paddedMaxDate]);

  }, [isMounted]);

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      // The custom data (GanttChartDataItem) is nested in payload[0].payload
      const taskData = payload[0].payload as GanttChartDataItem;

      if (!taskData || !taskData.actualStartDate || !taskData.actualEndDate) return null;

      const formattedStartDate = format(new Date(taskData.actualStartDate), 'MMM d, yyyy');
      const formattedEndDate = format(new Date(taskData.actualEndDate), 'MMM d, yyyy');
      const statusDisplay = taskData.status.charAt(0).toUpperCase() + taskData.status.slice(1);

      return (
        <div className="bg-background p-3 border rounded shadow-lg text-sm">
          <p className="font-bold text-primary mb-1">{taskData.name}</p>
          <p><strong>Status:</strong> {statusDisplay}</p>
          <p><strong>Start:</strong> {formattedStartDate}</p>
          <p><strong>End:</strong> {formattedEndDate}</p>
          <p><strong>Duration:</strong> {taskData.durationDays} day{taskData.durationDays === 1 ? '' : 's'}</p>
          {taskData.description && <p className="mt-1 pt-1 border-t text-xs text-muted-foreground"><em>{taskData.description}</em></p>}
        </div>
      );
    }
    return null;
  };

  if (!isMounted || ganttData.length === 0) {
    return (
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Project Timeline</CardTitle>
          <CardDescription>Visual overview of task schedules.</CardDescription>
        </CardHeader>
        <CardContent className="h-[500px] flex items-center justify-center">
          <p className="text-muted-foreground">Loading chart data...</p>
        </CardContent>
      </Card>
    );
  }
  
  const uniqueStatuses = Array.from(new Set(ganttData.map(item => item.status)))
    .map(status => ({
      value: status,
      type: 'square' as const, // Ensures 'square' is treated as a literal type for Recharts Legend
      id: status,
      color: getStatusColor(Object.keys(statusMapping).find(key => statusMapping[key] === status) || status)
    }));

  return (
    <Card className="shadow-xl w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Project Timeline</CardTitle>
        <CardDescription>Visual overview of task schedules. Dates are illustrative.</CardDescription>
      </CardHeader>
      <CardContent className="h-[500px] w-full pr-6"> 
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={ganttData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 120, bottom: 20 }} 
            barCategoryGap="35%" 
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              domain={dateDomain}
              tickFormatter={(timestamp) => format(new Date(timestamp), 'MMM d')}
              stroke="hsl(var(--foreground))"
              tick={{ fontSize: 12 }}
              allowDuplicatedCategory={false}
              minTickGap={50} 
            />
            <YAxis
              dataKey="name"
              type="category"
              width={150} 
              stroke="hsl(var(--foreground))"
              tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
              interval={0} 
              tickLine={{ stroke: 'hsl(var(--foreground))' }}
              axisLine={{ stroke: 'hsl(var(--foreground))' }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
            />
            <Legend payload={uniqueStatuses} wrapperStyle={{paddingTop: '20px'}} />
            <Bar dataKey="range" radius={[4, 4, 4, 4]}>
              {ganttData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
