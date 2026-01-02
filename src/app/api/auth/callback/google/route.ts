
import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { initializeFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
        return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
    }
    if (!state) {
        return NextResponse.json({ error: 'Missing state parameter' }, { status: 400 });
    }

    try {
        const { userId } = JSON.parse(Buffer.from(state, 'base64').toString('ascii'));
        if (!userId) {
            return NextResponse.json({ error: 'Invalid state: userId missing' }, { status: 400 });
        }
        
        const redirectURI = process.env.GOOGLE_REDIRECT_URI;
        const oAuth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            redirectURI
        );

        const { tokens } = await oAuth2Client.getToken(code);
        const { refresh_token } = tokens;
        
        if (!refresh_token) {
             // This happens if the user has already granted consent and a refresh token wasn't re-issued.
             // You might redirect with a message, or if you need it, force re-consent.
            console.warn("Refresh token not received. User may have already granted consent.");
            // For this flow, we will proceed and assume a token might already exist.
        }

        // Initialize server-side Firestore
        const { firestore } = initializeFirebase();
        
        // Securely store the refresh token in the user's document
        const userDocRef = doc(firestore, `users/${userId}`);
        await setDoc(userDocRef, { googleRefreshToken: refresh_token }, { merge: true });

        // Redirect user back to the daily planner page
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
        return NextResponse.redirect(`${appUrl}/daily-plan?status=calendar-connected`);

    } catch (error: any) {
        console.error('Error during Google OAuth callback:', error);
        return NextResponse.json({ error: 'Failed to exchange authorization code for tokens', details: error.message }, { status: 500 });
    }
}
