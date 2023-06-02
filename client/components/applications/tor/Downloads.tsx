import { useStore } from '../../../utils/store/store';
import { useTranslations } from 'next-intl';
import {
  openApplications,
  Applications,
} from '../../../utils/store/settingsStore';
const Downloads = () => {

  const t = useTranslations()
  const { focusApplication, setOpenApplication } = useStore();

  const handleOpenVsCode = () => {
    setTimeout(() => {
      setOpenApplication(Applications.VSCODE, true);
      focusApplication(Applications.VSCODE);
    }, 200);
  };

  return (
    <div className=" w-full bottom-0  bg-gray-600 pt-1 px-4 flex items-end">
      <div
        onClick={() => handleOpenVsCode()}
        className="bg-gray-400 hover:bg-gray-300 cursor-pointer py-2 px-6 rounded-md rounded-br-none rounded-bl-none flex items-center"
      >
        <p className="text-sm">{t("fileDownloadText")}</p>
        <p className="text-sm ml-2"></p>
      </div>
    </div>
  );
};

export default Downloads;
