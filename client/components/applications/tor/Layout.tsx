import Image from 'next/image';
import { Resizable } from 're-resizable';
import React, { KeyboardEvent, useState } from 'react';
import { WindowManagementSvgIcons } from 'utils/constants';
import { LayoutProps } from '../outlook/Layout';
import TabCloseIcon from 'assets/tor/close_tab.svg';
import TabNewIcon from 'assets/tor/add_tab.svg';
import ArrowRightIcon from 'assets/tor/arrow_right.svg';
import ArrowLeftIcon from 'assets/tor/arrow_left.svg';
import RefreshIcon from 'assets/tor/refresh.svg';
import ApplicationLogoIcon from 'assets/tor/application_logo.svg';
import LockedFiles from './websites/locked_files';
import OutsideClickHandler from 'components/OutsideClickHandler';
import classNames from 'classnames';
import { ChangeEvent, useEffect } from 'react';
import Spinner from 'components/icons/Spinner';
import Hive from './websites/hive';
import Cognito from './websites/cognito_files';
import Milkroad from './websites/milkroad';
import { Applications, Objectives } from 'utils/store/settingsStore';
import Downloads from './Downloads';
import { useStore } from '../../../utils/store/store';
import { Size } from '../cryptii/Layout';
import Twitter from './websites/twitter';
import { replacePlaceholder } from '../../../utils/helper';
import { useTranslations } from 'next-intl';
import Connect from './Connect';
import EmptyPage from './EmptyPage';
import { HACK_URL, DPIA_URL } from '../../../utils/constants';
import {
  SUR5_TWITTER_URL,
  COGNITO_URL,
  SUR5_CHAT_URL,
  MILKROAD_URL,
  LOCKED_FILES_URL,
} from '../../../utils/constants';
interface ITab {
  id: number;
  page: string;
  active: boolean;
  loading?: boolean;
}

export interface LayoutSizeProps {
  size: Size;
  setSize: (value: Size | ((prevVar: Size) => Size)) => void;
}
interface TorProps extends LayoutProps, LayoutSizeProps {}

