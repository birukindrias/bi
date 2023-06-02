import { LayoutProps } from '../outlook/Layout';
import {
  WindowManagementSvgIcons,
  SUR5_CHAT_URL,
} from '../../../utils/constants';

import { Resizable } from 're-resizable';
import { Applications } from '../../../utils/store/settingsStore';
import LockWhiteIcon from 'assets/server_message/lock_white.png';
import Image from 'next/image';
import { useStore } from '../../../utils/store/store';
import { useTranslations } from 'next-intl';
import reactStringReplace from 'react-string-replace';
import { LayoutSizeProps } from '../tor/Layout';
import { createElement, useEffect } from 'react';

interface ServerMessageProps extends LayoutProps, LayoutSizeProps {}
const Layout = ({ focus, close, size, setSize }: ServerMessageProps) => {
  const { setOpenApplication, focusApplication, tabs, setTabs, openTorPage } =
    useStore();

  const t = useTranslations();
  const handleOpenHive = () => {
    openTorPage(SUR5_CHAT_URL);
  };



  return (
    <Resizable
      defaultSize={{
        width: 800,
        height: 600,
      }}
      size={size}
      onResizeStop={(e, direction, elt, delta) => {
        setSize((size) => ({
          height: size.height + delta.height,
          width: size.width + delta.width,
        }));
      }}
      bounds={document.getElementById('draggable_space') || undefined}
    >
      <div
        onClick={() => focus(Applications.SERVER_MESSAGE)}
        className={`flex flex-col font-inter bg-red-700 h-full `}
      >
        <div id="handle" className="flex justify-end w-full px-2 py-1">
          <div className="flex items-center space-x-1">
            {WindowManagementSvgIcons.map((icon, index) => (
              <button
                onClick={() => close()}
                key={index}
                className="w-8 h-8 flex items-center hover:bg-signal_medium_gray cursor-pointer"
              >
                <div className="w-8 h-8 font-white flex items-center  stroke-white">
                  {createElement(icon)}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 overflow-hidden px-3 py-2">
          <div className="col-span-1 w-full">
            <div className=" relative w-32 mx-auto p-4 border-2 border-white rounded-md max-w-x">
              <Image src={LockWhiteIcon} alt="" />
            </div>

            <div className="flex text-center items-center justify-center mt-8">
              <p className="text-lg text-white font-semibold">
                {t.rich('serverMessageSideTitle')}
              </p>
            </div>
          </div>
          <div className="col-span-2 overflow-hidden">
            <p className="font-semibold text-xl text-white mb-4">
              {t.rich('serverMessageTitle')}
            </p>
            <div className="h-full bg-white overflow-auto px-2">
              <div className="py-2">
                <h2 className="font-semibold mb-2">
                  {t.rich('serverMessageSubtitle1')}
                </h2>
                <p className="text-sm">{t.rich('serverMessageParageraph1')}</p>
              </div>
              <div className="py-2">
                <h2 className="font-semibold mb-2">  {t.rich('serverMessageSubtitle2')}</h2>
                <p className="text-sm">
                  {reactStringReplace(
                    //@ts-ignore
                    t.rich('serverMessageParageraph2'),
                    '[SUR5CHAT]',
                    (match, i) => {
                      return (
                        <span
                          onClick={() => handleOpenHive()}
                          className="text-blue-600 hover:underline cursor-pointer"
                        >
                          {SUR5_CHAT_URL}
                        </span>
                      );
                    }
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Resizable>
  );
};

export default Layout;
