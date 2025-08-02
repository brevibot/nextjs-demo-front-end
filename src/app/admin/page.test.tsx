import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminPage from './page';
import { apiFetch } from '@/app/lib/api';

jest.mock('@/app/lib/api');

describe('AdminPage', () => {
  it('renders the admin page', () => {
    render(<AdminPage />);
    expect(screen.getByText('🔒 Admin Panel')).toBeInTheDocument();
  });

  it('publishes a notification', async () => {
    render(<AdminPage />);
    const textarea = screen.getByLabelText('Banner Message');
    const button = screen.getByText('Publish Notification');

    fireEvent.change(textarea, { target: { value: 'Test notification' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Test notification' }),
      });
    });
  });
});