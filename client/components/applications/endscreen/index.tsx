import VideoPlayer from 'components/layout/VideoPlayer';
import { useStore } from '../../../utils/store/store';
import { PLACEHOLDER_VIDEO_URL } from 'utils/constants';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
const Index = () => {

  const t = useTranslations()
  const { goodEnding, gameId, teamId } = useStore();




  const router = useRouter();

  const handleForward = () => {
    if (gameId && teamId) {
      router.push(`/score/${gameId}/${teamId}`);
    }
  };
  const getVideo = () => {
    if (goodEnding) {
      return (
        <VideoPlayer
          url={t("goodEndVideoLink")}
          onEnded={() => handleForward()}
        />
      );
    } else {
      return (
        <VideoPlayer
          url={t("badEndVideoLink")}
          onEnded={() => handleForward()}
        />
      );
    }
  };

  return (
    <div className="h-full w-full font-sharetech bg-black">
      <div className="absolute top-0 left-0 z-[90] h-full w-full  bg-black">{getVideo()}</div>
    </div>
  );
};

export default Index;
