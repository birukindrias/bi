import Image from 'next/image';
import TorLogo from 'assets/tor/application_logo.svg';
import { useStore } from '../../../utils/store/store';
const Connect = () => {
  const {setConnected, setTabs} = useStore()

  const connect = () => {
    setConnected(true)
    setTabs([{
      id: 1,
      page: "New Page",
      active: true,
      loading: false
    }])
  }

  return (
    <div className="flex flex-col mt-8 items-center h-full text-white font-sourcesanspro">
      <div className="flex flex-col justify-center">
        <div className='flex'>
          <div className="relative h-16  w-16 grayscale">
            <Image alt="" layout="fill" src={TorLogo} />
          </div>
          <div className="ml-4  mt-3 text-tor_extra_light_gray">
            <h1 className="font-thin text-4xl">Connect to Tor</h1>
            <p className="mt-8 text-lg">
              Tor Browser routes your traffic over the Tor Network, run by
              thousands of volunteers around the world
            </p>
          </div>
        </div>

        <div className="text-white font-bold flex w-full items-center justify-end mt-8 space-x-2">
          <button className="py-2 px-4 bg-tor_light_gray rounded-lg">
            Tor Network Settings
          </button>
          <button onClick={() => connect()} className="py-2 px-4 bg-tor_bright_lila rounded-lg hover:bg-tor_dark_lila">Connect</button>
        </div>
      </div>
    </div>
  );
};

export default Connect;
