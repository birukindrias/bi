import classNames from 'classnames';
import Image from 'next/image';
import { useStore } from '../../../utils/store/store';
import Layout from './Layout';
import Draggable from 'react-draggable';
import { useEffect, useState } from 'react';
import TorLogo from 'assets/tor/logo.png';
import { Applications } from 'utils/store/settingsStore';
const Index = () => {
  const {
    focusApplication,
    appInFocus,
    openApplications,
    setOpenApplication,
    isSideView,
  } = useStore();

  const [size, setSize] = useState({
    height: 700,
    width: 1200,
  });
  const [position, setPosition] = useState({ x: 0, y: 0 });


  useEffect(() => {
    if (isSideView) {
      let draggable = document.getElementById('draggable_space');

      let width = draggable?.offsetWidth;

      setPosition({
        x: 0,
        y: 0,
      });
      setSize((size) => {
        return {
          ...size,
          width: (width || size.width) / 2,
        };
      });
    }
  }, [isSideView]);
  const handleOpen = () => {
    if (!openApplications[Applications.TOR]) {
      setOpenApplication(Applications.TOR, true);
    }
    focusApplication(Applications.TOR);
  };

  return (
    <div className="h-full w-full">
      <div
        className={classNames(
          'p-1 rounded-md w-12 h-12 leading-[0] cursor-pointer',
          {
            'bg-slate-400': appInFocus === Applications.TOR,
          }
        )}
      >
        <button onClick={() => handleOpen()}>
          <Image
            className="rounded-md "
            alt=""
            src={TorLogo} /* width={900} height={900} */
          ></Image>
        </button>
      </div>
      {openApplications[Applications.TOR] && (
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
              'z-30': appInFocus == Applications.TOR,
              'z-0': appInFocus != Applications.TOR,
            })}
          >
            <Layout
              size={size}
              setSize={setSize}
              focus={focusApplication}
              close={() => setOpenApplication(Applications.TOR, false)}
            />
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default Index;
