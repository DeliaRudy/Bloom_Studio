
'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import * as React from 'react';
import { Label } from '@/components/ui/label';
import { demoPersona } from '@/lib/demo-data';

export default function DemoPersonaDefinitionPage() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: 'Demo Mode',
      description: 'Your changes are not saved in the demo.',
    });
  };

  const paddedReasons = [
    ...Array(5).fill({ text: demoPersona.why }),
  ].slice(0, 5);
  const paddedTraits = [
    ...demoPersona.traits,
    ...Array(5 - demoPersona.traits.length).fill({ word: '', meaning: '' }),
  ].slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Define Your Persona"
        description="If your WHY is strong enough, nothing will stop you. Defining WHO you need to become gives you the character to succeed. This gives you reasons to dig deep and overcome your challenges."
      />
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-headline">
            My 'Why': I want to achieve my Ambition, Vision and Goals because...
          </CardTitle>
          <CardDescription>
            Write at least 5 reasons WHY you want to achieve your Ambition,
            Vision and Goals.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paddedReasons.map((reason, index) => (
            <div key={index} className="flex items-center gap-4">
              <span className="text-lg font-semibold text-muted-foreground">
                {index + 1}.
              </span>
              <Input
                type="text"
                defaultValue={reason.text}
                placeholder="Enter your reason here..."
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-headline">
            My 'Who': The person I need to become
          </CardTitle>
          <CardDescription>
            Choose at least 5 words that define who you need to become. Explain
            what each word means to you.
            <br />
            <span className="text-xs text-muted-foreground">
              Example words: passionate, inspirational, famous, fit, healthy,
              successful, brave, calm, patient, great, kind, determined,
              considerate, energetic, renowned, respected, unstoppable,
              motivational, committed.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {paddedTraits.map((trait, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start"
            >
              <div className="flex items-center gap-4 md:col-span-1">
                <span className="text-lg font-semibold text-muted-foreground">
                  {index + 1}.
                </span>
                <Input
                  type="text"
                  defaultValue={trait.word}
                  placeholder="Trait (e.g., Brave)"
                />
              </div>
              <div className="md:col-span-2">
                <Textarea
                  defaultValue={trait.meaning}
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
            Define your personal philosophies, your own beliefs and opinions on
            the different facets of life. Defined philosophies give you clarity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="personal-philosophies">My Philosophies</Label>
            <Textarea
              id="personal-philosophies"
              placeholder="Write your philosophies here..."
              defaultValue={demoPersona.philosophies}
              className="resize-none h-48 leading-loose bg-transparent"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(to bottom, hsl(var(--border)) 0 1px, transparent 1px 2rem)',
                lineHeight: '2rem',
                backgroundAttachment: 'local',
              }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center gap-4 mt-8">
        <Button size="lg" onClick={handleSave}>
          Save My Persona
        </Button>
        <blockquote className="text-sm italic text-muted-foreground mt-4 text-center max-w-md">
          &ldquo;Success is not what you have, but who you are.&rdquo;
          <cite className="not-italic font-semibold"> - Bo Bennett</cite>
        </blockquote>
      </div>
    </div>
  );
}
