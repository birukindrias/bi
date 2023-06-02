import Background from 'assets/hack/background.png';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Applications } from 'utils/store/settingsStore';
import { useTranslations } from 'next-intl';
import { DPIA_URL } from 'utils/constants';
import { Objectives } from '../../../../utils/store/settingsStore';
import { useStore } from '../../../../utils/store/store';

interface IDataTransfer {
  id: number;
  time: number;
  source: string;
  destination: string;
  protocol: string;
}
const dataTransfer: IDataTransfer[] = [
  {
    id: 0,
    time: 1424370417,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'ARP',
  },
  {
    id: 1,
    time: 1157875291,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'NBNS',
  },
  {
    id: 2,
    time: 625922570,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'STP',
  },
  {
    id: 3,
    time: 1204222120,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'TCP',
  },
  {
    id: 4,
    time: 389661706,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'DNS',
  },
  {
    id: 5,
    time: 387021913,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'ARP',
  },
  {
    id: 6,
    time: 294875056,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'NBNS',
  },
  {
    id: 7,
    time: 441853146,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'FTP',
  },
  {
    id: 8,
    time: 495273378,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'ARP',
  },
  {
    id: 9,
    time: 26201121,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'DNS',
  },
  {
    id: 10,
    time: 501849717,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'STP',
  },
  {
    id: 11,
    time: 1135498821,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'FTP',
  },
  {
    id: 12,
    time: 939305330,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'STP',
  },
  {
    id: 13,
    time: 1489783702,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'DNS',
  },
  {
    id: 14,
    time: 457062253,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'NBNS',
  },
  {
    id: 15,
    time: 6767852,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'STP',
  },
  {
    id: 16,
    time: 184844249,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'TCP',
  },
  {
    id: 17,
    time: 1367391200,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'STP',
  },
  {
    id: 18,
    time: 468647593,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'ARP',
  },
  {
    id: 19,
    time: 193293810,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'DNS',
  },
  {
    id: 20,
    time: 455835771,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'FTP',
  },
  {
    id: 21,
    time: 305550962,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'TCP',
  },
  {
    id: 22,
    time: 791543106,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'ARP',
  },
  {
    id: 23,
    time: 464522736,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'ARP',
  },
  {
    id: 24,
    time: 1538432106,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'NBNS',
  },
  {
    id: 25,
    time: 1313445655,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'ARP',
  },
  {
    id: 26,
    time: 1051167797,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'FTP',
  },
  {
    id: 27,
    time: 575793564,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'TCP',
  },
  {
    id: 28,
    time: 1339125187,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'DNS',
  },
  {
    id: 29,
    time: 625784069,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'TCP',
  },
  {
    id: 30,
    time: 1270851133,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'STP',
  },
  {
    id: 31,
    time: 253117665,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'NBNS',
  },
  {
    id: 32,
    time: 117822829,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'FTP',
  },
  {
    id: 33,
    time: 704339099,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'STP',
  },
  {
    id: 34,
    time: 755844357,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'STP',
  },
  {
    id: 35,
    time: 136057911,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'STP',
  },
  {
    id: 36,
    time: 297830050,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'FTP',
  },
  {
    id: 37,
    time: 551958168,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'STP',
  },
  {
    id: 38,
    time: 622977845,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'TCP',
  },
  {
    id: 39,
    time: 1597731502,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'DNS',
  },
  {
    id: 40,
    time: 1430296955,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'DNS',
  },
  {
    id: 41,
    time: 320131950,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'TCP',
  },
  {
    id: 42,
    time: 908904568,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'FTP',
  },
  {
    id: 43,
    time: 1480334096,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'DNS',
  },
  {
    id: 44,
    time: 885822507,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'DNS',
  },
  {
    id: 45,
    time: 1509297702,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'DNS',
  },
  {
    id: 46,
    time: 353890612,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'ARP',
  },
  {
    id: 47,
    time: 1098172369,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'STP',
  },
  {
    id: 48,
    time: 904569179,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'DNS',
  },
  {
    id: 49,
    time: 431345397,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'ARP',
  },
  {
    id: 50,
    time: 628674245,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'DNS',
  },
  {
    id: 51,
    time: 172373092,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'NBNS',
  },
  {
    id: 52,
    time: 1646335076,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'STP',
  },
  {
    id: 53,
    time: 1414080549,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'FTP',
  },
  {
    id: 54,
    time: 436393506,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'ARP',
  },
  {
    id: 55,
    time: 965356760,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'ARP',
  },
  {
    id: 56,
    time: 1309966122,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'TCP',
  },
  {
    id: 57,
    time: 1008729974,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'FTP',
  },
  {
    id: 58,
    time: 1272550713,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'ARP',
  },
  {
    id: 59,
    time: 666616575,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'DNS',
  },
  {
    id: 60,
    time: 607459631,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'DNS',
  },
  {
    id: 61,
    time: 747547111,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'ARP',
  },
  {
    id: 62,
    time: 466810014,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'STP',
  },
  {
    id: 63,
    time: 736705550,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'DNS',
  },
  {
    id: 64,
    time: 943828708,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'ARP',
  },
  {
    id: 65,
    time: 178902918,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'FTP',
  },
  {
    id: 66,
    time: 1506090217,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'ARP',
  },
  {
    id: 67,
    time: 841195750,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'ARP',
  },
  {
    id: 68,
    time: 1470299994,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'NBNS',
  },
  {
    id: 69,
    time: 1459212209,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'DNS',
  },
  {
    id: 70,
    time: 1038226668,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'ARP',
  },
  {
    id: 71,
    time: 274348148,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'ARP',
  },
  {
    id: 72,
    time: 152649607,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'DNS',
  },
  {
    id: 73,
    time: 1256694357,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'NBNS',
  },
  {
    id: 74,
    time: 665021999,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'ARP',
  },
  {
    id: 75,
    time: 1222006405,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'STP',
  },
  {
    id: 76,
    time: 179052391,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'NBNS',
  },
  {
    id: 77,
    time: 1530718990,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'FTP',
  },
  {
    id: 78,
    time: 1461504012,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'TCP',
  },
  {
    id: 79,
    time: 275883939,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'NBNS',
  },
  {
    id: 80,
    time: 1180769011,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'FTP',
  },
  {
    id: 81,
    time: 35752986,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'DNS',
  },
  {
    id: 82,
    time: 1265439208,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'DNS',
  },
  {
    id: 83,
    time: 871416461,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'FTP',
  },
  {
    id: 84,
    time: 841126630,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'STP',
  },
  {
    id: 85,
    time: 1369863147,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'TCP',
  },
  {
    id: 86,
    time: 1328931279,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'NBNS',
  },
  {
    id: 87,
    time: 928015654,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'DNS',
  },
  {
    id: 88,
    time: 1338570275,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'NBNS',
  },
  {
    id: 89,
    time: 1457822260,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'DNS',
  },
  {
    id: 90,
    time: 1445700258,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'STP',
  },
  {
    id: 91,
    time: 39546184,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'NBNS',
  },
  {
    id: 92,
    time: 520147570,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'NBNS',
  },
  {
    id: 93,
    time: 1202788341,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'NBNS',
  },
  {
    id: 94,
    time: 430401354,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'ARP',
  },
  {
    id: 95,
    time: 1237987734,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'STP',
  },
  {
    id: 96,
    time: 468117531,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'NBNS',
  },
  {
    id: 97,
    time: 620445669,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'DNS',
  },
  {
    id: 98,
    time: 787042872,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'FTP',
  },
  {
    id: 99,
    time: 1271559059,
    source: 'Amsterdam',
    destination: 'youllneverpealthis.onion',
    protocol: 'NBNS',
  },
];

