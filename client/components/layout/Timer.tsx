import { useStore } from '../../utils/store/store';
import { secondsToTimeFormat } from '../../utils/helper';
import { useEffect, useRef } from 'react';
const Timer = () => {

  const timeRef = useRef(useStore.getState().gameTimeInSeconds);

  useEffect(() => {
    useStore.subscribe(
      (state) => state.gameTimeInSeconds,
      (gameTimeInSeconds) => (timeRef.current = gameTimeInSeconds)
    );
  }, []);

  return (
    <div className="flex space-x-2 px-3 py-2 rounded-md bg-slate-600 items-center">
      <p className="text-white"> {secondsToTimeFormat(timeRef.current)}</p>
    </div>
  );
};

export default Timer;
