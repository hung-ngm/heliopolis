import { ChakraProvider } from '@chakra-ui/react';
import { createClient, configureChains, defaultChains, WagmiConfig } from 'wagmi';
import { extendTheme } from '@chakra-ui/react';
import { WalletProvider } from 'components/chat/WalletProvider';
import XmtpProvider from 'components/chat/XmtpProvider';
import { publicProvider } from 'wagmi/providers/public';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { mode } from '@chakra-ui/theme-tools';
const { provider, webSocketProvider } = configureChains(defaultChains, [publicProvider()]);
import type { GlobalStyleProps } from '@chakra-ui/theme-tools';
import '@styles/globals.css';

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: true,
});

const config = {
  initialColorMode: 'white',
  useSystemColorMode: false,
};

const styles = {
  global: (props: GlobalStyleProps) => ({
    body: {
      fontFamily: 'body',
      color: mode('gray.800', 'whiteAlpha.900')(props),
      backgroundImage: mode('/beach.webp', '/cosmos.jpeg')(props),
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
      lineHeight: 'base',
    },
  }),
  ...config,
};

const theme = extendTheme({ styles });

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <WalletProvider>
      <XmtpProvider>
        <ChakraProvider resetCSS theme={theme}>
          <WagmiConfig client={client}>
            <SessionProvider session={pageProps.session} refetchInterval={0}>
              <Component {...pageProps} />
            </SessionProvider>
          </WagmiConfig>
        </ChakraProvider>
      </XmtpProvider>
    </WalletProvider>
  );
};

export default MyApp;
