import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusBadge from '../components/ui/StatusBadge.jsx';

describe('StatusBadge', () => {
  it('renders the human label for each status', () => {
    render(<StatusBadge status="DRAFT" />);
    expect(screen.getByLabelText(/Status: Draft/)).toBeInTheDocument();
  });

  it('falls back gracefully on unknown status', () => {
    render(<StatusBadge status="UNKNOWN" />);
    expect(screen.getByLabelText(/Status:/)).toBeInTheDocument();
  });
});
