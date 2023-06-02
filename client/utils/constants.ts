import MinimizeIcon from 'assets/signal/minimize.svg';
import { IEmail } from 'components/applications/outlook/InnerLayoutItems';
import MinimizeSvgIcon from '../components/icons/Minimize';
export const isLocal = process.env.NODE_ENV;

export const SERVER_URL = "http://localhost:4000";
  isLocal === "development"
  //   ? "http://localhost:4000/api"
  //   : "https://ransom.brooklyn-bridge.nl/api";

export enum TeamNamePages {
  INFO = 'info',
  TEAM_NAME = 'team_name',
}

export enum SetupPages {
  TEAM_MATES = 'team_mates',
  DEPARTMENT = 'department',
}

export const IMAGE_URL = SERVER_URL + '/settings/images/';

export const PLACEHOLDER_VIDEO_URL = 'https://vimeo.com/608334799';

export const GAME_LENGTH_IN_SECONDS = 45 * 60;

export const ENDGAME_LENGTH_IN_SECONDS = 10 * 60;

export const WindowManagementSvgIcons = [MinimizeSvgIcon];

export const COMBINATION_LOCK_CODE = '8623';
export const SECONDS_AFTER_START_TO_OPEN_HACK = 90;
export const DPIA_URL = 'dpia';
export const HACK_URL = 'hack';
export const LOCKED_FILES_URL = 'youllneverpealthis.onion';
export const SUR5_TWITTER_URL = 'https://twitter.com/sur5';
export const COGNITO_URL = 'https://cognito.amazonaws.com/';
export const SUR5_CHAT_URL = 'https://chat.sur5.onion';
export const MILKROAD_URL =
  '12.423.12.654.M.ilk.Road.onion/auction/<ORGANIZATIONNAME>_files&personaldata';
// export const EMAILS: IEmail[] = [
//   {
//     id: '1',
//     from_name: 'Customer',
//     from_mail: '[emailadres from the board]@[customer domain]',
//     subject: 'Board objectives and boundaries',
//     date: '14-6-2013',
//     html: `
//     <p>Hi team,</p>
//     <p>Thanks for being our boots on the ground and supporting our forensic teams with this hack. As emphasized in our videocall, these are your objectives:</p>
//     <ol>
//       <li>1. Principally we never pay hackers, we don&#39;t subsidize criminal actions</li>
//       <li>2. Protect leackage of our customers&#39; and employees&#39; information at any cost</li>
//       <li>3. Beyond the forensic team, I will give you &euro; 250.000 funds, to be used as you see fit, to ensure we keep this incident in control.</li>
//     </ol>
//     <p>If you have any questions, please check in with [CISO Name] our [CISO Function]. Because of the extremely sensitive nature, the internal and external projectteam will use Signal for encrypted communications.</p>
//     <p>I&#39;m hoping for good news.</p>
//     <p>Talk to you soon.</p>
//     <p>[Name authority] [Function authority] &lt;/p&gt;</p>
//     `,
//   },
//   {
//     id: '2',
//     from_name: 'Stan Pho',
//     from_mail: 'stan.pho-rensic@microsoft829.com',
//     subject: '[URGENT] Late payment - invoice due retainer forensic experts',
//     date: '14-6-2013',
//     html: `
//     <p>Hi [names of the teammembers],</p>
//     <p>[Name authority] and [CISO name] hired us for out-of-office hours forensic support. And we were sent to you for an invoice problem.</p>
//     </br>
//     <p>We've been involved since the beginning of the IT incident, and have been burning over 300 hours (20 FTE x 15hrs x € 250/hr) already.</p>
//     <p>Our retainer invoice for 500 hours (100K in EUR) has not been paid yet. Our internal risk & compliance procedure mandates the invoice to be paid, before we can continu with any work.</p>
//     </br>
//     <p>Click here to find the invoice and payment details:</p>
//     <a href="https://microsoft829.com/onedrive/document_829013929480.pdf">https://microsoft829.com/onedrive/document_829013929480.pdf</a>
//     <p>Thanks for your quick response and prompt payment.</p>
//     <p>Kind regards</p>
//     <p>Stan</p>
//     <p>Manhattan Associates Protection Services LTD.</p>
//     `,
//   },
//   {
//     id: '3',
//     from_name: 'System administrator',
//     from_mail: 'stan.pho-rensic@microsoft829.com',
//     subject: '[URGENT] Late payment - invoice due retainer forensic experts',
//     date: '14-6-2013',
//     html: `
//     <p>placeholder</p>
//     `,
//   },
//   {
//     id: '4',
//     from_name: 'Forensics collegue',
//     from_mail: 'stan.pho-rensic@microsoft829.com',
//     subject: 'Digital Forensics for dummies',
//     date: '14-6-2013',
//     triggerTimeInSeconds: 60 * 1,
//     html: `
//     <p>Hi Team,</p>
//     <p>I can understand it is a bit overwhelming, being part of our forensics teams.</p>
//     </br>
//     <p>Some light - night-time - reading, which I thought might be of interest to you:</p>
//     <ul>
//       <li>Digital forensics: <a href="https://en.wikipedia.org/wiki/Digital_forensics">https://en.wikipedia.org/wiki/Digital_forensics</a></li>
//       <li>Cryptography: <a href="https://en.wikipedia.org/wiki/Cryptography">https://en.wikipedia.org/wiki/Cryptography</a></li>
//     </ul>
//     <p>Good luck!</p>
//     <p>Cheers</p>
//     <p>[CISO name]</p>
//     `,
//   },
//   {
//     id: '5',
//     from_name: 'Nigerian prince',
//     from_mail: 'stan.pho-rensic@microsoft829.com',
//     subject: 'Additional info',
//     date: '14-6-2013',
//     triggerTimeInSeconds: 60 * 2,
//     html: `
//     <p>Please see this video:<a href="https://you-tu.be/839237393"> https://you-tu.be/839237393</a></p>
//     <p>----</p>
//     <p>[CISO name]</p>
//     `,
//   },
// ];
