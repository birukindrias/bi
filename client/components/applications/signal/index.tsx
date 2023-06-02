import SignalLogo from 'assets/signal/logo.png'; // 900x900
import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Applications } from 'utils/store/settingsStore';
import { useStore } from 'utils/store/store';
import Layout from './Layout';
const Index = () => {
  const [unread, setUnread] = useState(0);

  const {
    focusApplication,
    appInFocus,
    openApplications,
    setOpenApplication,
    chats,
  } = useStore();
  const handleOpen = () => {
    if (!openApplications[Applications.SIGNAL]) {
      setOpenApplication(Applications.SIGNAL, true);
    }
    focusApplication(Applications.SIGNAL);
  };
  useEffect(() => {
    let unread = 0;
    chats.forEach((chat) => {
      unread += chat.unreadCount;
    });
    setUnread(unread);
  }, [chats]);
  return (
    <div className="h-full w-full">
      <div
        className={classNames(
          'p-1 rounded-md w-12 h-12 leading-[0] cursor-pointer',
          {
            'bg-slate-400': appInFocus === Applications.SIGNAL,
          }
        )}
      >
        <button className="relative " onClick={() => handleOpen()}>
          {unread > 0 && (
            <div className="absolute -top-2 -right-2 font-bold text-white bg-red-600 p-3 flex items-center justify-center z-40 rounded-full h-3 w-3">
              {unread}
            </div>
          )}
          <Image
            className="rounded-md h-12"
            alt=""
            src={SignalLogo} /* width={900} height={900} */
          ></Image>
        </button>
      </div>
      {openApplications[Applications.SIGNAL] && (
        <Draggable
          defaultPosition={{ x: 200, y: 20 }}
          bounds="#draggable_space"
          handle="#handle"
        >
          <div
            className={classNames('absolute top-0 left-0', {
              'z-30': appInFocus == Applications.SIGNAL,
              'z-0': appInFocus != Applications.SIGNAL,
            })}
          >
            <Layout
              focus={focusApplication}
              close={() => setOpenApplication(Applications.SIGNAL, false)}
            />
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default Index;
