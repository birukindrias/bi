import { OutlookSlice } from './outlookStore';
import { SignalSlice } from './signalStore';
import { SettingsSlice } from './settingsStore';
import { TorBrowserSlice } from './torStore';
import { TimerSlice } from './timerStore';
import { StoreSlice } from './store';
import { removeFunctions } from '../helper';

export interface SaveSlice
  extends Partial<OutlookSlice>,
    Partial<SignalSlice>,
    Partial<SettingsSlice>,
    Partial<TorBrowserSlice>,
    Partial<TimerSlice> {
  saveState: () => void;
  checkIfStateExists: () => boolean;
  loadState: () => void;
}

export const createSaveSlice: StoreSlice<SaveSlice> = (set, get) => ({
  saveState: () => {
    const state = get();
    localStorage.setItem('ransom_state', JSON.stringify(state));
  },
  checkIfStateExists: () => {
    return localStorage.getItem('ransom_state') !== null;
  },
  loadState: () => {
    const loadedState = localStorage.getItem('ransom_state');
    if (loadedState) {
      set((state) => {
        //merge state and loaded state
        const newState = { ...state, ...JSON.parse(loadedState) };
        return newState;
      });
      get().startTimer?.();
    }
  },
});
