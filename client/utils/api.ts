import axios from 'axios';
import useSWR from 'swr';
import { isLocal, SERVER_URL } from './constants';

const standardAxios = axios.create({
  baseURL: SERVER_URL,
});

/**
 * AXIOS
 */

export const useFetchGameResults = (gameId: string | null) => {
  const { data, error, mutate } = useSWR(
    gameId ? `/result/game/${gameId}` : null,
    fetcher
  );
  return {
    teams: data,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  };
};

export const getGameByGameCode = async (gameCode: string) => {
  return standardAxios.get(`/game/check/${gameCode}`);
};

export const getGameById = async (id: string) => {
  return standardAxios.get(`/game/${id}`);
};

export type CreateTeamDto = {
  gameId: string;
  name: string;
};
export const createTeam = async (createTeamData: CreateTeamDto) => {
  return standardAxios.post(`/team`, createTeamData);
};

export type Player = {
  id: string;
  name: string;
};
export type PlayerMemb = {
  email: string;
  name: string;
};

export type Result = {
  id?: string;
  score: number;
  date?: string;
  objectives?: number;
  timePlayedInSeconds?: number;
  moneySpent?: number;
  riskAssessment?: 'high' | 'medium' | 'low' | 'none';
};

export type Team = {
  id: string;
  name: string;
  players?: Player[];
  department?: string;
  result?: Result;
  game_name?: string;
};

export type UpdateTeamDto = {
  players?: PlayerMemb[];
  name?: string;
  email?:string;
  department?: string;
  result?: Result;
};
export const updateTeam = async (
  teamId: string,
  updateTeamData: UpdateTeamDto
) => {
  console.log(updateTeamData)
  return standardAxios.patch(`/team/${teamId}`, updateTeamData);
};

export const getTeam = async (teamId: string) => {
  return standardAxios.get(`/team/${teamId}`);
};

/**
 * SWR
 */
const fetcher = (url: string) => standardAxios.get(url).then((res) => res.data);

export const getLanguageFile = async (gameId: string) => {
  const response = await fetch(
    isLocal !== 'development'
      ? 'http://ransom_dev_backend:4000/api' + '/settings/language/' + gameId
      : SERVER_URL + '/settings/language/' + gameId
  );
  return await response.json();
};

export const getSignalChats = async (gameId: string) => {
  const response = await fetch(
    isLocal !== 'development'
      ? 'http://ransom_dev_backend:4000/api' +
          '/settings/signal/chats/ssr/' +
          gameId
      : SERVER_URL + '/settings/signal/chats/ssr/' + gameId
  );
  return await response.json();
};

export const getEmails = async (gamesId: string) => {
  const response = await fetch(
    isLocal !== 'development'
      ? 'http://ransom_dev_backend:4000/api' + '/settings/email/ssr/' + gamesId
      : SERVER_URL + '/settings/email/ssr/' + gamesId
  );
  return await response.json();
};

export const getHive = async (gamesId: string) => {
  const response = await fetch(
    isLocal !== 'development'
      ? 'http://ransom_dev_backend:4000/api' + '/settings/hive/ssr/' + gamesId
      : SERVER_URL + '/settings/hive/ssr/' + gamesId
  );
  return await response.json();
};

export const getMilkroad = async (gamesId: string) => {
  const response = await fetch(
    isLocal !== 'development'
      ? 'http://ransom_dev_backend:4000/api' +
          '/settings/milkroad/ssr/' +
          gamesId
      : SERVER_URL + '/settings/milkroad/ssr/' + gamesId
  );
  return await response.json();
};

export const getDepartments = async (gamesId: string) => {
  const response = await fetch(
    isLocal !== 'development'
      ? 'http://ransom_dev_backend:4000/api' +
          '/settings/departments/ssr/' +
          gamesId
      : SERVER_URL + '/settings/departments/ssr/' + gamesId
  );
  return await response.json();
};

export const getTwitter = async (gamesId: string) => {
  const response = await fetch(
    isLocal !== 'development'
      ? 'http://ransom_dev_backend:4000/api' +
          '/settings/twitter/ssr/' +
          gamesId
      : SERVER_URL + '/settings/twitter/ssr/' + gamesId
  );
  return await response.json();
};
