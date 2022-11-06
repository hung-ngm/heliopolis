import { ChakraProvider } from '@chakra-ui/react';
import { createClient, configureChains, defaultChains, WagmiConfig } from 'wagmi';
import { extendTheme } from '@chakra-ui/react';
import { WalletProvider } from 'components/chat/WalletProvider';
import XmtpProvider from 'components/chat/XmtpProvider';
import { publicProvider } from 'wagmi/providers/public';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import '../styles/globals.css'

const { provider, webSocketProvider } = configureChains(defaultChains, [publicProvider()]);

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: true,
});

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};


const theme = extendTheme({ config });

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
      <WalletProvider>
        <ChakraProvider resetCSS theme={theme}>
          <WagmiConfig client={client}>
            <SessionProvider session={pageProps.session} refetchInterval={0}>
              <XmtpProvider>
                <Component {...pageProps} />
              </XmtpProvider>
            </SessionProvider>
          </WagmiConfig>
        </ChakraProvider>
      </WalletProvider>

  );
};

export default MyApp;
