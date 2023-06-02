import classNames from 'classnames';
import Image from 'next/image';
import Draggable from 'react-draggable';
import { Applications } from '../../../utils/store/settingsStore';
import CryptiiLogo from 'assets/cryptii/logo.png';
import Layout from './Layout';
import { useStore } from '../../../utils/store/store';
import { useState, useEffect } from 'react';
const Index = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({
    height: 600,
    width: 800,
  });
  const {
    focusApplication,
    appInFocus,
    openApplications,
    setOpenApplication,
    isSideView,
  } = useStore();

  useEffect(() => {
    if (isSideView) {
      let draggable = document.getElementById('draggable_space');
      let height = draggable?.offsetHeight;
      let width = draggable?.offsetWidth;

      setSize((size) => {
        return {
          height: (height || size.height),
          width: (width || size.width) / 2,
        };


      });

      setPosition({ x: (width || size.width) / 2, y: 0 });
    }
  }, [isSideView]);
  const handleOpen = () => {
    if (!openApplications[Applications.CRYPTII]) {
      setOpenApplication(Applications.CRYPTII, true);
    }
    focusApplication(Applications.CRYPTII);
  };
  return (
    <div className="h-full w-full">
      <div
        className={classNames(
          'p-1 rounded-md w-12 h-12 leading-[0] cursor-pointer',
          {
            'bg-slate-400': appInFocus === Applications.CRYPTII,
          }
        )}
      >
        <button
          className="flex items-center justify-center h-full"
          onClick={() => handleOpen()}
        >
          <Image
            className="rounded-md "
            alt=""
            src={CryptiiLogo} /* width={900} height={900} */
          ></Image>
        </button>
      </div>
      {openApplications[Applications.CRYPTII] && (
        <Draggable
          onStop={(e, data) => {
            setPosition({ x: data.x, y: data.y });
          }}
          position={position}
          defaultPosition={{ x: 200, y: 20 }}
          bounds="#draggable_space"
          handle="#handle"
        >
          <div
            className={classNames('absolute top-0 left-0', {
              'z-30': appInFocus == Applications.CRYPTII,
              'z-0': appInFocus != Applications.CRYPTII,
            })}
          >
            <Layout
              focus={focusApplication}
              close={() => setOpenApplication(Applications.CRYPTII, false)}
              size={size}
              setSize={setSize}
            />
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default Index;
