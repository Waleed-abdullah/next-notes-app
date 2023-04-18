import TodoList from '@/components/TodoList';
import { Todo } from '../utils/types';
import { getSession, useSession } from 'next-auth/react';
import NavBar from '@/components/NavBar';
import axios from 'axios';
import useSWR from 'swr';
import Loader from '@/components/Loader';
import signInWithToken from '../lib/firebase/signIntoFirebase';
import admin from 'firebase-admin';

const fetcher = (params: any) => {
  const [url, email] = params;
  return axios
    .get(url, {
      headers: {
        Authentication: email,
      },
    })
    .then((res) => res.data);
};

const HomePage = () => {
  const { data: session } = useSession();
  const { data, error } = useSWR(['/api/todos', session?.user?.email], fetcher);

  if (!data && !session) {
    return (
      <p className="flex items-center text-center text-5xl m-auto">
        Access Denied
      </p>
    );
  }

  if (!data) {
    return <Loader />;
  }
  console.log('Data', data);

  console.log(session);
  return (
    <>
      <NavBar />
      <TodoList todos={data} />
    </>
  );
};

export default HomePage;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

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

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
  }

  const getDataFromFirebase = (projectRef: string) => {
    return new Promise((resolve) => {
      const firebaseDb = admin.database();
      const refVal = firebaseDb.ref(projectRef);
      refVal.once('value', (snapshot) => {
        const data = snapshot.val();
        resolve(data);
      });
    });
  };

  const projectData = await getDataFromFirebase(
    `projects/642dba63b5a7ae767d89962f`
  );

  return {
    props: {
      projectData,
    },
  };
}
