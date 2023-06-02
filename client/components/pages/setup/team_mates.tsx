import { useRouter } from "next/router";
import { useState, Fragment } from "react";
import { useStore } from "../../../utils/store/store";
import { updateTeam } from "../../../utils/api";
import Input from "../../inputs/input";
import SetupLayout from "../../layout/SetupLayout";
import InputContainer from "../../layout/InputContainer";
import Form from "../../inputs/form";
import Button from "../../inputs/button";
import { LocalTeamMember } from "utils/store/settingsStore";

function TeamMates({ t }: { t: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { addLocalPlayers } = useStore();
  const [teamMateInput, setTeamMateInput] = useState<LocalTeamMember[]>([
    {
      name: "",
      email: "",
    },
    {
      name: "",
      email: "",
    },
    {
      name: "",
      email: "",
    },
    {
      name: "",
      email: "",
    },
    {
      name: "",
      email: "",
    },
  ]);
  const { teamId, gameId } = useStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("teams ", teamMateInput);

    if (teamMateInput.length > 0 && teamId && gameId) {
      setLoading(true);
      let players = teamMateInput.filter((player) => player.name.length > 0);
      addLocalPlayers(players);
      const result = await updateTeam(teamId, {
        players: players.map((player) => ({name: player.name, email: player.email})),
      });
      // const result = await updateTeam(teamId, {
      //   players: pla
      // });
      if (result.status === 200) {
        router.push(`/intro/${gameId}/${teamId}`);
      }
      console.log(players);
    }
  };

  const getInputs = () => {
    return teamMateInput.map((_, index) => {
      return (
        <div className="flex space-x-1" key={index}>
          <Input
            className="my-2"
            key="name"
            placeholder={"Member " + (index + 1) + " name"}
            value={teamMateInput[index].name}
            handleChange={(e) =>
              setTeamMateInput((teamNames: LocalTeamMember[]) => {
                teamNames[index].name = e.target.value;
                return [...teamNames];
              })
            }
          />
          <Input
            className="my-2"
            key="email"
            placeholder={"Member " + (index + 1) + " email"}
            value={teamMateInput[index].email}
            handleChange={(e) =>
              setTeamMateInput((teamNames: LocalTeamMember[]) => {
                teamNames[index].email = e.target.value;
                return [...teamNames];
              })
            }
          />
        </div>
      );
    });
  };
  return (
    <SetupLayout>
      <InputContainer title={t("introTeamMemberTitle")}>
        <>
          <p className="max-w-md py-4 px-2 text-center text-gray-100 mx-auto text-xl">
            {t("introTeamMemberDisclaimer")}
          </p>
          <p className="max-w-md py-4 px-2 text-center text-gray-100 mx-auto text-xl">
            {t("introTeamMemberDisclaimer2")}
          </p>
          <Form handleSubmit={(e) => handleSubmit(e)}>
            <Fragment>
              <div className="grid grid-cols-1 divide-y divide-solid divide-slate-300 mb-8">
                {getInputs()}
              </div>
              <Button
                disabled={
                  loading ||
                  teamMateInput.filter((tm) => tm.name.length > 0).length < 1
                }
                type="submit"
              >
                {"Start"}
              </Button>
            </Fragment>
          </Form>
        </>
      </InputContainer>
    </SetupLayout>
  );
}

export default TeamMates;
