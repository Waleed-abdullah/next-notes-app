import axios from 'axios';
import useSWR from 'swr';
import Loader from '@/components/Loader';
import NavBar from '@/components/NavBar';
import { useState } from 'react';
import SearchBar from '@/components/SearchBar';

const fetcher = (url: any) => {
  return axios.get(url).then((res) => res.data);
};

const SharedTodos = () => {
  const { data: todos, error } = useSWR('/api/todos/getSharedTodos', fetcher);
  const [searchVal, setSearchVal] = useState<string>('');

  if (!todos) {
    return <Loader />;
  }

  const getFilteredTodos = (todos: any) =>
    todos.filter((todo: any) => todo.item.includes(searchVal));
  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
        <div className="h-100 h-100 w-full flex items-center justify-center font-sans">
          <div className="bg-white rounded shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg text-center">
            <div className="mb-4">
              <h1 className="text-black font-semibold">
                Shared <span className="text-xl text-stone-500">Todo</span>List
              </h1>
            </div>
            <SearchBar setSearch={setSearchVal} />
            <div className=" text-left">
              {getFilteredTodos(todos).map((todo: any) => (
                <div
                  key={todo._id}
                  className="flex mb-4 items-center border-b-black   border-b-2 mt-2"
                >
                  {todo.completed ? (
                    <p className="w-full text-grey-darkest line-through">
                      {todo.item}
                    </p>
                  ) : (
                    <p className="w-full text-grey-darkest">{todo.item}</p>
                  )}
                  <h3 className="flex-no-shrink p-2 ml-4 mr-2 text-slate-700">
                    {todo.completed ? 'Done' : 'Incomplete'}
                    {todo.shared ? ' ,Shared' : ''}
                    {` ,Shared By: ${todo.belongsTo}`}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SharedTodos;
