import { StoreSlice } from './store';
import { ENDGAME_LENGTH_IN_SECONDS } from '../constants';
import { SettingsSlice, Applications } from './settingsStore';
import { randomItemFromArray } from '../helper';

interface ITab {
  id: number;
  page: string;
  active: boolean;
  loading?: boolean;
}

export interface Tweet {
  id: string | number;
  timeAgo: string;
  comments: number;
  retweets: number;
  likes: number;
  tweet: string;
}

export interface TwitterAccount {
  name: string;
  handle: string;
  info: string;
  tweets: Tweet[];
}

interface MilkRoadMessage {
  id: string | number;
  text?: string;
  name: string;
  own?: boolean;
  time?: string;
  bid?: number;
}

export interface HiveMessage {
  id: string | number;
  message: string;
  trigger?: string; //id of the message to trigger next,
  answers?: HiveAnswer[];
}
export interface HiveAnswer {
  id: string | number;
  short: string;
  message: string;
  trigger: string;
  own?: boolean;
  correct?: boolean;
}

export interface TorBrowserSlice extends Partial<SettingsSlice> {
  combinationLockLocked: boolean;
  setCombinationLockLocked: (locked: boolean) => void;
  lockedFilesPopupOpen: boolean;
  setLockedFilesPopupOpen: (b: boolean) => void;
  openTorPage: (page: string) => void;
  bitcoinPriceUsd: number | null;
  setBitcoinPriceUsd: (price: number) => void;
  closeTab: (id: number) => void;
  currentBid: {
    bid: number;
    name: string;
  };
  connected: boolean;
  twitterAccount: TwitterAccount | null;
  setTwitterAccount: (twitterAccount: TwitterAccount) => void;
  setConnected: (connected: boolean) => void;
  setBid: (bid: number, name: string, player?: boolean) => void;
  triggerHiveMessage: (messageId: string, answer?: HiveAnswer) => void;
  hiveMessageQueue: HiveMessage[];
  setHiveMessageQueue: (messages: HiveMessage[]) => void;
  hiveMessages: Array<HiveMessage | HiveAnswer>;
  decryptionAttempts: number;
  hashedPlainText: string;
  setDecryptionAttempts: (decryptionAttempts: number) => void;
  isSideView: boolean;
  setIsSideView: (isSideView: boolean) => void;
  preparingDownload: boolean;
  downloading: boolean;
  tabs: ITab[];
  setTabs: (tabs: ITab[]) => void;
  setPreparingDownload: (value: boolean) => void;
  setDownloading: (value: boolean) => void;
  showDownloads: boolean;
  setShowDownloads: (value: boolean) => void;
  startMessages: () => void;
  messagesStarted: boolean;
  messageQueue: MilkRoadMessage[];
  messages: MilkRoadMessage[];
  sendMessage: (message: MilkRoadMessage) => void;
  decryptionTimerStarted: boolean;
  startDecryptTimer: () => void;
  stopDecryptTimer: () => void;
  timeLeft: number;
  torTimer: NodeJS.Timer | undefined;
  getLastHiveMessage: () => HiveMessage | undefined;
  hiveTyping: boolean;
  setMilkroadMessageQueue: (messages: MilkRoadMessage[]) => void;
}

