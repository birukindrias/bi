import { useStore } from '../../../../../utils/store/store';
import { ChangeEvent, useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { secondsToTimeFormat } from 'utils/helper';
import { useTranslations } from 'next-intl';
const Index = () => {
  const t = useTranslations();
  const {
    messagesStarted,
    startMessages,
    messages,
    sendMessage,
    currentBid,
    setBid,
    localPlayers,
    bitcoinPriceUsd,
  } = useStore();

  const timeRef = useRef(useStore.getState().gameTimeInSeconds);

  const [currentBidInput, setCurrentBidInput] = useState(0);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    if (!messagesStarted) {
      startMessages();

      useStore.subscribe(
        (state) => state.gameTimeInSeconds,
        (gameTimeInSeconds) => (timeRef.current = gameTimeInSeconds)
      );
    }
  }, []);

  useEffect(() => {
    var chatObj = document.getElementById('milkroad_chat');
    if (!chatObj) return;

    if (chatObj?.scrollHeight - chatObj?.scrollTop < 700) {
      chatObj.scrollTop = chatObj.scrollHeight;
    }
  }, [messages.length]);

  const handleChatInput = (e: ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value);
  };

  const handleBetInput = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentBidInput(Number(e.target.value));
  };

  const placeBid = () => {
    if (currentBidInput > 0 && currentBidInput > currentBid.bid) {
      //TODO: CREATE NEW MESSAGE AND APPEND TO CHAT

      setBid(currentBidInput, 'you', true);

      sendMessage({
        id: (Date.now() + Math.random()).toString(),
        name: 'You',
        time: new Date().toTimeString().split(':').slice(0, 2).join(':'),
        text: `Bid: ${currentBidInput} BTC`,
        own: true,
      });

      setCurrentBidInput(0);
    }
  };

  const sendChatMessage = () => {
    if (chatInput.length > 0) {
      sendMessage({
        id: (Date.now() + Math.random()).toString(),
        name: 'You',
        time: new Date().toTimeString().split(':').slice(0, 2).join(':'),
        text: chatInput,
        own: true,
      });
      //TODO: CREATE NEW MESSAGE AND APPEND TO CHAT

      setChatInput('');
    }
  };

  return (
    <div className=" bg-milkroad_bg h-full w-full flex  overflow-hidden">
      <div className="text-white max-w-6xl mx-auto w-full py-4 space-y-6 font-roboto px-4 flex flex-col flex-1 overflow-hidden">
        <div className="flex flex-none items-center justify-between bg-milkroad_gray border-2 border-milkroad_light_gray rounded-md py-4 px-8">
          <div className="flex  flex-col">
            <p className="text-4xl font-extrabold">
              MILK<span className="text-gray-400">ROAD</span>
            </p>
            <p className="text-sm">Deep Web Marketplace</p>
          </div>
          {/* <div>searchbar</div> */}
        </div>
        <div className="w-full flex-1 flex flex-col items-center justify-between bg-milkroad_gray border-2 border-milkroad_light_gray rounded-md py-4 px-8 overflow-hidden">
          <div className="grid grid-cols-12 w-full">
            <div className="col-span-5 flex items-center">
              <p className="text-2xl font-bold">{t('milkroadCompanyHacked')}</p>
            </div>

            <div className="flex items-center justify-between col-span-7  py-2">
              <div className="pl-4 text-sm">
                {currentBid.bid > 0 && (
                  <p className="">
                    Highest bit:{' '}
                    <span className="text-base text-milkroad_blue">
                      {currentBid.bid} BTC
                    </span>
                    {bitcoinPriceUsd && (
                      <span className="ml-1">
                        {Math.round(bitcoinPriceUsd * currentBid.bid * 100) /
                          100}{' '}
                        USD{' '}
                      </span>
                    )}
                    by
                    <span className="text-milkroad_red">
                      {' '}
                      {currentBid.name}
                    </span>
                  </p>
                )}
                <p>
                  Time remaining:{' '}
                  <span className="font-black">
                    {secondsToTimeFormat(timeRef.current)}
                  </span>
                </p>
              </div>

              <div className="flex items-center space-x-2 border border-milkroad_light_gray rounded-sm md px-2 py-1">
                <input
                  value={currentBidInput}
                  onChange={handleBetInput}
                  className="w-20 p-0 bg-transparent border-milkroad_gray focus:ring-0 focus:border-transparent"
                  placeholder="Your bid"
                  type="text"
                />
                <p>BTC</p>
                <button
                  onClick={() => placeBid()}
                  className="flex w-fit rounded-md bg-milkroad_light_blue py-2 px-4 text-sm "
                >
                  Place Bid
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 w-full h-full gap-x-4 overflow-hidden">
            <div className="col-span-5 h-full ">
              <div className="rounded-sm bg-black border border-milkroad_light_gray flex flex-col h-full">
                <div className="flex-none border border-milkroad_light_gray text-xl px-2 py-3 ">
                  <p>Data Information</p>
                </div>
                <div className="flex-none">
                  <table className="mr_table">
                    <tbody>
                      <tr>
                        <th className="w-[35%]">Amount of files</th>
                        <td>6.504</td>
                      </tr>
                      <tr>
                        <th className="w-[35%]">Containing</th>
                        <td>
                          Passwords, employee information, passports, tax
                          infomration
                        </td>
                      </tr>
                      <tr>
                        <th className="w-[35%]">Sold by</th>
                        <td className="text-milkroad_red">Sur5</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="flex-1 rounded-sm bg-black border border-milkroad_light_gray min-h-min">
                  <p className="px-2 py-3 text-sm">Preview</p>
                  <p className="px-2 pb-3 text-sm">
                    {t('milkroadPreviewText', {
                      companyname: t('organizationName'),
                    })}
                  </p>
                  <ul className="pl-2 text-sm flex flex-wrap">
                    {localPlayers?.map((player) => (
                      <li className="mr-2" key={player.email}>
                        <span>{`${player.name} ${player.email}`}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-span-7 h-full w-full overflow-hidden">
              <div className="h-full rounded-sm bg-black border border-milkroad_light_gray flex flex-col ">
                <div className="flex-none border border-milkroad_light_gray flex items-center justify-between">
                  <p className=" text-xl px-2 py-3">
                    Live Chat
                    <span className="text-gray-400 text-sm ml-2">
                      {t("milkroadLiveChatPeople")}
                    </span>
                  </p>
                  <div className="bg-milkroad_blue animate-pulse h-4 w-4 rounded-full mr-4"></div>
                </div>

                <div
                  id="milkroad_chat"
                  className="flex-1 border border-milkroad_light_gray overflow-scroll py-4"
                >
                  <div>
                    <ul className="flex flex-col w-full h-full px-2">
                      {messages.map((message) => (
                        <li key={message.id} className="flex items-end">
                          <div
                            className={classNames(
                              ' w-2/3 max-w-[75%] px-6 py-2 mb-2 rounded-3xl ',
                              {
                                'ml-auto bg-signal_blue text-white':
                                  message.own,

                                'mr-auto': !message.own,
                                'bg-red-600': !message.text,
                                'bg-milkroad_gray text-white':
                                  !message.own && message.text,
                              }
                            )}
                          >
                            {!message.own && (
                              <p className="font-semibold">{message.name}</p>
                            )}
                            {!message.bid ? (
                              <p className="font-thin leading-5">
                                {message.text}
                              </p>
                            ) : (
                              <p>Bid: {message.bid} BTC</p>
                            )}
                            <p
                              className={classNames('text-xs mt-1 font-thin', {
                                'text-right': message.own,
                              })}
                            >
                              {'Just now'}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex-none bg-milkroad_gray py-1">
                  <div className="flex items-center justify-between ">
                    <input
                      value={chatInput}
                      onChange={handleChatInput}
                      className="flex-1 p-0 bg-transparent placeholder:text-sm text-sm border-transparent focus:ring-0 focus:border-transparent px-2"
                      placeholder="Type something"
                      type="text"
                    />
                    <button
                      onClick={() => sendChatMessage()}
                      className="flex-none py-1 px-6 bg-milkroad_light_blue rounded-md mx-3 text-sm"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
