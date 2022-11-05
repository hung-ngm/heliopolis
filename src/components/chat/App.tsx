import Layout from 'components/chat/Layout'

type AppProps = {
  children?: React.ReactNode
}

function App({ children }: AppProps) {
  return (
    <Layout>{children}</Layout>
  )
}

export default App