import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SettingsPage from '../src/pages/SettingsPage';
import { api } from '../src/api/client';
import { useAuth } from '../src/context/AuthContext';
import { useTranslation } from '../src/context/TranslationContext';

jest.mock('../src/api/client', () => ({
  api: {
    updateSettings: jest.fn().mockResolvedValue({}),
  },
}));

jest.mock('../src/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../src/context/TranslationContext', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('../src/components/BaseCurrencyModal', () => () => null);

describe('SettingsPage', () => {
  const baseSettings = {
    language: 'en',
    currency: 'USD',
    currencies: [
      { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
      { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.9 },
    ],
    store: { shipping: 10, taxRate: 5 },
  };

  const renderPage = (overrides = {}) => {
    const settings = { ...baseSettings, ...overrides.settings };
    const setSettings = overrides.setSettings || jest.fn();

    useAuth.mockReturnValue({ user: null, isAdmin: overrides.isAdmin || false });
    useTranslation.mockReturnValue({ t: (key) => key, language: 'en' });

    return render(
      <SettingsPage
        onNavigate={jest.fn()}
        settings={settings}
        setSettings={setSettings}
        onBaseCurrencyChange={jest.fn()}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the general tab for non-admin users', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: /settings/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/selectlanguage/i)).toBeInTheDocument();
    expect(screen.queryByText(/currencies/i)).not.toBeInTheDocument();
  });

  it('changes language and calls api.updateSettings', async () => {
    const setSettings = jest.fn();
    renderPage({ setSettings });

    const select = screen.getByLabelText(/selectlanguage/i);
    fireEvent.change(select, { target: { value: 'ru' } });

    await waitFor(() => expect(api.updateSettings).toHaveBeenCalled());
    expect(setSettings).toHaveBeenCalledWith({ ...baseSettings, language: 'ru' });
    expect(api.updateSettings).toHaveBeenCalledWith({ ...baseSettings, language: 'ru' });
  });

  it('shows admin currency tab and updates exchange rates using inverted values', async () => {
    const setSettings = jest.fn();
    renderPage({ isAdmin: true, setSettings });

    fireEvent.click(screen.getByText(/currencies/i));

    const eurInput = screen.getByDisplayValue('1.111111');
    fireEvent.change(eurInput, { target: { value: '2' } });

    await waitFor(() => expect(api.updateSettings).toHaveBeenCalled());

    const expectedSettings = {
      ...baseSettings,
      currencies: [
        baseSettings.currencies[0],
        { ...baseSettings.currencies[1], rate: 0.5 },
      ],
    };

    expect(setSettings).toHaveBeenCalledWith(expectedSettings);
    expect(api.updateSettings).toHaveBeenCalledWith(expectedSettings);
  });
});
