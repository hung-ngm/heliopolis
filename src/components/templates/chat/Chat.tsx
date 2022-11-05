import App from 'components/chat/App';

type AppProps = {
  children?: React.ReactNode
}

function Chat({ children }: AppProps) {
  return (
    <App>
      {children}
    </App>
  )
}

export default Chat
