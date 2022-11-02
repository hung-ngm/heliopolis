import XmtpProvider from 'components/chat/XmtpProvider'
import Layout from 'components/chat/Layout'
import { WalletProvider } from 'components/chat/WalletProvider'
import { Default } from 'components/layouts/Default';
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

Chat.PageLayout = Default
export default Chat
