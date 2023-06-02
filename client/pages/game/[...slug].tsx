import { GetServerSideProps } from 'next';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { useEffect, useState, Fragment } from 'react';
import DisplayLayout from '../../components/layout/DisplayLayout';
import { useStore } from '../../utils/store/store';
import {
  getLanguageFile,
  getSignalChats,
  getEmails,
  getHive,
} from '../../utils/api';
import { Chat, Message, TaskTrigger } from 'utils/store/signalStore';
import { getMilkroad, getTwitter } from '../../utils/api';
import LoadSavedGame from '../../components/LoadSavedGame';

//TODO: VIDEOS
const Index = ({
  signalChats,
  hiveChat,
  emails,
  milkroad,
  twitter,
  coinData,
}: {
  signalChats: any;
  hiveChat: any;
  emails: any;
  milkroad: any;
  twitter: any;
  coinData: any;
}) => {
  const t = useTranslations();
  const router = useRouter();
  const { slug } = router.query;
  const {
    checkIfStateExists,
    loadState,
    addGameId,
    addTeamId,
    loadChatsInQueue,
    setEmailQueue,
    setHiveMessageQueue,
    setMilkroadMessageQueue,
    startTimer,
    setTwitterAccount,
    setBitcoinPriceUsd,
  } = useStore();

  const [foundState, setFoundState] = useState(false);
  useEffect(() => {
    let coinPrice = coinData.coin.price;
    //rouond to 2 decimal places
    coinPrice = Math.round(coinPrice * 100) / 100;
    setBitcoinPriceUsd(coinPrice);
    setEmailQueue(emails);
    setHiveMessageQueue(hiveChat);
    setMilkroadMessageQueue(milkroad);
    setTwitterAccount(twitter);
    const chats: Chat[] = [];
    signalChats?.forEach((chat: any) => {
      if (!chat.messages || chat.messages?.length <= 0) return;
      let newChat: Chat = {
        id: chat.id,
        name: chat.name,
        unreadCount: 0,
        messages: chat.messages?.map((message: any): Message => {
          let newMessage: Message = {
            id: message.id,
            message: message.message,
            read: false,
            own: false,
            triggerTimeInSeconds: message.triggerTimeInSeconds || 0,
            answers: message.answers || undefined,
          };
          if (message.taskTrigger) {
            newMessage.taskTrigger = message.taskTrigger as TaskTrigger;
          }

          return newMessage;
        }),
      };
      chats.push(newChat);
    });

    loadChatsInQueue(chats);

    if (checkIfStateExists()) {
      setFoundState(true);
    } else {
      startGame()
    }

    window.onbeforeunload = function(){
      return 'Are you sure you want to leave?';
    };
  }, []);

  const startGame = () => {
    setFoundState(false)
    startTimer();
  };

  useEffect(() => {
    if (router.isReady && Array.isArray(slug) && slug.length === 2) {
      const [gameId, teamId] = slug;
      addGameId(gameId);
      addTeamId(teamId);
    }
  }, [slug, addGameId, addTeamId, router.isReady]);

  return (
    <div className="relative">
      {foundState && (
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 h-screen w-screen bg-black bg-opacity-40'>
          <LoadSavedGame
          startNewGame={() => startGame()}
            loadSavedState={() => {
              setFoundState(false);
              loadState()
            }}
          />
        </div>
      )}
      <div>
      <DisplayLayout />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const gameId = context.params?.slug?.[0];

  if (!gameId) {
    return {
      props: {},
    };
  }

  let coinDataUrl =
    'https://api.coinstats.app/public/v1/coins/bitcoin?currency=USD';

  let coinData = await fetch(coinDataUrl).then((res) => res.json());

  const json = await getLanguageFile(gameId);

  const signalChats = await getSignalChats(gameId);

  let hiveChatRes = await getHive(gameId);

  let emailsRes = await getEmails(gameId);

  let milkroadRes = await getMilkroad(gameId);

  let twitterRes = await getTwitter(gameId);

  return {
    props: {
      messages: json,
      signalChats: signalChats,
      hiveChat: hiveChatRes,
      emails: emailsRes,
      milkroad: milkroadRes,
      twitter: twitterRes,
      coinData: coinData,
    },
  };
};

export default Index;
