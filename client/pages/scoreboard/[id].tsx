import { GetServerSideProps, NextPageContext } from 'next';
import { sortTeams, getTruncatedText } from '../../utils/helper';
import { useState, useEffect } from 'react';
import { useFetchGameResults } from 'utils/api';
import { Team } from '../../utils/api';
import SortChevrons from 'components/icons/SortChevrons';

type ScoreBoardProps = {
  id: string;
};

const Scoreboard = ({ id }: ScoreBoardProps) => {
  const { isError, isLoading, teams } = useFetchGameResults(id);

  const [sortedTeams, setSortedTeams] = useState<Team[]>([]);

  const [currentSort, setCurrentSort] = useState<string>('score_asc');

  useEffect(() => {
    handleSortClick('score');
  }, [teams]);

  const handleSortClick = (entity: string) => {
  if(teams?.length > 0){
    let sortResult = sortTeams(entity, teams, currentSort);
    setSortedTeams(() => sortResult.teams);
    setCurrentSort(() => sortResult.sort);
  }
  };
  if (isError) {
    console.error(isError);
    return <div>Error</div>;
  }
  if (isLoading) {
    return <div>Loading</div>;
  }
  return (
    <div className="bg-dpia_bg bg-cover h-screen">
      <div className="grid grid-cols-12 grid-rows-12 p-8 gap-x-28 relative h-screen w-screen max-w-screen-2xl mx-auto">
        <div className="px-6 py-4 col-span-12 row-span-9 h-full w-full bg-slate-400 rounded-lg shadow-md relative overflow-y-scroll">
          <div className="h-full w-full bg-slate-500 rounded-lg relative">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-slate-600">
                <tr>
                  {/* <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider "
                  >
                    ID
                  </th> */}
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSortClick('name')}
                    >
                      Team Name
                      <div className="ml-2">
                        <SortChevrons public_mode entity="name" sort={currentSort} />
                      </div>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Department Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSortClick('score')}
                    >
                      Score
                      <div className="ml-2">
                        <SortChevrons public_mode entity="score" sort={currentSort} />
                      </div>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSortClick('date')}
                    >
                      Date
                      <div className="ml-2">
                        <SortChevrons public_mode entity="date" sort={currentSort} />
                      </div>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-white text-left text-xs font-medium  uppercase tracking-wider"
                  >
                    Team Members
                  </th>

                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedTeams.map((team) => (
                  <tr key={team.id} className="bg-slate-100">
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 ">
                      {getTruncatedText(team.id)}
                    </td> */}

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 ">
                      {team.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                      {team.department ? team.department : 'n/a'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                      {team.result?.score ? team.result.score : 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                      {team.result?.date
                        ? new Date(team.result.date).toLocaleString()
                        : 'n/a'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {team.players?.map((p) => (
                        <p key={p.id}>{getTruncatedText(p.name)}</p>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  return {
    props: {
      id: id as string,
    },
  };
};

export default Scoreboard;
