import { useRouter } from 'next/router'
import Head from 'next/head'
import { NavigationView, ConversationView } from './Views'
import { RecipientControl } from './Conversation'
import NewMessageButton from './NewMessageButton'
import NavigationPanel from './NavigationPanel'
import XmtpInfoPanel from './XmtpInfoPanel'
import UserMenu from './UserMenu'
import BackArrow from './BackArrow'
import React, { useCallback, useContext } from 'react'
import { WalletContext } from '../contexts/wallet'
import XmtpContext from '../contexts/xmtp'
import { Button } from '@chakra-ui/react'
import { AiOutlineHome } from "react-icons/ai"
const NavigationColumnLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <aside className="flex w-full md:w-84 flex-col flex-grow fixed inset-y-0">
    <div className="flex flex-col flex-grow md:border-r md:border-gray-200 bg-white overflow-y-auto">
      {children}
    </div>
  </aside>
)


const NavigationHeaderLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const handleBackArrowClick = useCallback(() => {
    router.push('/')
  }, [router])
  return(
    <div className="h-[10vh] max-h-20 bg-p-600 flex items-center justify-between flex-shrink-0 px-4">
      <Button leftIcon={<AiOutlineHome />} colorScheme='teal' variant='outline' onClick = {handleBackArrowClick}>
        Back
      </Button>
      {children}
    </div>
  )
}

const TopBarLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="sticky top-0 z-10 flex-shrink-0 flex bg-zinc-50 border-b border-gray-200 md:bg-white md:border-0">
    {children}
  </div>
)

const ConversationLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter()
  const recipientWalletAddress = router.query.recipientWalletAddr as string

  const handleSubmit = async (address: string) => {
    router.push(address ? `/chat/dm/${address}` : '/chat/dm/')
  }

  const handleBackArrowClick = useCallback(() => {
    router.push('/')
  }, [router])

  return (
    <>
      <TopBarLayout>
        <div className="md:hidden flex items-center ml-3">
          <BackArrow onClick={handleBackArrowClick} />
        </div>
        <RecipientControl
          recipientWalletAddress={recipientWalletAddress}
          onSubmit={handleSubmit}
        />
      </TopBarLayout>
      {children}
    </>
  )
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { client, initClient } = useContext(XmtpContext)

  const {
    address: walletAddress,
    connect: connectWallet,
    disconnect: disconnectWallet,
    signer,
  } = useContext(WalletContext)

  const handleDisconnect = useCallback(async () => {
    await disconnectWallet()
  }, [disconnectWallet])

  const handleConnect = useCallback(async () => {
    await connectWallet()
    // eslint-disable-next-line no-unused-expressions
    signer && (await initClient(signer))
  }, [connectWallet, initClient, signer])

  return (
    <>
      <Head>
        <title>Chat</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <div>
        <NavigationView>
          <NavigationColumnLayout>
            <NavigationHeaderLayout>
              {walletAddress && client && <NewMessageButton />}
            </NavigationHeaderLayout>
            <NavigationPanel onConnect={handleConnect} />
            <UserMenu
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
          </NavigationColumnLayout>
        </NavigationView>
        <ConversationView>
          {walletAddress && client ? (
            <ConversationLayout>{children}</ConversationLayout>
          ) : (
            <XmtpInfoPanel onConnect={handleConnect} />
          )}
        </ConversationView>
      </div>
    </>
  )
}

export default Layout
