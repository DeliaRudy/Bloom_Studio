
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

export default function SettingsPage() {
  const { user, isUserLoading } = useUser();
  const { firestore, auth } = useFirebase();
  const { toast } = useToast();
  
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  React.useEffect(() => {
    if (user && userDocRef) {
      const fetchUserData = async () => {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username || user.displayName || '');
          setEmail(userData.email || user.email || '');
        } else {
            // Pre-fill from auth if doc doesn't exist
            setUsername(user.displayName || '');
            setEmail(user.email || '');
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
    </div>
  );
}
