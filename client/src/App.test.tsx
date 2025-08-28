import React from 'react';
import { render } from '@testing-library/react';

// Évite d'importer toutes les pages/ESM (ex: date-fns) via le router
jest.mock('./router', () => ({
  AppRoutes: () => null,
}));

import App from './App';

test("rend l'app sans crash", () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeTruthy();
});
