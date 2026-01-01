
'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BellRing, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Notification = {
  id: string;
  title: string;
  description: string;
  read: boolean;
  date: string;
};

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'AI Reflection Ready!',
    description: 'Your weekly AI-powered reflection is now available to view.',
    read: false,
    date: '2 hours ago',
  },
  {
    id: '2',
    title: 'Goal Milestone Achieved',
    description: 'Congratulations! You completed "Launch my side business".',
    read: false,
    date: '1 day ago',
  },
  {
    id: '3',
    title: 'New "Rose Gold" Theme Unlocked',
    description: 'You can now select the new theme in your settings.',
    read: true,
    date: '3 days ago',
  },
  {
    id: '4',
    title: 'Cycle Phase Change',
    description: 'You are now entering your Luteal phase. Time to focus on details.',
    read: true,
    date: '5 days ago',
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState(mockNotifications);
  const [showUnreadOnly, setShowUnreadOnly] = React.useState(false);
  const { toast } = useToast();

  const handleToggleRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast({
      title: 'Notifications Cleared',
      description: 'All your notifications have been removed.',
    });
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({...n, read: true})));
     toast({
      title: 'All Marked as Read',
      description: 'All notifications have been marked as read.',
    });
  }

  const filteredNotifications = showUnreadOnly
    ? notifications.filter((n) => !n.read)
    : notifications;

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Here's a list of your recent updates, reminders, and achievements."
      />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <BellRing className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Inbox</CardTitle>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch 
                    id="show-unread" 
                    checked={showUnreadOnly}
                    onCheckedChange={setShowUnreadOnly}
                />
                <Label htmlFor="show-unread">Show unread only</Label>
              </div>
              <Button variant="outline" onClick={markAllAsRead}>Mark All as Read</Button>
              <Button variant="destructive" onClick={handleClearAll}>
                <Trash2 className="mr-2 h-4 w-4" /> Clear All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <div className="flex items-start justify-between gap-4 p-4 rounded-lg hover:bg-muted/50">
                    <div className="flex items-start gap-4">
                         <span className={cn(
                            "h-3 w-3 rounded-full mt-1.5 shrink-0",
                            notification.read ? "bg-muted" : "bg-primary"
                         )} />
                        <div>
                            <p className="font-semibold">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
                        </div>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleToggleRead(notification.id)}
                    >
                      {notification.read ? 'Mark as Unread' : 'Mark as Read'}
                    </Button>
                  </div>
                  {index < filteredNotifications.length - 1 && <Separator />}
                </React.Fragment>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="font-semibold">All caught up!</p>
                <p>You have no new notifications.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
