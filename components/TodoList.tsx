import Link from 'next/link';
import { useState } from 'react';
import { Todo as TodoType } from '../utils/types';
import SearchBar from './SearchBar';
import Todo from './Todo';
import { searchContext } from '@/context/searchContext';
import { useContext } from 'react';
import app from '@/lib/firebase/initFirebase';
import signInwithToken from '@/lib/firebase/signIntoFirebase';
import { useSession } from 'next-auth/react';
import { getDatabase, ref, onValue } from 'firebase/database';

interface IndexProps {
  todos: Array<TodoType>;
}

enum Filter {
  All = 'all',
  Completed = 'completed',
  Incomplete = 'incomplete',
}

const TodoList = (props: IndexProps) => {
  const { todos } = props;
  const { data: session } = useSession();
  const [filter, setFilter] = useState<Filter>(Filter.All);
  // const [searchVal, setSearchVal] = useState<string>('');
  const { searchString } = useContext(searchContext);

  const changeFilter = (event: any) => {
    const filterVal = event.target.value;
    if (Filter.All === filterVal) {
      setFilter(Filter.All);
    } else if (Filter.Completed === filterVal) {
      setFilter(Filter.Completed);
    } else {
      setFilter(Filter.Incomplete);
    }
  };

  const getFirebaseData = async () => {
    await signInwithToken({
      token: session!.firebaseToken,
    });

    const db = getDatabase(app);
    const projectsRef = ref(db, 'projects/' + '642dba63b5a7ae767d89962f');
    onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
    });
  };

  const comparator = (todo: any, idx: number): boolean => {
    switch (filter) {
      case Filter.All:
        return todo.item.includes(searchString) ? true : false;
      case Filter.Completed:
        return todo.completed && todo.item.includes(searchString)
          ? true
          : false;
      case Filter.Incomplete:
        return !todo.completed && todo.item.includes(searchString)
          ? true
          : false;
    }
  };
  const getFilteredTodos = (todos: any) => todos.filter(comparator);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <div className="h-100 h-100 w-full flex items-center justify-center font-sans">
        <div className="bg-white rounded shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg text-center">
          <div className="mb-4">
            <button onClick={getFirebaseData}>Get firebase data</button>
            <h1 className="text-black font-semibold">
              <span className="text-xl text-stone-500">Todo</span>List
            </h1>
          </div>
          {/* setSearch={setSearchVal} */}
          <SearchBar />
          <div className="flex flex-row">
            <h2 className="mt-6 mr-5">Filter: </h2>
            <button
              onClick={changeFilter}
              value="all"
              className={`flex-no-shrink p-2 border-2 rounded  text-black border-black
               hover:text-white hover:bg-gray-700 m-5 ${
                 filter === Filter.All ? 'bg-gray-700 text-white' : ''
               }`}
            >
              All
            </button>
            <button
              onClick={changeFilter}
              value="completed"
              className={`flex-no-shrink p-2 border-2 rounded  text-black border-black
               hover:text-white hover:bg-gray-700 m-5 ${
                 filter === Filter.Completed ? 'bg-gray-700 text-white' : ''
               }`}
            >
              Completed
            </button>
            <button
              onClick={changeFilter}
              value="incomplete"
              className={`flex-no-shrink p-2 border-2 rounded  text-black border-black
               hover:text-white hover:bg-gray-700 m-5 ${
                 filter === Filter.Incomplete ? 'bg-gray-700 text-white' : ''
               }`}
            >
              Uncompleted
            </button>
          </div>
          <div className="mb-4 justify-items-end"></div>
          <div className=" text-left">
            {getFilteredTodos(todos).map((todo: any) => (
              <Todo
                todoItem={todo.item}
                isCompleted={todo.completed}
                isShared={todo.shared}
                key={todo._id}
                todoID={todo._id}
              />
            ))}
          </div>

          <div className="mt-4">
            <Link href="/todos/create">
              <button
                className="flex-no-shrink p-2 border-2 rounded  text-black border-black
               hover:text-white hover:bg-gray-700 mt-5 "
              >
                Create a New Todo
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
