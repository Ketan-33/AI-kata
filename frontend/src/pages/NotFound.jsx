import { Link } from 'react-router-dom';
import PillButton from '../components/ui/PillButton.jsx';

export default function NotFound() {
  return (
    <div className="bg-bg-primary min-h-screen grid place-items-center px-6">
      <div className="text-center max-w-md">
        <p className="text-accent-lime font-bold uppercase tracking-widest">404</p>
        <h1 className="h-section mt-2">This episode hasn't been recorded.</h1>
        <p className="text-text-secondary mt-3">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <PillButton as={Link} to="/" variant="primary" className="mt-6">
          Back to dashboard
        </PillButton>
      </div>
    </div>
  );
}
