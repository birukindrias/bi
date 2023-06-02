import { ReactElement } from "react";
type FormProps = {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: ReactElement;
};

function Form({ handleSubmit, children }: FormProps) {
  return (
    <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col mx-8 my-4">
      {children}
    </form>
  );
}

export default Form;
