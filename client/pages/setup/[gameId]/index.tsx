import { GetServerSideProps } from 'next';
import { useTranslations } from 'next-intl';
import InputContainer from '../../../components/layout/InputContainer';
import SetupLayout from '../../../components/layout/SetupLayout';
import { useState, Fragment, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { TeamNamePages } from '../../../utils/constants';
import Form from '../../../components/inputs/form';
import Input from '../../../components/inputs/input';
import Button from '../../../components/inputs/button';
import { createTeam, getLanguageFile } from '../../../utils/api';
import Info from '../../../components/pages/setup/info';
import { useStore } from '../../../utils/store/store';

const Index = () => {
  const [teamName, setTeamname] = useState('');

  const { addTeamId, setTeamName } = useStore();
  const [currentPage, setCurrentPage] = useState(TeamNamePages.INFO);
  const t = useTranslations('');
  const router = useRouter();
  const { gameId } = router.query;

  const handleNameInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 25) {
      setTeamname(e.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (teamName.length > 0 && gameId && typeof gameId === 'string') {
      let result = await createTeam({ gameId, name: teamName });
      if (result.status === 201) {
        addTeamId(result.data.id);
        router.push(`${gameId}/${result.data.id}`);
      }
    }
  };

  if (currentPage === TeamNamePages.INFO) {
    return <Info t={t} setCurrentSetupPage={setCurrentPage}></Info>;
  }

  if (currentPage === TeamNamePages.TEAM_NAME) {
    return (
      <SetupLayout>
        <InputContainer title={t('introTeamNameTitle')}>
          <Fragment>
            <div className="max-w-sm mx-8 text-center">
              <div className="w-full text-gray-100">
                <p className="text-xl">{t('teamNameInstructions')}</p>
              </div>
            </div>
            <div className="flex align-middle justify-center">
              <Form handleSubmit={(e) => handleSubmit(e)}>
                <Fragment>
                  <Input
                    placeholder={t('introTeamName')}
                    value={teamName}
                    handleChange={(e) => handleNameInput(e)}
                  />
                  <Button disabled={teamName.length === 0} type="submit">
                    {t('startButton')}
                  </Button>
                </Fragment>
              </Form>
            </div>
          </Fragment>
        </InputContainer>
      </SetupLayout>
    );
  }
};

export default Index;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const gameId = context.params?.gameId;

  if (!gameId) {
    return {
      props: {},
    };
  }
  // GET LANGUAGE FILE
  const json = await getLanguageFile(gameId as string);
  return {
    props: {
      test: 'data',
      // You can get the messages from anywhere you like, but the recommended
      // pattern is to put them in JSON files separated by language and read
      // the desired one based on the `locale` received from Next.js.
      //TODO: PROVIDE LANGUAGE FILE
      messages: json,
    },
  };
};