const Layout = ({ close, focus, size, setSize }: TorProps) => {
  const [focusSearchBar, setFocusSearchBar] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { showDownloads, tabs, setTabs, closeTab, objectives } = useStore();

  const t = useTranslations();
  useEffect(() => {
    let draggable = document.getElementById('draggable_space');
    let height = draggable?.offsetHeight;
    let width = draggable?.offsetWidth;
    if (width && height) {
      setSize({
        height,
        width,
      });
    }
  }, []);

  const getWebPage = () => {
    const tab = tabs.find((t) => t.active);

    if (tab && tab.loading) {
      return <Spinner />;
    }

    if (tab) {
      if (tab.page.includes(LOCKED_FILES_URL)) return <LockedFiles />;

      switch (tab.page) {
        case 'Tor Browser':
          return <Connect />;
        case SUR5_CHAT_URL:
          return <Hive />;
        case COGNITO_URL:
          return <Cognito />;
        case replacePlaceholder(
          MILKROAD_URL,
          '<ORGANIZATIONNAME>',
          t('urlOrgianization')
        ):
          return <Milkroad />;
        // case LOCKED_FILES_URL:
        //   return <LockedFiles />;
        case SUR5_TWITTER_URL:
          return <Twitter />;
        default:
          return <EmptyPage />;
      }
    }
    return <div className="bg-tor_dark_lila flex-1"> </div>;
  };

  //set new tab active and
  const focusTab = (id: number) => {
    setTabs(
      tabs.map((tab) => ({
        ...tab,
        active: tab.id === id,
      }))
    );
  };

  const addTab = () => {
    if (tabs.length == 5) {
      return;
    }
    const newTab = {
      id: tabs[tabs.length - 1]?.id + 1 || 1,
      page: 'New Page',
      active: true,
    };
    //set all tabs inactive
    tabs.forEach((tab) => {
      tab.active = false;
    });
    //add new tab
    setTabs([...tabs, newTab]);
  };

  // const closeTab = (id: number) => {
  //   if (tabs.length === 1) {
  //     setTabs([]);
  //     return;
  //   }

  //   const tabIndexToRemove = tabs.findIndex((tab) => tab.id === id);

  //   let newTabs = tabs.filter((tab) => tab.id !== id);

  //   if (!tabs[tabIndexToRemove].active) {
  //     setTabs(newTabs);
  //     return;
  //   }

  //   let idToFocus = newTabs[0].id;
  //   //if deleting an inactive tab, stay on current tab. otherwise, focus next tab && tab before is avaliable
  //   if (tabIndexToRemove - 1 >= 0) {
  //     idToFocus = newTabs[tabIndexToRemove - 1].id;
  //     newTabs = newTabs.map((tab) => ({
  //       ...tab,
  //       active: tab.id === idToFocus,
  //     }));
  //   }

  //   setTabs(newTabs);
  // };

  const findWebsite = (url: string) => {
    let localTabs = tabs;
    //find active tab index
    let activeTabIndex = localTabs.findIndex((tab) => tab.active);

    if (activeTabIndex === -1) {
      localTabs = [...localTabs, { id: 1, page: 'New Page', active: true }];
      activeTabIndex = 0;
    }
    //update page on tab

    localTabs[activeTabIndex].page = searchValue;
    localTabs[activeTabIndex].loading = true;
    setTabs(localTabs);
    setSearchValue('');
    setFocusSearchBar(false);
    setTimeout(() => {
      localTabs[activeTabIndex].loading = false;

      setTabs(localTabs);
      //TODO: LOAD PAGE
    }, 600);
  };
  const search = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || searchValue.length > 0 == false) {
      return;
    }

    findWebsite(searchValue);
  };

  const handleSearchInput = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <Resizable
      size={size}
      minWidth={524}
      minHeight={410}
      onResizeStop={(e, direction, elt, delta) => {
        setSize((size) => ({
          height: size.height + delta.height,
          width: size.width + delta.width,
        }));
      }}
      defaultSize={{ width: 1200, height: 700 }}
      bounds={document.getElementById('draggable_space') || undefined}
    >
      <div
        onClick={() => focus(Applications.TOR)}
        className="font-sourcesanspro flex flex-col bg-tor_dark_gray h-full w-full relative"
      >
        {/* Header */}
        <div id="handle" className="flex w-full  justify-between py-1">
          <ul className="flex items-center content-center flex-1">
            {tabs.map((tab) => {
              return (
                <li

                  key={tab.id}
                  className={classNames(
                    'cursor-pointer rounded-md flex-1 max-w-[140px] flex items-center justify-between ml-1  px-1 text-tor_extra_light_gray ',
                    {
                      'bg-tor_light_gray': tab.active,
                    }
                  )}
                >
                  <div onClick={() => focusTab(tab.id)} className="w-full">
                    <p className="text-xs font-light ml-1 py-2  truncate">
                      {tab.page}
                    </p>
                  </div>
                  <div
                    onClick={() => closeTab(tab.id)}
                    className=" py-2 relative h-6 w-6 flex items-center justify-center hover:bg-gray-500 rounded-md cursor-pointer"
                  >
                    {tab.loading ? (
                      <Spinner className="-ml-1 mr-3 h-5 w-5" />
                    ) : (
                      <Image alt="" src={TabCloseIcon} />
                    )}
                  </div>
                </li>
              );
            })}
            <li className="py-1">
              <div
                onClick={() => addTab()}
                className={classNames(
                  'relative flex items-center justify-center ml-2 rounded-md',
                  {
                    'cursor-not-allowed': tabs.length === 5,
                    'hover:bg-tor_light_gray cursor-pointer': tabs.length !== 5,
                  }
                )}
              >
                <Image alt="" src={TabNewIcon} />
              </div>
            </li>
          </ul>
          <div className="flex items-center space-x-1 pr-2">
            {WindowManagementSvgIcons.map((icon, index) => (
              <button
                onClick={() => close()}
                key={index}
                className="w-8 h-8 flex items-center hover:bg-vscode_light_gray cursor-pointer"
              >
                <div className="w-8 h-8 font-white flex items-center  stroke-white">
                  {React.createElement(icon)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* search bar */}
        <div className="w-full  flex-none bg-tor_medium_gray flex items-center pr-4">
          <div className="flex items-center ml-3 space-x-1 pr-1">
            <div className="relative h-7 w-7 hover:bg-tor_light_gray flex items-center justify-center rounded-md cursor-pointer">
              <Image alt="" src={ArrowLeftIcon} />
            </div>
            <div className="relative h-7 w-7 hover:bg-tor_light_gray flex items-center justify-center rounded-md cursor-pointer">
              <Image alt="" src={ArrowRightIcon} />
            </div>
            <div className="relative h-7 w-7 hover:bg-tor_light_gray flex items-center justify-center rounded-md cursor-pointer">
              <Image alt="" src={RefreshIcon} />
            </div>
          </div>
          <OutsideClickHandler
            className="flex-1"
            onOutsideClick={() => setFocusSearchBar(false)}
          >
            <div
              className="bg-tor_dark_gray flex rounded-md my-1 w-full py-1 cursor-text group"
              onClick={() => {
                setFocusSearchBar(true);
                setSearchValue(tabs.find((tab) => tab.active)?.page || '');
              }}
            >
              {focusSearchBar ? (
                <div className="bg-tor_dark_gray px-1 py-[2px] w-full">
                  <div className=" items-center">
                    <input
                      onKeyDown={search}
                      onChange={handleSearchInput}
                      onClick={(e) => e.stopPropagation()}
                      value={searchValue}
                      className="p-0 py-[2px] w-full border-none bg-tor_dark_gray focus:ring-0 text-tor_extra_light_gray"
                      type="text"
                      placeholder="Search"
                      autoFocus
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-tor_light_gray max-w-fit ml-1 rounded-md px-1 py-1 flex-1">
                  <div className="flex items-center">
                    {tabs.find((v) => v.active)?.loading ? (
                      <Spinner className="h-4 w-4 mx-1 my-1" />
                    ) : (
                      <div className="py-1 relative flex items-center mx-1 w-4">
                        <Image alt="" src={ApplicationLogoIcon} />
                      </div>
                    )}
                    <p className="font-light text-sm text-tor_bright_lila">
                      {tabs.find((tab) => tab.active)?.page}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </OutsideClickHandler>
        </div>
        {getWebPage()}
        {showDownloads && <Downloads />}
      </div>
    </Resizable>
  );
};

export default Layout;
