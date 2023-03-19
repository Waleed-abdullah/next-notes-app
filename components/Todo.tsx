import Link from 'next/link';
const Todo = (props: any) => {
  const { todoItem } = props;
  const { isCompleted } = props;
  const { todoID } = props;
  const { isShared } = props;

  return (
    <div className="flex mb-4 items-center border-b-black   border-b-2 mt-2">
      <Link className="flex mb-4 items center w-full" href={`/todos/${todoID}`}>
        {isCompleted ? (
          <p className="w-full text-grey-darkest line-through">{todoItem}</p>
        ) : (
          <p className="w-full text-grey-darkest">{todoItem}</p>
        )}
        <h3 className="flex-no-shrink p-2 ml-4 mr-2 text-slate-700">
          {isCompleted ? 'Done' : 'Incomplete'}
          {isShared ? ' ,Shared' : ''}
        </h3>
      </Link>
    </div>
  );
};

export default Todo;
