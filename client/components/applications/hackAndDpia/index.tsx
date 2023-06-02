import classNames from 'classnames';
import Image from 'next/image';
import Draggable from 'react-draggable';
import { Applications } from '../../../utils/store/settingsStore';
import HackLogo from 'assets/hack/logo.png';
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

      let draggable = document.getElementById('draggable_space');
      let height = draggable?.offsetHeight;
      let width = draggable?.offsetWidth;

      if (width && height) {
        setSize({
          height: height*0.9,
          width: width * 0.8,
        });

        setPosition({
          x: width * 0.1,
          y: 0
        })
      }



  }, [isSideView]);
  const handleOpen = () => {
    if (!openApplications[Applications.HACK_DPIA]) {
      setOpenApplication(Applications.HACK_DPIA, true);
    }
    focusApplication(Applications.HACK_DPIA);
  };
  return (
    <div className="h-full w-full">
      <div
        className={classNames(
          'p-1 rounded-md w-12 h-12 leading-[0] cursor-pointer',
          {
            'bg-slate-400': appInFocus === Applications.HACK_DPIA,
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
            src={HackLogo} /* width={900} height={900} */
          ></Image>
        </button>
      </div>
      {openApplications[Applications.HACK_DPIA] && (
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
              'z-30': appInFocus == Applications.HACK_DPIA,
              'z-0': appInFocus != Applications.HACK_DPIA,
            })}
          >
            <Layout
              focus={focusApplication}
              close={() => setOpenApplication(Applications.HACK_DPIA, false)}
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
