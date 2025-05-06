
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

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
  isLoading: boolean;
}

export function RecentSales({ data, isLoading }: RecentSalesProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[160px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {data.map((session) => (
        <div key={session.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={session.user.avatar} alt="Avatar" />
            <AvatarFallback>
              {session.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{session.user.name}</p>
            <p className="text-sm text-muted-foreground">{session.user.email}</p>
          </div>
          <div className="ml-auto font-medium">
            {session.messageCount} messages
          </div>
        </div>
      ))}
    </div>
  );
}
