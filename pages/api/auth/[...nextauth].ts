import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';
import { compare } from 'bcrypt';
import admin from 'firebase-admin';

export default NextAuth({
  providers: [
    // Email & Password
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        await dbConnect();

        // Find user with the email
        const user = await User.findOne({
          email: credentials?.email,
        });

        // Email Not found
        if (!user) {
          return null;
        }

        // Check hased password with DB hashed password
        const isPasswordCorrect = await compare(
          credentials!.password,
          user.hashedPassword
        );

        // Incorrect password
        if (!isPasswordCorrect) {
          return null;
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: '/LandingPage',
  },
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session, token, user }) {
      const firebaseToken = await generateFirebaseToken(
        '642dba63b5a7ae767d89962f'
      );
      session.firebaseToken = firebaseToken as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

const serviceAccount = {
  type: process.env.FIREBASE_SA_TYPE,
  project_id: process.env.FIREBASE_SA_PROJECT_ID,
  private_key_id: process.env.FIREBASE_SA_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_SA_PRIVATE_KEY
    ? process.env.FIREBASE_SA_PRIVATE_KEY.replace(/\\n/gm, '\n')
    : undefined,
  client_email: process.env.FIREBASE_SA_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_SA_CLIENT_ID,
  auth_uri: process.env.FIREBASE_SA_AUTH_URI,
  token_uri: process.env.FIREBASE_SA_TOKEN_URI,
  auth_provider_x509_cert_url:
    process.env.FIREBASE_SA_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_SA_CLIENT_X509_CERT_URL,
};

const signInWithCustomToken = async (customToken: string) => {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: customToken,
      returnSecureToken: true,
    }),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.error.message);
  }

  const { idToken, refreshToken, expiresIn } = await response.json();
  const expirationTime = new Date(new Date().getTime() + expiresIn * 1000);

  return {
    token: idToken,
    refreshToken,
    expirationTime,
  };
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });
}

async function generateFirebaseToken(userID: string) {
  try {
    const customToken = await admin.auth().createCustomToken(userID);
    return customToken;
  } catch (error) {
    console.log('Error creating custom token:', error);
  }
}
