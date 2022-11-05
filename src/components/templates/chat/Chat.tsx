import dynamic from 'next/dynamic'

type AppProps = {
  children?: React.ReactNode
}

const ChatAppWithoutSSR = dynamic(() => import('components/chat/App'), {
  ssr: false,
})

function Chat({ children }: AppProps) {
  return (
    <ChatAppWithoutSSR>
      {children}
    </ChatAppWithoutSSR>
  )
}

export default Chat
