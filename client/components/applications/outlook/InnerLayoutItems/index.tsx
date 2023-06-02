import LeftMenu from './LeftMenu';
import MailOverview from './MailOverview';
import { useState } from 'react';
import MailView from './MailView';
import { useStore } from 'utils/store/store';

export interface IEmail {
  id: string;
  fromName: string;
  fromMail: string;
  isPhishing: boolean;
  reportedAsPhishing?: boolean;
  subject: string;
  date: string;
  // we went await from html, now its simply text
  html: string;
  hasAttachment?: boolean;
  attachmentName?: string;
  attachmentSize?: string;
  triggerTimeInSeconds?: number; // seconds delay before receiving
  read?: boolean
}

interface InnerMainLayoutProps {
  mails: IEmail[];
  activeMail?: IEmail;
  setActiveMail: (mail: IEmail) => void;
}


const InnerMainLayout = ({mails, activeMail, setActiveMail}:InnerMainLayoutProps) => {





  return (
    <div className="grid grid-cols-11 w-full h-full overflow-auto">
      <LeftMenu />
      <MailOverview
        mails={mails}
        activeMail={activeMail}
        setActiveMail={setActiveMail}
      />
     {activeMail && <MailView mail={activeMail} />}
    </div>
  );
};

export default InnerMainLayout;
