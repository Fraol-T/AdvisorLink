"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileText, Download, Trash2, Folder, Search, Filter } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  sharedWith: string[];
}

const initialDocuments: Document[] = [
  { id: '1', name: 'Project Proposal v2.docx', type: 'Word Document', size: '2.5MB', lastModified: '2024-07-28', sharedWith: ['Advisor Emily', 'John Doe'] },
  { id: '2', name: 'Literature Review.pdf', type: 'PDF', size: '5.1MB', lastModified: '2024-07-27', sharedWith: ['Jane Smith'] },
  { id: '3', name: 'Presentation Slides.pptx', type: 'PowerPoint', size: '10.2MB', lastModified: '2024-07-26', sharedWith: ['Advisor Emily'] },
  { id: '4', name: 'Raw Data.zip', type: 'ZIP Archive', size: '55MB', lastModified: '2024-07-25', sharedWith: [] },
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }
    
    const newDocument: Document = {
      id: String(Date.now()),
      name: selectedFile.name,
      type: selectedFile.type || 'Unknown',
      size: `${(selectedFile.size / (1024*1024)).toFixed(2)}MB`,
      lastModified: new Date().toISOString().split('T')[0],
      sharedWith: ['You']
    };
    setDocuments([newDocument, ...documents]);
    
    setIsUploading(false);
    setSelectedFile(null); 
    // Reset file input if possible, or clear its visual selection
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleDelete = (docId: string) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
  };

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline">Document Repository</h1>
          <p className="text-muted-foreground">Manage and share your project files.</p>
        </div>
        <Button onClick={() => document.getElementById('file-upload-card-button')?.click()} className="w-full md:w-auto">
          <Upload className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </header>
      
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Upload New Document</CardTitle>
          <CardDescription>Select a file from your computer to upload it to the repository.</CardDescription>
        </CardHeader>
        <form onSubmit={handleUpload}>
          <CardContent>
            <Input id="file-upload" type="file" onChange={handleFileChange} className="mb-4" aria-label="File upload input"/>
            {selectedFile && <p className="text-sm text-muted-foreground mb-2">Selected: {selectedFile.name}</p>}
            {isUploading && <Progress value={uploadProgress} className="w-full mb-2 h-2" />}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={!selectedFile || isUploading} id="file-upload-card-button">
              {isUploading ? `Uploading... ${uploadProgress}%` : "Start Upload"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline">Your Documents</CardTitle>
            <CardDescription>Browse, download, or manage your uploaded files.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input placeholder="Search documents..." className="max-w-xs" icon={<Search className="h-4 w-4 text-muted-foreground"/>} />
            <Button variant="outline" size="icon"><Filter className="h-4 w-4"/></Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Folder className="inline-block mr-1 h-4 w-4 text-muted-foreground"/>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Shared With</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-primary" />
                    {doc.name}
                  </TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{doc.size}</TableCell>
                  <TableCell>{doc.lastModified}</TableCell>
                  <TableCell>{doc.sharedWith.length > 0 ? doc.sharedWith.join(', ') : '-'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          <span>Download</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" />
                          <span>Share</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(doc.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {documents.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">No documents uploaded yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}