import create, { GetState, SetState } from 'zustand';
import { devtools } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';
import { createOutlookSlice } from './outlookStore';
import { createSettingsSlice, SettingsSlice } from './settingsStore';
import { createSignalSlice } from './signalStore';
import { createTimerSlice, TimerSlice } from './timerStore';
import { createTorSclice, TorBrowserSlice } from './torStore';
import { persist } from 'zustand/middleware';
import { createSaveSlice } from './saveStore';
import { createDpiaSlice } from './dpiaStore';
//https://github.com/pmndrs/zustand/wiki/Splitting-the-store-into-separate-slices
export type StoreSlice<T extends object, E extends object = T> = (
  set: SetState<E extends T ? E : E & T>,
  get: GetState<E extends T ? E : E & T>
) => T;

const createRootSlice = (set: SetState<any>, get: GetState<any>) => ({
  ...createOutlookSlice(set, get),
  ...createSettingsSlice(set, get),
  ...createTorSclice(set, get),
  ...createTimerSlice(set, get),
  ...createSignalSlice(set, get),
  ...createSaveSlice(set, get),
  ...createDpiaSlice(set, get),
});

export const useStore = create(
  devtools(subscribeWithSelector(createRootSlice))
);
