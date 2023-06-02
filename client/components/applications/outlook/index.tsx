import Image from 'next/image';
import classNames from 'classnames';
import { useState, useEffect } from 'react';
import OutlookLogo from 'assets/outlook/logo.png';
import Draggable from 'react-draggable';
import Layout from './Layout';
import { useStore } from 'utils/store/store';
import { Applications } from 'utils/store/settingsStore';
const Index = () => {
  const [unread, setUnread] = useState(0);

  const [size, setSize] = useState({
    height: 700,
    width: 1200,
  });
  const {
    focusApplication,
    appInFocus,
    openApplications,
    setOpenApplication,
    emails,
  } = useStore();
  const handleOpen = () => {
    if (!openApplications[Applications.OUTLOOK]) {
      setOpenApplication(Applications.OUTLOOK, true);
    }
    focusApplication(Applications.OUTLOOK);
  };

  useEffect(() => {
    let unread = 0;
    emails.forEach((email) => {
      if (!email.read) {
        unread++;
      }
    });
    setUnread(unread);
  }, [emails]);

  return (
    <div className="h-full w-full">
      <div
        className={classNames(
          'p-1 rounded-md w-12 h-12 flex items-center leading-[0] cursor-pointer',
          {
            'bg-slate-400': appInFocus === Applications.OUTLOOK,
          }
        )}
      >
        <button className="relative" onClick={() => handleOpen()}>
          {unread > 0 && (
            <div className="absolute -top-2 -right-2 font-bold text-white bg-red-600 p-3 flex items-center justify-center z-40 rounded-full h-3 w-3">
              {unread}
            </div>
          )}
          <Image
            className="rounded-md "
            alt=""
            src={OutlookLogo} /* width={900} height={900} */
          ></Image>
        </button>
      </div>
      {openApplications[Applications.OUTLOOK] && (
        <Draggable
          defaultPosition={{ x: 0, y: 0 }}
          bounds="#draggable_space"
          handle="#handle"
        >
          <div
            className={classNames('absolute top-0 left-0', {
              'z-30': appInFocus == Applications.OUTLOOK,
              'z-0': appInFocus != Applications.OUTLOOK,
            })}
          >
            <Layout
              size={size}
              setSize={setSize}
              focus={focusApplication}
              close={() => setOpenApplication(Applications.OUTLOOK, false)}
            />
          </div>
        </Draggable>
      )}
    </div>
  );
};
export default Index;
