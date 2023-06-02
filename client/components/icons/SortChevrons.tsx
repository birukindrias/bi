import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import classNames from 'classnames';

type SortChevronsProps = {
  sort: string;
  entity: "score" | "date" | "name";
  public_mode?: boolean;
}
const SortChevrons = ({sort, entity}:SortChevronsProps) => {
  return (
    <div className="ml-2">
                        <ChevronUpIcon
                          className={classNames(
                            sort === `${entity}_asc`
                              ? 'text-blue'
                              : 'text-gray-200',
                            'h-4 w-4'
                          )}
                        ></ChevronUpIcon>
                        <ChevronDownIcon
                          className={classNames(
                            sort === `${entity}_desc`
                              ? 'text-blue'
                              : 'text-gray-200',
                            'h-4 w-4'
                          )}
                        ></ChevronDownIcon>
                      </div>
  );
}

export default SortChevrons;
