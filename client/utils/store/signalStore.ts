import { StoreSlice } from './store';
import { GAME_LENGTH_IN_SECONDS } from '../constants';
import { TimerSlice } from './timerStore';
import { ObjectiveSettings, Objectives, SettingsSlice } from './settingsStore';

export interface Answer {
  id: string | number;
  message: string;
  trigger: string;
  triggerAfterXseconds?: number;
  costs?: number; // describes the cost of the decision in money
}

export interface TaskTrigger {
  task: Objectives; //task
  triggerTimeInSeconds: number; //time in seconds after which to trigger the message if task isn't done
}

export interface Message {
  id: string | number;
  message: string; // the message to display
  read: boolean; // whether the message has been read
  time?: string; // the time the message was sent
  own: boolean; // whether the message was sent by the user
  triggerTimeInSeconds?: number; //time in seconds when to send this message (after x seconds played)
  answers?: Answer[]; //possible answers for this message
  taskTrigger?: TaskTrigger; //TODO: id of task, trigger message if a task isn't done
}

export interface Chat {
  id: string;
  name: string;
  unreadCount: number;
  messages: Message[];
}

export interface SignalSlice extends Partial<SettingsSlice> {
  triggerSignal: (
    newTimeInSeconds: number,
    objectives: ObjectiveSettings[] | undefined
  ) => void;
  chatQueue: Chat[];
  loadChatsInQueue: (chats: Chat[]) => void;
  chats: Chat[];
  typing: boolean;
  activeChatId: string | null;
  setActiveChatId: (n: string) => void;
  handleAnswerTrigger: (answer: Answer | undefined, chatId: string) => void;
}

