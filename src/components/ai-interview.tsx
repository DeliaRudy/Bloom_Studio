'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, BrainCircuit, Loader2 } from 'lucide-react';
import { narrateText } from '@/ai/flows/narrate-text-flow';
import { useToast } from '@/hooks/use-toast';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';

type InterviewStatus = 'idle' | 'narrating' | 'listening' | 'error';
type InterviewStep = 'idle' | 'intro' | 'why' | 'who' | 'philosophy' | 'outro';

const interviewScript: Record<InterviewStep, string> = {
    idle: "",
    intro: "Hello! I'm here to help you define your persona. We'll go through three questions. Let's start with your 'Why'. In your own words, tell me why you want to achieve your Ambition, Vision and Goals.",
    why: "Great, thank you for sharing. Now, let's talk about the 'Who'. Describe the person you need to become to achieve these goals. What traits or characteristics would they have, and what do those traits mean to you?",
    who: "Excellent. Lastly, let's define your personal philosophies. What are the core beliefs, opinions, or rules that guide you in life and work?",
    philosophy: "Perfect. I have everything I need. I'm now processing your responses and filling out the fields for you. Thank you for sharing.",
    outro: "All done! Your persona has been updated."
};


export function AIInterview({ 
    onTranscript,
 }: { 
    onTranscript: (transcript: string) => Promise<void>,
}) {
  const [audioSrc, setAudioSrc] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<InterviewStatus>('idle');
  const [interviewStep, setInterviewStep] = React.useState<InterviewStep>('idle');
  const { toast } = useToast();
  
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    hasRecognitionSupport 
  } = useSpeechRecognition();

  const advanceInterview = React.useCallback(async (currentStep: InterviewStep) => {
    let nextStep: InterviewStep;
    switch (currentStep) {
        case 'idle':       nextStep = 'intro'; break;
        case 'intro':      nextStep = 'why'; break;
        case 'why':        nextStep = 'who'; break;
        case 'who':        nextStep = 'philosophy'; break;
        case 'philosophy': nextStep = 'outro'; break;
        case 'outro':
            // End of the interview, reset state
            setInterviewStep('idle');
            setStatus('idle');
            return;
        default: return;
    }

    setInterviewStep(nextStep);
    setStatus('narrating');
    try {
        const response = await narrateText(interviewScript[nextStep]);
        if (response.media) {
            setAudioSrc(response.media); // This will auto-play and trigger handleAudioEnded
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
  }, [toast]);


  // Effect to handle transitions after listening stops
  React.useEffect(() => {
    if (status === 'listening' && !isListening && transcript) {
      // User has finished speaking.
      // 1. Process the transcript in the background (fire and forget)
      onTranscript(transcript);

      // 2. Concurrently, advance to the next interview question
      advanceInterview(interviewStep);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, transcript]); // This effect depends on the result of the speech recognition

  const handleStartInterview = () => {
    if (status === 'idle' || status === 'error') {
      advanceInterview('idle');
    }
  };

  const handleAudioEnded = () => {
    setAudioSrc(null);
    if (interviewStep === 'outro') {
        // After the final message, reset.
        advanceInterview('outro');
    } else if (hasRecognitionSupport) {
        // After a question, start listening for an answer.
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
            return <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Speaking...</>;
        case 'listening':
            return <><Mic className="mr-2 h-4 w-4 text-red-500 animate-pulse" /> Listening...</>;
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
          <p className="text-sm text-muted-foreground mt-2 p-2 bg-muted/50 rounded-md min-h-[40px]">
            {transcript || 'Speak now...'}
          </p>
      )}
      {audioSrc && (
        <audio src={audioSrc} autoPlay onEnded={handleAudioEnded} />
      )}
    </div>
  );
}