const Index = () => {
  const t = useTranslations();
  const [time, setTime] = useState('00:00:00');
  const [transferToShow, setTransferToShow] = useState<IDataTransfer[]>([]);
  const [started, setStarted] = useState(false);
  const { openTorPage, finishObjective, tabs, closeTab } = useStore();

  const handleTakeAction = () => {
    finishObjective(Objectives.HACK_DECISION);

  };

  useEffect(() => {
    let int: NodeJS.Timer;
    if (time == '00:00:00') {
      int = setInterval(() => {
        const newTime = new Date().toLocaleTimeString();
        setTime(() => newTime);
      }, 1000);
    }

    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    if (!started) {
      setStarted(true);
      (function loop(counter: number) {
        var rand = Math.round(Math.random() * 600) + 1;
        if (counter < dataTransfer.length) {
          setTimeout(function () {
            let element = dataTransfer[counter];
              setTransferToShow((state) => {
                if (state.length > 50) {
                 return [...state.slice(20), element]
                } else {
                  return [...state, element]
                }
              });
            loop((counter += 1));
          }, rand);
        } else {
          counter = 0
          loop(counter);
        }
        return;
      })(0);
    }
  }, [started]);

  return (
    <div className="flex-1 flex flex-col h-full font-sharetech overflow-auto">
      <div className="relative h-full w-full">
        <div className="absolute top-0 left-0 h-full w-full">
          <div className="h-full w-full bg-black relative overflow-hidden">
            <Image src={Background} alt="" />
          </div>
        </div>
        <div className="relative top-0 left-0 flex flex-col justify-between h-full">
          <div className="grid grid-cols-8 mt-8">
            <div className="col-span-2 text-white">
              <div className="flex flex-col ml-16">
                <p className="text-hack_gray text-2xl">
                  {t('hackLocalTimeText')}
                </p>
                <p className="text-3xl border-hack_gray border-0 border-b max-w-fit animate-pulse">
                  {time}
                </p>
              </div>
            </div>
            <div className="col-span-4 text-white text-center">
              <p className="text-4xl">{t('hackTitle')}</p>
            </div>
          </div>
          <div className="grid grid-cols-8 text-white ml-16 space-x-14 ">
            <div className="col-span-4">
              <p className="text-2xl border-b border-hack_gray max-w-fit">
                {t('hackListTitle')}
              </p>
              <div className="overflow-scroll h-56 flex mt-8 flex-col-reverse space-y-4 relative">
                <table className="table-auto w-full mt-2  ">
                  <thead className="sticky top-0 bg-black">
                    <tr className="">
                      <th className="text-left p-1">{t('hackId')}</th>
                      <th className="text-left p-1">{t('hackTime')}</th>
                      <th className="text-left p-1">{t('hackSource')}</th>
                      <th className="text-left p-1">{t('hackDestination')}</th>
                      <th className="text-left p-1">{t('hackProtocol')}</th>
                    </tr>
                  </thead>
                  <tbody className="text-hack_light_gray   ">
                    {transferToShow.map((transfer) => (
                      <tr key={transfer.id + Date.now()} className="">
                        <td className="text-left p-1">{transfer.id}</td>
                        <td className="text-left p-1">{transfer.time}</td>
                        <td className="text-left p-1">{transfer.source}</td>
                        <td className="text-left p-1">
                          {transfer.destination}
                        </td>
                        <td className="text-left p-1">{transfer.protocol}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-start-6 col-end-8 flex items-center">
              <button
                onClick={() => handleTakeAction()}
                className="px-3 py-2 text-2xl bg-white text-black rounded-md animate-pulse "
              >
                {t('hackActionButton')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
