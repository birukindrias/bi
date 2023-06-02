import { Team } from './api';

export const sekToMin = (s: number) => {
  return s / 60;
};

export const secondsToTimeFormat = (e: number) => {
  let m = Math.floor((e % 3600) / 60)
      .toString()
      .padStart(2, '0'),
    s = Math.floor(e % 60)
      .toString()
      .padStart(2, '0');

  return m + ':' + s;
};

export const getTruncatedText = (s: string, maxLenth: number = 10) => {
  return s.length > maxLenth ? s.substring(0, maxLenth - 1) + '...' : s;
};

export const sortTeams = (
  entity: string,
  teams: Team[],
  currentSort: string
) => {
  const oldTime = '2001-01-01T00:00:00.000Z';

  switch (entity) {
    case 'score':
      if (currentSort === 'score_desc') {
        currentSort = 'score_asc';
      } else {
        currentSort = 'score_desc';
      }
      break;
    case 'date':
      if (currentSort === 'date_desc') {
        currentSort = 'date_asc';
      } else {
        currentSort = 'date_desc';
      }
      break;
    case 'name':
      if (currentSort === 'name_desc') {
        currentSort = 'name_asc';
      } else {
        currentSort = 'name_desc';
      }
      break;
    default:
      currentSort = entity;
      break;
  }

  let result = teams.sort((a, b) => {
    switch (currentSort) {
      case 'score_asc':
        return sort(
          'asc',
          a.result?.score ? a.result.score : 0,
          b.result?.score ? b.result.score : 0
        );
      case 'score_desc':
        return sort(
          'desc',
          a.result?.score ? a.result.score : 0,
          b.result?.score ? b.result.score : 0
        );

      case 'date_asc':
        return sort(
          'asc',
          a.result?.date ?? oldTime,
          b.result?.date ?? oldTime
        );
      case 'date_desc':
        return sort(
          'desc',
          a.result?.date ?? oldTime,
          b.result?.date ?? oldTime
        );
      case 'name_asc':
        return sort('asc', a.name, b.name);
      case 'name_desc':
        return sort('desc', a.name, b.name);

      default:
        return 0;
    }
  });

  return {
    teams: result,
    sort: currentSort,
  };
};

export const sort = (
  direction: 'asc' | 'desc',
  a: string | number | undefined,
  b: string | number | undefined
) => {
  if (typeof a === 'string' && typeof b === 'string') {
    const dateA = new Date(a);
    const dateB = new Date(b);
    if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
      if (direction === 'asc') {
        return dateA.getTime() - dateB.getTime();
      }
      if (direction === 'desc') {
        return dateB.getTime() - dateA.getTime();
      }
    } else {
      if (direction === 'asc') {
        return sortTextAsc(a, b);
      }

      if (direction === 'desc') {
        return sortTextDesc(a, b);
      }
    }
  }

  if (typeof a === 'number' && typeof b === 'number') {
    if (direction === 'asc') {
      return a - b;
    }

    if (direction === 'desc') {
      return b - a;
    }
  }
  return 0;
};

const sortTextAsc = (textA: string, textB: string) => {
  if (textA && textB) {
    textA.toUpperCase();
    textB.toUpperCase();
    if (textA < textB) {
      return -1;
    }
    if (textA > textB) {
      return 1;
    }
  }
  // text muss gleich sein
  return 0;
};

const sortTextDesc = (textA: string, textB: string) => {
  if (textA && textB) {
    textA.toUpperCase();
    textB.toUpperCase();
    if (textA > textB) {
      return -1;
    }
    if (textA < textB) {
      return 1;
    }
  }
  // text muss gleich sein
  return 0;
};

export const replacePlaceholder = (
  message: string,
  placeholder: string,
  replacement: string
) => {
  var message = message.replace(placeholder, replacement);
  return message;
};

export const addMinutes = (date: Date, minutes: number) => {
  return new Date(date.getTime() + minutes * 60000);
};

export const removeFunctions = (obj: any) => {
  const stringified = JSON.stringify(obj);

  // We need to parse string back to object and return it
  const parsed = JSON.parse(stringified);

  return parsed;
};

export const randomItemFromArray = (items: any[]) => {
  return items[Math.floor(Math.random() * items.length)];
};
