import { StoreSlice } from './store';

interface DpiaInputData {
  1: string;
  2: string;
  3: number[];
  4: number[];
  5: number[];
  6: number[];
}
export interface DPIASlice {
  dpiaInputData: DpiaInputData;
  nextDpiaStep: () => void;
  previousDpiaStep: () => void;
  dpiaStep: number;
  feedbackOverlayOpen: boolean;
  setFeedbackOverlayOpen: (open: boolean) => void;
  setDpiaInputData: (id: string, value: string | number | number[]) => void;
}

export const createDpiaSlice: StoreSlice<DPIASlice> = (set, get) => ({
  feedbackOverlayOpen: false,
  setFeedbackOverlayOpen: (open) => {
    set({
      feedbackOverlayOpen: open,
    });
  },
  dpiaStep: 0,
  nextDpiaStep: () => {
    set({
      dpiaStep: get().dpiaStep + 1,
    });
  },
  previousDpiaStep: () => {
    set({
      dpiaStep: get().dpiaStep - 1,
    });
  },
  dpiaInputData: {
    1: '',
    2: '',
    3: [0],
    4: [0],
    5: [0],
    6: [0],
  },
  setDpiaInputData: (id, value) => {
    set({
      dpiaInputData: {
        ...get().dpiaInputData,
        [id]: value,
      },
    });
  },
});
