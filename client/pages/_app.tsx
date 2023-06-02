import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { NextIntlProvider } from 'next-intl';
import { SWRConfigurationProvider } from '../utils/SWRConfigProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextIntlProvider locale={'nl'} messages={pageProps.messages} defaultTranslationValues={{
      br: () => <br/>,
      companyname: () => ""
    }}>
      <SWRConfigurationProvider>
        <Component {...pageProps} />
      </SWRConfigurationProvider>
    </NextIntlProvider>
  );
}

export default MyApp;
