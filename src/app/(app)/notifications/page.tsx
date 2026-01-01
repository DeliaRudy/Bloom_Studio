
'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BellRing, Trash2, Mail, Clock, Save, Send } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/firebase';
import { sendTestEmailNotification } from './actions';

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

export type TestNotificationType = 'generic' | 'planDay' | 'productivity' | 'habits' | 'reflection';

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState(mockNotifications);
  const [showUnreadOnly, setShowUnreadOnly] = React.useState(false);
  
  // State for notification settings
  const [enableEmails, setEnableEmails] = React.useState(true);
  const [planDayReminder, setPlanDayReminder] = React.useState(true);
  const [productivityReminders, setProductivityReminders] = React.useState(['09:00', '13:00', '16:00']);
  const [habitsReminder, setHabitsReminder] = React.useState(true);
  const [reflectionReminder, setReflectionReminder] = React.useState(true);

  const [testNotificationType, setTestNotificationType] = React.useState<TestNotificationType>('generic');
  const [isSending, setIsSending] = React.useState(false);

  const { toast } = useToast();
  const { user } = useUser();

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

  const handleSaveSettings = () => {
    console.log("Saving notification settings:", {
        enableEmails,
        planDayReminder,
        productivityReminders,
        habitsReminder,
        reflectionReminder,
    });
    toast({
        title: "Settings Saved",
        description: "Your notification preferences have been updated."
    });
  }

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...productivityReminders];
    newTimes[index] = value;
    setProductivityReminders(newTimes);
  }

  const handleSendTest = async () => {
    if (!user?.email) {
        toast({
            title: "Error",
            description: "Could not find user email.",
            variant: "destructive"
        });
        return;
    }
    setIsSending(true);
    const result = await sendTestEmailNotification({
        email: user.email,
        notificationType: testNotificationType
    });

    if (result.error) {
        toast({
            title: "Failed to Send Test Email",
            description: result.error,
            variant: "destructive"
        });
    } else {
        toast({
            title: "Test Email Queued!",
            description: `An email for ${user.email} was added to the Firestore 'mail' collection.`
        });
    }
    setIsSending(false);
  }

  const filteredNotifications = showUnreadOnly
    ? notifications.filter((n) => !n.read)
    : notifications;

  return (
    <div>
      <PageHeader
        title="Notifications & Settings"
        description="View recent updates and configure your email notification preferences."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
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
                    <Label htmlFor="show-unread" className="text-xs">Show unread only</Label>
                </div>
                <Button variant="outline" size="sm" onClick={markAllAsRead}>Mark All Read</Button>
                <Button variant="destructive" size="sm" onClick={handleClearAll}>
                    Clear
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
                            className="text-xs"
                        >
                        {notification.read ? 'Mark Unread' : 'Mark Read'}
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

        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Mail className="h-6 w-6 text-primary" />
                        <CardTitle className="font-headline">Email Notification Settings</CardTitle>
                    </div>
                    <CardDescription>Configure when you receive email reminders from BloomVision.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label htmlFor="enable-emails" className="font-semibold">Enable Daily Emails</Label>
                            <p className="text-xs text-muted-foreground">Master switch for all email notifications.</p>
                        </div>
                        <Switch
                            id="enable-emails"
                            checked={enableEmails}
                            onCheckedChange={setEnableEmails}
                        />
                    </div>

                    <div className={cn("space-y-4", !enableEmails && "opacity-50 pointer-events-none")}>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="plan-day-reminder">"Plan Your Day" Reminder (8am)</Label>
                            <Switch
                                id="plan-day-reminder"
                                checked={planDayReminder}
                                onCheckedChange={setPlanDayReminder}
                            />
                        </div>
                        <Separator/>
                        <div>
                            <Label>Productivity Matrix Reminders</Label>
                            <p className="text-xs text-muted-foreground mb-2">Set 3 times to get AI-categorized task lists.</p>
                            <div className="grid grid-cols-3 gap-2">
                                {productivityReminders.map((time, index) => (
                                    <Input 
                                        key={index}
                                        type="time" 
                                        value={time}
                                        onChange={(e) => handleTimeChange(index, e.target.value)}
                                        className="text-xs"
                                    />
                                ))}
                            </div>
                        </div>
                        <Separator/>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="habits-reminder">Important Habits Reminder</Label>                            <Switch
                                id="habits-reminder"
                                checked={habitsReminder}
                                onCheckedChange={setHabitsReminder}
                            />
                        </div>
                        <Separator/>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="reflection-reminder">End-of-Day Reflection Reminder (8pm)</Label>
                            <Switch
                                id="reflection-reminder"
                                checked={reflectionReminder}
                                onCheckedChange={setReflectionReminder}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSaveSettings} className="ml-auto">
                        <Save className="mr-2 h-4 w-4" /> Save Settings
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className='font-headline'>Test Center</CardTitle>
                    <CardDescription>Send a test notification to see what the email would look like.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex items-center gap-4'>
                        <Select onValueChange={(value: TestNotificationType) => setTestNotificationType(value)} defaultValue='generic'>
                            <SelectTrigger>
                                <SelectValue placeholder="Select notification type..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="generic">Generic Test</SelectItem>
                                <SelectItem value="planDay">"Plan Your Day" Reminder</SelectItem>
                                <SelectItem value="productivity">Productivity Matrix</SelectItem>
                                <SelectItem value="habits">Habits Reminder</SelectItem>
                                <SelectItem value="reflection">Reflection Reminder</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={handleSendTest} disabled={isSending}>
                            <Send className="mr-2 h-4 w-4"/>
                            {isSending ? "Sending..." : "Send Test"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
