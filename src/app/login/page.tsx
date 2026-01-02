
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuth, useFirebase, useUser } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider,
  signInWithPopup,
  User
} from "firebase/auth";
import { Rose } from "@/components/icons/rose";
import { Separator } from "@/components/ui/separator";
import { doc, getDoc, setDoc, query, collection, where, getDocs } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
    <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.641-3.657-11.303-8.524l-6.571 4.819C9.656 39.663 16.318 44 24 44z"/>
    <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-3.044 0-5.748-1.07-7.92-2.853l-6.571 4.819C12.353 39.699 17.848 44 24 44c11.045 0 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
  </svg>
);


export default function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();
  const { firestore } = useFirebase();
  const { user, isUserLoading } = useUser();

  React.useEffect(() => {
    if (!isUserLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isUserLoading, router]);

  const ensureUserDocuments = async (user: User) => {
    // Check and create /users/{userId} if it doesn't exist
    const userDocRef = doc(firestore, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (!userDocSnap.exists()) {
      setDocumentNonBlocking(userDocRef, {
        id: user.uid,
        email: user.email,
        username: user.displayName || user.email,
        creationDate: new Date().toISOString(),
      }, { merge: true });
    }

    // Check and create default session if it doesn't exist
    const sessionDocRef = doc(firestore, `users/${user.uid}/sessions/default`);
    const sessionDocSnap = await getDoc(sessionDocRef);
    if (!sessionDocSnap.exists()) {
      setDocumentNonBlocking(sessionDocRef, {
        id: 'default',
        userAccountId: user.uid,
        startTime: new Date().toISOString(),
      }, { merge: true });
    }
    
    // CRITICAL: Ensure the bigGoal document exists for ALL users on login.
    const bigGoalDocRef = doc(firestore, `users/${user.uid}/sessions/default/visionStatements`, 'bigGoal');
    const bigGoalDocSnap = await getDoc(bigGoalDocRef);
    if (!bigGoalDocSnap.exists()) {
      setDocumentNonBlocking(bigGoalDocRef, {
          goalText: '', // Initialize with an empty goal
          sessionID: 'default',
          id: 'bigGoal'
      }, { merge: true });
    }
  };


  const handleGoogleSignIn = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await ensureUserDocuments(result.user);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${result.user.displayName}!`,
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Google Sign-In Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleLogin = async () => {
    setError(null);
    let loginEmail = emailOrUsername;

    if (!emailOrUsername.includes('@')) {
        try {
            const usersRef = collection(firestore, "users");
            const q = query(usersRef, where("username", "==", emailOrUsername));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                loginEmail = userDoc.data().email;
            } else {
                setError("User not found.");
                toast({ title: "Login Failed", description: "User not found.", variant: "destructive" });
                return;
            }
        } catch (err: any) {
            setError(err.message);
            toast({ title: "Error", description: err.message, variant: "destructive" });
            return;
        }
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, password);
      await ensureUserDocuments(userCredential.user);
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Login Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
                <Rose className="w-8 h-8 text-primary" />
                <CardTitle className="font-headline text-3xl">Bloom</CardTitle>
            </div>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
             <Link href="/demo/dashboard" className="w-full">
                <Button variant="secondary" className="w-full">Try Interactive Demo</Button>
            </Link>
            <Button variant="outline" onClick={handleGoogleSignIn}>
              <GoogleIcon />
              Sign in with Google
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email-username">Email or Username</Label>
              <Input
                id="email-username"
                type="text"
                placeholder="m@example.com or your_username"
                required
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" onClick={handleLogin}>
              Sign in
            </Button>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
    </div>
  );
}

    