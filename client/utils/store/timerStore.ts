import { GAME_LENGTH_IN_SECONDS } from 'utils/constants';
import { StoreSlice } from './store';
import { OutlookSlice } from './outlookStore';
import { SignalSlice } from './signalStore';
import { SettingsSlice, Applications, Objectives } from './settingsStore';
import { TorBrowserSlice } from './torStore';
import { HACK_URL, SECONDS_AFTER_START_TO_OPEN_HACK } from '../constants';
import { SaveSlice } from './saveStore';

export interface TimerSlice
  extends Partial<OutlookSlice>,
    Partial<SignalSlice>,
    Partial<SettingsSlice>,
    Partial<TorBrowserSlice> {
  gameTimeInSeconds: number;
  timer: number | undefined;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  gameStartedTime: number;
}

export const createTimerSlice: StoreSlice<TimerSlice> = (set, get) => ({
  timer: undefined,
  gameStartedTime: 0,
  gameTimeInSeconds: GAME_LENGTH_IN_SECONDS,
  startTimer: () => {
    set({
      gameStartedTime: Date.now(),
    });

    let timer = setInterval(() => {
      // update the timer every second and update the state
      set((state) => {
        const newTime = state.gameTimeInSeconds - 1;
        if (newTime <= 0) {
          get().stopTimer();
        }
        //UPDATE STATE HERE!
        //run email trigger
        if (newTime % 2 === 0) {
          get().triggerEmails?.(newTime);
        } else {
          get().triggerSignal?.(newTime, get().objectives);
        }

        if (newTime % 10 === 0) {
          //@ts-ignore
          get().saveState?.();
        }

        let timePlayed = GAME_LENGTH_IN_SECONDS - newTime;

        //HANDLE OPEN HACK Open if played time is > SECONDS_AFTER_START_TO_OPEN_HACK seconds, and
        if (
          timePlayed === SECONDS_AFTER_START_TO_OPEN_HACK &&
          !get().isObjectiveFinished?.(Objectives.HACK_DECISION) &&
          !get().isObjectiveFinished?.(Objectives.SCHEDULE_MEETING) &&
          !get().isObjectiveFinished?.(Objectives.DIDNT_SCHEDULE_MEETING) &&
          !get().isApplicationOpen?.(Applications.HACK_DPIA)
        ) {
          get().setOpenApplication?.(Applications.HACK_DPIA, true);
        }

        //HANDLE OPEN SERVER MESSAGE IMMEDIATELY

        if (timePlayed === 2) {
          get().setOpenApplication?.(Applications.SERVER_MESSAGE, true);
        }

        //END GAME STOP TIME AND GO TO END SCREEN
        if (newTime < 2 * 60) {
          get().stopTimer();
          get()?.setOpenApplication?.(Applications.ENDSCREEN, true);
        }

        return {
          gameTimeInSeconds: newTime,
        };
      });
    }, 1000) as unknown as number;
    //setting timer instance to state so we can clear it later
    set(() => ({
      timer: timer,
    }));
  },
  // clear the interval
  stopTimer: () => {
    clearInterval(get().timer);
    set(() => ({
      timer: undefined,
    }));
  },
  resetTimer: () => {
    clearInterval(get().timer);
    set(() => ({
      timer: undefined,
      gameTimeInSeconds: GAME_LENGTH_IN_SECONDS,
    }));
  },
});
