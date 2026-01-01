"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import * as React from "react";

export default function PersonaDefinitionPage() {
    const [reasons, setReasons] = React.useState(Array(5).fill(""));
    const { toast } = useToast();

    const handleReasonChange = (index: number, value: string) => {
        const newReasons = [...reasons];
        newReasons[index] = value;
        setReasons(newReasons);
    };

    const handleSave = () => {
        console.log("Saving Persona Definition (Why):", reasons);
        toast({
            title: "Your 'Why' has been saved!",
            description: "Connecting with your reasons is a huge step.",
        });
    }

    return (
        <div>
            <PageHeader
                title="Define Your Why"
                description="If your WHY is strong enough nothing will stop you from achieving your goals. Defining your WHY helps you to emotionally connect to your Ambition and Vision which gives you reasons to dig deep and overcome your challenges."
            />
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">I want to achieve my Ambition, Vision and Goals because...</CardTitle>
                    <CardDescription>Write at least 5 reasons WHY you want to achieve your Ambition, Vision and Goals.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {reasons.map((reason, index) => (
                         <div key={index} className="flex items-center gap-4">
                            <span className="text-lg font-semibold text-muted-foreground">{index + 1}.</span>
                            <Input 
                                type="text"
                                value={reason}
                                onChange={(e) => handleReasonChange(index, e.target.value)}
                                placeholder="Enter your reason here..."
                            />
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="flex flex-col items-center gap-4 mt-8">
                <Button size="lg" onClick={handleSave}>Save My 'Why'</Button>
                <blockquote className="text-sm italic text-muted-foreground mt-4 text-center max-w-md">
                    &ldquo;People lose their way when they lose their WHY.&rdquo;
                    <cite className="not-italic font-semibold"> - Michael Hyatt</cite>
                </blockquote>
            </div>
        </div>
    );
}