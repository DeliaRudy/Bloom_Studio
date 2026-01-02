
import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

export async function GET() {
  const redirectURI = process.env.GOOGLE_REDIRECT_URI;

  if (!redirectURI) {
    return NextResponse.json({ error: 'Google Redirect URI not configured' }, { status: 500 });
  }

  const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectURI
  );

  // Generate the url that will be used for the consent dialog.
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline', // 'offline' grants a refresh token
    scope: [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events'
    ],
  });

  return NextResponse.redirect(authorizeUrl);
}
