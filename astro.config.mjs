import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: process.env.SITE_URL || process.env.URL || 'http://localhost:4321',
  integrations: [react()],
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
