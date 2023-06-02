import Image from 'next/image';
import ParticleBackground from './layout/ParticleBackground';
import { useTranslations } from 'next-intl';
import Background from 'assets/1_background.png';
import InputContainer from './layout/InputContainer';
import Button from './inputs/button';

interface LoadSavedGameProps {
  loadSavedState: () => void;
  startNewGame: () => void;
}

const LoadSavedGame = ({
  loadSavedState,
  startNewGame,
}: LoadSavedGameProps) => {
  const t = useTranslations();
  return (

    <div className="fixed z-50 top-0 left-0 bg-gray-800 bg-opacity-40 h-screen w-screen">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-1/3 rounded-xl">
        <div className="py-8 px-6 flex flex-col justify-between h-full">
          <div className="pb-8">
            <p>
             {t("savedGame")}
            </p>
          </div>
          <div className="flex px-4 space-x-2">
            <Button color="red" onClick={() => startNewGame()}>
              {t("savedGameButtonNew")}
            </Button>
            <Button onClick={() => loadSavedState()}>{t("savedGameButtonLoad")}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadSavedGame;
