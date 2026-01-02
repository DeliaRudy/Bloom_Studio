
'use client';

import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/page-header';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, Palette, Save } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { demoUser } from '@/lib/demo-data';

export default function DemoSettingsPage() {
  const { toast } = useToast();
  
  const [username, setUsername] = React.useState(demoUser.name);
  const [avatarUrl, setAvatarUrl] = React.useState(demoUser.avatarUrl);
  const [avatarPrompt, setAvatarPrompt] = React.useState(demoUser.avatarPrompt);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const { theme: activeTheme, setTheme: setActiveTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = React.useState<string>(activeTheme || 'rose-gold');
  
  React.useEffect(() => { setSelectedTheme(activeTheme || 'rose-gold'); }, [activeTheme]);

  const handleUpdateProfile = async () => {
    toast({ title: 'Demo Mode', description: 'Your changes are not saved in the demo.' });
  };

  const handleGenerateAvatar = async () => {
    if (!avatarPrompt.trim()) {
        toast({ title: 'Prompt is empty', description: 'Please enter a prompt.', variant: 'destructive' });
        return;
    }
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAvatarUrl("https://picsum.photos/seed/newavatar/400/400");
    toast({ title: 'Avatar Generated!', description: 'This is a new placeholder avatar for the demo.' });
    setIsGenerating(false);
  };

  const handleSaveTheme = () => {
    if (selectedTheme) {
      setActiveTheme(selectedTheme);
      toast({ title: 'Theme Saved', description: `Your theme has been set to ${selectedTheme.replace(/-/g, ' ')}.` });
    }
  };

  const themes = [
    { name: 'Rose Gold', value: 'rose-gold', colors: ['bg-[#f5c1cd]', 'bg-[#dead9d]', 'bg-[#6d100f]'] },
    { name: 'Black Gold', value: 'black-gold', colors: ['bg-[#1a1a1a]', 'bg-[#d4af37]', 'bg-[#f0e68c]'] },
    { name: 'Brown Gold', value: 'brown-gold', colors: ['bg-[#a0522d]', 'bg-[#e6c278]', 'bg-[#fdf5e6]'] },
  ];

  return (
    <div>
      <PageHeader title="Account Settings" description="Manage your account details, preferences, and appearance." />
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-1 md:border-r p-6 lg:p-8 space-y-6">
                <div className="flex flex-col items-center text-center">
                    <Avatar className="h-32 w-32 mb-4 ring-4 ring-primary/20">
                        <AvatarImage src={avatarUrl} alt={username} />
                        <AvatarFallback>{username?.[0]?.toUpperCase() || 'A'}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold">{username}</h2>
                    <p className="text-sm text-muted-foreground">anastasia.n@example.com</p>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <Button onClick={handleUpdateProfile} className="w-full">
                        <Save className="mr-2 h-4 w-4" /> Save Profile
                    </Button>
                </div>
            </div>

            <div className="md:col-span-2 p-6 lg:p-8 space-y-8">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-2"><Sparkles className="text-primary"/> AI Avatar Generator</h3>
                    <p className="text-sm text-muted-foreground mb-4">Generate a unique profile picture based on a text prompt.</p>
                     <div className="space-y-2">
                        <Label htmlFor="avatar-prompt">Your Prompt</Label>
                        <div className="flex items-center gap-2">
                            <Input id="avatar-prompt" defaultValue={avatarPrompt} onChange={e => setAvatarPrompt(e.target.value)} />
                             <Button onClick={handleGenerateAvatar} disabled={isGenerating} className="whitespace-nowrap">
                                <Sparkles className="mr-2 h-4 w-4" />
                                {isGenerating ? 'Generating...' : 'Generate'}
                            </Button>
                        </div>
                     </div>
                </div>
                
                <Separator/>

                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-2"><Palette className="text-primary"/> App Theme</h3>
                    <p className="text-sm text-muted-foreground mb-4">Select a color palette that inspires you.</p>
                     <div className="space-y-4">
                        {themes.map(theme => (
                             <div 
                                key={theme.value}
                                onClick={() => setSelectedTheme(theme.value)}
                                className={cn("flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all", selectedTheme === theme.value ? "border-primary ring-2 ring-primary/50" : "border-border hover:border-primary/50" )}
                            >
                                <span className="font-medium">{theme.name}</span>
                                <div className="flex items-center gap-2">
                                    {theme.colors.map((color, i) => (
                                        <div key={i} className={cn("h-6 w-6 rounded-full", color)}></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                     <Button onClick={handleSaveTheme} className="mt-6">
                        <Save className="mr-2 h-4 w-4" /> Save Theme
                    </Button>
                </div>
            </div>
        </div>
      </Card>
    </div>
  );
}
