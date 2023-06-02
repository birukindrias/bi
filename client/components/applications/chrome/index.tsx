import classNames from 'classnames';
import Image from 'next/image';
import { useState } from 'react';
import Draggable from 'react-draggable';

import { useStore } from '../../../utils/store/store';
import ChromeLogo from 'assets/chrome/logo.png';
import Layout from './Layout';
import { Applications } from 'utils/store/settingsStore';
const Index = () => {
  const { focusApplication, appInFocus, openApplications, setOpenApplication } = useStore();
  const handleOpen = () => {
    if (!openApplications[Applications.CHROME]) {
      setOpenApplication(Applications.CHROME,true);
    }
    focusApplication(Applications.CHROME);
  };
  return (
    <div className="h-full w-full">
      <div
        className={classNames(
          'p-1 rounded-md w-12 h-12 leading-[0] cursor-pointer',
          {
            'bg-slate-400': openApplications[Applications.CHROME],
          }
        )}
      >
        <button onClick={() => handleOpen()}>
          <Image
            className="rounded-md "
            alt=""
            src={ChromeLogo} /* width={900} height={900} */
          ></Image>
        </button>
      </div>
      {openApplications[Applications.CHROME] && (
        <Draggable
          defaultPosition={{ x: 200, y: 20 }}
          bounds="#draggable_space"
          handle="#handle"
        >
          <div
            className={classNames('absolute top-0 left-0', {
              'z-30': appInFocus == Applications.CHROME,
            })}
          >
            <Layout
              focus={focusApplication}
              close={() => setOpenApplication(Applications.CHROME,false)}
            />
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default Index;
