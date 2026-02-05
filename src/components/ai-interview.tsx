'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import { narrateText } from '@/ai/flows/narrate-text-flow';
import { useToast } from '@/hooks/use-toast';

export function AIInterview({ introText }: { introText: string }) {
  const [audioSrc, setAudioSrc] = React.useState<string | null>(null);
  const [isNarrating, setIsNarrating] = React.useState(false);
  const { toast } = useToast();

  const handleStartInterview = async () => {
    setIsNarrating(true);
    setAudioSrc(null);
    try {
      const response = await narrateText(introText);
      if (response.media) {
        setAudioSrc(response.media);
      } else {
        throw new Error('No audio media returned.');
      }
    } catch (error) {
      console.error("Narration failed", error);
      toast({
        title: 'Narration Failed',
        description: 'Could not generate audio at this time.',
        variant: 'destructive',
      });
    } finally {
      setIsNarrating(false);
    }
  };

  return (
    <div>
      <Button onClick={handleStartInterview} disabled={isNarrating}>
        <Mic className="mr-2 h-4 w-4" />
        {isNarrating ? 'Thinking...' : 'Start AI Interview'}
      </Button>
      {audioSrc && (
        <audio src={audioSrc} autoPlay onEnded={() => setAudioSrc(null)} />
      )}
    </div>
  );
}