export const createTorSclice: StoreSlice<TorBrowserSlice> = (set, get) => ({
  combinationLockLocked: true,
  setCombinationLockLocked: (locked) => {
    set({
      combinationLockLocked: locked,
    });
  },
  lockedFilesPopupOpen: false,
  setLockedFilesPopupOpen: (b) => {
    set({
      lockedFilesPopupOpen: b,
    });
  },
  setBitcoinPriceUsd: (price) => set(() => ({ bitcoinPriceUsd: price })),
  bitcoinPriceUsd: null,
  closeTab: (id) => {
    if (get().tabs.length === 1) {
      get().setTabs([]);
      return;
    }

    const tabIndexToRemove = get().tabs.findIndex((tab) => tab.id === id);

    let newTabs = get().tabs.filter((tab) => tab.id !== id);

    if (!get().tabs[tabIndexToRemove].active) {
      get().setTabs(newTabs);
      return;
    }

    let idToFocus = newTabs[0].id;
    //if deleting an inactive tab, stay on current tab. otherwise, focus next tab && tab before is avaliable
    if (tabIndexToRemove - 1 >= 0) {
      idToFocus = newTabs[tabIndexToRemove - 1].id;
      newTabs = newTabs.map((tab) => ({
        ...tab,
        active: tab.id === idToFocus,
      }));
    }

    get().setTabs(newTabs);
  },
  openTorPage: (page: string) => {
    get().setOpenApplication?.(Applications.TOR, true);
    get().focusApplication?.(Applications.TOR);
    let localTabs = get().tabs;
    //find active tab index
    let activeTabIndex = localTabs.findIndex((tab) => tab.active);
    if (activeTabIndex !== -1) {
      localTabs[activeTabIndex].active = false;
    }
    localTabs = [
      ...localTabs,
      { id: Date.now(), page: page, active: true, loading: true },
    ];
    let newIndex = localTabs.length - 1;
    get().setTabs(localTabs);
    setTimeout(() => {
      localTabs[newIndex].loading = false;
      get().setTabs(localTabs);
      //TODO: LOAD PAGE
    }, 600);
  },
  //0 = oldest; n-1 = newest
  twitterAccount: null,
  setTwitterAccount: (twitterAccount) =>
    set((state) => ({ twitterAccount: twitterAccount })),
  currentBid: {
    bid: 0,
    name: '',
  },
  connected: false,
  setConnected: (connected: boolean) => {
    set({
      connected,
    });
  },
  setBid: (bid: number, name: string, player = false) => {
    if (bid > 0 && bid > get().currentBid.bid) {
      set({
        currentBid: {
          bid: Math.round(bid * 100) / 100,
          name,
        },
      });
    }

    if (!player) return;

    let randomNames = [
      'jedson0',
      'wsaldler1',
      'cmathes2',
      'mbeckhouse3',
      'tcobbe4',
      'mwitherspoon5',
      'srowlinson6',
    ];
    setTimeout(() => {
      let name = randomItemFromArray(randomNames);
      let newBid = Math.round((Math.random() + Number.EPSILON) * 100) / 100;
      newBid = newBid + bid;

      set({
        messages: [
          ...get().messages,
          {
            id: Date.now().toString(),
            bid: newBid,
            name: name,
          },
        ],
        currentBid: {
          bid: newBid,
          name: name,
        },
      });
    }, 1000);
  },

  setHiveMessageQueue: (messages: HiveMessage[]) => {
    set({
      hiveMessageQueue: [...messages],
    });
  },
  hiveTyping: false,
  hiveMessageQueue: [],
  getLastHiveMessage: () => {
    const lastMessage = get().hiveMessages[get().hiveMessages.length - 1];
    if (lastMessage) {
      return lastMessage;
    }
    return undefined;
  },
  hiveMessages: [],
  stopDecryptTimer: () => {
    let timer = get().torTimer;
    if (timer) {
      clearInterval(timer);
    }
    set(() => ({
      torTimer: undefined,
    }));
  },
  timeLeft: ENDGAME_LENGTH_IN_SECONDS,
  decryptionTimerStarted: false,
  startDecryptTimer: () => {
    //@ts-ignore
    let gameTimeLeft = get().gameTimeInSeconds;
    if (gameTimeLeft > ENDGAME_LENGTH_IN_SECONDS) {
      set(() => ({
        timeLeft: ENDGAME_LENGTH_IN_SECONDS,
      }));
    } else {
      set(() => ({
        timeLeft: gameTimeLeft - 5,
      }));
    }

    //TODO logic either 10 minutes or rest of time
    set(() => ({
      decryptionTimerStarted: true,
    }));

    let timer = setInterval(() => {
      // update the timer every second and update the state
      set((state) => {
        const newTime = state.timeLeft - 1;
        if (newTime <= 0) {
          get().stopDecryptTimer();
        }

        return {
          timeLeft: newTime < 0 ? 0 : newTime,
        };
      });
    }, 1000);
    //setting timer instance to state so we can clear it later
    set(() => ({
      torTimer: timer,
    }));
  },
  hashedPlainText:
    '526c2ec9bea48500faead1d6e9346f44c5fcf4cf5b40dd0d6b3c992d0f56c5a6c47d905334df025cd811668a3b1b9816f86b852cd145c2899fdd361334f8fe19',
  decryptionAttempts: 5,
  setDecryptionAttempts: (decryptionAttempts) =>
    set((state) => ({ ...state, decryptionAttempts })),
  isSideView: false,
  setIsSideView: (isSideView) => set(() => ({ isSideView })),
  messageQueue: [],
  messages: [],
  setMilkroadMessageQueue: (messages: MilkRoadMessage[]) => {
    set({
      messageQueue: [...messages],
    });
  },
  torTimer: undefined,
  sendMessage: (message: MilkRoadMessage) => {
    set(() => ({ messages: [...get().messages, message] }));
  },
  startMessages: () => {
    set(() => ({ messagesStarted: true }));

    (function loop() {
      var rand = Math.round(Math.random() * (3000 - 500)) + 2000;
      if (get().messageQueue.length > 0) {
        setTimeout(function () {
          let message = get().messageQueue.shift();

          if (message) {
            if (message.bid) {
              let newBid =
                Math.round((message.bid + get().currentBid.bid) * 100) / 100;
              get().setBid(newBid, message.name);
              message.bid = newBid;
            }
            let newMessages = get().messages;
            newMessages.push(message);
            set(() => ({ messages: newMessages }));
          }
          loop();
        }, rand);
      }
      return;
    })();
    set(() => ({ messagesStarted: false }));
  },
  messagesStarted: false,
  tabs: [{ id: 1, page: 'Tor Browser', active: true, loading: false }],
  setTabs: (tabs) => {
    set(() => ({ tabs }));
  },
  preparingDownload: false,
  downloading: false,
  showDownloads: false,
  setShowDownloads: (value: boolean) => {
    set(() => ({
      showDownloads: value,
    }));
  },
  setDownloading: (downloading: boolean) => {
    set(() => ({
      downloading,
    }));
  },
  setPreparingDownload: (preparingDownload: boolean) => {
    set(() => ({
      preparingDownload,
    }));
  },

  triggerHiveMessage: (idOfMessageToTrigger: string, answer?: HiveAnswer) => {
    if (answer) {
      set(() => ({
        hiveMessages: [...get().hiveMessages, answer],
      }));
    }

    set({
      hiveTyping: true,
    });

    let message = get().hiveMessageQueue.find(
      (message) => message.id == idOfMessageToTrigger
    );

    let timeoutTime = 1;

    if (message?.message) {
      timeoutTime = message.message.length * 0.3 * 100;
    }

    setTimeout(() => {
      let newQueue: HiveMessage[];

      if (message) {
        newQueue = get().hiveMessageQueue.filter(
          (message) => message.id !== idOfMessageToTrigger
        );
        let newMessages = get().hiveMessages;

        newMessages.push(message);

        set(() => ({
          hiveMessageQueue: newQueue,
          hiveMessages: [...newMessages],
          hiveTyping: false,
        }));

        if (message?.trigger) {
          get().triggerHiveMessage(message.trigger);
        }
      }
    }, timeoutTime);
  },
});

