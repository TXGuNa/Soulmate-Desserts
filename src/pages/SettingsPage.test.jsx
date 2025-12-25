import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SettingsPage from './SettingsPage';
import { AuthProvider } from '../context/AuthContext';
import { TranslationProvider } from '../context/TranslationContext';
import { api } from '../api/client';

jest.mock('../api/client', () => ({
  api: {
    updateSettings: jest.fn(),
    getUsers: jest.fn().mockResolvedValue([]),
    getInvites: jest.fn().mockResolvedValue([]),
    createUser: jest.fn().mockResolvedValue({}),
    deleteUser: jest.fn().mockResolvedValue({}),
    createInvite: jest.fn().mockResolvedValue({}),
    updateInvite: jest.fn().mockResolvedValue({}),
    deleteInvite: jest.fn().mockResolvedValue({}),
  },
}));


// Mock the context hooks
jest.mock('../context/AuthContext', () => ({
  ...jest.requireActual('../context/AuthContext'),
  useAuth: () => ({
    user: { name: 'Admin User' },
    isAdmin: true,
  }),
}));

jest.mock('../context/TranslationContext', () => ({
  ...jest.requireActual('../context/TranslationContext'),
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

const renderWithProviders = (component) => {
  return render(
    <AuthProvider>
      <TranslationProvider>
        {component}
      </TranslationProvider>
    </AuthProvider>
  );
};

describe('SettingsPage Currency Management', () => {
  let settings;
  let setSettings;
  let consoleErrorSpy;

  beforeEach(() => {
    settings = {
      language: 'en',
      currency: 'USD',
      currencies: [
        { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
        { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.9 },
      ],
      store: {
        shipping: 10,
        taxRate: 0.05,
      },
    };
    setSettings = jest.fn((newSettings) => {
      if (typeof newSettings === 'function') {
        settings = newSettings(settings);
      } else {
        settings = newSettings;
      }
    });
    jest.clearAllMocks();
    api.updateSettings.mockClear();
  });

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  test('should allow changing the display currency', async () => {
    const { rerender } = renderWithProviders(
      <SettingsPage
        settings={settings}
        setSettings={setSettings}
      />
    );

    await waitFor(() => expect(screen.getByText(/currencies/i)).toBeInTheDocument());

    fireEvent.click(screen.getByText(/currencies/i));

    await waitFor(() => expect(screen.getAllByTitle(/setdefault/i).length).toBeGreaterThan(1));

    const eurDisplayButton = screen.getAllByTitle(/setdefault/i)[1]; // Second star button for EUR
    fireEvent.click(eurDisplayButton);

    expect(setSettings).toHaveBeenCalledWith(expect.objectContaining({ currency: 'EUR' }));
    expect(api.updateSettings).toHaveBeenCalledWith(expect.objectContaining({ currency: 'EUR' }));

    // Simulate parent component updating settings after API call
    settings.currency = 'EUR';
    rerender(
        <AuthProvider>
            <TranslationProvider>
                <SettingsPage
                    settings={settings}
                    setSettings={setSettings}
                />
            </TranslationProvider>
        </AuthProvider>
    );

    const eurStar = screen.getAllByTitle(/setdefault/i)[1].querySelector('svg');
    expect(eurStar).toHaveAttribute('fill', '#d4af37');
  });

  test('should prevent deletion of base currency', async () => {
    renderWithProviders(
      <SettingsPage
        settings={settings}
        setSettings={setSettings}
      />
    );

    await waitFor(() => expect(screen.getByText(/currencies/i)).toBeInTheDocument());
    fireEvent.click(screen.getByText(/currencies/i));

    const deleteButtons = screen.getAllByTitle(/delete/i);
    expect(deleteButtons.length).toBe(1); // Only non-base currencies are deletable
  });
});
