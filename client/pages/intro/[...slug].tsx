import VideoPlayer from 'components/layout/VideoPlayer';
import { GetServerSideProps } from 'next';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getLanguageFile } from 'utils/api';
import { PLACEHOLDER_VIDEO_URL } from 'utils/constants';
import { Objectives } from 'utils/store/settingsStore';
import { useStore } from '../../utils/store/store';


const Index = () => {
  const t = useTranslations();
  const router = useRouter();
  const { slug } = router.query;
  const { addGameId, addTeamId, gameId, teamId, addToScore, finishObjective} = useStore();
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  useEffect(() => {
    if (router.isReady && Array.isArray(slug) && slug.length === 2) {
      const [gameId, teamId] = slug;
      addGameId(gameId);
      addTeamId(teamId);
    }
  }, [slug, addGameId, addTeamId, router.isReady]);
  return (
    <div className="w-screen h-screen bg-black">
      {!isSSR && (
        <VideoPlayer
          t={t}
          url={t("introVideoUrl")}
          onEnded={() => {
            finishObjective(Objectives.FINISH_INTRO)
            addToScore(10)
            router.push(`/game/${gameId}/${teamId}`)
          }}
        />
      )}
    </div>
  );
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  const gameId = context.params?.slug?.[0];
  if (!gameId) {
    return {
      props: {},
    };
  }
  //TODO: ADD GET LANGUAGE FILE
  const json = await getLanguageFile(gameId as string);
  return {
    props: {
      messages: json,
    },
  };
};

export default Index;
