import { Fragment, useState } from "react";
import { SetupPages } from "../../../utils/constants";
import SetupLayout from "../../layout/SetupLayout";
import InputContainer from "../../layout/InputContainer";
import Form from "../../inputs/form";
import Input from "../../inputs/input";
import Button from "../../inputs/button";
import { useStore } from "../../../utils/store/store";
import { updateTeam } from "../../../utils/api";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import classNames from "classnames";
type TeamDepartmentProps = {
  setCurrentSetupPage: (page: SetupPages) => void;
  t: any;
};
function TeamDepartment({ setCurrentSetupPage, t }: TeamDepartmentProps) {
  const [loading, setLoading] = useState(false);
  const { teamId, gameId, setDepartment, selectedDepartment, departments } =
    useStore();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!selectedDepartment && teamId && gameId) {
      setLoading(true);
      const result = await updateTeam(teamId, {
        department: "engineer",
      });
      if (result.status === 200) {
        setCurrentSetupPage(SetupPages.TEAM_MATES);
        setLoading(false);
      }
    }
  };

  return (
    <SetupLayout>
      <InputContainer title={t("introDepartment")}>
        <Fragment>
          <div className="w-56">
            <div>
              <Listbox
                value={selectedDepartment ? selectedDepartment : departments[0]}
                onChange={setDepartment}
              >
                {({ open }) => (
                  <>
                    <div className="mt-1 relative">
                      <Listbox.Button className="bg-white  relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <span className="block truncate text-lg">
                          {selectedDepartment
                            ? selectedDepartment.name
                            : t("selectDepartmentPlaceholder")}
                        </span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <SelectorIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                          {departments.length > 0 &&
                            departments.map((department) => (
                              <Listbox.Option
                                key={department.name}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? "text-white bg-indigo-600"
                                      : "text-gray-900",
                                    "cursor-default select-none relative py-2 pl-3 pr-9 text-lg"
                                  )
                                }
                                value={department}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span
                                      className={classNames(
                                        selected
                                          ? "font-semibold"
                                          : "font-normal",
                                        "block truncate"
                                      )}
                                    >
                                      {department.name}
                                    </span>

                                    {selected ? (
                                      <span
                                        className={classNames(
                                          active
                                            ? "text-white"
                                            : "text-indigo-600",
                                          "absolute inset-y-0 right-0 flex items-center pr-4"
                                        )}
                                      >
                                        <CheckIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
            </div>
          </div>
          <div className="mt-4">
            <Button
              onClick={(e) => handleSubmit(e)}
              disabled={loading || !selectedDepartment}
              type="submit"
            >
              {t("startButton")}
            </Button>
          </div>
        </Fragment>
      </InputContainer>
    </SetupLayout>
  );
}

export default TeamDepartment;