const hiveStartMessages: HiveMessage[] = [
  {
    id: '1',
    message: '',
    answers: [
      {
        id: '1',
        message: "Hi, we've found out that you've hacked us.",
        short: 'Friendly Hi',
        trigger: '2',
      },
      {
        id: '2',
        message:
          "You dirty criminals, we know it's you who've hacked us. We will find you, and we will expose you!",
        short: 'unfriendly hi',
        trigger: '3',
      },
    ],
  },
  {
    id: '2',
    message:
      'Hello. Thanks for contacting our support desk. We took all your files.',
    trigger: '4',
  },
  {
    id: '3',
    message:
      'Hi, Haha, we did hack you and your ransom-price just doubled. You will never find us.',
    trigger: '4',
  },
  {
    id: '4',
    message:
      "It is not the first time we've hacked an organization similar to you. We know we are currently talking to someone non-important, most probably from a security team. We only talk to your CEO or CFO. We are asking €2.000.000,- for you, to get back your data.",
    answers: [
      {
        id: '1',
        message:
          'Right now our leadership is not available. For them to take this seriously, we need to make sure that you have actually gotten into our systems. Can you prove this by sharing some of our files, with us? If you can prove you are actually within our systems, leadership will consider talking to you.',
        short: 'coorparative',
        trigger: '5',
      },
      {
        id: '2',
        message:
          "Right now leadership is not available. They will never talk directly with you. Furthermore, they've already stated that they will never pay any ransom amount.",
        short: 'unfriendly',
        trigger: '6',
      },
    ],
  },
  {
    id: '5',
    message:
      'We will send you some proof. Please ask your leadership to reconsider. Only we can give you access to your systems and files.  #Attachment1 + #Attachment2 + #Attachment3',
    trigger: '7',
  },
  {
    id: '6',
    message: 'Then, we can only hope you have good backups.',
    trigger: '7',
  },
  {
    id: '7',
    message:
      'We are not here for fun and games, we also have a reputation and good track record to keep. Which so far, we have! You can ask any of our previous customers. We always give back the files, and no longer keep our passwords your systems.',
    answers: [
      {
        id: '1',
        message:
          'Our forensics team is familiar with your organization and know you are "trustworthy". Please give us some more time, leadership is in a meeting abroad, they are the only ones who can approve a deal like this. From our internal guidelines, we are only able to pay you €200.000,- for our data. Our leadership may be able to raise this amount by a couple of thousand euros.',
        short: 'reputation familiar',
        trigger: '8',
      },
      {
        id: '2',
        message:
          "We will never trust you, and we don't care about your reputation. Our leadership is in a meeting abroad, they are the only ones who can approve a deal like this. From our internal guidelines, we are only able to pay you €200.000,- for our data. If you take this offer, we can do a deal right now.",
        short: 'your reputation is not important',
        trigger: '9',
      },
    ],
  },
  {
    id: '8',
    message:
      "We will wait for you leadership. But, the price you are mentioning is not near enough. Another lowball like this and we will sell the data to the highest bidder on the Darkweb, on Milk Road. We know there will be a lot of demand for your data. I'm currently supporting another customer, similar to your organization, we are experiencing a full bidding war for their data on Milk Road.",
    answers: [
      {
        id: '1',
        message:
          "We understand, but we do need our leadership involved, they will join as soon as possible. Then we still need more time to buy the crypto's you accept. What is a price you are willing to accept?",
        short: 'price',
        trigger: '10',
      },
      {
        id: '2',
        message:
          "We understand, we want to offer more, but this is all we can currently do. You've seen our financials, and you know we are currently experiencing financially hard times.",
        short: 'no pay',
        trigger: '11',
      },
    ],
  },
  {
    id: '9',
    message:
      "We will never trust you. We need you to act now, the price you are mentioning is not near enough. Another lowball like this and we will sell the data to the highest bidder on the Darkweb, on Milk Road. We know there will be a lot of demand for your data. I'm currently supporting another customer, similar to your organization, we are experiencing a full bidding war for their data on Milk Road.",
    answers: [
      {
        id: '1',
        message:
          "We understand, but we do need our leadership involved, they will join as soon as possible. Then we still need more time to buy the crypto's you accept. What is a price you are willing to accept?",
        short: 'price',
        trigger: '10',
      },
      {
        id: '2',
        message:
          "We understand, we want to offer more, but this is all we can currently do. You've seen our financials, and you know we are currently experiencing financially hard times.",
        short: 'no pay',
        trigger: '11',
      },
    ],
  },
  {
    id: '10',
    message: 'We need your leadership to act now.',
    trigger: '12',
  },
  {
    id: '11',
    message: 'We do not care about any sad stories. Do you want your data?',
    trigger: '12',
  },
  {
    id: '12',
    message:
      'The minimum we need is €1.500.000,-. We will give you proof of deletion. We know this is important to our customers, and again, we have a reputation to keep up. This is our best and final offer.',
    answers: [
      {
        id: '1',
        message:
          'We expect you will give us proof of deletion, we will require it for a deal. Please consider lowering your amount.',
        short: 'nice',
        trigger: '14',
      },
      {
        id: '2',
        message:
          "Thanks for lowering your price. To consider this price, we will need to see proof that you will delete the files after you've handed the files back to us. Furthermore we need proof that you will delete any password you have to our systems. Without this proof of deletion, we won't consider any price. Your current price is still too high for us.",
        short: 'demanding',
        trigger: '13',
      },
    ],
  },
  {
    id: '13',
    message:
      "You are frustrating us by explaining, we've done this before, we know what you need! ",
    trigger: '14',
  },
  {
    id: '14',
    message:
      'We will not lower the price, my boss is okay with selling your data on Milk Road.',
    answers: [
      {
        id: '1',
        message: 'Please, wait!',
        short: 'ask for waiting',
        trigger: '15',
      },
      {
        id: '2',

        message: 'Please, we can go to €350.000,-',
        short: 'offer more money',
        trigger: '16',
      },
    ],
  },
  {
    id: '15',
    message: 'No, time is out!',
    trigger: '17',
  },
  {
    id: '16',
    message: 'Still too low…!',
    trigger: '17',
  },
  {
    id: '17',
    message:
      "You can now find your data on Milk Road. To now get back your data, you have to be the highest bidder. Good Luck! This will be a lot more than our offers! You will see a export of your active directory, with probably your own personal data being sold. Here's the link to the live auction: 12.423.12.654.M.ilk.Road.onion/auction/<ORGANIZATIONNAME>_files&personaldata",
  },
];

