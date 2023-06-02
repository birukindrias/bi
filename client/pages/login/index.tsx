import { Fragment, useState, useEffect } from 'react';
import Form from '../../components/inputs/form';
import Input from '../../components/inputs/input';
import InputContainer from '../../components/layout/InputContainer';
import SetupLayout from '../../components/layout/SetupLayout';
import Button from '../../components/inputs/button';
import { getGameByGameCode } from '../../utils/api';
import { useRouter } from 'next/router';
import { useStore } from '../../utils/store/store';
import { GetServerSideProps } from 'next';
import classNames from 'classnames';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/outline';


interface Language {
  id: "en" | "de" | "fr" | "es" | "nl";
  name: string;
}
const languages:Language[] = [
  {
    id: 'nl',
    name: 'Nederlands',
  },
  {
    id: 'en',
    name: 'English',
  },
  {
    id: 'de',
    name: 'Deutsch',
  },
  {
    id: 'fr',
    name: 'Français',
  },
  {
    id: 'es',
    name: 'Español',
  }
];

interface Translations {
  [key: string]: {
    title: string;
    placeholder: string;
    button: string;
  };
}

const translations:Translations = {
  "nl": {
    title: "Voer uw game code in",
    placeholder: "Game code",
    button: "Begin",
  },
  "en": {
    title: "Enter your game code",
    placeholder: "Game code",
    button: "Start",
  },
  "de": {
    title: "Gib deinen Spielcode ein",
    placeholder: "Spielcode",
    button: "Beginnen",
  },
  "fr": {
    title: "Introduis ton code de jeu",
    placeholder: "Code du jeu",
    button: "Commencer",
  },
  "es": {
    title: "Introduzca su código de juego",
    placeholder: "Código del juego",
    button: "Comienza",
  }
}
const Index = () => {


  const router = useRouter();

  const [gameCode, setGameCode] = useState('');
  const { addGameId } = useStore();
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [open, setOpen] = useState(false);
  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const result = await getGameByGameCode(gameCode);
      if (result.status === 200) {
        addGameId(result.data.id);
        router.push(`/setup/${result.data.id}`);
      }
    } catch (error) {
      console.error('No Game could be found');
    }
  };
  return (
    <SetupLayout login={true}>
      {/* <div className="absolute top-8 right-8 w-48">
        <Listbox
          value={selectedLanguage.name}
          //@ts-ignore
          onChange={setSelectedLanguage}
        >
          {({ open }) => (
            <>
              <div className="mt-1 relative">
                <Listbox.Button className="bg-white  relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <span className="block truncate text-lg">
                    {selectedLanguage.name}
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
                    {languages.map((language) => (
                      <Listbox.Option
                        key={language.id}
                        className={({ active }) =>
                          classNames(
                            active
                              ? 'text-white bg-indigo-600'
                              : 'text-gray-900',
                            'cursor-default select-none relative py-2 pl-3 pr-9 text-lg'
                          )
                        }
                        value={language}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={classNames(
                                selected ? 'font-semibold' : 'font-normal',
                                'block truncate'
                              )}
                            >
                              {language.name}
                            </span>

                            {selected ? (
                              <span
                                className={classNames(
                                  active ? 'text-white' : 'text-indigo-600',
                                  'absolute inset-y-0 right-0 flex items-center pr-4'
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
      </div> */}
      <InputContainer title={translations[selectedLanguage.id].title || "Enter your game code"}>
        <div className="flex align-middle justify-center">
          <Form handleSubmit={(e) => handleLogin(e)}>
            <Fragment>
              <Input
                value={gameCode}
                handleChange={(e) => setGameCode(e.target.value)}
                type="text"
                placeholder={translations[selectedLanguage.id].placeholder || "Game code"}
              ></Input>
              <Button type="submit">{translations[selectedLanguage.id].button || "Start"}</Button>
            </Fragment>
          </Form>
        </div>
      </InputContainer>
    </SetupLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const json = { test: 'test' };

  return {
    props: {
      messages: json,
    },
  };
};

export default Index;
