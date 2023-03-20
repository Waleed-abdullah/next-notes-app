import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { SearchProvider } from '@/context/searchContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <SearchProvider>
        <Component {...pageProps} />
      </SearchProvider>
    </SessionProvider>
  );
}
