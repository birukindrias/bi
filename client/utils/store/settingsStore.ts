import { StoreSlice } from './store';
import { getGameById, getTeam } from '../api';
export interface Department {
  id: string;
  name: string;
  person: string;
}

const departments: Department[] = [];

export enum Objectives {
  FINISH_INTRO = 'FINISH_INTRO', // finish the intro video
  PHISHING_REPORTED = 'PHISHING_REPORTED', //EENDSCREEN - Phishing mails reported
  HACK_DECISION = 'HACK_DECISION', //taka action hack
  PREVENT_DATA_LEAK = 'PREVENT_DATA_LEAK', //EENDSCREEN - decided for shutdown
  SCHEDULE_MEETING = 'SCHEDULE_MEETING', //EENDSCREEN - scheduled meeting
  DIDNT_SCHEDULE_MEETING = 'DIDNT_SCHEDULE_MEETING', // didn't schedule meeting
  DOWNLOAD_CODE = 'DOWNLOAD_CODE', //opened the cognito page TODO: CHECK, it is don 2 times
  FIND_RANSOM_GROUP = 'FIND_RANSOM_GROUP', //opened the sur5 chat
  NEGOTIATION = 'NEGOTIATION', //EENDSCREEN - negotiation via sur5 chat
  FIND_ONION_ADDRESS = 'FIND_ONION_ADDRESS', // after opening cognito page TODO: CHECK AGAIN
  GET_DATA_BACK = 'GET_DATA_BACK', //EENDSCREEN
  READ_EMAIL = 'READ_EMAIL', //TODO: DELETE; JUST FOR TESTING
}

export interface ObjectiveSettings {
  name: Objectives;
  done: boolean;
}

const objectives: ObjectiveSettings[] = [
  {
    name: Objectives.DIDNT_SCHEDULE_MEETING,
    done: false,
  },
  {
    name: Objectives.PHISHING_REPORTED,
    done: false,
  },
  {
    name: Objectives.PREVENT_DATA_LEAK,
    done: false,
  },
  {
    name: Objectives.HACK_DECISION,
    done: false,
  },

  {
    name: Objectives.SCHEDULE_MEETING,
    done: false,
  },
  {
    name: Objectives.NEGOTIATION,
    done: false,
  },
  {
    name: Objectives.GET_DATA_BACK,
    done: false,
  },
  {
    name: Objectives.READ_EMAIL,
    done: false,
  },
];

export enum Applications {
  HACK_DPIA = 'hack_dpia',
  VSCODE = 'vscode',
  OUTLOOK = 'outlook',
  SIGNAL = 'signal',
  CHROME = 'chrome',
  TOR = 'tor',
  CRYPTII = 'cryptii',
  SERVER_MESSAGE = 'serverMessage',
  ENDSCREEN = 'endscreen',
}

export interface LocalTeamMember {
  name: string;
  email: string;
}

type OpenApplications = {
  [key in Applications]: boolean;
};

export const openApplications: OpenApplications = {
  [Applications.HACK_DPIA]: false,
  [Applications.CHROME]: false,
  [Applications.VSCODE]: false,
  [Applications.OUTLOOK]: false,
  [Applications.SIGNAL]: false,
  [Applications.TOR]: false,
  [Applications.SERVER_MESSAGE]: false,
  [Applications.CRYPTII]: false,
  [Applications.ENDSCREEN]: false,
};

export interface SettingsSlice {
  companyName: string;
  teamName: string;
  setTeamName: (teamName: string) => void;
  moneySpent: number;
  addMoney: (amount: number) => void;
  goodEnding: boolean;
  setGoodEnding: (goodEnding: boolean) => void;
  negotiationPoints: number;
  addToNegotiationPoints: (points: number) => void;
  objectives: ObjectiveSettings[];
  finishObjective: (name: Objectives) => void;
  isObjectiveFinished: (name: Objectives) => boolean;
  departments: Department[];
  selectedDepartment: Department | null;
  setDepartments: (departments: Department[]) => void;
  setDepartment: (department: Department) => void;
  assessment: 'high' | 'medium' | 'low' | 'none';
  setAssessment: (assessment: 'high' | 'medium' | 'low' | 'none') => void;
  score: number;
  addToScore: (score: number) => void;
  openApplications: OpenApplications;
  appInFocus: Applications | undefined;
  gameId: string | undefined;
  teamId: string | undefined;
  localPlayers: LocalTeamMember[] | undefined;
  settingsId: string | undefined;
  addGameId: (gameId: string) => void;
  addTeamId: (teamId: string) => void;
  addLocalPlayers: (players: LocalTeamMember[]) => void;
  focusApplication: (application: Applications) => void;
  isApplicationOpen: (application: Applications) => boolean;
  setOpenApplication: (application: Applications, isOpen: boolean) => void;
}

export const createSettingsSlice: StoreSlice<SettingsSlice> = (
  set,
  get
): SettingsSlice => ({
  companyName: '',
  teamName: '',
  setTeamName: (teamName) => {
    set({ teamName });
  },
  isApplicationOpen: (application: Applications) => {
    return get().openApplications[application];
  },
  isObjectiveFinished: (name: Objectives) => {
    return get().objectives.find((o) => o.name === name)?.done ?? false;
  },
  assessment: 'none',
  setAssessment: (assessment) => {
    set({
      assessment,
    });
  },
  moneySpent: 0,
  addMoney: (amount: number) => {
    set({ moneySpent: get().moneySpent + amount });
  },
  goodEnding: false,
  setGoodEnding: (goodEnding) => {
    set({
      goodEnding,
    });
  },
  negotiationPoints: 0,
  addToNegotiationPoints: (points: number) => {
    set((state) => ({
      ...state,
      negotiationPoints: state.negotiationPoints + points,
    }));
  },
  objectives: objectives,
  finishObjective: (name: Objectives) => {
    set({
      objectives: get().objectives.map((objective) => {
        if (objective.name === name) {
          return { ...objective, done: true };
        }
        return objective;
      }),
    });
  },
  departments: departments,
  setDepartments: (departments: Department[]) => {
    set({
      departments,
    });
  },
  selectedDepartment: null,
  setDepartment: (department) => {
    set((state) => ({ ...state, selectedDepartment: department }));
  },
  score: 0,
  addToScore: (score) => {
    set((state) => ({
      score: state.score + score,
    }));
  },
  openApplications,
  setOpenApplication: (application, isOpen) => {
    set((state) => ({
      openApplications: {
        ...state.openApplications,
        [application]: isOpen,
      },
    }));
  },
  settingsId: undefined,
  gameId: undefined,
  teamId: undefined,
  appInFocus: undefined,
  localPlayers: [],
  focusApplication: (application: Applications) => {
    set((state) => ({ appInFocus: application }));
  },
  addLocalPlayers: async (players) => {
    set(() => ({
      localPlayers: players,
    }));
  },
  addGameId: async (gameId) => {
    if (!get().settingsId) {
      let result = await getGameById(gameId);
      if (result.data) {
        set((state) => ({
          settingsId: result.data.setting.id,
          companyName: result.data.company.name,
        }));
      }
      //TODO: FETCH GAME AND SETTINGS ID
    }

    set(() => ({
      gameId: gameId,
    }));
  },
  addTeamId: async (teamId) => {
    let result = await getTeam(teamId);
    if (result.data) {
      set({
        teamId: teamId,
        teamName: result.data.name,
      });
    }

    set(() => ({
      teamId: teamId,
    }));
  },
});
