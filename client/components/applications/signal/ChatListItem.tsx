import classNames from 'classnames';
import Image from 'next/image';
import { Chat } from 'utils/store/signalStore';
import { useStore } from '../../../utils/store/store';
import { IMAGE_URL } from '../../../utils/constants';
import reactStringReplace from 'react-string-replace';
import { useTranslations } from 'next-intl';
interface ChatListItemProps {
  chat: Chat;
  isActive: boolean;
}

const ChatListItem = ({ chat, isActive }: ChatListItemProps) => {
  const { setActiveChatId, settingsId, teamName } = useStore();

  const t = useTranslations();

  const parseMessage = (message: string) => {
    let parsedText = message.replace('[TEAMNAME]', teamName);
    parsedText = parsedText.replace('[AUTHORITY]', t('organizationName'));
    parsedText = parsedText.replace('[CISONAME]', t('cisoName'));
    return parsedText;
  };

  return (
    <li
      onClick={() => setActiveChatId(chat.id)}
      className={classNames(
        "relative flex w-full h-full font-light hover:bg-white  cursor-pointer before:content-['']  before:w-1 before:bg-signal_white",
        {
          'bg-white before:bg-signal_blue': isActive,
        }
      )}
    >
      <div className="flex items-center pl-4 py-2">
        <div className="relative w-12 h-12">
          {chat.unreadCount > 0 && (
            <div className="z-20 rounded-full -right-1 absolute w-5 h-5 bg-signal_blue flex items-center justify-center">
              <p className="leading-[0] text-center text-xs font-normal text-white">
                {chat.unreadCount}
              </p>
            </div>
          )}
          <img
            alt=""
            className="rounded-full"
            src={encodeURI(IMAGE_URL + settingsId + '/' + chat.id + '.png')}
          />
        </div>
        <div className="flex flex-col ml-2 leading-[0] max-w-[120px]">
          <p className="text-lg">{chat.name}</p>
          <p className="truncate text-sm">
            {parseMessage(chat.messages[chat.messages.length - 1].message)}
          </p>
        </div>
      </div>
      <div className="flex items-center mr-4">
        <p className="text-sm">
          {chat.messages[chat.messages.length - 1].time}
        </p>
      </div>
    </li>
  );
};

export default ChatListItem;
