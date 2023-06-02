import { useTranslations } from 'next-intl';
const DoneScreen = () => {
  const t = useTranslations();
  return (
    <div className="relative top-0 left-0 z-50 h-full w-full bg-dpia_bg bg-no-repeat bg-cover flex flex-col items-center justify-center">
      <div className="max-w-4xl">
      <p className="text-center text-xl">{t('finishedDPIAText')}</p>
      </div>
    </div>
  );
};

export default DoneScreen;
