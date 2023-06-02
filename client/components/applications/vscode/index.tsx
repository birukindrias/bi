import classNames from 'classnames';
import Image from 'next/image';
import { useState } from 'react';
import Draggable from 'react-draggable';
import VSCodeLogo from 'assets/vscode/logo.png';
import Layout from './Layout';
import { useStore } from '../../../utils/store/store';
import { Applications } from 'utils/store/settingsStore';
const Index = () => {
  const { focusApplication, appInFocus, openApplications, setOpenApplication } =
    useStore();

  const [size, setSize] = useState({
    height: 700,
    width: 1200,
  });
  const handleOpen = () => {
    if (!openApplications[Applications.VSCODE]) {
      setOpenApplication(Applications.VSCODE, true);
    }
    focusApplication(Applications.VSCODE);
  };

  return (
    <div className="h-full w-full">
      <div
        className={classNames(
          'p-1 rounded-md w-12 h-12 flex items-center leading-[0] cursor-pointer',
          {
            'bg-slate-400': openApplications[Applications.VSCODE],
          }
        )}
      >
        <button onClick={() => handleOpen()}>
          <Image
            className="rounded-md "
            alt=""
            src={VSCodeLogo} /* width={900} height={900} */
          ></Image>
        </button>
      </div>
      {openApplications[Applications.VSCODE] && (
        <Draggable
          defaultPosition={{ x: 0, y: 0 }}
          bounds="#draggable_space"
          handle="#handle"
        >
          <div
            className={classNames('absolute top-0 left-0', {
              'z-30': appInFocus == Applications.VSCODE,
              'z-0': appInFocus != Applications.VSCODE,
            })}
          >
            <Layout
             setSize={setSize}
              size={size}
              focus={focusApplication}
              close={() => setOpenApplication(Applications.VSCODE, false)}
            />
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default Index;
