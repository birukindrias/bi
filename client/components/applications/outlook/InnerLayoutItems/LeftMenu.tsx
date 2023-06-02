import ChevDownIcon from 'assets/outlook/chevDown.svg';
import Image from 'next/image';
import InboxIcon from "assets/outlook/inbox.svg";
import JunkIcon from "assets/outlook/junk_2.svg"
import ConceptsIcon from "assets/outlook/concepts.svg"
import SentIcon from "assets/outlook/send.svg"
import DeletedIcon from "assets/outlook/delete.svg"
import ArchiveIcon from "assets/outlook/archive.svg"
import { useTranslations } from 'next-intl';

const LeftMenu = () => {
  const t = useTranslations();

  const actionIcons = [

    {
      name: t("outlookLeftMenuInboxButton"),
      icon:InboxIcon
    },
    {
      name:t("outlookJunkButton"),
      icon:JunkIcon
    },
    {
      name:t("outlookLeftMenuDraftsButton"),
      icon:ConceptsIcon
    },
    {
      name:t("outlookLeftMenuSentButton"),
      icon:SentIcon
    },
    {
      name:t("outlookLeftMenuDeleteButton"),
      icon:DeletedIcon
    },
    {
      name:t("outlookArchiveButton"),
      icon:ArchiveIcon
    }
  ]


  return (
    <div className="col-span-2 h-full w-full bg-outlook_light_gray  py-2">
    <div className='flex items-center px-8'>
      <div className="relative w-4 h-4 mr-5">
        <Image alt="" layout="fill" src={ChevDownIcon} />
      </div>
      <p className='font-semibold'>{t("outlookLeftMenuFolderTitle")}</p>
    </div>
    <div>
      <ul className='flex flex-col space-y-5 mt-8'>
        {actionIcons.map((icon,index)=>(
          <li key={icon.name} className="flex items-center px-12">
            <div className='relative w-5 h-5 mr-2'>
              <Image src={icon.icon} alt="" layout='fill'/>
            </div>
            <p className='font-thin'>{icon.name}</p>
          </li>
        ))}
      </ul>
    </div>
  </div>
  );
}

export default LeftMenu;
