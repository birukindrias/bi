import Image from 'next/image';
import { WindowManagementSvgIcons } from 'utils/constants';
import { LayoutProps } from '../outlook/Layout';
import ChevDownLogo from 'assets/vscode/chevDown.svg';
import CppLogo from 'assets/vscode/cpp_icon.png';
import React, { Fragment, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Resizable } from 're-resizable';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import {
  COMMON_H,
  FILESYSTEM_H,
  THREAD_POOL_H,
  GLOBAL_PARAMETERS_H,
  NETWORK_SCANNER_CPP,
  NETWORK_SCANNER_H,
  SEARCH_CPP,
  DECRYPTOR_CPP,
  DECRYPTOR_H,
  MAIN_CPP,
} from '../../../utils/codeplaceholder';
import { Applications } from 'utils/store/settingsStore';
import { useStore } from '../../../utils/store/store';
import { LayoutSizeProps } from '../tor/Layout';
import { ENCRYPTION_ENV } from '../../../utils/codeplaceholder';

interface File {
  name: string;

  code: string;
}

interface Folder {
  name: string;
  files: File[];
}

const FolderStructure: Folder = {
  name: 'root',
  files: [

    {
      name: 'network_scanner.cpp',
      code: NETWORK_SCANNER_CPP,
    },
    {
      name: 'network_scanner.h',
      code: NETWORK_SCANNER_H,
    },
    {
      name: 'upload.cpp',
      code: SEARCH_CPP,
    },
    {
      name: ".env",
      code: ENCRYPTION_ENV
    },
    {
      name: 'validator.cpp',
      code: DECRYPTOR_CPP,
    },
    {
      name: 'validator.h',
      code: DECRYPTOR_H,
    },
    {
      name: 'main.cpp',
      code: MAIN_CPP,
    },
    {
      name: 'common.h',
      code: COMMON_H,
    },
    {
      name: 'filesystem.h',
      code: FILESYSTEM_H,
    },
    {
      name: 'threadpool.h',
      code: THREAD_POOL_H,
    },
    {
      name: 'global_parameters.h',
      code: GLOBAL_PARAMETERS_H,
    },
  ],
};

interface VSCodeLayoutProps extends LayoutSizeProps, LayoutProps {}

