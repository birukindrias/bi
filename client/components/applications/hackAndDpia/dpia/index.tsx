import VideoPlayer from 'components/layout/VideoPlayer';
import { useState, Fragment, useEffect } from 'react';
import { Range } from 'react-range';
import { useTranslations } from 'next-intl';
import { useStore } from '../../../../utils/store/store';
import { Objectives } from '../../../../utils/store/settingsStore';
import DoneScreen from './doneScreen';
const Index = () => {
  const {
    selectedDepartment,
    addToScore,
    finishObjective,
    assessment,
    setAssessment,
    isObjectiveFinished,
    dpiaInputData,
    setDpiaInputData,
    dpiaStep,
    nextDpiaStep,
    previousDpiaStep,
    feedbackOverlayOpen,
    setFeedbackOverlayOpen,
  } = useStore();
  const t = useTranslations();

  const [videoDone, setVideoDone] = useState(false);
  const finishDpia = (booked: boolean) => {
    if (booked) {
      finishObjective(Objectives.SCHEDULE_MEETING);
      addToScore(100);
    } else {
      finishObjective(Objectives.DIDNT_SCHEDULE_MEETING);
    }
  };

  const openThanksOverlay = (decision: 'SHUTDOWN' | 'KEEP') => {
    if (decision === 'SHUTDOWN') {
      finishObjective(Objectives.PREVENT_DATA_LEAK);
      addToScore(50);
    }
    setFeedbackOverlayOpen(true);
  };
  const handleDecision = (decision: 'SHUTDOWN' | 'KEEP') => {
    setFeedbackOverlayOpen(false);
    nextDpiaStep();
  };
  const handleInputChange = (e: any) => {
    const { id, value } = e.target;
    setDpiaInputData(id, value);
  };

  useEffect(() => {
    let nums = [
      dpiaInputData[3][0],
      dpiaInputData[4][0],
      dpiaInputData[5][0],
      dpiaInputData[6][0],
    ];
    let total = nums.reduce((acc, curr) => acc + curr, 0);

    //0-4.=4 5-11 = 6 12-16 = 4

    if (total <= 4) {
      setAssessment('low');
    } else if (total <= 11) {
      setAssessment('medium');
    } else {
      setAssessment('high');
    }
  }, [dpiaInputData, dpiaStep]);

  const getStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div className="w-full h-full bg-black">
            <VideoPlayer
              url={t('dpiaIntroVideoLink')}
              onEnded={() => nextDpiaStep()}
            />
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col space-y-12">
            <p className="mx-auto">{t('dpiaIntroText')}</p>
            <div className="flex max-w-4xl space-x-12">
              <div className="flex flex-col flex-1 justify-between">
                <label className="text-lg py-1 text-center mb-4" htmlFor="1">
                  <span className="font-bold mr-1">1.</span>
                  {t('dpiaQuestion1')}
                </label>
                <textarea
                  rows={2}
                  className="py-3 resize-none rounded-3xl bg-black bg-opacity-40 focus:ring-0 focus:border-0 border-0"
                  id="1"
                  value={dpiaInputData['1']}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="flex flex-col flex-1 justify-between">
                <label className="text-lg py-1 text-center mb-4" htmlFor="2">
                  <span className="text-lg font-bold mr-1">2.</span>
                  {t('dpiaQuestion2')}
                </label>
                <textarea
                  rows={2}
                  className="py-3 resize-none rounded-3xl bg-black bg-opacity-40 focus:ring-0 focus:border-0 border-0"
                  id="2"
                  value={dpiaInputData['2']}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-lg py-1 text-center mb-2" htmlFor="2">
                <span className="text-lg font-bold mr-1">3.</span>
                {t('dpiaQuestion3')}
              </label>

              <div className="flex items-center justify-center">
                <span className="flex-none mr-2">
                  {t('dpiaQuestion3Option1')}
                </span>
                <div className="w-96 px-3">
                  <Range
                    step={1}
                    min={0}
                    max={4}
                    values={dpiaInputData['3']}
                    onChange={(values) => {
                      setDpiaInputData('3', values);
                    }}
                    renderTrack={({ props, children }) => (
                      <div
                        {...props}
                        className="w-full h-4 pr-2 my-4 bg-black bg-opacity-40 rounded-full"
                      >
                        {children}
                      </div>
                    )}
                    renderThumb={({ props }) => (
                      <div
                        {...props}
                        className="w-5 h-5 transform translate-x-10 bg-white rounded-full focus:outline-none focus:ring-0 focus:ring-offset-2 focus:ring-indigo-500"
                      />
                    )}
                  />
                </div>
                <span>{t('dpiaQuestion3Option2')}</span>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex max-w-4xl flex-col space-y-12">
            <div className="flex flex-col">
              <label className="text-lg py-1 mb-2 text-center" htmlFor="2">
                <span className="text-lg font-bold mr-1">4.</span>
                {t('dpiaQuestion4')}
              </label>

              <div className="flex items-center">
                <span className="flex-none w-32 mr-2">
                  {t('dpiaQuestion4Option1')}
                </span>
                <div className="w-96 px-3">
                  <Range
                    step={1}
                    min={0}
                    max={4}
                    values={dpiaInputData['4']}
                    onChange={(values) => {
                      setDpiaInputData('4', values);
                    }}
                    renderTrack={({ props, children }) => (
                      <div
                        {...props}
                        className="w-full h-4 pr-2 my-4 bg-black bg-opacity-40 rounded-full"
                      >
                        {children}
                      </div>
                    )}
                    renderThumb={({ props }) => (
                      <div
                        {...props}
                        className="w-5 h-5 transform translate-x-10 bg-white rounded-full focus:outline-none focus:ring-0 focus:ring-offset-2 focus:ring-indigo-500"
                      />
                    )}
                  />
                </div>
                <span>{t('dpiaQuestion4Option2')}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-lg py-1 mb-2 text-center" htmlFor="2">
                <span className="text-lg font-bold mr-1">5.</span>
                {t('dpiaQuestion5')}
              </label>

              <div className="flex items-center">
                <span className="flex-none w-32 mr-2">
                  {t('dpiaQuestion5Option1')}
                </span>
                <div className="w-96 px-3">
                  <Range
                    step={1}
                    min={0}
                    max={4}
                    values={dpiaInputData['5']}
                    onChange={(values) => {
                      setDpiaInputData('5', values);
                    }}
                    renderTrack={({ props, children }) => (
                      <div
                        {...props}
                        className="w-full h-4 pr-2 my-4 bg-black bg-opacity-40 rounded-full"
                      >
                        {children}
                      </div>
                    )}
                    renderThumb={({ props }) => (
                      <div
                        {...props}
                        className="w-5 h-5 transform translate-x-10 bg-white rounded-full focus:outline-none focus:ring-0 focus:ring-offset-2 focus:ring-indigo-500"
                      />
                    )}
                  />
                </div>
                <span>{t('dpiaQuestion5Option2')}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-lg py-1 mb-2 text-center" htmlFor="6">
                <span className="text-lg font-bold mr-1">6.</span>
                {t('dpiaQuestion6')}
              </label>
              <div className="flex items-center">
                <span className="flex-none w-32 mr-2">
                  {t('dpiaQuestion6Option1')}
                </span>
                <div className="w-96 px-3">
                  <Range
                    step={1}
                    min={0}
                    max={4}
                    values={dpiaInputData['6']}
                    onChange={(values) => {
                      setDpiaInputData('6', values);
                    }}
                    renderTrack={({ props, children }) => (
                      <div
                        {...props}
                        className="w-full h-4 pr-2 my-4 bg-black bg-opacity-40 rounded-full"
                      >
                        {children}
                      </div>
                    )}
                    renderThumb={({ props }) => (
                      <div
                        {...props}
                        className="w-5 h-5 transform translate-x-10 bg-white rounded-full focus:outline-none focus:ring-0 focus:ring-offset-2 focus:ring-indigo-500"
                      />
                    )}
                  />
                </div>
                <span>{t('dpiaQuestion6Option2')}</span>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="relative">
            <div className="text-xl mr-1">
              <p className="text-center">{t('dpiaResponsibility')}</p>
              <p className="text-2xl py-2">
                {t('dpiaAssessment', {
                  assessment: assessment,
                })}
              </p>

              <div className="h-80 relative flex items-center justify-center py-8">
                <VideoPlayer
                  onEnded={() => setVideoDone(true)}
                  t={t}
                  url={t('dpiaDecisionVideoLink')}
                />
              </div>
             {videoDone && (
               <p className=" text-center">{t('dpiaDecision')}</p>
             )}
            </div>
            {videoDone && (
              <div className="mt-8 flex items-center justify-center">
                <button
                  onClick={() => openThanksOverlay('SHUTDOWN')}
                  className="rounded-full bg-red-700 text-white py-2 px-9 mx-1"
                >
                  {t('dpiaDecisionShutdownButton')}
                </button>
                <button
                  onClick={() => openThanksOverlay('KEEP')}
                  className="rounded-full bg-green-600 text-white py-2 px-9 mx-1"
                >
                  {t('dpiaDecisionContinueButton')}
                </button>
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="max-w-4xl">
            <div className="text-xl mr-1 my-8">
              <p className="text-center">
                {t('dpiaBookAppointment', {
                  person: selectedDepartment?.person,
                })}
              </p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => finishDpia(true)}
                className="rounded-full bg-black text-white py-2 px-9 mx-1"
              >
                {t('dpiaAppointmentBookedButton')}
              </button>
              <button
                onClick={() => finishDpia(false)}
                className="rounded-full bg-black text-white py-2 px-9 mx-1"
              >
                {t('dpiaAppointmentNotBookedButton')}
              </button>
            </div>
          </div>
        );
      default:
        return <p></p>;
    }
  };

  const handleNext = () => {
    nextDpiaStep();
  };

  const handleBack = () => {
    if (dpiaStep - 1 < 0) return;
    previousDpiaStep();
  };

  if (
    isObjectiveFinished(Objectives.DIDNT_SCHEDULE_MEETING) ||
    isObjectiveFinished(Objectives.SCHEDULE_MEETING)
  )
    return <DoneScreen />;

  return (
    <div className="h-full w-full font-roboto text-white ">
      <div className="relative top-0 left-0 z-50 h-full w-full bg-dpia_bg bg-no-repeat bg-cover flex flex-col">
        <div className="h-full flex flex-col justify-center">
          <div className="h-full w-full flex flex-col justify-center items-center ">
            {feedbackOverlayOpen && (
              <div className="absolute top-0 bottom-0 h-full w-full bg-black bg-opacity-75 z-10">
                <div className="flex items-center justify-center h-full w-full">
                  <div className="flex flex-col items-center justify-center space-y-8">
                    {isObjectiveFinished(Objectives.PREVENT_DATA_LEAK) ? (
                      <div>
                        <div className="text-center text-white text-xl font-bold">
                          {t('dpiaThanksForShuttingDownText')}
                        </div>
                        <button
                          className="rounded-full bg-white text-black py-2 px-9 mx-1"
                          onClick={() => handleDecision('SHUTDOWN')}
                        >
                          {t('dpiaThanksForShuttingDownAcknowledgeButton')}
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="text-center text-white text-xl font-bold">
                          {t('dpiaDidntShutDownText')}
                        </div>
                        <button
                          className="rounded-full bg-white text-black py-2 px-9 mx-1"
                          onClick={() => handleDecision('KEEP')}
                        >
                          {t('dpiaDidnShutDownAcknowledgeButton')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {dpiaStep > 0 && dpiaStep < 3 ? (
              <Fragment>
                <h1 className="text-4xl font-bold mb-8">{t('dpiaTitle')}</h1>
                {getStep(dpiaStep)}
                <div className="mt-12">
                  <button
                    className="rounded-full bg-black disabled:bg-gray-800 text-white py-2 px-9 mx-1"
                    disabled={dpiaStep != 2}
                    onClick={handleBack}
                  >
                    {t('dpiaButtonBack')}
                  </button>
                  <button
                    className="rounded-full bg-black text-white py-2 px-9 mx-1"
                    onClick={handleNext}
                  >
                    {dpiaStep == 2
                      ? t('dpiaButtonFinish')
                      : t('dpiaButtonNext')}
                  </button>
                </div>
              </Fragment>
            ) : (
              <Fragment>{getStep(dpiaStep)}</Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
