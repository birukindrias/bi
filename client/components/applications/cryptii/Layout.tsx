import React from 'react';
import { WindowManagementSvgIcons } from '../../../utils/constants';
import { Resizable } from 're-resizable';
import { Applications } from '../../../utils/store/settingsStore';
import { LayoutProps } from '../outlook/Layout';
import { useEffect } from 'react';
import Image from 'next/image';
import CryptiiLogo from 'assets/cryptii/logo.png';
import classNames from 'classnames';
import md5 from 'blueimp-md5';
import { useStore } from '../../../utils/store/store';
import { useTranslations } from 'next-intl';
export interface Size {
  height: number;
  width: number;
}
interface CryptiiProps extends LayoutProps {
  size: Size;
  setSize: (value: Size | ((prevVar: Size) => Size)) => void;
}
const Layout = ({ close, focus, size, setSize }: CryptiiProps) => {
  const t = useTranslations();
  const [textInput, setTextInput] = React.useState('');
  const [textOutput, setTextOutput] = React.useState('');
  const [selectedAlgorithm, setSelectedAlgorithm] = React.useState('md5');
  const [encodedBytes, setEncodedBytes] = React.useState('');
  const [changedAlgorithm, setChangedAlgorithm] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(e.target.value);
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAlgorithm(e.target.id);
  };

  useEffect(() => {
    let res = '';
    const hash = async () => {
      switch (selectedAlgorithm) {
        case 'md5':
          res = md5(textInput);
          setTextOutput(res);
          setEncodedBytes('16');
          break;
        case 'sha1':
          res = await shaHash(textInput, 'SHA-1');
          setEncodedBytes('20');
          break;
        case 'sha256':
          res = await shaHash(textInput, 'SHA-256');
          setEncodedBytes('32');
          break;
        case 'sha384':
          res = await shaHash(textInput, 'SHA-384');
          setEncodedBytes('48');
          break;
        case 'sha512':
          res = await shaHash(textInput, 'SHA-512');
          setEncodedBytes('64');
          break;
        default:
          break;
      }
    };
    hash();

    setChangedAlgorithm(true);
    setTimeout(() => {
      setChangedAlgorithm(false);
    }, 1000);
  }, [selectedAlgorithm, textInput]);

  async function shaHash(string: string, algorithm: string) {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest(algorithm, utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((bytes) => bytes.toString(16).padStart(2, '0'))
      .join('');
    setTextOutput((i) => hashHex);
    return hashHex;
  }

  return (
    <Resizable
      onResizeStop={(e, direction, elt, delta) => {
        setSize((size) => ({
          height: size.height + delta.height,
          width: size.width + delta.width,
        }));
      }}
      size={size}
      defaultSize={{
        width: 800,
        height: 600,
      }}
      bounds={document.getElementById('draggable_space') || undefined}
    >
      <div
        onClick={() => focus(Applications.CRYPTII)}
        className={`flex flex-col font-inter bg-white h-full `}
      >
        <div id="handle" className="flex justify-between w-full px-2 py-1">
          <div className="flex items-center">
            <div className="w-8 flex items-center">
              <Image className="" alt="" src={CryptiiLogo} />
            </div>
            <p className="text-sm ml-1">Cryptii</p>
          </div>
          <div className="flex items-center space-x-1">
            {WindowManagementSvgIcons.map((icon, index) => (
              <button
                onClick={() => close()}
                key={index}
                className="w-8 h-8 flex items-center hover:bg-signal_medium_gray cursor-pointer"
              >
                <div className="w-8 h-8 font-white flex items-center  stroke-signal_dark_gray">
                  {React.createElement(icon)}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-cryptii_bg flex-1 flex flex-col items-center h-full overflow-auto text-white ">
          <div className="flex flex-col items-center justify-center py-8">
            <div
              className="relative h-14 w-24 bg-cryptii_blue border-cryptii_blue
   part-pipe"
            ></div>
            <div className="w-96 bg-white shadow-md border border-gray-300 flex flex-col divide-y divide-gray-300">
              <div className=" pt-4 px-4">
                <p className="text-cryptii_blue text-2xl ">
                  {t('cryptii_plaintext')}
                </p>
              </div>
              <div className="px-4 pb-4 ">
                <input
                  value={textInput}
                  onChange={handleInputChange}
                  placeholder="enter text"
                  className="font-roboto-mono text-gray-500 mx-0 px-0 mt-2 focus:ring-0 w-full border-none active-border-none"
                  type="text"
                />
              </div>
            </div>
            <div className="relative h-14 w-24 bg-cryptii_blue part-pipe"></div>
            <div className=" w-96 bg-white shadow-md border border-gray-300 flex flex-col divide-y divide-gray-300">
              <div className=" pt-4 px-4">
                <p className="text-cryptii_blue text-2xl ">
                  {t('cryptii_hash_function')}
                </p>
              </div>

              <form>
                <div
                  className="field field-enum field-enum--radio field--first"
                  data-width="12"
                >
                  <label className="field__label" htmlFor="u13">
                    {t('cryptii_algorithms')}
                  </label>
                  <div className="field-enum__field">
                    <div
                      className="field-enum__options"
                      role="radiogroup"
                      id="algorithms"
                    >
                      <div className="field-enum__option">
                        <input
                          onChange={handleRadioChange}
                          checked={selectedAlgorithm === 'sha384'}
                          type="radio"
                          className="field-enum__option-radio"
                          id="sha384"
                          name="algorithms"
                          data-dashlane-rid="93abc518764264ad"
                          data-form-type=""
                        ></input>
                        <label
                          htmlFor="sha384"
                          className="field-enum__option-label"
                        >
                          SHA-384
                        </label>
                      </div>
                      <div className="field-enum__option">
                        <input
                          onChange={handleRadioChange}
                          checked={selectedAlgorithm === 'md5'}
                          type="radio"
                          className="field-enum__option-radio"
                          id="md5"
                          name="algorithms"
                          data-dashlane-rid="236e51fae18d1497"
                          data-form-type=""
                        ></input>
                        <label
                          htmlFor="md5"
                          className="field-enum__option-label"
                        >
                          MD5
                        </label>
                      </div>
                      <div className="field-enum__option">
                        <input
                          onChange={handleRadioChange}
                          checked={selectedAlgorithm === 'sha1'}
                          type="radio"
                          className="field-enum__option-radio"
                          id="sha1"
                          name="algorithms"
                          data-dashlane-rid="fa5c1ceba6f000b9"
                          data-form-type=""
                        ></input>
                        <label
                          htmlFor="sha1"
                          className="field-enum__option-label"
                        >
                          SHA-1
                        </label>
                      </div>

                      <div className="field-enum__option">
                        <input
                          onChange={handleRadioChange}
                          checked={selectedAlgorithm === 'sha512'}
                          type="radio"
                          className="field-enum__option-radio"
                          id="sha512"
                          name="algorithms"
                          data-dashlane-rid="9e62783c6d6f8d88"
                          data-form-type=""
                        ></input>
                        <label
                          htmlFor="sha512"
                          className="field-enum__option-label"
                        >
                          SHA-512
                        </label>
                      </div>
                      <div className="field-enum__option">
                        <input
                          onChange={handleRadioChange}
                          checked={selectedAlgorithm === 'sha256'}
                          type="radio"
                          className="field-enum__option-radio"
                          id="sha256"
                          name="algorithms"
                          data-dashlane-rid="19548ad18e98cea2"
                          data-form-type=""
                        ></input>
                        <label
                          htmlFor="sha256"
                          className="field-enum__option-label"
                        >
                          SHA-256
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
              <footer
                className={classNames('brick__status brick__status--forward', {
                  'text-cryptii_orange': changedAlgorithm,
                  'text-[#90999e]': !changedAlgorithm,
                })}
              >
                <div className="brick__status-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path d="M16 7H3.83l3.58-3.59L6 2 0 8l6 6 1.41-1.41L3.83 9H16z"></path>
                  </svg>
                </div>
                <div className="brick__status-message">
                  {t('cryptii_encoded_bytes', {
                    bytes: encodedBytes,
                  })}
                </div>
              </footer>
            </div>
            <div className="relative h-14 w-24 bg-cryptii_blue part-pipe"></div>
            <div className=" w-96 bg-white shadow-md border border-gray-300 flex flex-col divide-y divide-gray-300">
              <div className=" pt-4 px-4">
                <p className="text-cryptii_blue text-2xl ">
                  {t('cryptii_cyphertext')}
                </p>
              </div>
              <div className="px-4 pb-4 ">
                <textarea
                  readOnly={true}
                  value={textOutput}
                  className="font-roboto-mono text-gray-500 mx-0 px-0 min-h-[200px] mt-2 focus:ring-0 w-full border-none active-border-none"
                ></textarea>
              </div>
            </div>
            <div className="relative h-14 w-24 bg-cryptii_blue part-pipe border-cryptii_blue"></div>
          </div>
        </div>
      </div>
    </Resizable>
  );
};

export default Layout;
