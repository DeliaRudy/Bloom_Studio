
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
  createUserWithEmailAndPassword, 
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { Rose } from "@/components/icons/rose";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
    <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.641-3.657-11.303-8.524l-6.571 4.819C9.656 39.663 16.318 44 24 44z"/>
    <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-3.044 0-5.748-1.07-7.92-2.853l-6.571 4.819C12.353 39.699 17.848 44 24 44c11.045 0 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
  </svg>
);

const initializeNewUser = (firestore: any, user: any) => {
    const userDocRef = doc(firestore, "users", user.uid);
    setDocumentNonBlocking(userDocRef, {
        id: user.uid,
        email: user.email,
        username: user.displayName || user.email,
        creationDate: new Date().toISOString(),
    }, { merge: true });

    const sessionDocRef = doc(firestore, `users/${user.uid}/sessions`, 'default');
    setDocumentNonBlocking(sessionDocRef, {
        id: 'default',
        userAccountId: user.uid,
        startTime: new Date().toISOString(),
    }, { merge: true });
    
    // CRITICAL: Ensure the bigGoal document exists for new users.
    const visionStatementDocRef = doc(firestore, `users/${user.uid}/sessions/default/visionStatements`, 'bigGoal');
    setDocumentNonBlocking(visionStatementDocRef, {
        goalText: '', // Initialize with an empty goal
        sessionID: 'default',
        id: 'bigGoal'
    }, { merge: true });
};

export default function SignupPage() {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
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

  const handleGoogleSignIn = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(firestore, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        initializeNewUser(firestore, user);
      }

      toast({
        title: "Login Successful",
        description: `Welcome, ${user.displayName}!`,
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

  const handleSignup = async () => {
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;
      
      await updateProfile(newUser, {
        displayName: username,
      });

      // Pass the new user object to the initialization function
      const userToInit = {
          uid: newUser.uid,
          email: newUser.email,
          displayName: username,
      };
      
      initializeNewUser(firestore, userToInit);

      toast({
        title: "Account Created",
        description: "Welcome! You have been successfully signed up.",
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Signup Failed",
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
            <CardDescription>Enter your information to create an account</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/demo/dashboard" className="w-full">
                <Button variant="secondary" className="w-full">Try Interactive Demo</Button>
            </Link>
            <Button variant="outline" onClick={handleGoogleSignIn}>
                <GoogleIcon />
                Sign up with Google
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
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="your_username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
             {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" onClick={handleSignup}>
              Create account
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
    </div>
  );
}
