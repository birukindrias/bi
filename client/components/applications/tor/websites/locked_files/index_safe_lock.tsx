import { useEffect, useState } from 'react';
import $ from 'jquery';
import Draggable from 'gsap/dist/Draggable';
import { gsap } from 'gsap';
import classNames from 'classnames';

const Index = () => {
  var firstNum = 1,
    secondNum = 2,
    thirdNum = 3;

  const defaultLockData = {
    dial: false,
    numPassed: 0,
    _lastAngle: 0,
    _angle: 0,
    _dir: 0,
    _lastNr: 0,
    _numbers: 0,
    _reset: 0,
    _Dir: -1,
    _step: 1,
  };
  const [combo, setCombo] = useState([firstNum, secondNum, thirdNum]);
  const [comboState, setComboState] = useState([false, false, false]);
  const [unlocked, setUnlocked] = useState(false);
  const [lockData, setLockData] = useState(defaultLockData);

  useEffect(() => {
    gsap.registerPlugin(Draggable);
    if (typeof window !== 'undefined') {
      Draggable.create('.dial', {
        type: 'rotation',

        onDrag: () => findAngle(),
        onRelease: () => {
          findCombo();
        },
        throwProps: true,
      });
    }
    for (var i = 0; i < combo.length; ++i) {
      if (combo[i] >= 40) {
        setCombo((state) => [...state, (combo[i] = 0)]);
        //  combo[i] = 0
      }
      // $('.num' + (i + 1)).html(combo[i].toString());
    }
  }, []);

  const reset = () => {

    setLockData(defaultLockData);
    setComboState((state) => [...state.map(() => false)]);
  };

  const findCombo = function () {
    var ticks = 40,
      tickAngle = 360 / ticks,
      numOffset = 0.5,
      i: any,
      j;
    if (lockData._dir == lockData._Dir && lockData._step) {
      for (i = 0; i < combo.length; ++i) {

        if (comboState[i] == false) {
          if (
            lockData._angle >= (combo[i] - numOffset) * tickAngle &&
            lockData._angle <= (combo[i] + numOffset) * tickAngle
          ) {
            setComboState((state) => {
              return [...state.map((_, index) => (index === i ? true : false))];
            });

            setLockData((state) => ({ ...state, _lastNr: combo[i] }));
            if (i == combo.length - 1) {
              // on unlock
              setUnlocked(true);
              setTimeout(function () {
                setUnlocked(false);
                // then lock again
                reset();
              }, 2400);
            }
          }
          break;
        }
      }
      if (i == 0) {
        setLockData((state) => ({ ...state, _step: 0, _Dir: 1 }));
      } else {
        setLockData((state) => ({ ...state, _Dir: -1 }));
      }
    }
  };

  const findAngle = () => {
    var dial = $('.dial'),
      dialTrans = dial.css('transform'),
      ticks = 40,
      tickAngle = 360 / ticks,
      numOffset = 0.5,
      matrixVal = dialTrans.split('(')[1].split(')')[0].split(','),
      cos1 = matrixVal[0],
      sin = matrixVal[1],
      negSin = matrixVal[2],
      cos2 = matrixVal[3];

    let newAngle =
      -Math.atan2(parseFloat(sin), parseFloat(cos1)) * (180 / Math.PI);
    setLockData((state) => ({ ...state, _angle: newAngle }));

    if (newAngle < 0) newAngle += 360;

    let newDir = 0;

    //nach links drehen macht winkel größer, nach rechts drehen kleiner
    if (lockData._lastAngle < newAngle) {
      newDir = 1
    }
    else if (lockData._lastAngle > newAngle) {
      newDir = -1
    }

    let newReset = lockData._reset;
    if (lockData._lastAngle < 90 && newAngle > 270) {
      // reset
      newDir = -1;
      newReset++;

      if (newReset > 1) reset();
    } else if (newAngle < 90 && lockData._lastAngle > 270) {
      newReset = 0;
      newDir = 1;
    }

    let newStep = lockData._step;
    if (newDir == 1) {
      switch (lockData._step) {
        case 0:
          if (lockData._lastNr > Math.floor(newAngle / 9)) newStep = 2;
          break;
        case 2:
          if (lockData._lastNr < Math.floor(newAngle / 9)) newStep = 1;
          break;
      }
    }
    if (newDir && newDir != lockData._Dir) {
      if (Math.abs(lockData._lastAngle - newAngle) > 2) reset();
    }
    setLockData((state) => ({
      ...state,
      _lastAngle: newAngle,
      // _angle: newAngle,
      _dir: newDir,
      _step: newStep,
      _reset: newReset,
    }));
  };

  return (
    <div
      id="lock_body"
      className="bg-cognito_bg bg-gradient-to-b from-purple-900 via-black to-black flex-1 flex flex-col items-center py-20 h-full overflow-auto text-white font-sourcesanspro"
    >
      <div className="grid h-full w-full grid-cols-2 p-24">
        <div className="col-span-1 flex items-center justify-center">
          <p className="text-6xl font-bold">
            This data is locked <br /> Go away!
          </p>
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <div className="container">
            <div className="lock">
              <div
                className={classNames('shackle', {
                  unlocked: unlocked,
                })}
              >
                <div
                  className={classNames('top', {
                    pivot1: unlocked,
                  })}
                >
                  <div
                    className={classNames('inner', {
                      pivot2: unlocked,
                    })}
                  ></div>
                </div>
                <div
                  className={classNames('left', {
                    moveRight: unlocked,
                  })}
                >
                  <div
                    className={classNames('dentL', {
                      moveLeft: unlocked,
                    })}
                  ></div>
                  <div
                    className={classNames('dentR', {
                      moveLeft: unlocked,
                    })}
                  ></div>
                </div>
                <div className="right"></div>
              </div>
              <div className="arrow"></div>
            </div>
            <div
              className="dial"
              style={{
                transform: 'translate3d(0px, 0px, 0px)',
                userSelect: 'none',
                touchAction: 'none',
              }}
            >
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
              <div className="tick"></div>
            </div>
          </div>
        </div>
        <div className="combo">
          <span className="num1">{combo[0]}</span>
          <span className="num2">{combo[1]}</span>
          <span className="num3">{combo[2]}</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
