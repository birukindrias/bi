import Image from 'next/image';
import { Resizable } from 're-resizable';
import { WindowManagementSvgIcons } from 'utils/constants';
import * as React from 'react';
import { LayoutProps } from '../outlook/Layout';
import 'cross-fetch/polyfill';
import fetch from 'cross-fetch';
import { useEffect } from 'react';
import { Applications } from 'utils/store/settingsStore';
const Layout = ({ close, focus }: LayoutProps) => {
  const [buffer, setBuffer] = React.useState('<p>Loading...</p>');

  const load = async () => {
    fetch('://google.com')
      .then((result) => {
        return result.arrayBuffer();
      })
      .then((content) => {
        const enc = new TextDecoder('utf-8');
        setBuffer(enc.decode(content));
      });
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Resizable
      defaultSize={{
        width: 800,
        height: 600,
      }}
    >
      <div
        onClick={() => focus(Applications.CHROME)}
        className={`flex flex-col font-inter bg-white h-full `}
      >
        <div id="handle" className="flex justify-between w-full px-2 py-1">
          <div className="flex items-center">
            <div className="w-8 flex items-center">
              {/* <Image className="" alt="" src={ApplicationLogo} /> */}
            </div>
            <p className="text-sm ml-1">Chrome</p>
          </div>
          <div className="flex items-center space-x-1">
            {WindowManagementSvgIcons.map((icon, index) => (
              <button
                onClick={() => close()}
                key={index}
                className="w-8 h-8 flex items-center hover:bg-signal_medium_gray cursor-pointer"
              >
                <div className="w-8 h-8 font-white flex items-center  stroke-signal_dark_gray">
                  {React.createElement(icon)}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Resizable>
  );
};

export default Layout;
