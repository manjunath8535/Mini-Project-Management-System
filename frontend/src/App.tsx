import { ApolloProvider } from '@apollo/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { client } from './apollo';
import { Dashboard } from './components/Dashboard';
import { ProjectDetails } from './components/ProjectDetails';

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          {/* Home Screen */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Task/Project Details Screen */}
          <Route path="/project/:id" element={<ProjectDetails />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;