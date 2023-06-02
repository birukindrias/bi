import SetupLayout from '../../layout/SetupLayout';
import InputContainer from '../../layout/InputContainer';
import Button from '../../inputs/button';
import { TeamNamePages } from '../../../utils/constants';

type InfoProps = {
  setCurrentSetupPage: (page: TeamNamePages) => void;
  t: any;
};
function Info({ setCurrentSetupPage, t }: InfoProps) {
  return (
    <SetupLayout>
      <InputContainer title={t("gameInstructionsTitle")}>
        <div className="max-w-md w-96 mx-8 my-4">
          <div className="mb-8  w-full text-gray-100 space-y-2 text-xl">
            <p>{t("gameInstructionsItem1")}</p>
            <p>{t("gameInstructionsItem2")}</p>
            <p>{t("gameInstructionsItem3")}</p>
            <p>{t("gameInstructionsItem4")}</p>
            <p>{t("gameInstructionsItem5")}</p>
          </div>

          <div className="w-1/2 mx-auto">
          <Button type="button" onClick={() => setCurrentSetupPage(TeamNamePages.TEAM_NAME)}>
            {t("gameInstructionsContinueButton")}
          </Button>
          </div>
        </div>
      </InputContainer>
    </SetupLayout>
  );
}

export default Info;
