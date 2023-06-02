import Image from 'next/image';
import Logo from 'assets/twitter/logo.png';
import SearchIcon from 'assets/twitter/search.png';
import HomeIcon from 'assets/twitter/home.png';
import HashtagIcon from 'assets/twitter/hashtag.png';
import MessageIcon from 'assets/twitter/message.png';
import BellIcon from 'assets/twitter/bell.png';
import classNames from 'classnames';
import Comment from 'components/icons/Twitter/Comment';
import Retweet from 'components/icons/Twitter/Retweet';
import Heart from 'components/icons/Twitter/Heart';
import Share from 'components/icons/Twitter/Share';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import reactStringReplace from 'react-string-replace';
import { COGNITO_URL } from 'utils/constants';
import { SERVER_URL } from '../../../../../utils/constants';
import { useStore } from '../../../../../utils/store/store';
import {
  Applications,
  Objectives,
} from '../../../../../utils/store/settingsStore';

interface Tweet {
  id: string;
  timeAgo: string;
  comments: number;
  retweets: number;
  likes: number;
  tweet: string;
}
const tweets: Tweet[] = [
  {
    id: '1',
    timeAgo: '3h',
    comments: 8,
    retweets: 12,
    likes: 33,
    tweet:
      "I'm happy that security researchers, like me, unite and investigate! That is real work not just like hacking networks. And @BBC, sorry not open for interviews. Sur5 is already on my tail, stakes are to high. But feel free to post about the published source codes.",
  },
  {
    id: '2',
    comments: 8,
    retweets: 12,
    likes: 33,
    timeAgo: '21h',
    tweet: '[COGNITO].... Sur5 source code incl. encryption key',
  },
];

export interface Account {
  name: string;
  handle: string;
}

