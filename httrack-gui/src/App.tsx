import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MainLayout } from './components/Layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Downloads } from './pages/Downloads';
import { Settings } from './pages/Settings';
import { About } from './pages/About';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="downloads" element={<Downloads />} />
            <Route path="settings" element={<Settings />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
