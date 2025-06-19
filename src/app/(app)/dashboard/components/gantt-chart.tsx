
"use client";

import type { CSSProperties } from 'react';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Task } from '@/app/(app)/workspace/components/kanban-board';
import { addDays, format, differenceInDays, startOfDay } from 'date-fns';

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

// Helper to get a color based on task status
const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'todo': return 'hsl(var(--chart-1))'; // Blue
    case 'inprogress': return 'hsl(var(--chart-2))'; // Orange
    case 'review': return 'hsl(var(--chart-4))'; // Yellow
    case 'done': return 'hsl(var(--chart-3))'; // Green
    default: return 'hsl(var(--muted))'; // Grey
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
    const today = startOfDay(new Date());
    let overallMinDate = today;
    let overallMaxDate = addDays(today, 7); // Default to at least 7 days out

    const processedData: GanttChartDataItem[] = mockTasks.map((task, index) => {
      let startDate: Date;
      let endDate: Date;
      const baseDuration = Math.max(1, (index % 3) + 2); // 2-4 days base

      switch (task.columnId) {
        case 'done':
          endDate = addDays(today, - (index % 4) -1); // Ends in the past
          startDate = addDays(endDate, -baseDuration);
          break;
        case 'review':
          startDate = addDays(today, (index % 2) -1 ); // Starts around today or yesterday
          endDate = addDays(startDate, baseDuration -1);
          break;
        case 'inprogress':
          startDate = addDays(today, -(index % 3)); // Started recently
          endDate = addDays(startDate, baseDuration + 1);
          break;
        case 'todo':
        default:
          startDate = addDays(today, (index % 3)); // Starts today or in near future
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
    }).sort((a,b) => a.range[0] - b.range[0]); // Sort by start date

    setGanttData(processedData);
    
    // Add some padding to the domain
    const paddedMinDate = addDays(overallMinDate, -2).getTime();
    const paddedMaxDate = addDays(overallMaxDate, 2).getTime();
    setDateDomain([paddedMinDate, paddedMaxDate]);

  }, []);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as GanttChartDataItem; // The whole data item for the bar
      if (!data) return null;

      const formattedStartDate = format(new Date(data.actualStartDate), 'MMM d, yyyy');
      const formattedEndDate = format(new Date(data.actualEndDate), 'MMM d, yyyy');

      return (
        <div className="bg-background p-3 border rounded shadow-lg text-sm">
          <p className="font-bold text-primary mb-1">{data.name}</p>
          <p><strong>Status:</strong> {data.status}</p>
          <p><strong>Start:</strong> {formattedStartDate}</p>
          <p><strong>End:</strong> {formattedEndDate}</p>
          <p><strong>Duration:</strong> {data.durationDays} day{data.durationDays === 1 ? '' : 's'}</p>
          {data.description && <p className="mt-1 pt-1 border-t text-xs text-muted-foreground"><em>{data.description}</em></p>}
        </div>
      );
    }
    return null;
  };

  if (!isMounted || ganttData.length === 0) {
    // Skeleton loader or simple loading message
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
      type: 'square',
      id: status,
      color: getStatusColor(Object.keys(statusMapping).find(key => statusMapping[key] === status) || status)
    }));


  return (
    <Card className="shadow-xl w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Project Timeline</CardTitle>
        <CardDescription>Visual overview of task schedules. Dates are illustrative.</CardDescription>
      </CardHeader>
      <CardContent className="h-[500px] w-full pr-6"> {/* Added pr-6 for YAxis label visibility */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={ganttData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 120, bottom: 20 }} // Increased left margin for YAxis labels
            barCategoryGap="35%" // Adds more space between bars for different tasks
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              domain={dateDomain}
              tickFormatter={(timestamp) => format(new Date(timestamp), 'MMM d')}
              stroke="hsl(var(--foreground))"
              tick={{ fontSize: 12 }}
              allowDuplicatedCategory={false}
              minTickGap={50} // Min gap between ticks in pixels
            />
            <YAxis
              dataKey="name"
              type="category"
              width={150} // Ensure enough width for task names
              stroke="hsl(var(--foreground))"
              tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
              interval={0} // Show all task names
              tickLine={{ stroke: 'hsl(var(--foreground))' }}
              axisLine={{ stroke: 'hsl(var(--foreground))' }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
            />
            <Legend payload={uniqueStatuses} wrapperStyle={{paddingTop: '20px'}} />
            <Bar dataKey="range" fill="hsl(var(--primary))" radius={[4, 4, 4, 4]}>
              {ganttData.map((entry, index) => (
                <Bar key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