const Index = () => {
  const {
    setTabs,
    tabs,
    setOpenApplication,
    focusApplication,
    addToScore,
    finishObjective,
    objectives,
    twitterAccount,
    settingsId,
  } = useStore();

  let serverProfileImageUrl = `${SERVER_URL}/settings/images/${settingsId}/${'twitter_profile'}.png`;
  let serverBannerImageUrl = `${SERVER_URL}/settings/images/${settingsId}/${'twitter_banner'}.png`;

  const twitterMenu = [
    {
      name: 'Home',
      icon: HomeIcon,
    },
    {
      name: 'Explore',
      icon: HashtagIcon,
    },
    {
      name: 'Notifications',
      icon: BellIcon,
    },
    {
      name: 'Messages',
      icon: MessageIcon,
    },
  ];

  const openCognito = () => {
    if (
      objectives.find((o) => o.name === Objectives.DOWNLOAD_CODE)?.done ===
      false
    ) {
      finishObjective(Objectives.DOWNLOAD_CODE);
      addToScore(20);
    }

    setOpenApplication(Applications.TOR, true);
    focusApplication(Applications.TOR);
    let localTabs = tabs;
    //find active tab index
    let activeTabIndex = localTabs.findIndex((tab) => tab.active);

    // if (activeTabIndex === -1) {
    //   localTabs = [...localTabs, { id: 1, page: 'New Page', active: true }];
    //   activeTabIndex = 0;
    // }
    //update page on tab

    localTabs[activeTabIndex].active = false;
    localTabs = [
      ...localTabs,
      { id: Date.now(), page: COGNITO_URL, active: true, loading: true },
    ];
    let newIndex = localTabs.length - 1;
    setTabs(localTabs);
    setTimeout(() => {
      localTabs[newIndex].loading = false;
      setTabs(localTabs);
    }, 600);
  };
  return (
    <div className="h-full w-full  bg-white font-sourcesanspro overflow-hidden ">
      <div className="max-w-6xl h-full w-full mx-auto grid grid-cols-4">
        <div className="col-span-1">
          <div className="pt-2 pl-12">
            <div className="relative h-12 w-12">
              <Image alt="" src={Logo} />
            </div>
          </div>

          <div className="mt-10">
            {twitterMenu.map((item, index) => {
              return (
                <div className="flex items-center pl-12 py-4" key={index}>
                  <div className="w-7 relative flex items-center justify-center">
                    <Image alt="" src={item.icon} />
                  </div>
                  <div
                    className={classNames('ml-6 text-xl', {
                      'text-twitter_blue font-bold': index === 0,
                    })}
                  >
                    {item.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="col-span-2 h-full w-full border-x-[1px] overflow-auto">
          <div className="pt-2 pb-2  border-b-[1px] flex items-center space-x-2">
            <div>
              <ChevronLeftIcon className="w-6" />
            </div>
            <p className="font-bold text-xl">{twitterAccount?.name}</p>
          </div>
          <div className="relative">
            <div className="relative w-full h-48">
              <img
                alt=""
                className="h-full w-full"
                src={serverBannerImageUrl}
              />
            </div>
            <div className="absolute -bottom-10 left-5">
              <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-white">
                <img
                  alt=""
                  className="h-full w-full"
                  src={serverProfileImageUrl}
                />
              </div>
            </div>
          </div>
          <div className="p-2 flex justify-end">
            <div className="px-3 py-2 rounded-full bg-white text-black border-[1px] border-twitter_light_gray border-opacity-30">
              Following
            </div>
          </div>
          <div className="flex flex-col ml-5">
            <span className="font-bold text-xl">{twitterAccount?.name}</span>
            <span className="text-twitter_gray">{twitterAccount?.handle}</span>
            <p className="mt-2">
             {twitterAccount?.info}
            </p>
          </div>

          <div className="mt-10">
            <ul className=" twitter_profile_menu">
              <li className="active">Tweets</li>
              <li>Tweets & replies</li>
              <li>Media</li>
              <li>Likes</li>
            </ul>
          </div>
          <div className="flex flex-col space-y-4">
            {twitterAccount?.tweets.map((tweet, index) => {
              return (
                <div
                  key={tweet.id}
                  className="grid grid-cols-7 w-full px-8 py-4 border-b-[1px]"
                >
                  <div className="col-span-1 relative h-16  w-16 rounded-full overflow-hidden border-2 border-white">
                    <img
                      alt=""
                      className="h-full w-full"
                      src={serverProfileImageUrl}
                    />
                  </div>
                  <div className="col-span-6">
                    <div className="text-twitter_gray">
                      <span className="font-bold text-black">
                        {twitterAccount.name}
                      </span>{' '}
                      <span className="">{twitterAccount.handle}</span>
                      <span className="px-1">·</span>
                      <span>{tweet.timeAgo}</span>
                    </div>
                    {reactStringReplace(
                      tweet.tweet,
                      '[COGNITO]',
                      (match, i) => (
                        <span
                          onClick={() => openCognito()}
                          className="text-blue-600 cursor-pointer hover:underline"
                          key={i}
                        >
                          {COGNITO_URL}
                        </span>
                      )
                    )}
                  </div>

                  <div className="mt-7 flex col-start-2 col-span-6 mr-12 justify-between">
                    {/**
                     * Comment
                     */}
                    <div className="twitter_action_container">
                      <Comment />
                      <span>{tweet.comments}</span>
                    </div>

                    {/**
                     * Retweet
                     */}
                    <div className="twitter_action_container">
                      <Retweet />
                      <span>{tweet.retweets}</span>
                    </div>

                    {/**
                     * Heart
                     */}
                    <div className="twitter_action_container">
                      <Heart />
                      <span>{tweet.likes}</span>
                    </div>

                    {/**
                     * Share
                     */}
                    <div className="twitter_action_container">
                      <Share />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div></div>
        </div>
        <div className="col-span-1">
          <div className="mt-2 ml-4 rounded-full flex items-center bg-twitter_blue_gray px-2">
            <div className="relative w-10 h-10 px-1 flex items-center justify-center ">
              <Image alt="" src={SearchIcon} />
            </div>
            <input
              className="flex-1 bg-transparent text-twitter_gray py-2 px-6 pl-0  focus:ring-0 border-0 focus:border-0"
              placeholder="Search Twitter"
            ></input>
          </div>

          <div>
            {/**
             * TODO: ADD FOLLOW BROOKLYN AND INTERPOL
             */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
