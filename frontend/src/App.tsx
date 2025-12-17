
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo';
import { Dashboard } from './components/Dashboard'

function App() {

  return (
    <>
      <ApolloProvider client={client}>
        <Dashboard />
      </ApolloProvider>
    </>
  )
}

export default App
