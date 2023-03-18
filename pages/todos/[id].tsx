import { Todo } from '../../utils/types';
import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';

// Define Prop Interface
interface ShowProps {
  todo: Todo;
  url: string;
}

// Define Component
function Show(props: ShowProps) {
  // get the next router, so we can use router.push later
  const router = useRouter();
  // set the todo as state for modification
  const [todo, setTodo] = useState<Todo>(props.todo);

  // function to complete a todo
  const handleComplete = async () => {
    if (!todo.completed) {
      // make copy of todo with completed set to true
      const newTodo: Todo = { ...todo, completed: true };
      // make api call to change completed in database
      await fetch(props.url + '/' + todo._id, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
        },
        // send copy of todo with property
        body: JSON.stringify(newTodo),
      });
      // once data is updated update state so ui matches without needed to refresh
      setTodo(newTodo);
    }
    // if completed is already true this function won't do anything
  };

  // function for handling clicking the delete button
  const handleDelete = async () => {
    await fetch(props.url + '/' + todo._id, {
      method: 'delete',
    });
    //push user back to main page after deleting
    router.push('/');
  };

  const setShared = async () => {
    const isShared = todo.shared;
    const newTodo: Todo = { ...todo, shared: !isShared };
    // make api call to change completed in database
    await fetch(props.url + '/' + todo._id, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      // send copy of todo with property
      body: JSON.stringify(newTodo),
    });
    setTodo(newTodo);
  };

  //return JSX
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <div className="h-100 h-100 w-full flex items-center justify-center font-sans">
        <div className="bg-white rounded shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg text-center">
          <div className="mb-4">
            <h1 className="text-black font-semibold">
              Choose <span className="text-xl text-stone-500">Todo</span>{' '}
              Options
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center space-x-3">
            <h1>{todo.item}</h1>
            <div className="flex flex-row items-center justify-center space-x-3">
              <h2 className="flex-no-shrink p-2 border-b-2 text-black border-black ">
                {todo.completed ? 'Completed' : 'Incomplete'}
              </h2>
              <button
                className="flex-no-shrink p-2 border-2 rounded text-black border-black
               hover:text-white hover:bg-gray-700 mt-5 "
                onClick={handleComplete}
              >
                Complete
              </button>
              <button
                className="flex-no-shrink p-2 border-2 rounded text-black border-black
               hover:text-white hover:bg-gray-700 mt-5 "
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="flex-no-shrink p-2 border-2 rounded text-black border-black
               hover:text-white hover:bg-gray-700 mt-5 "
                onClick={() => {
                  router.push('/');
                }}
              >
                Go Back
              </button>
              <button
                className="flex-no-shrink p-2 border-2 rounded text-black border-black
               hover:text-white hover:bg-gray-700 mt-5 "
                onClick={setShared}
              >
                {!todo.shared ? 'Share' : 'Unshare'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Define Server Side Props
export async function getServerSideProps(context: any) {
  // fetch the todo, the param was received via context.query.id
  const res = await fetch(process.env.API_URL + '/' + context.query.id);
  const todo = await res.json();

  //return the serverSideProps the todo and the url from out env variables for frontend api calls
  return { props: { todo, url: process.env.API_URL } };
}

// export component
export default Show;
