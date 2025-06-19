
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Filter, Search } from "lucide-react";
import { Input } from '@/components/ui/input';

interface Submission {
  id: string;
  projectTitle: string;
  groupName: string;
  submittedDate: string;
  status: "Pending Review" | "Approved" | "Needs Revision" | "Rejected";
  advisor: string;
}

const initialSubmissions: Submission[] = [
  { id: '1', projectTitle: 'AI-Powered Student Collaboration Platform', groupName: 'The Innovators', submittedDate: '2024-07-29', status: 'Pending Review', advisor: 'Dr. Smith' },
  { id: '2', projectTitle: 'Sustainable Urban Farming Initiative', groupName: 'Green Thumbs', submittedDate: '2024-07-28', status: 'Approved', advisor: 'Prof. Jones' },
  { id: '3', projectTitle: 'Decentralized Social Media Network', groupName: 'Team Web3', submittedDate: '2024-07-27', status: 'Needs Revision', advisor: 'Dr. Lee' },
  { id: '4', projectTitle: 'IoT Based Smart Home Automation', groupName: 'Tech Wizards', submittedDate: '2024-07-26', status: 'Rejected', advisor: 'Prof. Davis' },
  { id: '5', projectTitle: 'Gamified Language Learning App', groupName: 'LingoLeap', submittedDate: '2024-07-25', status: 'Approved', advisor: 'Dr. Smith' },
];

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadgeVariant = (status: Submission["status"]): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Approved":
        return "default"; 
      case "Pending Review":
        return "secondary";
      case "Needs Revision":
        return "outline"; 
      case "Rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };
  
  const filteredSubmissions = submissions.filter(submission => 
    submission.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.advisor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline">Project Submissions</h1>
          <p className="text-muted-foreground">Review and manage student project submissions.</p>
        </div>
      </header>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="font-headline">All Submissions</CardTitle>
            <CardDescription>Overview of all project title submissions.</CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search submissions..." 
                className="pl-8 w-full" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" aria-label="Filter submissions">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Title</TableHead>
                <TableHead>Group Name</TableHead>
                <TableHead>Advisor</TableHead>
                <TableHead>Submitted Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.projectTitle}</TableCell>
                    <TableCell>{submission.groupName}</TableCell>
                    <TableCell>{submission.advisor}</TableCell>
                    <TableCell>{submission.submittedDate}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(submission.status)} 
                             className={submission.status === 'Approved' ? 'bg-green-500 hover:bg-green-600 text-primary-foreground' : 
                                        submission.status === 'Pending Review' ? 'bg-yellow-500 hover:bg-yellow-600 text-secondary-foreground' :
                                        submission.status === 'Needs Revision' ? 'bg-orange-500 hover:bg-orange-600 text-primary-foreground' :
                                        submission.status === 'Rejected' ? 'bg-red-600 hover:bg-red-700 text-destructive-foreground' : ''}>
                        {submission.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" aria-label="View submission details">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No submissions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        { filteredSubmissions.length > 0 && (
          <CardFooter className="flex justify-end">
             <p className="text-sm text-muted-foreground">
              Showing {filteredSubmissions.length} of {submissions.length} submissions.
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
