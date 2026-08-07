import React, { useEffect, useState } from 'react';
import { Theme } from 'src/shared/types/theme.types';

const GeneralSettings = () => {
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    window.electron.GET_THEME().then(({ theme }) => setTheme(theme))
  }, [])

  const themes: { name: string; value: Theme }[] = [
    { name: 'Light', value: 'light' },
    { name: 'Dark', value: 'dark' },
    { name: 'System', value: 'system' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = e.target.value as Theme
    setTheme(selectedTheme)
    window.electron['SELECT_THEME'](selectedTheme)
  }

  return (
    <div>
      <h2>General Settings</h2>
      <p>Theme:</p>
      <select value={theme} onChange={handleChange}>
        {themes.map((t) => (
          <option key={t.value} value={t.value}>
            {t.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default GeneralSettings;
