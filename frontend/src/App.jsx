import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/layout/NavBar.jsx';
import Footer from './components/layout/Footer.jsx';
import RequireAuth from './routes/RequireAuth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Episodes from './pages/Episodes.jsx';
import EpisodeForm from './pages/EpisodeForm.jsx';
import ScriptGenerator from './pages/ScriptGenerator.jsx';
import Guests from './pages/Guests.jsx';
import Analytics from './pages/Analytics.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import NotFound from './pages/NotFound.jsx';
import useAuth from './hooks/useAuth.js';

export default function App() {
  // Hydrate `auth.user` if a token already exists in sessionStorage.
  useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <NavBar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/episodes" element={<RequireAuth><Episodes /></RequireAuth>} />
          <Route path="/episodes/new" element={<RequireAuth><EpisodeForm /></RequireAuth>} />
          <Route path="/episodes/:id" element={<RequireAuth><EpisodeForm /></RequireAuth>} />
          <Route path="/scripts" element={<RequireAuth><ScriptGenerator /></RequireAuth>} />
          <Route path="/guests" element={<RequireAuth><Guests /></RequireAuth>} />
          <Route path="/analytics" element={<RequireAuth><Analytics /></RequireAuth>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