export const createSignalSlice: StoreSlice<SignalSlice> = (set, get) => ({
  chatQueue: [], //inactive chats and messages
  chats: [], //active chats and messages
  loadChatsInQueue: (chats: Chat[]) => {
    set({
      chatQueue: chats,
    });
  },
  typing: false,
  activeChatId: null,
  handleAnswerTrigger: (answer: Answer | undefined, chatId: string) => {
    if (!answer) return;

    if (answer.costs) {
      get()?.addMoney?.(answer.costs);
    }

    let activeId = chatId;
    let chats = get().chats;
    let chatIndex = chats.findIndex((c) => c.id == activeId);
    if (chatIndex === -1) return;

    //chat for the answer
    const chat = chats[chatIndex];
    let chatQueue = get().chatQueue;

    //creating message out of answer
    let newAnswerMessage: Message = {
      id: new Date().getTime().toString(),
      message: answer.message,
      read: true,
      own: true,
    };

    //adding message to chat
    chat.messages.push(newAnswerMessage);
    //set chat in chats
    chats[chatIndex] = chat;

    if (chatIndex != 0) {
      chats.splice(chatIndex, 1);
      chats = [chat, ...chats];
    }

    if (answer.triggerAfterXseconds) {
      set({
        chats: [...chats],
      });
    } else if (!answer.trigger) {
      set({
        chats: [...chats],
      });
    } else {
      set({
        chats: [...chats],
        typing: true,
      });
    }

    setTimeout(() => {
      //@ts-ignore
      let timePlayed = GAME_LENGTH_IN_SECONDS - get().gameTimeInSeconds;

      let chats = get().chats;
      let chatIndex = chats.findIndex((c) => c.id == activeId);
      let chatQIndex = chatQueue.findIndex((c) => c.id == activeId);
      if (chatIndex === -1) return;

      const chat = chats[chatIndex];

      //find chat in queue

      if (chatIndex === -1) return;
      let chatInQueue = chatQueue[chatQIndex];
      // find and remove triggered message from chatInQueue
      let messageIndex = chatInQueue.messages.findIndex(
        (m) => m.id == answer.trigger?.toString()
      );
      if (messageIndex === -1) return;

      let answerMessage = chatInQueue.messages[messageIndex];

      if (answer.triggerAfterXseconds) {
        chatQueue[chatQIndex].messages[messageIndex].triggerTimeInSeconds =
          timePlayed + answer.triggerAfterXseconds;

        set({
          chatQueue,
          typing: false,
        });
        return;
      }

      chat.messages.push(answerMessage);

      if (activeId !== get().activeChatId) {
        chat.unreadCount++;
      }

      chatInQueue.messages.splice(messageIndex, 1);

      if (chatInQueue.messages.length === 0) {
        chatQueue.splice(chatQIndex, 1);
      }

      chatQueue = [...chatQueue, chatInQueue];

      chats[chatIndex] = chat;

      if (chatIndex != 0) {
        chats.splice(chatIndex, 1);
        chats = [chat, ...chats];
      }

      set({
        chatQueue: chatQueue,
        typing: false,
        chats: [...chats],
      });
    }, 2000);
  },
  setActiveChatId: (n: string) => {
    let localChats = get().chats;
    //set active chat id and set messages to read
    const activeChatIndex = localChats.findIndex((c) => c.id === n);
    if (activeChatIndex !== -1) {
      const activeChat = localChats[activeChatIndex];
      const messages = activeChat.messages.map((m) => ({ ...m, read: true }));
      localChats[activeChatIndex] = { ...activeChat, messages, unreadCount: 0 };
      set({ chats: [...localChats], activeChatId: n });
    }
  },
  triggerSignal: (
    gameTime: number,
    objectives: ObjectiveSettings[] | undefined
  ) => {
    let timePlayed = GAME_LENGTH_IN_SECONDS - gameTime;
    let localChats = get().chats;

    let chatQueue = get().chatQueue;
    let newQueue: Chat[] = chatQueue;

    //check if chatQueue is empty or not defined
    if (!chatQueue || chatQueue.length <= 0) return [chatQueue || [], []];

    //iterate over every chat in chatQueue
    for (let i = 0; i < chatQueue.length; i++) {
      // debugger;

      //we can always just add one message to the chat which requires an answer
      let addedQuestion = false;

      let chat = chatQueue[i];

      //if chat in active chats and last message in active chats is waiting for answer, don't trigger
      let localChat = localChats.find((c) => c.id === chat.id);
      if (localChat) {
        let lastMessage = localChat.messages[localChat.messages.length - 1];
        if (lastMessage.answers && lastMessage.answers.length > 0) {
          continue;
        }
      }

      //iterate over every message in chat from chatQueue
      for (let j = 0; j < chat.messages.length; j++) {
        let message = chat.messages[j];

        //check if we already added a message requiring an answer, if so, break
        if (message.answers && message.answers.length > 0) {
          if (addedQuestion) break;
          addedQuestion = true;
        }

        //HANDLE TASK TRIGGER
        if (message.taskTrigger) {
          // if last message is waiting for an answer, send it again after the task message

          if (
            objectives &&
            objectives.find((t) => t.name === message.taskTrigger?.task)
              ?.done === false &&
            message.taskTrigger?.triggerTimeInSeconds! <= timePlayed
          ) {
            //check if chat is already in chats, if not, add it
            let chatInChats = localChats.find((c) => c.id === chat.id);

            if (!chatInChats) {
              localChats = [...localChats, { ...chat, messages: [] }];
            }

            //add message to chat
            let chatInChatsIndex = localChats.findIndex(
              (c) => c.id === chat.id
            );

            let lastMessage: Message | undefined;
            if (chatInChatsIndex > -1) {
              //add new message to chat and place chat at beginning
              let temp = localChats[chatInChatsIndex];

              //check if last one is waiting for an answer, if yes, send it again

              // if (
              //   temp.messages.length > 0 &&
              //   temp.messages[temp.messages.length - 1]?.answers
              // ) {

              //   // lastMessage = temp.messages[temp.messages.length - 1];
              //   // temp.unreadCount++;
              // }

              // if (lastMessage) temp.messages.push(lastMessage);
              temp.messages.push(message);

              temp.unreadCount++;
              localChats.splice(chatInChatsIndex, 1);
              localChats = [temp, ...localChats];
            }

            //remove message from queue
            newQueue[i].messages.splice(j, 1);

            //remove chat from queue if no messages left
            if (newQueue[i].messages.length <= 0) {
              newQueue.splice(i, 1);
            }
          }
        }
        //handle message with time trigger
        else {
          //if trigger time is reached
          if (
            message.triggerTimeInSeconds &&
            message.triggerTimeInSeconds! <= timePlayed
          ) {
            //check if chat is already in chats, if not, add it
            let chatInChats = localChats.find((c) => c.id === chat.id);
            if (!chatInChats) {
              localChats = [...localChats, { ...chat, messages: [] }];
            }

            //add message to chat
            let chatInChatsIndex = localChats.findIndex(
              (c) => c.id === chat.id
            );

            if (chatInChatsIndex > -1) {
              //add new message to chat and place chat at beginning
              let temp = localChats[chatInChatsIndex];
              temp.messages.push(message);
              temp.unreadCount++;
              localChats.splice(chatInChatsIndex, 1);
              localChats = [temp, ...localChats];
            }

            //remove message from queue
            newQueue[i].messages.splice(j, 1);

            //remove chat from queue if no messages left
            if (newQueue[i].messages.length <= 0) {
              newQueue.splice(i, 1);
            }
          }
        }
      }
    }
    set(() => ({
      chats: localChats,
      chatQueue: newQueue,
    }));
  },
});
