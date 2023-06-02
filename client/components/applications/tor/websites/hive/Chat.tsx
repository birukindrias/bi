import classNames from 'classnames';
import { useStore } from '../../../../../utils/store/store';
import { HiveAnswer, HiveMessage } from '../../../../../utils/store/torStore';
import { useEffect, useState } from 'react';
import ChatTyping from '../../../../ChatTyping';
import { useTranslations } from 'next-intl';
import { replacePlaceholder } from '../../../../../utils/helper';
import { Objectives } from 'utils/store/settingsStore';
import reactStringReplace from 'react-string-replace';
import { MILKROAD_URL, SERVER_URL } from '../../../../../utils/constants';
import { Applications } from '../../../../../utils/store/settingsStore';
import { XIcon } from '@heroicons/react/outline';
//<ORGANIZATIONNAME>
interface IMessage {
  id: number;
  message: string;
  isOwn: boolean;
  time: string;
}
interface IChat {
  name: string;
  department: string;
  messages: IMessage[];
  startDate: string;
}

type ChatProps = {
  openPreview: () => void;
}

const Chat = ({openPreview}:ChatProps) => {
  const t = useTranslations();

  const {
    hiveMessages,
    getLastHiveMessage,
    triggerHiveMessage,
    hiveTyping,
    addToScore,
    addToNegotiationPoints,
    finishObjective,
    objectives,
    openTorPage,
    settingsId
  } = useStore();
  //function to replace <ORGANIZATIONNAME> with the name of the organization
  const handleReplace = (message: string) => {
    return replacePlaceholder(
      message,
      '<ORGANIZATIONNAME>',
      t('urlOrgianization')
    );
  };
  let serverProfileImageUrl = `${SERVER_URL}/settings/images/${settingsId}/sur_attachment.png`;
  const openMilkroad = () => {
    if (
      objectives.find((o) => o.name === Objectives.DOWNLOAD_CODE)?.done ===
      false
    ) {
      finishObjective(Objectives.DOWNLOAD_CODE);
      addToScore(20);
    }

    openTorPage(handleReplace(MILKROAD_URL));

    //   setOpenApplication(Applications.TOR, true);
    //   focusApplication(Applications.TOR);
    //   let localTabs = tabs;
    //   //find active tab index
    //   let activeTabIndex = localTabs.findIndex((tab) => tab.active);

    // /*   if (activeTabIndex === -1) {
    //     localTabs = [...localTabs, { id: 1, page: 'New Page', active: true }];
    //     activeTabIndex = 0;
    //   } */
    //   //update page on tab

    //   localTabs = [...localTabs, { id: Date.now(), page: handleReplace(MILKROAD_URL), active: true, loading: true}];
    //   let newIndex = localTabs.length - 1;
    //   localTabs[activeTabIndex].active = false;
    //   setTabs(localTabs);
    //   setTimeout(() => {
    //     localTabs[newIndex].loading = false;
    //     setTabs(localTabs);
    //     //TODO: LOAD PAGE
    //   }, 600);
  };

  const [lastMessage, setLastMessage] = useState<HiveMessage | null>(null);

  useEffect(() => {
    var chatObj = document.getElementById('hive_chat');
    if (!chatObj) return;

    chatObj.scrollTop = chatObj.scrollHeight;
  }, [hiveMessages.length]);
  useEffect(() => {
    if (hiveMessages.length === 0) {
      triggerHiveMessage('1');
    }
  }, []);

  useEffect(() => {
    const lastMessage = getLastHiveMessage();
    if (lastMessage) {
      setLastMessage(lastMessage);
    }
  }, [hiveMessages]);

  const handleAnswer = (answer: HiveAnswer) => {
    finishObjective(Objectives.NEGOTIATION);
    if (answer) {
      if (answer.correct) {
        addToNegotiationPoints(10);
        addToScore(10);
      }
      answer.own = true;
      answer.id = answer.id.toString() + Date.now();
      triggerHiveMessage(answer.trigger, answer);
    }
  };

  let fileNames = [
    "finances.csv",
    "employees.csv",
    "salary.csv",
  ];

  let fileSizes = [
    "8 MB",
    "1.5 MB",
    "0.8 MB",
  ]

  const prepMessage = (message: string) => {

    let result = reactStringReplace(
      message,
      '[MILKROAD]',
      (match, i) => {
        return (
          <span
            onClick={() => openMilkroad()}
            className="text-blue-600 cursor-pointer hover:underline"
            key={i}
          >
            {handleReplace(MILKROAD_URL)}
          </span>
        );
      }
    )



    result = reactStringReplace(
      result,
      /\[ATTACHMENT(\w+)]/g,
      (match, i) => {
        return (
          <div className='my-2 flex cursor-pointer' onClick={() => openPreview()}>
            <img className='w-12'  src={serverProfileImageUrl} alt="attachment" />
            <p className='ml-2'>{fileNames.pop() || "mixed.csv"} <span className='text-sm text-gray'>{fileSizes.pop() || "0.3 MB"}</span> </p>
          </div>
        )
      }
    )

    return result
  }

  return (
    <div className="flex flex-col w-full h-full ">
      <div id="hive_chat" className="flex-1 overflow-auto px-4 py-6 ">

        <p className="text-2xl">{t('sur5_chat_title')}</p>
        <p className="mt-1 text-sm">{t('sur5_chat_subtitle')}</p>
        <div className="mt-8">
          <p className="text-center text-hive_gray_blue text-sm font-light">
            {t('sur5_chat_date')}
          </p>
          <div className="mt-4">
            {hiveMessages.map((m: HiveAnswer | HiveMessage) => {
              if (m.message.length > 0) {
                return (
                  <div
                    className={classNames('flex flex-col max-w-[50%]', {
                      //@ts-ignore
                      'ml-auto': m.own,
                    })}
                    key={m.id}
                  >
                    <div
                      className={classNames(
                        'px-2 py-3  bg-opacity-75 rounded-md',
                        {
                          //@ts-ignore
                          'bg-hive_medium_blue': m.own,
                          //@ts-ignore
                          'bg-white': !m.own,
                        }
                      )}
                    >
                      <p
                        className={classNames('max-w-fit break-words', {
                          //@ts-ignore
                          'text-white': m.own,
                        })}
                      >
                        {
                          prepMessage(m.message)
                        }
                      </p>
                    </div>
                    <p
                      className={classNames('text-hive_gray_blue text-sm', {
                        //@ts-ignore
                        'text-right': m.own,
                      })}
                    >
                      Just now
                    </p>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
      <div className=" py-4 px-8">
        {hiveTyping && <ChatTyping />}
        <div className="flex items-center justify-center">
          {lastMessage && lastMessage.answers && (
            <div className="flex text-sm items-center justify-between w-full space-x-2">
              <button
                className="bg-white py-2 px-3 rounded-md border-[1px] border-hive_gray_blue border-opacity-75"
                onClick={() =>
                  handleAnswer(
                    lastMessage?.answers?.[0] as unknown as HiveAnswer
                  )
                }
              >
                {lastMessage.answers[0].short}
              </button>
              <button
                className="bg-white py-2 px-3 rounded-md border-[1px] border-hive_gray_blue border-opacity-75"
                onClick={() =>
                  handleAnswer(
                    lastMessage?.answers?.[1] as unknown as HiveAnswer
                  )
                }
              >
                {lastMessage.answers[1].short}
              </button>
            </div>
          )}

          {/* <textarea
            className={
              'resize-none w-full border-none rounded-md px-2 py-2 focus:ring-0 flex-1'
            }
            placeholder={'Type a message'}
          />
          <button
            className="flex-none py-2 px-6 bg-transparent border text-black bg-hive_orange rounded-md hover:text-white"
          >
            Send
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Chat;
