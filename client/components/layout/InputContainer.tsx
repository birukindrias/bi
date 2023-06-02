import { ReactElement } from 'react';

type InputContainerProps = {
  children: ReactElement,
  title?: string
}

function InputContainer({children, title="Please input a title"}:InputContainerProps) {
  return (
    <div className="bg-slate-500 rounded-xl">
      <div className="bg-light-blue p-4 rounded-t-xl">
        <h3 className="text-slate-300 font-medium text-3xl text-center">{title}</h3>
      </div>
      <div className="p-2">
      {children}
      </div>
    </div>
  );
}

export default InputContainer;
