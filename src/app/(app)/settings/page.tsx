
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
import { Sparkles, Palette } from 'lucide-react';
import { generateAvatar as generateAvatarAction } from './actions';
import { useTheme } from '@/components/theme-provider';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function SettingsPage() {
  const { user, isUserLoading } = useUser();
  const { firestore, auth } = useFirebase();
  const { toast } = useToast();
  
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [avatarUrl, setAvatarUrl] = React.useState('');
  const [avatarPrompt, setAvatarPrompt] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const { theme, setTheme } = useTheme();

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

  if (isLoading) {
      return (
          <div className="flex items-center justify-center h-full">
              <p>Loading settings...</p>
          </div>
      )
  }

  return (
    <div>
      <PageHeader
        title="Account Settings"
        description="Manage your account details and preferences."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>
                    Update your personal information below.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} disabled readOnly />
                    <p className="text-sm text-muted-foreground">
                        Email cannot be changed.
                    </p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                </CardContent>
                <CardFooter>
                <Button onClick={handleUpdateProfile}>Save Changes</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Theme</CardTitle>
                    <CardDescription>
                        Choose a color palette for your app.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="theme-select" className="flex items-center gap-2"><Palette/> Select Theme</Label>
                         <Select onValueChange={setTheme} value={theme}>
                            <SelectTrigger id="theme-select">
                                <SelectValue placeholder="Select a theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="rose-gold">Rose Gold</SelectItem>
                                <SelectItem value="black-gold">Black Gold</SelectItem>
                                <SelectItem value="brown-gold">Brown Gold</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-1">
             <Card>
                <CardHeader>
                    <CardTitle>Avatar</CardTitle>
                    <CardDescription>Update your profile picture.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <Avatar className="h-32 w-32">
                        <AvatarImage src={avatarUrl} alt={username} />
                        <AvatarFallback>{username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                     <div className="w-full space-y-4">
                        <div>
                            {/* In a real app, you'd use a file input and upload to storage */}
                            <Button variant="outline" className="w-full" disabled>Upload Image</Button>
                            <p className="text-xs text-center text-muted-foreground mt-2">File upload is not available in this demo.</p>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">
                                Or
                                </span>
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="avatar-prompt">Generate with AI</Label>
                            <Input id="avatar-prompt" placeholder="e.g., 'A tranquil forest scene'" value={avatarPrompt} onChange={e => setAvatarPrompt(e.target.value)} />
                        </div>
                        <Button onClick={handleGenerateAvatar} disabled={isGenerating} className="w-full">
                            <Sparkles className="mr-2 h-4 w-4" />
                            {isGenerating ? 'Generating...' : 'Generate Avatar'}
                        </Button>
                     </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