const Layout = ({ close, focus, size, setSize }: VSCodeLayoutProps) => {
  const [activeFile, setActiveFile] = useState<File>(FolderStructure.files[0]);
  const [showFolder, setShowFolder] = useState(true);
  const [showFiles, setShowFiles] = useState(true);
  const { showDownloads } = useStore();

  useEffect(() => {
    let draggable = document.getElementById('draggable_space');
    let height = draggable?.offsetHeight;
    let width = draggable?.offsetWidth;
    if (width && height) {
      setSize({
        height,
        width,
      });
    }
  }, []);

  const mapExtensionToLanguage = (extension: string) => {
    switch (extension) {
      case 'cpp':
        return 'cpp';
      case 'h':
        return 'cpp';
      case 'json':
        return 'json';
      case 'css':
        return 'css';
      case 'js':
        return 'javascript';
      default:
        return 'plaintext';
    }
  };

  const getFileSymbol = (type: string) => {
    switch (type) {
      case 'css':
        return <p className="text-[17px] text-center text-vscode_blue">#</p>;
      case 'json':
        return <p className="text-center text-vscode_yellow">{'{ }'}</p>;
      case 'js':
        return <p className="text-vscode_yellow">JS</p>;
      case 'cpp':
        return (
          <div className="relative h-4 w-4 flex items-center justify-center">
            <Image src={CppLogo} layout="fill" alt="" />
          </div>
        );
      case 'h':
        return (
          <div className="relative h-4 w-4 flex items-center justify-center">
            <Image src={CppLogo} layout="fill" alt="" />
          </div>
        );
      default:
        return <p className="text-vscode_yellow">JS</p>;
    }
  };

  return (
    <Resizable
      size={size}
      onResizeStop={(e, direction, elt, delta) => {
        setSize((size) => ({
          height: size.height + delta.height,
          width: size.width + delta.width,
        }));
      }}
      defaultSize={{ width: 1000, height: 500 }}
      bounds={document.getElementById('draggable_space') || undefined}
    >
      <div
        onClick={() => focus(Applications.VSCODE)}
        className="flex-col font-inter bg-vscode_dark_gray h-full grid grid-cols-12"
      >
        <div className="col-span-3 h-full w-full bg-vscode_dark_brown_gray ">
          <div className="flex flex-col">
            <div className="text-vscode_font_primary h-10">
              <p className="font-light pt-3 pl-4 text-sm">{showDownloads ? "Explorer" : "Visual Studio Code"}</p>
            </div>
          </div>

          {showDownloads && (
            <div className="text-vscode_font_primary h-full">
              <div
                className="flex items-center space-x-2 pl-4 w-full hover:bg-vscode_light_gray py-1 cursor-pointer"
                onClick={() => setShowFolder((s) => !s)}
              >
                <div
                  className={classNames('relative h-4 w-4 -rotate-90', {
                    'rotate-0': showFolder,
                  })}
                >
                  <Image alt="" layout="fill" src={ChevDownLogo} />
                </div>
                <p className="text-sm">TOASTRE</p>
              </div>

              <div className="overflow-none">
                <ul>
                  <li
                    className={classNames('', {
                      hidden: !showFolder,
                    })}
                  >
                    <div
                      onClick={() => setShowFiles((s) => !s)}
                      className="flex items-center space-x-2 ml-8 mt-2 cursor-pointer hover:bg-vscode_light_gray"
                    >
                      <div
                        className={classNames('relative h-4 w-4 -rotate-90', {
                          'rotate-0': showFiles,
                        })}
                      >
                        <Image alt="" layout="fill" src={ChevDownLogo} />
                      </div>
                      <p className="text-sm">{FolderStructure.name}</p>
                    </div>
                    <div
                      className={classNames('text-sm mt-2', {
                        hidden: !showFiles,
                      })}
                    >
                      <ul className="space-y-1">
                        {FolderStructure.files.map((file) => (
                          <li
                            onClick={() => setActiveFile(file)}
                            key={file.name}
                            className="group w-full cursor-pointer pl-12 hover:bg-vscode_light_gray"
                          >
                            <div className="flex ">
                              <div className="w-4 mr-2">
                                {getFileSymbol(file.name.split('.')[1])}
                              </div>
                              <p
                                className={classNames(
                                  'group-hover:text-vscode_flush',
                                  {
                                    'text-vscode_flush':
                                      activeFile.name === file.name,
                                  }
                                )}
                              >
                                {file.name}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
        <div className="col-span-9 h-full overflow-hidden max-w-full relative">
          <div
            id="handle"
            className={classNames(
              ' w-full flex  text-vscode_font_primary bg-vscode_dark_brown_gray pr-2',
              {
                'justify-end': !showDownloads,
                'justify-between': showDownloads,
              }
            )}
          >
            {showDownloads && (
              <div className="flex h-10 items-center py-2 px-3 bg-vscode_dark_gray">
                <div className="w-5 mr-3">
                  {getFileSymbol(activeFile.name.split('.')[1])}
                </div>
                <p>{activeFile.name}</p>
              </div>
            )}
            <div className="flex items-center space-x-1">
              {WindowManagementSvgIcons.map((icon, index) => (
                <button
                  onClick={() => close()}
                  key={index}
                  className="w-8 h-8 flex items-center hover:bg-vscode_light_gray cursor-pointer"
                >
                  <div className="w-8 h-8 font-white flex items-center  stroke-white">
                    {React.createElement(icon)}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="relative h-full overflow-scroll pb-10 px-1">
            {showDownloads && (
              <Fragment>
                {/* a11yDark */}
                <SyntaxHighlighter
                  wrapLongLines
                  language={mapExtensionToLanguage(
                    activeFile.name.split('.')[1]
                  )}
                  style={vs2015}
                >
                  {activeFile.code}
                </SyntaxHighlighter>
              </Fragment>
            )}
          </div>
        </div>
      </div>
    </Resizable>
  );
};

export default Layout;
