import CheckIcon from 'assets/outlook/check.svg';
import FilterIcon from 'assets/outlook/filter.svg';
import Image from 'next/image';
import { IEmail } from './index';
import classNames from 'classnames';
import { useStore } from '../../../../utils/store/store';
import { useTranslations } from 'next-intl';

interface MailOverviewProps {
  mails: IEmail[];
  activeMail?: IEmail;
  setActiveMail: (mail: IEmail) => void;
}

const MailOverview = ({
  mails,
  activeMail,
  setActiveMail,
}: MailOverviewProps) => {
  const t = useTranslations();
  const { readMail, teamName } = useStore();


  const parseHTML = (html: string) => {
    let parsedText = html.replace('[TEAMNAME]', teamName);
    parsedText = parsedText.replace('[AUTHORITY]', t('organizationName'));
    parsedText = parsedText.replace('[CISONAME]', t("cisoName"))
    return parsedText;
  };


  const parseHtmlToText = (html: string) => {
    const doc = new DOMParser().parseFromString(parseHTML(html), 'text/html');
    return doc.body.textContent || '';
  };

  let date = new Date();
  let today = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  let dateString = `${today}-${month + 1}-${year}`;

  const handleReadMail = (mail: IEmail) => {
    setActiveMail(mail);
    if (!mail.read) {
      readMail(mail);
    }
  };

  return (
    <div className="col-span-3 h-full w-full bg-outlook_beige_gray flex flex-col">
      <div className="flex items-center justify-between pr-16 pl-2 bg-white  py-2">
        <div className="flex items-center ">
          <div className="relative w-8 h-8 flex items-center">
            <Image alt="" src={CheckIcon} />
          </div>
          <p>{t('outlookPriority')}</p>
        </div>
        <div>
          <p>{t('outlookOtherButton')}</p>
        </div>
        <div className="flex items-center ">
          <div className="relative w-8 h-8 flex items-center">
            <Image alt="" src={FilterIcon} />
          </div>
          <p>{t('outlookFilterButton')}</p>
        </div>
      </div>
      <div className="w-full ">
        <ul className="flex flex-col">
          {mails.map((mail, _) => (
            <li
              onClick={() => handleReadMail(mail)}
              key={mail.id}
              className={classNames(
                'flex px-2 bg-white py-2 w-full cursor-pointer hover:bg-outlook_blue_gray hover:bg-opacity-30 justify-between',
                {
                  'bg-outlook_blue_gray bg-opacity-30':
                    mail.id === activeMail?.id,
                }
              )}
            >
              <div className="flex">
                <div
                  className={`p-5 mr-2 mt-3 h-8 w-8 bg-outlook_blue rounded-full flex items-center justify-center`}
                >
                  <p className="text-sm leading-[0] p-0 m-0 text-white font-bold text-center">
                    {mail.fromName.charAt(0)}
                  </p>
                </div>
                <div
                  className={classNames('flex flex-col w-52', {
                    'font-semibold': !mail.read,
                  })}
                >
                  <div className="flex justify-between items-center">
                    <p>{mail.fromName}</p>
                  </div>
                  <div className="flex text-sm  justify-between w-full">
                    <p className="truncate w-52">{mail.subject}</p>
                  </div>
                  <div className="truncate">{parseHtmlToText(mail.html)}</div>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center pr-4">
                <p className="text-xs font-bold uppercase text-red-700">
                  {mail.reportedAsPhishing ? 'Reported' : ' '}
                </p>
                <p className="text-sm">{dateString}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MailOverview;
