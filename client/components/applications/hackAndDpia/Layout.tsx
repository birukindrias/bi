import React from 'react';
import { WindowManagementSvgIcons } from '../../../utils/constants';
import { Resizable } from 're-resizable';
import { Applications, Objectives } from '../../../utils/store/settingsStore';
import { LayoutProps } from '../outlook/Layout';
import Image from 'next/image';
import HackLogo from 'assets/hack/logo.png';
import { useTranslations } from 'next-intl';
import { useStore } from '../../../utils/store/store';
import Hack from "./hack"
import DPIA from "./dpia"
export interface Size {
  height: number;
  width: number;
}
interface CryptiiProps extends LayoutProps {
  size: Size;
  setSize: (value: Size | ((prevVar: Size) => Size)) => void;
}
const Layout = ({ close, focus, size, setSize }: CryptiiProps) => {
  const t = useTranslations();

  const { objectives } = useStore();

  return (
    <Resizable
      onResizeStop={(e, direction, elt, delta) => {
        setSize((size) => ({
          height: size.height + delta.height,
          width: size.width + delta.width,
        }));
      }}
      size={size}
      defaultSize={{
        width: 800,
        height: 600,
      }}
      bounds={document.getElementById('draggable_space') || undefined}
    >
      <div
        onClick={() => focus(Applications.HACK_DPIA)}
        className={`flex flex-col font-inter bg-white h-full `}
      >
        <div id="handle" className="flex justify-between w-full px-2 py-1">
          <div className="flex items-center">
            <div className="w-8 flex items-center">
              <Image className="" alt="" src={HackLogo} />
            </div>
            <p className="text-sm ml-1">Wireshark</p>
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
        <div className="bg-cryptii_bg flex-1 flex flex-col items-center h-full overflow-auto text-white border-2 border-white shadow-lg">
          {objectives.find((o) => o.name === Objectives.HACK_DECISION)?.done ? (
           <DPIA/>
          ) : (
            <Hack/>
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default Layout;
