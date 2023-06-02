import { useRef, useEffect } from 'react';

interface IOutsideClickHandlerProps {
  onOutsideClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const OutsideClickHandler = ({children, onOutsideClick, className}: IOutsideClickHandlerProps) => {
  const handleClickOutside = (event: MouseEvent) => {
    const { current: element } = ref;
    if (element && !element.contains(event.target as Node)) {
      onOutsideClick();
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ref = useRef<HTMLDivElement>(null);
  return <div className={className && className}  ref={ref}>{children}</div>;
};

export default OutsideClickHandler;
