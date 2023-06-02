import { GetServerSideProps } from 'next';
import { useTranslations } from 'next-intl';
import InputContainer from '../../../../components/layout/InputContainer';
import SetupLayout from '../../../../components/layout/SetupLayout';
import { useState, Fragment, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TeamNamePages, SetupPages } from '../../../../utils/constants';
import Form from '../../../../components/inputs/form';
import Input from '../../../../components/inputs/input';
import Button from '../../../../components/inputs/button';
import {
  createTeam,
  getLanguageFile,
  getDepartments,
} from '../../../../utils/api';
import TeamDepartment from '../../../../components/pages/setup/team_department';
import { useStore } from '../../../../utils/store/store';
import TeamMates from '../../../../components/pages/setup/team_mates';
import { Department } from 'utils/store/settingsStore';

interface Props {
  departments: Department[];
}

const Index = (props: Props) => {
  const t = useTranslations();
  const router = useRouter();
  const { addGameId, addTeamId, setDepartments } = useStore();
  const { gameId, teamId } = router.query;

  useEffect(() => {
    setDepartments(props.departments);
  }, []);

  useEffect(() => {
    if (router.isReady) {
      if (
        gameId &&
        teamId &&
        typeof gameId === 'string' &&
        typeof teamId === 'string'
      ) {
        addGameId(gameId);
        addTeamId(teamId);
      } else {
        router.push('/login');
      }
    }
  }, [gameId, teamId]);

  const [currentSetupPage, setCurrentSetupPage] = useState(
    SetupPages.DEPARTMENT
  );

  if (currentSetupPage === SetupPages.DEPARTMENT) {
    return (
      <TeamDepartment
        t={t}
        setCurrentSetupPage={setCurrentSetupPage}
      ></TeamDepartment>
    );
  }

  if (currentSetupPage === SetupPages.TEAM_MATES) {
    return <TeamMates t={t}></TeamMates>;
  }
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  const gameId = context.params?.gameId;

  if (!gameId) {
    return {
      props: {},
    };
  }
  //TODO: ADD GET LANGUAGE FILE
  const json = await getLanguageFile(gameId as string);
  const departments = await getDepartments(gameId as string);
  return {
    props: {
      test: 'data',
      // You can get the messages from anywhere you like, but the recommended
      // pattern is to put them in JSON files separated by language and read
      // the desired one based on the `locale` received from Next.js.
      //TODO: PROVIDE LANGUAGE FILE
      messages: json,
      departments: departments,
    },
  };
};

export default Index;
