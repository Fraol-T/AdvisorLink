
"use client";

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, Send, Smile } from "lucide-react";
import { CardFooter } from '@/components/ui/card';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  avatarUrl?: string;
  isCurrentUser: boolean;
}

const initialMessages: Message[] = [
  { id: '1', sender: 'Advisor Emily', text: 'Hello team! How is the project proposal coming along?', timestamp: '10:00 AM', avatarUrl: 'https://placehold.co/40x40.png?text=AE', isCurrentUser: false },
  { id: '2', sender: 'Student John', text: 'Hi Emily! We are making good progress. Should have a draft by EOD.', timestamp: '10:01 AM', avatarUrl: 'https://placehold.co/40x40.png?text=SJ', isCurrentUser: true },
  { id: '3', sender: 'Advisor Emily', text: 'Great to hear, John! Let me know if you need any feedback.', timestamp: '10:02 AM', avatarUrl: 'https://placehold.co/40x40.png?text=AE', isCurrentUser: false },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [messages]);


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: String(Date.now()),
      sender: 'Student John', // Assuming current user is Student John for demo
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatarUrl: 'https://placehold.co/40x40.png?text=SJ',
      isCurrentUser: true,
    };
    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-4rem-2px)] flex-col"> {/* Adjust height based on header */}
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold text-primary font-headline">Project Alpha Chat</h1>
        <p className="text-sm text-muted-foreground">Active members: Advisor Emily, Student John, Student Jane</p>
      </header>
      
      <ScrollArea className="flex-1 p-4 bg-muted/20">
        <div className="space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-3 ${
                msg.isCurrentUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {!msg.isCurrentUser && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={msg.avatarUrl} alt={msg.sender} data-ai-hint="user avatar" />
                  <AvatarFallback>{msg.sender.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-xs rounded-lg p-3 shadow-md lg:max-w-md ${
                  msg.isCurrentUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card'
                }`}
              >
                {!msg.isCurrentUser && <p className="text-xs font-semibold mb-1">{msg.sender}</p>}
                <p className="text-sm">{msg.text}</p>
                <p className={`mt-1 text-xs ${msg.isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground/70'} text-right`}>
                  {msg.timestamp}
                </p>
              </div>
              {msg.isCurrentUser && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={msg.avatarUrl} alt={msg.sender} data-ai-hint="user avatar" />
                  <AvatarFallback>{msg.sender.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <CardFooter className="border-t bg-background p-4">
        <form onSubmit={handleSendMessage} className="flex w-full items-center gap-3">
          <Button variant="ghost" size="icon" type="button">
            <Paperclip className="h-5 w-5 text-muted-foreground" />
            <span className="sr-only">Attach file</span>
          </Button>
          <Input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 rounded-full px-4 py-2 focus-visible:ring-primary"
            aria-label="Chat message input"
          />
          <Button variant="ghost" size="icon" type="button">
            <Smile className="h-5 w-5 text-muted-foreground" />
            <span className="sr-only">Add emoji</span>
          </Button>
          <Button type="submit" size="icon" className="rounded-full bg-primary hover:bg-primary/90">
            <Send className="h-5 w-5 text-primary-foreground" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </div>
  );
}
