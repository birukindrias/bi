import CombinationLock from './combination_lock';
import { useStore } from '../../../../../utils/store/store';
import { Applications } from 'utils/store/settingsStore';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import LockIcon from 'assets/locked_files/lock.png';
import { secondsToTimeFormat } from 'utils/helper';
import { ENDGAME_LENGTH_IN_SECONDS } from '../../../../../utils/constants';
import { Objectives } from '../../../../../utils/store/settingsStore';
import { useTranslations } from 'next-intl';
//make an enum with page names
enum Pages {
  LOCK = 'lock',
  ENCRYPT = 'encrypt',
}

//yourdataissafewithus

const Index = () => {
  const t = useTranslations();

  const {
    setOpenApplication,
    focusApplication,
    setIsSideView,
    decryptionAttempts,
    setDecryptionAttempts,
    hashedPlainText,
    startDecryptTimer,
    stopDecryptTimer,
    timeLeft,
    addToScore,
    finishObjective,
    setGoodEnding,
    goodEnding,
    stopTimer,
    lockedFilesPopupOpen,
    setLockedFilesPopupOpen,
    combinationLockLocked,
    decryptionTimerStarted
  } = useStore();



  const [currentPage, setCurrentPage] = useState<Pages>(combinationLockLocked ? Pages.LOCK : Pages.ENCRYPT);
  const [dectyptionText, setDectyptionText] = useState<string>('');


  const endGame = () => {
    stopTimer();
    focusApplication(Applications.ENDSCREEN);
    setOpenApplication(Applications.ENDSCREEN, true);
  };

  const openOverlay = (goodEnding?: boolean) => {
    if (goodEnding) {
      setGoodEnding(true);
    } else {
      setGoodEnding(false);
    }
    setLockedFilesPopupOpen(true);
  };

  const handleBadEnd = () => {
    endGame();
  };

  const handleGoodEnd = () => {
    addToScore(100);
    finishObjective(Objectives.GET_DATA_BACK);
    endGame();
  };

  useEffect(() => {
    //only start if on encrypt page and time never started
    if (
      currentPage === Pages.ENCRYPT &&
      decryptionTimerStarted === false
    ) {
      startDecryptTimer();
    }
  }, [currentPage]);

  useEffect(() => {
    if (timeLeft < 1) {
      openOverlay(false);
    }
  }, [timeLeft]);

  const handleUnlocked = () => {
    setTimeout(() => {
      setOpenApplication(Applications.CRYPTII, true);
      focusApplication(Applications.CRYPTII);
      focusApplication(Applications.TOR);
      setIsSideView(true);
      setCurrentPage(Pages.ENCRYPT);
    }, 1000);
  };

  const handleCheckDecrypt = () => {
    if (dectyptionText === hashedPlainText) {
      openOverlay(true);
      stopDecryptTimer();
    } else if (decryptionAttempts - 1 !== 0) {
      setDecryptionAttempts(decryptionAttempts - 1);
    } else {
      openOverlay(false);
      stopDecryptTimer();
    }
  };

  const getPage = () => {
    switch (currentPage) {
      case Pages.LOCK:
        return (
          <div className="grid h-full w-full grid-cols-3 p-24">
            <div className="col-span-2 flex items-center justify-center">
              <p className="font-saira text-6xl font-bold">
                {t.rich('decryptLockTitle')}
              </p>
            </div>
            <div className="col-span-1 flex items-center justify-center">
              <CombinationLock handleUnlocked={handleUnlocked} />
            </div>
          </div>
        );
      case Pages.ENCRYPT:
        return (
          <div className="max-w-md font-lato flex flex-col justify-around h-full">
            <div className="flex space-x-8 pb-6 border-b-2 border-white">
              <div className="relative w-16 flex items-center justify-center">
                <Image src={LockIcon} />
              </div>
              <div className="">
                <p className="font-saira text-5xl font-bold">Company Data</p>
                <div className="flex items-center space-x-6 mt-6">
                  <span>{t('fileSize')}</span>
                  <span>{t('amountOfData')}</span>
                  <span className="text-red-600">Encrypted</span>
                </div>
              </div>
            </div>

            <div>
              <p>{t('decryptionTaskText')}</p>
              <span className="text-6xl font-bold mt-2 block animate-pulse endTimer">
                {secondsToTimeFormat(timeLeft)}
              </span>
            </div>

            <div className="flex flex-col">
              <span>
                {t('decryptAttemptsLeft', { attempts: decryptionAttempts })}
              </span>
              <div className="flex items-center ">
                <input
                  value={dectyptionText}
                  onChange={(e) => setDectyptionText(e.target.value)}
                  className="flex-1 mr-4 bg-black text-white border-1 border-white rounded-md mt-1"
                  type="text"
                />
                <button
                  onClick={handleCheckDecrypt}
                  className="py-2 px-3 rounded-md bg-indigo-900 hover:bg-indigo-800"
                >
                  {t('decryptButton')}
                </button>
              </div>
              {decryptionAttempts < 5 && (
                <span className="text-red-600">
                  {t('decryptWrongDecryption')}
                </span>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div
      id="lock_body"
      className="relative bg-cognito_bg bg-gradient-to-b from-purple-900 via-black to-black flex-1 flex flex-col items-center py-20 h-full overflow-auto text-white font-sourcesanspro"
    >
      {lockedFilesPopupOpen && (
        <div className="absolute top-0 left-0 h-full w-full bg-black z-20 bg-opacity-70">
          <div className="flex items-center justify-center h-full w-full flex-col space-y-8">
            <div className="text-2xl font-bold">
              {goodEnding ? t('goodEndMessage') : t('badEndMessage')}
            </div>
            <button
              onClick={() => {
                if (goodEnding) {
                  handleGoodEnd();
                } else {
                  handleBadEnd();
                }
              }}
              className="py-2 px-3 rounded-md bg-indigo-900 hover:bg-indigo-800"
            >
              {goodEnding ? t('goodEndButtonText') : t('badEndButtonText')}
            </button>
          </div>
        </div>
      )}
      {getPage()}
    </div>
  );
};

export default Index;
