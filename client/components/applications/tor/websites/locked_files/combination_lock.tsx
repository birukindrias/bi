import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { COMBINATION_LOCK_CODE } from '../../../../../utils/constants';
import { useStore } from '../../../../../utils/store/store';


interface CombinationLockProps {
  handleUnlocked: () => void;
}

const CombinationLock = ({handleUnlocked}:CombinationLockProps) => {
  const {combinationLockLocked, setCombinationLockLocked} = useStore()
  const [wheel, setWheel] = useState([0, 0, 0, 0]);

  useEffect(() => {
    let wheelString = wheel.join('');
    if (wheelString === COMBINATION_LOCK_CODE) {
      setCombinationLockLocked(false);
    } else {
      setCombinationLockLocked(true);
    }
  }, [wheel])


  useEffect(() => {
    if(combinationLockLocked === false ) {
      handleUnlocked()
    }
  }, [combinationLockLocked])


  const handleWheelInput = (index: number, direction: 'inc' | 'dec') => {
    if (direction === 'inc') {
      if (wheel[index] === 9) {
        setWheel((state) => {
          const newState = [...state];
          newState[index] = 0;
          return newState;
        });
      } else {
        setWheel((state) => {
          const newState = [...state];
          newState[index] += 1;
          return newState;
        });
      }
    }

    if (direction === 'dec') {
      if (wheel[index] === 0) {
        setWheel((state) => {
          const newState = [...state];
          newState[index] = 9;
          return newState;
        });
      } else {
        setWheel((state) => {
          const newState = [...state];
          newState[index] -= 1;
          return newState;
        });
      }
    }


  };


  return (
    <main>
      <div id="combo-lock">
        <div
          id="indicator"
          className={classNames('', {
            locked: combinationLockLocked,
            unlocked: !combinationLockLocked,
          })}
        >
          <svg
            className="locked"
            version="1.1"
            id="Lock"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 20 20"
            enableBackground="new 0 0 20 20"
            xmlSpace="preserve"
          >
            <path
              d="M15.8,8H14V5.6C14,2.703,12.665,1,10,1C7.334,1,6,2.703,6,5.6V8H4C3.447,8,3,8.646,3,9.199V17
    c0,0.549,0.428,1.139,0.951,1.307l1.197,0.387C5.672,18.861,6.55,19,7.1,19H12.9c0.549,0,1.428-0.139,1.951-0.307l1.196-0.387
    C16.571,18.139,17,17.549,17,17V9.199C17,8.646,16.352,8,15.8,8z M12,8H8V5.199C8,3.754,8.797,3,10,3c1.203,0,2,0.754,2,2.199V8z"
            />
          </svg>
          <svg
            className="unlocked"
            version="1.1"
            id="Lock_open"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 20 20"
            enableBackground="new 0 0 20 20"
            xmlSpace="preserve"
          >
            <path
              d="M15.8,8H14V5.6C14,2.703,12.665,1,10,1C7.334,1,6,2.703,6,5.6V6h2V5.199C8,3.754,8.797,3,10,3c1.203,0,2,0.754,2,2.199V8H4
    C3.447,8,3,8.646,3,9.199V17c0,0.549,0.428,1.139,0.951,1.307l1.197,0.387C5.672,18.861,6.55,19,7.1,19H12.9
    c0.549,0,1.428-0.139,1.951-0.307l1.196-0.387C16.571,18.139,17,17.549,17,17V9.199C17,8.646,16.352,8,15.8,8z"
            />
          </svg>
        </div>
        <div id="combination">
          {wheel.map((value, index) => {
            return (
              <div key={index} className="wheel">
                <div
                  onClick={() => handleWheelInput(index, 'inc')}
                  className="increment"
                  id="0"
                >
                  <svg
                    version="1.1"
                    id="Chevron_small_up"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="0 0 20 20"
                    enableBackground="new 0 0 20 20"
                    xmlSpace="preserve"
                  >
                    <path
                      fill="#fff"
                      d="M6.582,12.141c-0.271,0.268-0.709,0.268-0.978,0c-0.269-0.268-0.272-0.701,0-0.969l3.908-3.83
              c0.27-0.268,0.707-0.268,0.979,0l3.908,3.83c0.27,0.267,0.27,0.701,0,0.969c-0.271,0.268-0.709,0.268-0.979,0L10,9L6.582,12.141z"
                    />
                  </svg>
                </div>
                <input
                readOnly
                  className="digit"
                  id="0"
                  type="number"
                  value={wheel[index]}
                  min="0"
                  max="9"
                />
                <div
                  onClick={() => handleWheelInput(index, 'dec')}
                  className="decrement"
                  id="0"
                >
                  <svg
                    version="1.1"
                    id="Chevron_small_down"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="0 0 20 20"
                    enableBackground="new 0 0 20 20"
                    xmlSpace="preserve"
                  >
                    <path
                      fill="#fff"
                      d="M13.418,7.859c0.271-0.268,0.709-0.268,0.978,0c0.27,0.268,0.272,0.701,0,0.969l-3.908,3.83
                c-0.27,0.268-0.707,0.268-0.979,0l-3.908-3.83c-0.27-0.267-0.27-0.701,0-0.969c0.271-0.268,0.709-0.268,0.978,0L10,11L13.418,7.859z
                "
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default CombinationLock;
