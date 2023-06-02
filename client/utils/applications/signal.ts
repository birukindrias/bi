interface Message {
  id: number;
  text: string;
  own: boolean;
  time: string;
  showAfter: number; // in sekonds, 0 = show immediately
}

interface Chat {
  id: number;
  name: string;
  messages: Message[];
  active: boolean; // triggers a chat
}

const chat1: Chat = {
  id: 1,
  name: 'Security Expert',
  messages: [],
  active: true,
};

export {};
