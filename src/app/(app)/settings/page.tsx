
'use client';

import * as React from 'react';
import { useUser, useFirebase, useMemoFirebase } from '@/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateProfile } from 'firebase/auth';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, Palette, Save } from 'lucide-react';
import { generateAvatarAction } from './actions';
import { useTheme } from 'next-themes';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsPage() {
  const { user, isUserLoading } = useUser();
  const { firestore, auth } = useFirebase();
  const { toast } = useToast();
  
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [avatarUrl, setAvatarUrl] = React.useState('');
  const [avatarPrompt, setAvatarPrompt] = React.useState('');
  const [isGenerating, setIsGenerating = React.useState(false);
  const [isLoading, setIsLoading = React.useState(true);

  const { theme: activeTheme, setTheme: setActiveTheme } = useTheme();
  const [selectedTheme, setSelectedTheme = React.useState<string>(activeTheme || 'rose-gold');
  
  React.useEffect(() => {
    setSelectedTheme(activeTheme || 'rose-gold');
  }, [activeTheme]);

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  React.useEffect(() => {
    if (user && userDocRef) {
      const fetchUserData = async () => {
        setIsLoading(true);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username || user.displayName || '');
          setEmail(userData.email || user.email || '');
          setAvatarUrl(userData.photoURL || user.photoURL || '');
        } else {
            // Pre-fill from auth if doc doesn't exist
            setUsername(user.displayName || '');
            setEmail(user.email || '');
            setAvatarUrl(user.photoURL || '');
        }
        setIsLoading(false);
      };
      fetchUserData();
    } else if (!isUserLoading) {
        setIsLoading(false);
    }
  }, [user, userDocRef, isUserLoading]);

  const handleUpdateProfile = async () => {
    if (!user || !userDocRef || !auth.currentUser) {
      toast({
        title: 'Error',
        description: 'You must be logged in to update your profile.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Update Firestore
      updateDocumentNonBlocking(userDocRef, { username });

      // Update Firebase Auth display name
      await updateProfile(auth.currentUser, { displayName: username });

      toast({
        title: 'Profile Updated',
        description: 'Your username has been successfully updated.',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateAvatar = async () => {
    if (!avatarPrompt.trim()) {
        toast({ title: 'Prompt is empty', description: 'Please enter a prompt to generate an avatar.', variant: 'destructive' });
        return;
    }
    if (!user || !userDocRef || !auth.currentUser) return;

    setIsGenerating(true);
    try {
        const result = await generateAvatarAction({ prompt: avatarPrompt });
        if (result.error) throw new Error(result.error);
        if (!result.imageUrl) throw new Error("AI did not return an image.");

        setAvatarUrl(result.imageUrl);

        // Update auth and firestore
        await updateProfile(auth.currentUser, { photoURL: result.imageUrl });
        updateDocumentNonBlocking(userDocRef, { photoURL: result.imageUrl });

        toast({ title: 'Avatar Generated!', description: 'Your new avatar has been set.' });

    } catch (error: any) {
        console.error('Error generating avatar:', error);
        toast({ title: 'Generation Failed', description: error.message || 'Could not generate avatar.', variant: 'destructive' });
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSaveTheme = () => {
    if (selectedTheme) {
      document.documentElement.className = `theme-${selectedTheme}`;
      setActiveTheme(selectedTheme);
      localStorage.setItem('theme', selectedTheme);
      toast({
        title: 'Theme Saved',
        description: `Your theme has been set to ${selectedTheme.replace(/-/g, ' ')}.`,
      });
    }
  };

  const themes = [
    { name: 'Rose Gold', value: 'rose-gold', colors: ['bg-[#f5c1cd]', 'bg-[#dead9d]', 'bg-[#6d100f]'] },
    { name: 'Black Gold', value: 'black-gold', colors: ['bg-[#1a1a1a]', 'bg-[#d4af37]', 'bg-[#f0e68c]'] },
    { name: 'Brown Gold', value: 'brown-gold', colors: ['bg-[#a0522d]', 'bg-[#e6c278]', 'bg-[#fdf5e6]'] },
  ];

  if (isLoading) {
      return (
        <div>
            <PageHeader
                title="Account Settings"
                description="Manage your account details, preferences, and appearance."
            />
            <Card className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-1 space-y-6 flex flex-col items-center md:items-start">
                        <Skeleton className="h-32 w-32 rounded-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="md:col-span-2 space-y-6">
                        <Skeleton className="h-10 w-1/3" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <div className="pt-4">
                            <Skeleton className="h-10 w-1/3" />
                            <Skeleton className="h-20 w-full mt-2" />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
      )
  }

  return (
    <div>
      <PageHeader
        title="Account Settings"
        description="Manage your account details, preferences, and appearance."
      />
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Left Column */}
            <div className="md:col-span-1 md:border-r p-6 lg:p-8 space-y-6">
                <div className="flex flex-col items-center text-center">
                    <Avatar className="h-32 w-32 mb-4 ring-4 ring-primary/20">
                        <AvatarImage src={avatarUrl} alt={username} />
                        <AvatarFallback>{username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold">{username || "New User"}</h2>
                    <p className="text-sm text-muted-foreground">{email}</p>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleUpdateProfile} className="w-full">
                        <Save className="mr-2 h-4 w-4" />
                        Save Profile
                    </Button>
                </div>
            </div>

            {/* Right Column */}
            <div className="md:col-span-2 p-6 lg:p-8 space-y-8">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-2"><Sparkles className="text-primary"/> AI Avatar Generator</h3>
                    <p className="text-sm text-muted-foreground mb-4">Generate a unique profile picture based on a text prompt.</p>
                     <div className="space-y-2">
                        <Label htmlFor="avatar-prompt">Your Prompt</Label>
                        <div className="flex items-center gap-2">
                            <Input id="avatar-prompt" placeholder="e.g., 'A tranquil forest scene'" value={avatarPrompt} onChange={e => setAvatarPrompt(e.target.value)} />
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
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all",
                                    selectedTheme === theme.value ? "border-primary ring-2 ring-primary/50" : "border-border hover:border-primary/50"
                                )}
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
                        <Save className="mr-2 h-4 w-4" />
                        Save Theme
                    </Button>
                </div>
            </div>
        </div>
      </Card>
    </div>
  );

    