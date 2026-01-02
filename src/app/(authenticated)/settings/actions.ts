
'use server';
import { generateAvatar, type GenerateAvatarInput } from '@/ai/flows/generate-avatar';

export async function generateAvatarAction(input: GenerateAvatarInput): Promise<{ imageUrl?: string; error?: string }> {
    try {
        const result = await generateAvatar(input);
        if (!result.imageUrl) {
            throw new Error("The AI service did not return an image URL.");
        }
        return { imageUrl: result.imageUrl };
    } catch (e: any) {
        console.error('Error in generateAvatarAction:', e);
        return { error: e.message || 'An unexpected error occurred during avatar generation.' };
    }
}
