import Image from 'next/image';
import SearchIcon from 'assets/signal/search.svg';
import { useTranslations } from 'next-intl';

const SearchBar = () => {

  const t = useTranslations();
  return (
    <div className="flex py-4 items-center pl-2 ">

    <div className='flex flex-auto'>
      <div className='bg-signal_medium_gray py-1 rounded-full w-full mx-2 flex'>
        <div className="flex items-center w-6 ml-2">
          <Image alt="" src={SearchIcon}></Image>
        </div>
        <input
          className="w-full bg-transparent text-signal-medium-gray outline-none"
          placeholder={t("signalChatSearch")}
        />
      </div>
    </div>
  </div>
  );
}

export default SearchBar;
