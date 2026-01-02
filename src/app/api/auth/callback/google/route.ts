
import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { initializeFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function GET(request: NextRequest) {
    const { searchParams, protocol, host } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
        return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
    }
    if (!state) {
        return NextResponse.json({ error: 'Missing state parameter' }, { status: 400 });
    }

    try {
        const { userId } = JSON.parse(atob(state));
        if (!userId) {
            return NextResponse.json({ error: 'Invalid state: userId missing' }, { status: 400 });
        }
        
        // Dynamically construct the redirect URI to match the initial request
        const redirectURI = `${protocol}//${host}/api/auth/callback/google`;

        const oAuth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            redirectURI
        );

        const { tokens } = await oAuth2Client.getToken(code);
        const { refresh_token } = tokens;
        
        if (!refresh_token) {
             console.warn("Refresh token not received. User may have already granted consent. This is okay for subsequent sign-ins.");
        }

        const { firestore } = initializeFirebase();
        
        // Only update the refresh token if a new one was actually provided
        if (refresh_token) {
            const userDocRef = doc(firestore, `users/${userId}`);
            await setDoc(userDocRef, { googleRefreshToken: refresh_token }, { merge: true });
        }

        const appUrl = `${protocol}//${host}`;
        return NextResponse.redirect(`${appUrl}/daily-plan?status=calendar-connected`);

    } catch (error: any) {
        console.error('Error during Google OAuth callback:', error);
        return NextResponse.json({ error: 'Failed to exchange authorization code for tokens', details: error.message }, { status: 500 });
    }
}