// const messages: MilkRoadMessage[] = [
//   {
//     id: 1,
//     text: 'Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.\n\nPellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.\n\nCum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
//     name: 'jedson0',
//     own: false,
//     time: '5:35',
//   },
//   {
//     id: 2,
//     text: 'Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.\n\nCurabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.\n\nInteger tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.',
//     name: 'wsaldler1',
//     own: false,
//     time: '11:48',
//   },
//   {
//     id: 3,
//     text: 'In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.\n\nAliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.',
//     name: 'cmathes2',
//     own: false,
//     time: '12:08',
//   },
//   {
//     id: 4,
//     text: 'Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.',
//     name: 'mbeckhouse3',
//     own: false,
//     time: '0:57',
//   },
//   {
//     id: 5,
//     text: 'Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.',
//     name: 'tcobbe4',
//     own: false,
//     time: '1:42',
//   },
//   {
//     id: 6,
//     text: 'In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.\n\nAliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.\n\nSed ante. Vivamus tortor. Duis mattis egestas metus.',
//     name: 'mwitherspoon5',
//     own: false,
//     time: '14:44',
//   },
//   {
//     id: 7,
//     text: 'Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
//     name: 'srowlinson6',
//     own: false,
//     time: '17:26',
//   },
//   {
//     id: 8,
//     text: 'Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.\n\nDuis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.',
//     name: 'blochet7',
//     own: false,
//     time: '10:53',
//   },
//   {
//     id: 9,
//     text: 'Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.\n\nMaecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.',
//     name: 'rbingle8',
//     own: false,
//     time: '13:46',
//   },
//   {
//     id: 10,
//     text: 'Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.',
//     name: 'afumagall9',
//     own: false,
//     time: '8:48',
//   },
//   {
//     id: 11,
//     text: 'Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.\n\nDuis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.\n\nMauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.',
//     name: 'smawa',
//     own: false,
//     time: '4:37',
//   },
//   {
//     id: 12,
//     text: 'Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.\n\nPraesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.',
//     name: 'dgudgeonb',
//     own: false,
//     time: '21:13',
//   },
//   {
//     id: 13,
//     text: 'Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.',
//     name: 'cdoughtonc',
//     own: false,
//     time: '9:04',
//   },
//   {
//     id: 14,
//     text: 'Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.\n\nCum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
//     name: 'pnardrupd',
//     own: false,
//     time: '1:53',
//   },
//   {
//     id: 15,
//     text: 'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.',
//     name: 'itinceye',
//     own: false,
//     time: '16:22',
//   },
//   {
//     id: 16,
//     text: 'In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.\n\nSuspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.\n\nMaecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.',
//     name: 'swadlowf',
//     own: false,
//     time: '14:39',
//   },
//   {
//     id: 17,
//     text: 'Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.\n\nSed ante. Vivamus tortor. Duis mattis egestas metus.\n\nAenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.',
//     name: 'aianneg',
//     own: false,
//     time: '15:53',
//   },
//   {
//     id: 18,
//     text: 'Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.\n\nNam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.',
//     name: 'nmuncieh',
//     own: false,
//     time: '19:51',
//   },
//   {
//     id: 19,
//     text: 'Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.\n\nMauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.\n\nNullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.',
//     name: 'adomerquei',
//     own: false,
//     time: '20:54',
//   },
//   {
//     id: 20,
//     text: 'Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.',
//     name: 'hhatwellj',
//     own: false,
//     time: '18:39',
//   },
//   {
//     id: 21,
//     text: 'Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.\n\nCurabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.',
//     name: 'smatyushkink',
//     own: false,
//     time: '7:20',
//   },
//   {
//     id: 22,
//     text: 'Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.',
//     name: 'ddawneyl',
//     own: false,
//     time: '8:47',
//   },
//   {
//     id: 23,
//     text: 'Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.\n\nMaecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.',
//     name: 'gfoulksm',
//     own: false,
//     time: '17:01',
//   },
//   {
//     id: 24,
//     text: 'Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.\n\nProin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.\n\nDuis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.',
//     name: 'itaten',
//     own: false,
//     time: '8:49',
//   },
//   {
//     id: 25,
//     text: 'Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.\n\nVestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.',
//     name: 'ccogleo',
//     own: false,
//     time: '4:44',
//   },
//   {
//     id: 26,
//     text: 'Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.',
//     name: 'bharbachp',
//     own: false,
//     time: '9:51',
//   },
//   {
//     id: 27,
//     text: 'Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.\n\nPraesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.\n\nCras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
//     name: 'blanghorneq',
//     own: false,
//     time: '22:14',
//   },
//   {
//     id: 28,
//     text: 'Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.\n\nQuisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.\n\nPhasellus in felis. Donec semper sapien a libero. Nam dui.',
//     name: 'kridgerr',
//     own: false,
//     time: '4:28',
//   },
//   {
//     id: 29,
//     text: 'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.\n\nIn sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.\n\nSuspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.',
//     name: 'leccotts',
//     own: false,
//     time: '4:50',
//   },
//   {
//     id: 30,
//     text: 'Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.\n\nInteger ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.\n\nNam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.',
//     name: 'mhearseyt',
//     own: false,
//     time: '3:20',
//   },
//   {
//     id: 31,
//     text: 'Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.',
//     name: 'bionsu',
//     own: false,
//     time: '10:57',
//   },
//   {
//     id: 32,
//     text: 'Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.\n\nMaecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.',
//     name: 'kgriniovv',
//     own: false,
//     time: '23:08',
//   },
//   {
//     id: 33,
//     text: 'In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.\n\nMaecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.\n\nMaecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.',
//     name: 'ltommeiw',
//     own: false,
//     time: '23:17',
//   },
//   {
//     id: 34,
//     text: 'Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.',
//     name: 'mwalewskix',
//     own: false,
//     time: '16:08',
//   },
//   {
//     id: 35,
//     text: 'In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.',
//     name: 'aybarray',
//     own: false,
//     time: '2:54',
//   },
//   {
//     id: 36,
//     text: 'Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.\n\nProin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.\n\nAenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.',
//     name: 'dfarryanz',
//     own: false,
//     time: '23:01',
//   },
//   {
//     id: 37,
//     text: 'In congue. Etiam justo. Etiam pretium iaculis justo.\n\nIn hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.\n\nNulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.',
//     name: 'gchisolm10',
//     own: false,
//     time: '8:41',
//   },
//   {
//     id: 38,
//     text: 'Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.\n\nDuis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.\n\nIn sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.',
//     name: 'escandrite11',
//     own: false,
//     time: '13:36',
//   },
//   {
//     id: 39,
//     text: 'Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.\n\nProin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.',
//     name: 'avellacott12',
//     own: false,
//     time: '3:16',
//   },
//   {
//     id: 40,
//     text: 'Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.\n\nInteger ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.\n\nNam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.',
//     name: 'mcatcherside13',
//     own: false,
//     time: '19:42',
//   },
//   {
//     id: 41,
//     text: 'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.\n\nIn sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.\n\nSuspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.',
//     name: 'cbruntjen14',
//     own: false,
//     time: '20:38',
//   },
//   {
//     id: 42,
//     text: 'Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.\n\nCum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\n\nEtiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.',
//     name: 'bjoel15',
//     own: false,
//     time: '2:40',
//   },
//   {
//     id: 43,
//     text: 'Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.\n\nProin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.\n\nDuis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.',
//     name: 'gdulake16',
//     own: false,
//     time: '0:31',
//   },
//   {
//     id: 44,
//     text: 'Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.',
//     name: 'cyate17',
//     own: false,
//     time: '9:14',
//   },
//   {
//     id: 45,
//     text: 'Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.',
//     name: 'vhrihorovich18',
//     own: false,
//     time: '3:23',
//   },
//   {
//     id: 46,
//     text: 'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.',
//     name: 'rzamorano19',
//     own: false,
//     time: '8:55',
//   },
//   {
//     id: 47,
//     text: 'Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.',
//     name: 'pscotcher1a',
//     own: false,
//     time: '5:16',
//   },
//   {
//     id: 48,
//     text: 'Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.\n\nProin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.',
//     name: 'dgarces1b',
//     own: false,
//     time: '3:21',
//   },
//   {
//     id: 49,
//     text: 'In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.',
//     name: 'maleksandrikin1c',
//     own: false,
//     time: '1:06',
//   },
//   {
//     id: 50,
//     text: 'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.\n\nNullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.',
//     name: 'hbailles1d',
//     own: false,
//     time: '16:02',
//   },
// ];
