
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
import { useAuth, useUser } from "@/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useFirebase } from "@/firebase";
import { Rose } from "@/components/icons/rose";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export default function SignupPage() {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
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

  const handleSignup = async () => {
    setError(null);
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
      
      // Update user profile
      await updateProfile(newUser, {
        displayName: `${firstName} ${lastName}`.trim(),
      });
      
      // Create user document in Firestore
      const userDocRef = doc(firestore, "users", newUser.uid);
      setDocumentNonBlocking(userDocRef, {
        id: newUser.uid,
        email: newUser.email,
        creationDate: new Date().toISOString(),
      }, { merge: true });

      // Create a default session
      const sessionCollectionRef = collection(firestore, `users/${newUser.uid}/sessions`);
      const sessionDocRef = doc(sessionCollectionRef, 'default');
      setDocumentNonBlocking(sessionDocRef, {
        id: 'default',
        userAccountId: newUser.uid,
        startTime: new Date().toISOString(),
      }, { merge: true });

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
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
         <div className="flex justify-center items-center gap-2 mb-4">
            <Rose className="w-8 h-8 text-primary" />
            <CardTitle className="font-headline text-3xl">BloomVision</CardTitle>
        </div>
        <CardDescription>Enter your information to create an account</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="first-name">First name</Label>
            <Input
              id="first-name"
              placeholder="Max"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="last-name">Last name</Label>
            <Input
              id="last-name"
              placeholder="Robinson"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
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
  );
}
