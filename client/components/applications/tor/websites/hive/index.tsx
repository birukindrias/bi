import Logo from 'assets/hive/logo.png';
import Image from 'next/image';
import Chat from './Chat';
import Description from './Description';
import Decryption from './Decryption';
import { useEffect, useState} from 'react';
import { useStore } from '../../../../../utils/store/store';
import { Objectives } from 'utils/store/settingsStore';
import { SERVER_URL } from 'utils/constants';
import { XIcon } from '@heroicons/react/outline';

const Index = () => {
  const { addToScore, settingsId, objectives, finishObjective } = useStore();

  let serverProfileImageUrl = `${SERVER_URL}/settings/images/${settingsId}/sur_attachment.png`;
  const [showPreview, setShowPreview] = useState(false);
  useEffect(() => {
    if (
      objectives.find((c) => c.name === Objectives.FIND_RANSOM_GROUP)?.done ===
      false
    ) {
      finishObjective(Objectives.FIND_RANSOM_GROUP);
      addToScore(100);
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full overflow-auto">
        {showPreview && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black w-full h-full z-10 bg-opacity-70">
          <div className='relative flex items-center justify-center h-full overflow-scroll'>
            <div className='absolute top-2 right-2'><XIcon className='text-white h-12 cursor-pointer hover:bg-gray-400 rounded-md' onClick={() => setShowPreview(false)}/></div>
            <img src={serverProfileImageUrl}></img>
          </div>
        </div>
      )}
      <div className="bg-hive_medium_blue w-full py-3 px-6 flex items-center ">
        <div className="w-8 h-8 relative flex items-center justify-center">
          <Image alt="" src={Logo} />
        </div>
        <p className="text-white ml-2 text-2xl font-light">Sur5</p>
      </div>
      <div className="grid grid-cols-5 w-full h-full font-montserrat overflow-hidden">
        <div className="col-span-1 bg-hive_dark_blue overflow-auto">
          <Description openPreview={() => setShowPreview(true)}  />
        </div>
        <div className="col-span-2 bg-hive_light_blue overflow-hidden">
          <Chat openPreview={() => setShowPreview(true)} />
        </div>
        <div className="col-span-2 bg-hive_orange overflow-auto">
          <Decryption />
        </div>
      </div>
    </div>
  );
};

export default Index;
