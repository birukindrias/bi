import Image from 'next/image';
import BurgerMenuIcon from 'assets/outlook/burgerMenu.svg';
import NewMessageIcon from 'assets/outlook/newMessage.svg';
import DeleteIcon from 'assets/outlook/delete.svg';
import ArchiveIcon from 'assets/outlook/archive.svg';
import JunkIcon from 'assets/outlook/junk.svg';
import SweepIcon from 'assets/outlook/sweep.svg';
import MoveToIcon from 'assets/outlook/moveTo.svg';
import ChevreDownIcon from 'assets/outlook/chevDown.svg';
import PhishingIcon from 'assets/outlook/phishing_button.png';
import { useTranslations } from 'next-intl';
import { IEmail } from './InnerLayoutItems/index';
import { useStore } from '../../../utils/store/store';

interface MenuLineProps {
  activeMail: IEmail | undefined;
}

const MenuLine = ({activeMail}:MenuLineProps) => {

  const {reportEmail} = useStore()

  const reportPhishing = () => {
    if(activeMail) {
      reportEmail(activeMail)
    }
  }

  const t = useTranslations()

  const actionIcons = [
    { name: t("outlookDeleteButton"), icon: DeleteIcon },
    { name: t("outlookArchiveButton"), icon: ArchiveIcon },
    // { name: t("outlookJunkButton"), icon: JunkIcon },
    { name: t("outlookSweepButton"), icon: SweepIcon },
    { name: t("outlookMoveToButton"), icon: MoveToIcon },
  ];

  return (
    <div className="bg-outlook_light_gray py-3 px-6 items-center grid grid-cols-11 ">
      <div className="col-span-2 flex items-center">
        <div className="relative w-8 h-8 mr-12 ">
          <Image alt="" layout="fill" src={BurgerMenuIcon} />
        </div>
        <button className="flex bg-outlook_blue py-2 px-2 rounded-md text-white box-border max-w-[152px]">
          <div className="relative w-6 h-6 mr-2">
            <Image alt="" layout="fill" src={NewMessageIcon} />
          </div>
          {t("outlookNewMessage")}
        </button>
      </div>
      <div className="col-span-9 flex space-x-4">
        <div className="flex items-center">
          <p>
            {t("outlookAnswerButton")} <span className="ml-1">|</span>
          </p>
          <div className="relative w-4 h-4 ml-1 mr-4 ">
            <Image src={ChevreDownIcon} layout="fill" alt="" />
          </div>
        </div>
        <div>
          <ul className="flex items-center space-x-8">
            {actionIcons.map((icon, index) => (
              <li key={index} className="flex items-center justify-center max-w-28mpy-1 py-1 px-2 rounded-sm">
                <div className="relative w-5 h-5 mr-2">
                  <Image alt="" layout="fill" src={icon.icon} />
                </div>
                <p>{icon.name}</p>
              </li>
            ))}
            <li onClick={() => reportPhishing()} key="phishing" className="flex items-center justify-center cursor-pointer hover:bg-neutral-300 py-1 px-2 rounded-sm">
              <div className="relative w-10 h-8">
                <Image alt="" layout="fill" src={PhishingIcon} />
              </div>
              <p>{t("outlookReportPhishingButton")}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MenuLine;
