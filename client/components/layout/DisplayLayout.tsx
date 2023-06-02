import Display from 'assets/2_display.png';
import Background from 'assets/1_background.png';
import Image from 'next/image';
import Timer from './Timer';
import Signal from '../applications/signal';
import Outlook from '../applications/outlook';
import VSCode from '../applications/vscode';
import ServerMessage from '../applications/server_message';
import Tor from '../applications/tor';
import { useStore } from '../../utils/store/store';
import { Applications } from '../../utils/store/settingsStore';
import Cryptii from '../applications/cryptii';
import HackDpia from '../applications/hackAndDpia';
import DevLayout from './DevLayout';
import ParticleBackground from './ParticleBackground';
import { useTranslations } from 'next-intl';
import Endscreen from '../applications/endscreen';
import { IMAGE_URL } from '../../utils/constants';
import { useEffect, useState } from 'react';
const DisplayLaout = () => {
  const t = useTranslations();

  const [showDemoMode, setShowDemoMode] = useState(false);
  useEffect(() => {
    if (t('demoMode') === 'yes') {
      setShowDemoMode(true);
    }
  },[t])
  const { openApplications, currentBid, settingsId } = useStore();
  return (
    <div className="h-screen w-screen bg-zinc-600 ">
      <div className="absolute z-10 h-screen w-screen overflow-hidden">
        <Image
          alt="background"
          layout="fill"
          src={Background}
          width={1920}
          height={1080}
        ></Image>
      </div>

      {t('demoMode') === 'yes' && <DevLayout />}

      <div className="relative z-20 w-full max-w-screen-2xl mx-auto h-full ">
        <div className="p-[1.8%] flex justify-center items-center box-border overflow-auto max-w-full h-[calc(100vh)]">
          <div className="relative w-full pb-[55%] bg-slate-400 z-20 overflow-hidden">
            <div className="absolute top-0 opacity-70 left-0 bg-gradient-to-b bg-opacity-5 from-slate-200 h-16 w-full"></div>

            {/* Screen Content */}

            <div className="absolute top-0 left-0 w-full h-full ">
              <div className="absolute top-0 left-0 w-full h-full ">
                <ParticleBackground
                  backgroundColor={t('backgroundImageHexColor')}
                />
              </div>
              <div className="absolute top-6 right-4 h-12  mr-2 flex overflow-hidden">
                <img
                  alt=""
                  src={encodeURI(IMAGE_URL + settingsId + '/logo.png')}
                />
              </div>
              <div className="relative h-full w-full flex flex-col">
                <div id="draggable_space" className="h-full">
                  {/* Empty but important for layout and draggability */}
                </div>
                <div className="flex  justify-between bg-slate-300 px-4 py-2 h-16 z-40">
                  <div className="flex items-center space-x-8">
                    <Signal />
                    <Outlook />
                    <VSCode />
                    <HackDpia />
                    <ServerMessage />
                    {/* <Chrome /> */}
                    <Tor />
                    <Cryptii />

                    {/* {openApplications[Applications.HACK] && <Hack />}
                    {openApplications[Applications.DPIA] && <DPIA />} */}
                    {openApplications[Applications.ENDSCREEN] && <Endscreen />}
                  </div>
                  <div className="flex items-center space-x-1">
                    <div>
                      {currentBid.bid > 0 && (
                        <div className="flex space-x-2 px-3 py-2 rounded-md bg-slate-600 items-center">
                          <p className="text-white">{`Current Bid: ${currentBid.bid}`}</p>
                        </div>
                      )}
                    </div>
                    <Timer />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Image
            className=""
            objectFit="contain"
            layout="fill"
            alt="monitor display"
            src={Display}
            width={1920}
            height={1080}
          />
        </div>
      </div>
    </div>
  );
};

export default DisplayLaout;
