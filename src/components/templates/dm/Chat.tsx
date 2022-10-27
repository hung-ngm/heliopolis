import XmtpProvider from 'components/chat/XmtpProvider'
import Layout from 'components/chat/Layout'
import { WalletProvider } from 'components/chat/WalletProvider'

type AppProps = {
  children?: React.ReactNode
}

function Chat({ children }: AppProps) {
  return (
    <WalletProvider>
      <XmtpProvider>
        <Layout>{children}</Layout>
      </XmtpProvider>
    </WalletProvider>
  )
}

export default Chat
