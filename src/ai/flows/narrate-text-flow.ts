'use server';
/**
 * @fileOverview This file defines a flow for generating speech from text.
 *
 * - narrateText - A function that converts text to speech audio.
 * - NarrateTextInput - The input type for the function.
 * - NarrateTextOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import wav from 'wav';

const NarrateTextInputSchema = z.string();
export type NarrateTextInput = z.infer<typeof NarrateTextInputSchema>;

const NarrateTextOutputSchema = z.object({
  media: z.string().describe("The generated audio as a data URI in WAV format."),
});
export type NarrateTextOutput = z.infer<typeof NarrateTextOutputSchema>;

export async function narrateText(input: NarrateTextInput): Promise<NarrateTextOutput> {
  return narrateTextFlow(input);
}

// Helper function to convert PCM audio buffer to WAV format as a base64 string.
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (chunk) => {
      bufs.push(chunk);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const narrateTextFlow = ai.defineFlow(
  {
    name: 'narrateTextFlow',
    inputSchema: NarrateTextInputSchema,
    outputSchema: NarrateTextOutputSchema,
  },
  async (query) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: query,
    });
    if (!media?.url) {
      throw new Error('No media returned from TTS model');
    }
    
    // The model returns audio data in PCM format as a data URI.
    // We need to extract the base64 part and convert it to a WAV.
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    const wavBase64 = await toWav(audioBuffer);

    return {
      media: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);
