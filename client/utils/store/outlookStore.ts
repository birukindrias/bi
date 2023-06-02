import { GAME_LENGTH_IN_SECONDS } from 'utils/constants';
import { IEmail } from '../../components/applications/outlook/InnerLayoutItems/index';
import { StoreSlice } from './store';
import { Objectives, SettingsSlice } from './settingsStore';

export interface OutlookSlice extends Partial<SettingsSlice> {
  emailQueue: IEmail[];
  emails: IEmail[];
  reportedPhishingEmailIds: string[]; // email ids of emails that are reported as phishing and where isPhishing is true
  triggerEmails: (newTimeInSeconds: number) => void;
  readMail: (email: IEmail) => void;
  setEmailQueue: (emailQueue: IEmail[]) => void;
  reportEmail: (email: IEmail) => void;
}

export const createOutlookSlice: StoreSlice<OutlookSlice> = (set, get) => ({
  emailQueue: [],
  reportedPhishingEmailIds: [],
  reportEmail: (email: IEmail) => {
    let score = get().score;
    let reportedPhishingEmailIds = get().reportedPhishingEmailIds;
    if (email.isPhishing && score != undefined) {
      if (!reportedPhishingEmailIds.includes(email.id)) {
        let correctlyReportedEmails = get().reportedPhishingEmailIds.length + 1;

        let allEmails = [...get().emails, ...get().emailQueue];
        let isPhishingMails = allEmails.filter(
          (email) => email.isPhishing
        ).length;

        if (correctlyReportedEmails === isPhishingMails) {
          get().finishObjective?.(Objectives.PHISHING_REPORTED);
        }

        set({
          reportedPhishingEmailIds: [
            ...get().reportedPhishingEmailIds,
            email.id,
          ],
          score: score + 10,
        });
      }
    }

    set((state) => {
      const newEmails = state.emails.map((e) => {
        if (e.id === email.id) {
          return { ...e, reportedAsPhishing: true };
        }
        return e;
      });
      return {
        emails: newEmails,
      };
    });
  },
  setEmailQueue: (emailQueue) => set({ emailQueue }),
  emails: [],
  readMail: (email: IEmail) => {
    set((state) => {
      const newEmails = state.emails.map((e) => {
        if (e.id === email.id) {
          return { ...e, read: true };
        }
        return e;
      });
      return {
        emails: newEmails,
      };
    });
  },
  triggerEmails: (gameTime: number) => {
    let timePlayed = GAME_LENGTH_IN_SECONDS - gameTime;
    let emailsToAdd: IEmail[] = [];
    let newQueue: IEmail[] = [];
    let emailQueue = get().emailQueue;
    //if no queue left, return empty array as well empty array of emails to add
    if (!emailQueue || emailQueue.length <= 0) return [emailQueue || [], []];

    //iterate over all emails in queue, check if time played is greater than or equal to email trigger time
    //if so, add to emails to add and remove from queue

    for (let i = 0; i < emailQueue.length; i++) {
      //if no trigger time is set or equal to 0, add to emails and don't add to new queue
      if (
        typeof emailQueue[i].triggerTimeInSeconds == 'undefined' ||
        emailQueue[i].triggerTimeInSeconds === 0
      ) {
        emailsToAdd.push(emailQueue[i]);
      }
      //if trigger time is set and time played is greater than or equal to trigger time, add to emails and don't add to new queue
      else if (emailQueue[i].triggerTimeInSeconds! <= timePlayed) {
        emailsToAdd.push(emailQueue[i]);
      }
      //otherwise add to new newQueue
      else {
        newQueue.push(emailQueue[i]);
      }
    }

    //update state
    set(() => ({
      emailQueue: newQueue,
      emails: [...get().emails, ...emailsToAdd],
    }));
  },
});
