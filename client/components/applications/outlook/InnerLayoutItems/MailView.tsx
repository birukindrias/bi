import { IEmail } from './index';
import { useTranslations } from 'next-intl';
import { useStore } from 'utils/store/store';
import PDFLogo from 'assets/outlook/pdf_icon.png';
import Image from 'next/image';
import { useState } from 'react';
import { SERVER_URL } from 'utils/constants';
import { XIcon } from '@heroicons/react/outline';
interface MailViewProps {
  mail: IEmail;
}

const MailView = ({ mail }: MailViewProps) => {
  const { teamName, settingsId } = useStore();
  const t = useTranslations();

  let serverProfileImageUrl = `${SERVER_URL}/settings/images/${settingsId}/mail_attachment.png`;
  const [showPreview, setShowPreview] = useState(false);
  const parseHTML = (html: string) => {
    let parsedText = html.replace('[TEAMNAME]', teamName);
    parsedText = parsedText.replace('[AUTHORITY]', t('organizationName'));
    parsedText = parsedText.replace('[CISONAME]', t('cisoName'));
    return parsedText;
  };

  const handleOpenPreview = () => {
    setShowPreview(true);
  };
  return (
    <div className="col-span-6 bg-outlook_beige_gray w-full flex flex-col  overflow-scroll ">
      {showPreview && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black w-full h-full z-10 bg-opacity-70">
          <div className='relative flex items-center justify-center h-full overflow-scroll'>
            <div className='absolute top-2 right-2'><XIcon className='text-white h-12 cursor-pointer hover:bg-gray-400 rounded-md' onClick={() => setShowPreview(false)}/></div>
            <img src={serverProfileImageUrl}></img>
          </div>
        </div>
      )}

      <h2 className="font-semibold text-3xl py-3 pl-3 ">{mail.subject}</h2>
      <div className="bg-white ml-2 mr-2 shadow-sm ">
        <div className="flex items-center py-2 px-3 ">
          <div
            className={`p-5 h-8 w-8 bg-outlook_blue rounded-full  flex items-center justify-center`}
          >
            <p className="text-sm leading-[0] p-0 m-0 text-white font-bold text-center">
              {mail.fromName.charAt(0)}
            </p>
          </div>
          <div className="ml-2">
            <p>{mail.fromName + `<${mail.fromMail}>`}</p>
            <p className="text-sm">{t('outlookToText')}</p>
          </div>
        </div>
        {mail.hasAttachment && (
          <div
            onClick={() => handleOpenPreview()}
            className="ml-4 mt-2 border border-gray-300 rounded-md max-w-fit flex py-2 px-4 items-center cursor-pointer hover:bg-gray-200"
          >
            <div className="relative w-8 mr-2 flex items-center">
              <Image src={PDFLogo} alt="" />
            </div>
            <div className="">
              <p className="">{mail.attachmentName || ''}</p>
              <p className="font-thin text-outlook_dark_gray">
                {mail.attachmentSize || ''}
              </p>
            </div>
          </div>
        )}
        <div className="px-4 mt-2 py-4 mailView">
          <div
            dangerouslySetInnerHTML={{
              __html: parseHTML(mail.html) as unknown as string,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MailView;
