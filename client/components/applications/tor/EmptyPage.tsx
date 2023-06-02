import Image from 'next/image';
import DuckduckgoLogo from 'assets/tor/duckduckgo.png';
const EmptyPage = () => {
  return (
    <div className="bg-tor_dark_lila flex-1 font-sourcesanspro text-white flex flex-col">
      <div className="flex items-center justify-end pr-8 pt-4">
        <p>Tor Browser 11.0.11</p>
      </div>

      <div className="flex items-center flex-col justify-center flex-1 mb-24">
        <h1 className="text-6xl font-semibold">Explore. Privately.</h1>
        <p className="mt-6 text-xl">
          You&#39;re ready for the world&#39;s most private browsing experience.
        </p>
        {/* <div className="flex items-center justify-center mt-4 bg-white py-1 px-4 rounded-lg w-full max-w-2xl">
          <div className="relative h-10 w-10 rounded-full overflow-hidden bg-blue-400">
            <Image alt=""  layout="fill" src={DuckduckgoLogo} />
          </div>
          <input
            className="text-tor_light_gray flex-1 bg-transparent border-0 focus:border-0 focus:ring-0 text-xl placeholder:text-tor_light_gray"
            placeholder="Search with DuckDuckGo."
            type="text"
          />
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 stroke-tor_light_gray"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default EmptyPage;
