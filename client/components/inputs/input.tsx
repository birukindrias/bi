import  classNames  from "classnames";
import { HTMLAttributes } from 'react';
type InputProps = {
  type?: string;
  placeholder?: string;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fullSize?: boolean;
  className?: string
};

function Input({
  type = "text",
  placeholder = "",
  value,
  handleChange,
  fullSize = false,
  className
}: InputProps) {
  return (
    <input
      value={value}
      onChange={(e) => handleChange(e)}
      type={type}
      className={classNames(
        fullSize ? "w-full h-full" : "",
        "rounded-md px-4 mb-4 placeholder-gray-400 border-light-blue border-2 text-lg",
        className
      )}
      placeholder={placeholder}
    ></input>
  );
}

export default Input;
