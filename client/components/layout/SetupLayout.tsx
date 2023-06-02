import { useTranslations } from 'next-intl';
import ParticleBackground from './ParticleBackground';
type LayoutProps = {
  children: React.ReactNode;
  login?: boolean;
};

function SetupLayout({ children, login }: LayoutProps) {
  const t = useTranslations();
  return (
    <div className="relative max-h-screen h-screen ">
      <div className="absolute top-0 left-0 w-full h-full z-10">
        <ParticleBackground
          backgroundColor={login ? '#053d68' : t('backgroundImageHexColor')}
        />
      </div>
      <div className="flex justify-center items-center h-full relative z-20">
        {children}
      </div>
    </div>
  );
}

export default SetupLayout;
