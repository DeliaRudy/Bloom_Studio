'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, BrainCircuit, Loader2 } from 'lucide-react';
import { narrateText } from '@/ai/flows/narrate-text-flow';
import { useToast } from '@/hooks/use-toast';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { cn } from '@/lib/utils';

type InterviewStatus = 'idle' | 'narrating' | 'listening' | 'processing' | 'error';

export function AIInterview({ 
    introText,
    onTranscript,
 }: { 
    introText: string,
    onTranscript: (transcript: string) => void,
}) {
  const [audioSrc, setAudioSrc] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<InterviewStatus>('idle');
  const { toast } = useToast();
  
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    hasRecognitionSupport 
  } = useSpeechRecognition();

  // Effect to handle transitions after listening stops
  React.useEffect(() => {
    if (status === 'listening' && !isListening) {
      setStatus('processing');
      // Simulate processing and then pass transcript to parent
      setTimeout(() => {
          onTranscript(transcript);
          setStatus('idle');
      }, 1500); // Simulate processing time
    }
  }, [isListening, status, transcript, onTranscript]);

  const handleStartInterview = async () => {
    setStatus('narrating');
    setAudioSrc(null);
    try {
      const response = await narrateText(introText);
      if (response.media) {
        setAudioSrc(response.media); // This will auto-play
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
      setStatus('error');
    }
  };

  const handleAudioEnded = () => {
    setAudioSrc(null);
    if(hasRecognitionSupport) {
        setStatus('listening');
        startListening();
    } else {
        toast({
            title: "Speech Recognition Not Supported",
            description: "Your browser doesn't support speech recognition.",
            variant: 'destructive'
        });
        setStatus('idle');
    }
  };

  const renderButtonContent = () => {
    switch(status) {
        case 'narrating':
            return <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Preparing...</>;
        case 'listening':
            return <><Mic className="mr-2 h-4 w-4 text-red-500 animate-pulse" /> Listening...</>;
        case 'processing':
            return <><BrainCircuit className="mr-2 h-4 w-4 animate-spin" /> Processing...</>;
        case 'error':
             return <>Error, Try Again</>;
        case 'idle':
        default:
            return <><Mic className="mr-2 h-4 w-4" /> Start AI Interview</>;
    }
  };

  return (
    <div>
      <Button onClick={handleStartInterview} disabled={status !== 'idle' && status !== 'error'}>
        {renderButtonContent()}
      </Button>
      {status === 'listening' && (
          <p className="text-sm text-muted-foreground mt-2 p-2 bg-muted/50 rounded-md">
            {transcript || 'Speak now...'}
          </p>
      )}
      {audioSrc && (
        <audio src={audioSrc} autoPlay onEnded={handleAudioEnded} />
      )}
    </div>
  );
}
