import classNames from 'classnames';
import { MouseEvent, ReactElement } from 'react';


type ButtonProps = {
  children: string | ReactElement;
  color?: "green" | "red" | "primary" | "secondary"
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
};

function Button({
  children,
  color = "primary",
  type = "button",
  onClick,
  disabled,
}: ButtonProps) {
  const getColor = (): string => {
    switch (color) {
      case "red":
        return "border-transparent text-white bg-red-500 hover:bg-red-600 focus:ring-red-400";
      case "green":
        return "border-transparent text-white bg-green-500 hover:bg-green-600 focus:ring-green-400";
      case "secondary":
        return "border-transparent text-white bg-green-500 hover:bg-green-600 focus:ring-green-400";
      default:
        return "border-transparent text-white bg-green-500 hover:bg-green-600 focus:ring-green-400";
    }
  };

  return (
    <button
      disabled={disabled}
      onClick={
        onClick
          ? (e) => onClick(e)
          : () => {
              console.log("I need a task");
            }
      }
      type={type}
      className={classNames(
        disabled
          ? "bg-gray-200 text-gray-800 border-transparent cursor-not-allowed"
          : getColor(),
        " inline-flex justify-center items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium  focus:outline-none focus:ring-2 focus:ring-offset-2 w-full h-full"
      )}
    >
      <span className="sr-only">{children}</span>
      {children}
    </button>
  );
}

export default Button;
