import { useTranslations } from 'next-intl';

type DescriptionProps = {
  openPreview: () => void;
}
const Description = ({openPreview}:DescriptionProps) => {
  const t = useTranslations();
  return (
    <div className="text-white py-4 px-8 font-light">
      <p className="font-normal text-2xl mb-12">{t('sur5_sidebar_title')}</p>
      <p className="mb-12 ">{t('sur5_sidebar_paragraph')}</p>
      <div className="border-b space-y-3 pb-8">
        <div>
          <p>{t('sur5_sidebar_website_title')}</p>
          <p>{t('sur5_sidebar_website_link')}</p>
        </div>
        <div>
          <p>{t('sur5_sidebar_worth_title')}</p>
          <p>{t('sur5_sidebar_worth_amount')}</p>
        </div>
        <div>
          <p>{t('sur5_sidebar_employees_title')}</p>
          <p>{t('sur5_sidebar_employees_count')}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="font-medium mb-2">{t('sur5_sidebar_upload_title')}</p>
        <div className="flex">
          <p onClick={() => openPreview()} className="hover:underline text-hive_orange text-sm mb-2 cursor-pointer">
            {t('sur5_sidebar_upload_link')}
          </p>
          <p className="text-sm text-hive_gray ml-1">
            {t('sur5_sidebar_upload_size')}
          </p>
        </div>
      </div>
      {/* <button
        className="py-2 px-6 mt-6 bg-transparent border text-hive_orange border-hive_orange rounded-md hover:text-white hover:bg-hive_orange"
      >
        {t("sur5_sidebar_upload_button")}
      </button> */}
    </div>
  );
};

export default Description;
