import CognitoLogo from 'assets/cognito_files/logo.png';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Spinner from 'components/icons/Spinner';
import classNames from 'classnames';
import { useStore } from '../../../../../utils/store/store';
import { Objectives } from 'utils/store/settingsStore';
const Index = () => {
  const {
    downloading,
    setDownloading,
    preparingDownload,
    setPreparingDownload,
    setShowDownloads,
    finishObjective,
    addToScore,
    objectives,
  } = useStore();

  useEffect(() => {
    if (
      objectives.find((c) => c.name === Objectives.FIND_ONION_ADDRESS)?.done ===
      false
    ) {
      finishObjective(Objectives.FIND_ONION_ADDRESS);
      addToScore(30);
    }
  }, []);

  const startDownload = () => {
    if (!downloading) {
      setPreparingDownload(true);
      setTimeout(() => {
        setPreparingDownload(false);
        setShowDownloads(true);
        setDownloading(true);
      }, 5000);
    }
  };

  return (
    <div className="bg-cognito_bg flex-1 flex flex-col items-center py-20 h-full overflow-auto text-white font-sourcesanspro">
      <div>
        <div className="relative w-20 mx-auto">
          <Image alt="" src={CognitoLogo} />
        </div>
        <h1 className="text-4xl text-center py-2 font-joan">Cognito files</h1>
      </div>
      <div className="mt-8 text-center w-full flex flex-col">
        <h2 className="text-lg font-bold">Anonymous File Upload</h2>
        <div className="relative max-w-sm mx-auto mt-2">
          {preparingDownload && (
            <div className="h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
              <Spinner />
            </div>
          )}
          {downloading ? (
            <p className="py-2 px-8 rounded-md bg-white bg-opacity-20 ">
              Your download started...
            </p>
          ) : (
            <p
              onClick={() => startDownload()}
              className={classNames(
                'py-2 px-8 bg-white bg-opacity-20 hover:bg-opacity-30   rounded-md w-full mx-auto cursor-pointer',
                {
                  'opacity-30': preparingDownload,
                }
              )}
            >
              {'Download (531,243MB)'}
            </p>
          )}
        </div>
      </div>

      <div className="text-sm mt-4">
        <p>Upload your files anonymously and free on Cognito Files</p>
        <p>We offer you 20 GB filestze limit and unli mited bandwidth</p>
      </div>
    </div>
  );
};

export default Index;
