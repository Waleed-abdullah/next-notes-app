import { useRouter } from 'next/router';
import { FormEvent, FormEventHandler, useRef } from 'react';
import { Todo } from '../../utils/types';
import { useSession } from 'next-auth/react';
import NavBar from '@/components/NavBar';

// Define props
interface CreateProps {
  url: string;
}

// Define Component
function Create(props: CreateProps) {
  // get the next route
  const router = useRouter();
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  console.log('Email while creation', userEmail);

  // since there is just one input we will use a uncontrolled form
  const item = useRef<HTMLInputElement>(null);

  // Function to create new todo
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    // construct new todo, create variable, check it item.current is not null to pass type checks
    let todo: Todo = {
      item: '',
      completed: false,
      shared: false,
      belongsTo: userEmail as string,
    };
    if (null !== item.current) {
      todo['item'] = item.current.value;
    } else {
      return;
    }

    // Make the API request
    await fetch(props.url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...todo }),
    });

    // after api request, push back to main page
    router.push('/homepage');
  };
  if (!session) {
    return (
      <p className="flex items-center text-center text-5xl m-auto">
        Access Denied
      </p>
    );
  }
  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
        <div className="h-100 h-100 w-full flex items-center justify-center font-sans">
          <div className="bg-white rounded shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg text-center">
            <div className="mb-4">
              <h1 className="text-black font-semibold">
                Create a New{' '}
                <span className="text-xl text-stone-500">Todo</span>
              </h1>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
                type="text"
                ref={item}
                placeholder="Add todo"
              ></input>
              <input
                className="flex-no-shrink p-2 border-2 rounded text-black border-black
               hover:text-white hover:bg-gray-700 mt-5  "
                type="submit"
                value="create todo"
              ></input>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

// export getStaticProps to provie API_URL to component
export async function getStaticProps(context: any) {
  return {
    props: {
      url: process.env.API_URL,
    },
  };
}

// export component
export default Create;
