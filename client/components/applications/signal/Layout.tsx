import Image from 'next/image';
import ApplicationLogo from 'assets/signal/app_logo.png';
import SearchIcon from 'assets/signal/search.svg';
import CamIcon from 'assets/signal/cam.svg';
import ChevDownIcon from 'assets/signal/chevDown.svg';
import SearchBar from './SearchBar';
import ChatListItem from './ChatListItem';
import React, { useState } from 'react';
import classNames from 'classnames';
import { LayoutProps } from '../outlook/Layout';
import {
  WindowManagementSvgIcons,
  IMAGE_URL,
  SUR5_TWITTER_URL,
} from '../../../utils/constants';
import { Resizable } from 're-resizable';
import { Applications } from 'utils/store/settingsStore';
import { useStore } from '../../../utils/store/store';
import { useEffect } from 'react';
import { Answer } from 'utils/store/signalStore';
import { useTranslations } from 'next-intl';
import ChatTyping from 'components/ChatTyping';
import reactStringReplace from 'react-string-replace';
const ChatControlIcons = [CamIcon, SearchIcon, ChevDownIcon];

const Layout = ({ close, focus }: LayoutProps) => {
  const {
    chats,
    activeChatId,
    handleAnswerTrigger,
    typing,
    settingsId,
    openTorPage,
    teamName,
  } = useStore();
  const t = useTranslations();

  const openTwitterProfile = () => {
    openTorPage(SUR5_TWITTER_URL);
  };

  useEffect(() => {
    var chatObj = document.getElementById('signal_chat');
    if (!chatObj) return;

    chatObj.scrollTop = chatObj.scrollHeight;
  }, [chats]);

  const parseMessage = (message: string) => {
    let newMessage = reactStringReplace(message, '[TWITTER]', (match, i) => (
      <span
        onClick={() => openTwitterProfile()}
        className="text-blue-600 cursor-pointer hover:underline"
        key={i}
      >
        {SUR5_TWITTER_URL}
      </span>
    ));

    newMessage = reactStringReplace(
      newMessage,
      '[TEAMNAME]',
      (match, i) => teamName
    );

    newMessage = reactStringReplace(newMessage, '[AUTHORITY]', (match, i) =>
      t('organizationName')
    );

    newMessage = reactStringReplace(newMessage, '[CISONAME]', (match, i) =>
      t('cisoName')
    );
    return newMessage;
  };
  const getAnswers = () => {
    let activeChat = chats.find((c) => c.id === activeChatId);
    if (activeChat) {
      let chatId = activeChat.id;
      let lastMessage = activeChat.messages[activeChat.messages.length - 1];
      if (lastMessage.answers) {
        return (
          <div className="bg-signal_light_gray flex items-center">
            <ul className="flex w-full justify-center space-x-8 px-8 items-center my-1 text-center">
              {lastMessage.answers.map((answer: Answer) => {
                return (
                  <li
                    key={answer.id}
                    onClick={() => handleAnswerTrigger(answer, chatId)}
                    className="w-full my-2 py-2 px-4 bg-signal_blue text-white rounded-full cursor-pointer"
                  >
                    {answer.message}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      }
    }
  };

  return (
    <Resizable
      defaultSize={{
        width: 800,
        height: 600,
      }}
      bounds={document.getElementById('draggable_space') || undefined}
    >
      <div
        onClick={() => focus(Applications.SIGNAL)}
        className={`flex flex-col font-inter bg-white h-full shadow-md`}
      >
        <div id="handle" className="flex justify-between w-full px-2 py-1">
          <div className="flex items-center">
            <div className="w-8 flex items-center">
              <Image className="" alt="" src={ApplicationLogo} />
            </div>
            <p className="text-sm ml-1">Signal Chat</p>
          </div>
          <div className="flex items-center space-x-1">
            {WindowManagementSvgIcons.map((icon, index) => (
              <button
                onClick={() => close()}
                key={index}
                className="w-8 h-8 flex items-center hover:bg-signal_medium_gray cursor-pointer"
              >
                <div className="w-8 h-8 font-white flex items-center  stroke-signal_dark_gray">
                  {React.createElement(icon)}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="h-full grid grid-cols-3 overflow-hidden">
          <div className="col-span-1 bg-signal_light_gray overflow-hidden">
            <SearchBar />
            <div>
              <ul>
                {chats.map((chat, index) => (
                  <ChatListItem
                    isActive={chat.id === activeChatId}
                    key={chat.id}
                    chat={chat}
                  />
                ))}
              </ul>
            </div>
          </div>
          <div className="col-span-2 flex flex-col justify-end space-y-8 overflow-hidden">
            <div className="flex justify-between px-2">
              <div className="flex items-center">
                <div className="relative w-8 h-8 mr-2 flex rounded-full overflow-hidden">
                  <img
                    alt=""
                    className="rounded-full"
                    src={encodeURI(
                      IMAGE_URL + settingsId + '/' + activeChatId + '.png'
                    )}
                  />
                </div>
                <p className="">
                  {chats.find((chat) => chat.id === activeChatId)?.name}
                </p>
              </div>
              {activeChatId && (
                <div className="flex items-center space-x-1">
                  {ChatControlIcons.map((icon, index) => (
                    <button
                      key={icon.src}
                      className="w-8 h-8 flex items-center hover:bg-signal_medium_gray cursor-pointer"
                    >
                      <Image className="" alt="" src={icon} />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <ul
              id="signal_chat"
              className="flex flex-col w-full h-full px-2 overflow-scroll"
            >
              {chats
                .find((chat) => chat.id === activeChatId)
                ?.messages.map((message) => (
                  <li key={message.id} className="flex items-end">
                    {!message.own && (
                      <div className="relative w-8 h-8 mr-2 mb-2">
                        <img
                          alt=""
                          className="rounded-full"
                          src={encodeURI(
                            IMAGE_URL +
                              settingsId +
                              '/' +
                              chats.find((chat) => chat.id === activeChatId)
                                ?.id +
                              '.png'
                          )}
                        />
                      </div>
                    )}
                    <div
                      className={classNames(
                        ' w-fit max-w-[50%] px-6 py-2 mb-2 rounded-3xl ',
                        {
                          'ml-auto bg-signal_blue text-white': message.own,
                          'bg-signal_light_gray text-black': !message.own,
                          'mr-auto': !message.own,
                        }
                      )}
                    >
                      {!message.own && (
                        <p className="font-semibold">
                          {chats.find((chat) => chat.id === activeChatId)?.name}
                        </p>
                      )}
                      {parseMessage(message.message)}

                      <p
                        className={classNames('text-xs mt-1 font-thin', {
                          'text-right': message.own,
                        })}
                      >
                        {message.time}
                      </p>
                    </div>
                  </li>
                ))}
            </ul>
            {typing && (
              <div className="w-6 ml-2">
                <ChatTyping />
              </div>
            )}
            {chats && <div>{getAnswers()}</div>}
          </div>
        </div>
      </div>
    </Resizable>
  );
};

export default Layout;
