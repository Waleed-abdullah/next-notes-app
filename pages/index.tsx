import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
// define the page component
function Index() {
  const { status } = useSession() as any;
  const router = useRouter();

  useEffect(() => {
    if (status !== 'authenticated') {
      router.push('/LandingPage');
    } else {
      router.push('/homepage');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default Index;
