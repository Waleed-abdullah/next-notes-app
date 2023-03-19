import Link from 'next/link';
import { Todo as TodoType } from '../utils/types';
import Todo from './Todo';

interface IndexProps {
  todos: Array<TodoType>;
}

const TodoList = (props: IndexProps) => {
  const { todos } = props;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <div className="h-100 h-100 w-full flex items-center justify-center font-sans">
        <div className="bg-white rounded shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg text-center">
          <div className="mb-4">
            <h1 className="text-black font-semibold">
              <span className="text-xl text-stone-500">Todo</span>List
            </h1>
          </div>
          <div className=" text-left">
            {todos.map((todo: any) => (
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
