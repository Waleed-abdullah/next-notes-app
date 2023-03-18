import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { EmailProvider } from '../context/context';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <EmailProvider>
        <Component {...pageProps} />
      </EmailProvider>
    </SessionProvider>
  );
}
