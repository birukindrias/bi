import Image from 'next/image';
import ApplicationLogo from 'assets/outlook/app_logo.png';
import { WindowManagementSvgIcons } from 'utils/constants';
import MenuLine from './MenuLine';
import InnerMainLayout from './InnerLayoutItems';
import React, { useEffect, useState } from 'react';
import { Resizable } from 're-resizable';
import { Applications } from 'utils/store/settingsStore';
import { LayoutSizeProps } from '../tor/Layout';
import { useStore } from '../../../utils/store/store';
import { IEmail } from './InnerLayoutItems/index';
export interface LayoutProps {
  close: () => void;
  focus: (a: Applications) => void;
}

interface OutlookLayoutProps extends LayoutSizeProps, LayoutProps {}

const Layout = ({ close, focus, size, setSize }: OutlookLayoutProps) => {
  const { emails } = useStore();

  const [activeMail, setActiveMail] = useState<IEmail | undefined>(emails[0] ?? undefined);

  useEffect(() => {
    let draggable = document.getElementById('draggable_space');
    let height = draggable?.offsetHeight;
    let width = draggable?.offsetWidth;
    if (width && height) {
      setSize({
        height,
        width,
      });
    }
  }, []);

  return (
    <Resizable
      defaultSize={{
        width: 1400,
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
        onClick={() => focus(Applications.OUTLOOK)}
        className="flex flex-col font-opensans bg-white h-full relative"
      >
        <div
          id="handle"
          className="flex justify-between px-2 py-1 bg-outlook_blue"
        >
          <div className="flex items-center">
            <div className="w-5 flex items-center">
              <Image className="" alt="" src={ApplicationLogo} />
            </div>
            <p className="text-sm ml-5 text-white">Outlook</p>
          </div>
          <div className="flex items-center space-x-1">
            {WindowManagementSvgIcons.map((icon, index) => (
              <button
                onClick={() => close()}
                key={index}
                className="w-8 h-8 flex items-center hover:bg-outlook_blue_gray cursor-pointer"
              >
                <div className="w-8 h-8 font-white flex items-center  stroke-white hover:stroke-outlook_blue">
                  {React.createElement(icon)}
                </div>
              </button>
            ))}
          </div>
        </div>
        <MenuLine activeMail={activeMail} />
        {/* Main Part */}
        <InnerMainLayout
          mails={emails}
          setActiveMail={setActiveMail}
          activeMail={activeMail}
        />
      </div>
    </Resizable>
  );
};
export default Layout;
