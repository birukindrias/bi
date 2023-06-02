import { useStore } from '../../utils/store/store';
import { Applications } from '../../utils/store/settingsStore';
import { useTranslations } from 'next-intl';
import { replacePlaceholder } from '../../utils/helper';
import { MILKROAD_URL } from '../../utils/constants';
const DevLayout = () => {
  const t = useTranslations();
  const {
    startTimer,
    timer,
    stopTimer,
    setOpenApplication,
    openApplications,
    isSideView,
    setIsSideView,
    score,
    resetTimer,
    moneySpent,
    openTorPage,
    focusApplication,
    assessment,
    saveState,
    loadState,
  } = useStore();

  const handleReplace = (message: string) => {
    return replacePlaceholder(
      message,
      '<ORGANIZATIONNAME>',
      t('urlOrgianization')
    );
  };

  const handleTimer = () => {
    if (timer) {
      stopTimer();
      resetTimer();
      return;
    }
    startTimer();
  };

  const toggleSideView = () => {
    let open = !isSideView
    setIsSideView(open);
    setOpenApplication(Applications.CRYPTII, open);
    setOpenApplication(Applications.TOR, open);
    if(open) {
      focusApplication(Applications.CRYPTII);
      focusApplication(Applications.TOR);
    }

  };

  const handleOpenApplication = (application: Applications) => {
    if (openApplications[application]) {
      setOpenApplication(application, false);
      return;
    }
    setOpenApplication(application, true);
  };
  return (
    <div className="absolute z-50  w-screen overflow-hidden">
      <div className="w-full bg-gray-400 py-2 px-3 flex space-x-2">
        <button className="admin_button " onClick={handleTimer}>
          {timer ? 'Stop' : 'Start'} Timer
        </button>
        {/* <button
          className="admin_button"
          onClick={() => handleOpenApplication(Applications.HACK)}
        >
          {openApplications[Applications.HACK] ? 'Close' : 'Open'} Hack
        </button>
        <button
          className="admin_button"
          onClick={() => handleOpenApplication(Applications.DPIA)}
        >
          {openApplications[Applications.DPIA] ? 'Close' : 'Open'} DPIA
        </button> */}
        <button
          className="admin_button"
          onClick={() => handleOpenApplication(Applications.ENDSCREEN)}
        >
          {openApplications[Applications.ENDSCREEN] ? 'Close' : 'Open'}{' '}
          Endscreen
        </button>
        <button
          className="admin_button"
          onClick={() => openTorPage(handleReplace(MILKROAD_URL))}
        >
          Open Milkroad
        </button>
        <button className="admin_button" onClick={() => toggleSideView()}>
          Sideview {isSideView ? 'Off' : 'On'}
        </button>
        <button className="admin_button" onClick={() => saveState()}>
          Save Game State
        </button>
        <button className="admin_button" onClick={() => loadState()}>
          Load Game State
        </button>
        <div>
          <p className="text-white">Money Spent: {moneySpent}</p>
        </div>
        <div>
          <p className="text-white">Score: {score}</p>
        </div>
        <div>
          <p className="text-white">Assessment: {assessment}</p>
        </div>
      </div>
    </div>
  );
};

export default DevLayout;
