"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import * as React from "react";
import { Label } from "@/components/ui/label";
import { useFirebase, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { JournalEntry } from "@/lib/types";
import { AIInterview } from "@/components/ai-interview";

type Trait = {
    id: string;
    word: string;
    meaningId?: string;
    meaning?: string;
};

export default function PersonaDefinitionPage() {
    const { firestore, user } = useFirebase();
    const { toast } = useToast();

    const journalCollection = useMemoFirebase(() => {
        if (!user) return null;
        return collection(firestore, `users/${user.uid}/sessions/default/journalEntries`);
    }, [firestore, user]);

    const { data: journalData, isLoading } = useCollection<JournalEntry>(journalCollection);

    const reasons = React.useMemo(() => journalData?.filter(j => j.entryType === 'reason') || [], [journalData]);
    const philosophies = React.useMemo(() => journalData?.find(j => j.entryType === 'philosophy')?.text || "", [journalData]);
    
    const traits = React.useMemo(() => {
        const words = journalData?.filter(j => j.entryType === 'trait_word') || [];
        const meanings = journalData?.filter(j => j.entryType === 'trait_meaning') || [];

        return words.map(word => ({
            id: word.id,
            word: word.text,
            meaningId: meanings.find(m => m.relatedId === word.id)?.id,
            meaning: meanings.find(m => m.relatedId === word.id)?.text || ''
        }));
    }, [journalData]);


    const handleReasonChange = (entry: Partial<JournalEntry>, value: string) => {
        if (!journalCollection) return;
        if (entry.id) {
            const docRef = doc(journalCollection, entry.id);
            if(value.trim() === "") deleteDocumentNonBlocking(docRef);
            else updateDocumentNonBlocking(docRef, { text: value });
        } else if (value.trim() !== "") {
            addDocumentNonBlocking(journalCollection, { text: value, entryType: 'reason', sessionID: 'default' });
        }
    };

    const handleTraitWordChange = (entry: Partial<Trait>, value: string) => {
        if (!journalCollection) return;
        if(entry.id) {
            const docRef = doc(journalCollection, entry.id);
            if(value.trim() === "") {
                if(entry.meaningId) deleteDocumentNonBlocking(doc(journalCollection, entry.meaningId));
                deleteDocumentNonBlocking(docRef);
            }
            else updateDocumentNonBlocking(docRef, { text: value });
        } else if (value.trim() !== "") {
            addDocumentNonBlocking(journalCollection, { text: value, entryType: 'trait_word', sessionID: 'default' });
        }
    }
    
    const handleTraitMeaningChange = (wordEntry: Trait, value: string) => {
        if (!journalCollection || !wordEntry.id) return;
        if(wordEntry.meaningId) {
             const docRef = doc(journalCollection, wordEntry.meaningId);
             if(value.trim() === "") deleteDocumentNonBlocking(docRef);
             else updateDocumentNonBlocking(docRef, { text: value });
        } else if (value.trim() !== "") {
            addDocumentNonBlocking(journalCollection, { text: value, entryType: 'trait_meaning', sessionID: 'default', relatedId: wordEntry.id });
        }
    }
    
    const handlePhilosophyChange = (value: string) => {
        if (!journalCollection) return;
        const philosophyDoc = journalData?.find(j => j.entryType === 'philosophy');
        if (philosophyDoc) {
             const docRef = doc(journalCollection, philosophyDoc.id);
             updateDocumentNonBlocking(docRef, { text: value });
        } else if (value.trim() !== "") {
            addDocumentNonBlocking(journalCollection, { text: value, entryType: 'philosophy', sessionID: 'default' });
        }
    }


    const handleSave = () => {
        toast({
            title: "Your Persona has been saved!",
            description: "Connecting with your reasons and traits is a huge step.",
        });
    }

    const handleInterviewTranscript = (transcript: string) => {
        console.log("Transcript received:", transcript);
        toast({
            title: "Interview Response Captured",
            description: "Your response has been logged to the console. The next step is to process it and fill the fields.",
        });
        // In a future step, this is where we would call a Genkit flow
        // to process the transcript and then update the state/DB.
        // For example: setReasons(processedTranscript.reasons);
    };

    const paddedReasons = [...reasons, ...Array(5 - reasons.length).fill({id: '', text: ''})].slice(0,5);
    const paddedTraits = [...traits, ...Array(5 - traits.length).fill({id: '', word: '', meaning: ''})].slice(0,5);

    return (
        <div>
            <PageHeader
                title="Define Your Persona"
                description="If your WHY is strong enough, nothing will stop you. Defining WHO you need to become gives you the character to succeed. This gives you reasons to dig deep and overcome your challenges."
            />
             <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="font-headline">AI Interview</CardTitle>
                    <CardDescription>Use your voice to fill out this section. Click the button to have an AI assistant guide you through the questions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <AIInterview 
                        introText="Hello! I'm here to help you define your persona. Let's start with your 'Why'. In your own words, tell me why you want to achieve your Ambition, Vision and Goals."
                        onTranscript={handleInterviewTranscript}
                    />
                </CardContent>
            </Card>
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="font-headline">My 'Why': I want to achieve my Ambition, Vision and Goals because...</CardTitle>
                    <CardDescription>Write at least 5 reasons WHY you want to achieve your Ambition, Vision and Goals.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {paddedReasons.map((reason, index) => (
                         <div key={reason.id || index} className="flex items-center gap-4">
                            <span className="text-lg font-semibold text-muted-foreground">{index + 1}.</span>
                            <Input 
                                type="text"
                                defaultValue={reason.text}
                                onBlur={(e) => handleReasonChange(reason, e.target.value)}
                                placeholder="Enter your reason here..."
                            />
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="font-headline">My 'Who': The person I need to become</CardTitle>
                    <CardDescription>
                        Choose at least 5 words that define who you need to become. Explain what each word means to you.
                        <br />
                        <span className="text-xs text-muted-foreground">
                            Example words: passionate, inspirational, famous, fit, healthy, successful, brave, calm, patient, great, kind, determined, considerate, energetic, renowned, respected, unstoppable, motivational, committed.
                        </span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {paddedTraits.map((trait, index) => (
                         <div key={trait.id || index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <div className="flex items-center gap-4 md:col-span-1">
                               <span className="text-lg font-semibold text-muted-foreground">{index + 1}.</span>
                                <Input 
                                    type="text"
                                    defaultValue={trait.word}
                                    onBlur={(e) => handleTraitWordChange(trait, e.target.value)}
                                    placeholder="Trait (e.g., Brave)"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Textarea 
                                    defaultValue={trait.meaning}
                                    onBlur={(e) => handleTraitMeaningChange(trait, e.target.value)}
                                    placeholder="Explain what this word means to you..."
                                    rows={2}
                                />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="font-headline">Personal Philosophies</CardTitle>
                    <CardDescription>
                        Define your personal philosophies, your own beliefs and opinions on the different facets of life. Defined philosophies give you clarity.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="personal-philosophies">My Philosophies</Label>
                        <Textarea
                            id="personal-philosophies"
                            placeholder="Write your philosophies here..."
                            defaultValue={philosophies}
                            onBlur={(e) => handlePhilosophyChange(e.target.value)}
                            className="resize-none h-48 leading-loose bg-transparent"
                             style={{
                                backgroundImage: 'repeating-linear-gradient(to bottom, hsl(var(--border)) 0 1px, transparent 1px 2rem)',
                                lineHeight: '2rem',
                                backgroundAttachment: 'local'
                            }}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col items-center gap-4 mt-8">
                <Button size="lg" onClick={handleSave}>Save My Persona</Button>
                <blockquote className="text-sm italic text-muted-foreground mt-4 text-center max-w-md">
                    &ldquo;Success is not what you have, but who you are.&rdquo;
                    <cite className="not-italic font-semibold"> - Bo Bennett</cite>
                </blockquote>
            </div>
        </div>
    );
}
