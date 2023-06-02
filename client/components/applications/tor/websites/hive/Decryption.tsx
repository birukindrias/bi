import KeyLockIcon from 'assets/hive/key_lock.png';
import Image from 'next/image';
import LockIcon from 'assets/hive/lock.png';
import EyeIcon from 'assets/hive/eye.png';
import { useTranslations } from 'next-intl';
import { useStore } from '../../../../../utils/store/store';
import { useState, useEffect, useRef } from 'react';
import { addMinutes, secondsToTimeFormat } from '../../../../../utils/helper';
const Decryption = () => {
  const t = useTranslations();
  const { gameStartedTime } = useStore();
  const timeRef = useRef(useStore.getState().gameTimeInSeconds);

  const [timeDisclosed, setTimeDisclosed] = useState('Today');

  useEffect(() => {
    let date = new Date(gameStartedTime);
    let newTime = addMinutes(date, 25 )
    setTimeDisclosed(new Date(newTime).toLocaleString());
  }, [gameStartedTime]);

  useEffect(() => {
    useStore.subscribe(
      (state) => state.gameTimeInSeconds,
      (gameTimeInSeconds) => (timeRef.current = gameTimeInSeconds)
    );
  })

  return (
    <div className="flex flex-col items-center justify-between py-8 h-full">
      <div className="flex-none">
        <p className="text-3xl text-center">{t('sur5_right_sidebar_title')}</p>
        <div className="flex flex-col items-center mt-12">
          <div className="relative w-28 flex justify-center ">
            <Image src={KeyLockIcon} alt="" />
          </div>
          <p className="my-4 w-64 text-sm text-center">
            {t('sur5_right_sidebar_paragraph')}
          </p>
          {/* <button className="bg-red-600 my-4 text-sm border border-black rounded-md py-2 px-8 hover:text-white hover:border-white ">
            {t('sur5_right_sidebar_button')}
          </button> */}
        </div>
      </div>
      <div className="flex-1 px-12 flex items-end w-full">
        <div className="grid grid-cols-2 w-full mb-12">
          <div className="flex flex-col justify-around py-2 px-6 col-span-1 border border-black rounded-md rounded-tr-none rounded-br-none h-full w-full">
            <p className="text-xl text-center">
              {t('sur5_right_sidebar_encrypted_title')}
            </p>
            <div className="flex items-center justify-between h-24 max-h-24">
              <div className="">
                {/* <p className="text-sm">14 July 2021</p> */}
                <p className="text-2xl">
                  {t('sur5_right_sidebar_encrypted_date')}
                </p>
              </div>
              <div>
                <Image src={LockIcon} alt="" />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-around py-2 px-4 col-span-1 border border-black rounded-md rounded-tl-none rounded-bl-none h-full w-full border-l-0 ">
            <p className="text-xl text-center">
              {t('sur5_right_sidebar_disclosed_title')}
            </p>
            <div className="flex items-center justify-between h-24 max-h-24">
              <div>
                {/* <p className="text-sm">30 August 2021</p> */}
                {gameStartedTime && <p className="text-2xl"> {secondsToTimeFormat(timeRef.current)}</p>}
              </div>
              <div>
                <Image src={EyeIcon} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Decryption;
