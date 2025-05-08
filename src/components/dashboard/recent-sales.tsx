
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RecentSession {
  id: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  messageCount: number;
  date: string;
}

interface RecentSalesProps {
  data: RecentSession[];
  isLoading?: boolean;
}

export function RecentSales({ data, isLoading = false }: RecentSalesProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center animate-pulse">
            <div className="h-10 w-10 rounded-full bg-muted mr-4"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-3 bg-muted rounded w-2/4"></div>
            </div>
            <div className="h-4 bg-muted rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {data.map((session) => {
        // Get initials from user name
        const initials = session.user.name
          .split(' ')
          .map(part => part[0])
          .join('')
          .toUpperCase();

        return (
          <div key={session.id} className="flex items-center">
            <Avatar className="h-9 w-9 mr-4">
              {session.user.avatar ? (
                <AvatarImage src={session.user.avatar} alt={session.user.name} />
              ) : null}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1 flex-1">
              <p className="text-sm font-medium leading-none">{session.user.name}</p>
              <p className="text-sm text-muted-foreground">{session.user.email}</p>
            </div>
            <div className="ml-auto text-right flex flex-col items-end">
              <p className="text-sm font-medium">{session.messageCount} messages</p>
              <p className="text-xs text-muted-foreground">{session.date}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
