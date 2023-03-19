import TodoList from '@/components/TodoList';
import { Todo } from '../utils/types';
import { useSession } from 'next-auth/react';
import NavBar from '@/components/NavBar';
import { useContext, useEffect } from 'react';
import { emailContext } from '@/context/context';
import axios from 'axios';
import useSWR from 'swr';
import Loader from '@/components/Loader';

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
  const { userEmail, updateEmail } = useContext(emailContext);
  const { data, error } = useSWR(['/api/todos', session?.user?.email], fetcher);
  console.log(session);

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
