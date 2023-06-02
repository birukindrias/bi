import { getLanguageFile, getTeam, Result, updateTeam } from '../../utils/api';
import { GetServerSideProps } from 'next';
import ParticleBackground from 'components/layout/ParticleBackground';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import InterpolLogo from 'assets/score/interpol_logo.png';
import { useStore } from '../../utils/store/store';
import { secondsToTimeFormat } from '../../utils/helper';
import { GAME_LENGTH_IN_SECONDS } from 'utils/constants';
import { Objectives } from '../../utils/store/settingsStore';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
interface LocalObjective {
  name: Objectives;
  description: string;
  goodText: string;
  badText: string;
  done: boolean;
}
const Index = ({ teamId }: { teamId: string }) => {
  // SAVE GAME SCORE TO DATABASE:
  const t = useTranslations();
  const {
    gameTimeInSeconds,
    score,
    objectives,
    assessment,
    setAssessment,
    moneySpent,
    teamName,
    companyName,
    stopTimer,
  } = useStore();

  const [timePlayedInSeconds, setTimePlayedInSeconds] = useState(0);
  const [localObjectives, setLocalObjectives] = useState<LocalObjective[]>([]);
  const [objectiveCount, setObjectiveCount] = useState(0);
  const [localMoneySpent, setLocalMoneySpent] = useState(0);
  const [gameScore, setGameScore] = useState(0);

  useEffect(() => {
    //FETCH RESULTS FROM DATABASE
    stopTimer()
    fetchGameResults();
  }, []);

  const fetchGameResults = async () => {
    let res = await getTeam(teamId);

    if (res.status === 200 && res.data.result) {
      let result: Result = res.data.result;
      setGameScore(result.score);
      setObjectiveCount(result.objectives || 0);
      setLocalMoneySpent(result.moneySpent || 0);
      setTimePlayedInSeconds(result.timePlayedInSeconds || 0);
      if (result.riskAssessment) {
        setAssessment(result.riskAssessment);
      }
    } else {
      let score = calculateGameScore();
      let objectiveCountLocal = getObjectives();
      let timePlayedInSeconds = GAME_LENGTH_IN_SECONDS - gameTimeInSeconds;
      setGameScore(score);
      setObjectiveCount(objectiveCountLocal);
      setLocalMoneySpent(moneySpent);
      setTimePlayedInSeconds(timePlayedInSeconds);
      let result = {
        score,
        objectives: objectiveCountLocal,
        moneySpent,
        timePlayedInSeconds,
        riskAssessment: assessment,
      };

      await updateTeam(teamId, {
        result,
      });
    }
  };

  const calculateGameScore = () => {
    let timePlayed = gameTimeInSeconds;
    if (timePlayed <= 0) {
      timePlayed = 1;
    }

    let newScore = (score + 10 / timePlayed) * 2.777777777777778;

    newScore = Math.round(newScore);

    return newScore;
  };

  const getObjectives = () => {
    let counter = 0;
    let tempObjectives: LocalObjective[] = [];
    let objectivesToCount: {
      name: Objectives;
      description: string;
      goodText: string;
      badText: string;
    }[] = [
      {
        name: Objectives.PHISHING_REPORTED,
        description: t('score_phishing_reported'),
        goodText: t('score_phishing_reported_good'),
        badText: t('score_phishing_reported_bad'),
      },
      {
        name: Objectives.PREVENT_DATA_LEAK,
        description: t('score_prevent_data_leak'),
        goodText: t('score_prevent_data_leak_good'),
        badText: t('score_prevent_data_leak_bad'),
      },
      {
        name: Objectives.SCHEDULE_MEETING,
        description: t('score_schedule_meeting'),
        goodText: t('score_schedule_meeting_good'),
        badText: t('score_schedule_meeting_bad'),
      },
      {
        name: Objectives.NEGOTIATION,
        description: t('score_negotiation'),
        goodText: t('score_negotiation_good'),
        badText: t('score_negotiation_bad'),
      },
      {
        name: Objectives.GET_DATA_BACK,
        description: t('score_get_data_back'),
        goodText: t('score_get_data_back_good'),
        badText: t('score_get_data_back_bad'),
      },
    ];

    for (let i = 0; i < objectivesToCount.length; i++) {
      let objectiveName = objectivesToCount[i];
      let done = false;
      if (objectives.find((c) => c.name === objectiveName.name)?.done) {
        done = true;
        counter += 1;
      }

      tempObjectives.push({
        name: objectiveName.name,
        description: objectiveName.description,
        goodText: objectiveName.goodText,
        badText: objectiveName.badText,
        done,
      });
    }
    setLocalObjectives((prev) => [...tempObjectives]);
    return counter;
  };

  return (
    <div className="relative h-screen w-screen">
      <div className="absolute z-10 right-0 bottom-0 w-full h-full">
        <ParticleBackground
          backgroundColor={t('backgroundImageHexColor')}
        ></ParticleBackground>
      </div>
      <div className="relative z-50 text-white pt-12 mx-auto px-20 w-full max-w-7xl">
        <div className="flex items-center justify-start space-x-4 border-b-[1px] border-white pb-8">
          <div className="relative w-20">
            <Image alt="" src={InterpolLogo} />
          </div>
          <div className="font-oswald">
            <p className="text-6xl pb-2">{t("score_title")}</p>
            <p className="text-2xl font-thin tracking-widest">
              {t("score_subtitle")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 font-lato">
          <div className="col-span-1 mt-12">
            <h1 className="font-bold text-2xl">{t("score_game_stats_title")}</h1>
            <ul className="mt-8 space-y-4">
              <li className="flex items-center text-lg">
                <div className="w-56">
                  <p>{t('score_time_left')}</p>
                </div>
                <div className="py-1 w-40 bg-white text-black items-center justify-center flex font-bold">
                  {secondsToTimeFormat(gameTimeInSeconds)}
                </div>
              </li>
              <li className="flex items-center text-lg">
                <div className="w-56">
                  <p>{t('score_money_spent')}</p>
                </div>
                <div className="py-1 w-40 bg-white text-black items-center justify-center flex font-bold">
                  €{moneySpent}
                </div>
              </li>
              <li className="flex items-center text-lg">
                <div className="w-56">
                  <p>{t('score_game_score')}</p>
                </div>
                <div className="py-1 w-40 bg-white text-black items-center justify-center flex font-bold">
                  {gameScore}
                </div>
              </li>
              <li className="flex items-center text-lg">
                <div className="w-56">
                  <p>{t('score_goals_archived')}</p>
                </div>
                <div className="py-1 w-40 bg-white text-black items-center justify-center flex font-bold">
                  {objectiveCount}/5
                </div>
              </li>
            </ul>

            <div className="pl-12 mt-10">
            <h1 className="font-bold text-2xl my-2 mb-4">{t("score_implicit_stats_title")}</h1>
              <div className="space-y-4">
                {localObjectives.map((objective) => (
                  <div
                    key={objective.name + Date.now().toString()}
                    className="flex items-center "
                  >
                    <div
                      className={classNames(
                        'h-6 w-6 border-white border-2 mr-4 block',
                        {
                          'bg-white': objective.done,
                        }
                      )}
                    />
                    <div>
                      <p className="text-lg">{objective.description}</p>
                      <p>
                        {objective.done
                          ? objective.goodText
                          : objective.badText}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-1 mt-12">
            {localObjectives.length > 0 && (
              <div className="w-full h-full col-span-3">
                <iframe
                  src={`https://cyberbarometer.brooklynpartners.nl/zs/CRBj7C?organisatie=${encodeURIComponent(
                    companyName ?? ''
                  )}&team=${encodeURIComponent(teamName ?? '')}`}
                  frameBorder="0"
                  className="h-full w-full"
                  scrolling="auto"
                  allow="geolocation"
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const gameId = context.params?.slug?.[0];
  const teamId = context.params?.slug?.[1];
  if (!gameId) {
    return {
      props: {},
    };
  }
  const json = await getLanguageFile(gameId);

  return {
    props: {
      messages: json,
      gameId: gameId,
      teamId: teamId,
    },
  };
};

export default Index;
