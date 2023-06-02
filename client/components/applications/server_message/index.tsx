import classNames from 'classnames';
import Image from 'next/image';
import { Applications } from '../../../utils/store/settingsStore';
import { useStore } from '../../../utils/store/store';
import LockLogo from 'assets/server_message/lock_white.png';
import Draggable from 'react-draggable';
import Layout from './Layout';
import { useEffect, useState } from 'react';
const Index = () => {
  const { focusApplication, appInFocus, openApplications, setOpenApplication } =
    useStore();

  const [size, setSize] = useState({
    height: 600,
    width: 800,
  });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleOpen = () => {
    if (!openApplications[Applications.SERVER_MESSAGE]) {
      setOpenApplication(Applications.SERVER_MESSAGE, true);
    }
    focusApplication(Applications.SERVER_MESSAGE);
  };

  useEffect(() => {
    let draggable = document.getElementById('draggable_space');
    let height = draggable?.offsetHeight;
    let width = draggable?.offsetWidth;
    if (width && height) {
      setSize({
        height: height * 0.8,
        width: width * 0.5,
      });

      setPosition({
        x: width * 0.25,
        y: height * 0.1,
      })
    }
  }, []);

  return (
    <div className="h-full w-full">
      <div
        className={classNames(
          'p-1 rounded-md w-12 h-12 flex items-center leading-[0] cursor-pointer bg-red-700',
          {
            'bg-slate-400': appInFocus === Applications.SERVER_MESSAGE,
          }
        )}
      >
        <button className="py-1 px-1 flex" onClick={() => handleOpen()}>
          <Image
            className="rounded-md "
            alt=""
            src={LockLogo} /* width={900} height={900} */
          ></Image>
        </button>
      </div>
      {openApplications[Applications.SERVER_MESSAGE] && (
        <Draggable
          position={position}
          onStop={(e, data) => {
            setPosition({
              x: data.x,
              y: data.y,
            });
          }}
          defaultPosition={{ x: 0, y: 0 }}
          bounds="#draggable_space"
          handle="#handle"
        >
          <div
            className={classNames('absolute top-0 left-0', {
              'z-30': appInFocus == Applications.SERVER_MESSAGE,
              'z-0': appInFocus != Applications.SERVER_MESSAGE,
            })}
          >
            <Layout
              size={size}
              setSize={setSize}
              focus={focusApplication}
              close={() =>
                setOpenApplication(Applications.SERVER_MESSAGE, false)
              }
            />
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default Index;
