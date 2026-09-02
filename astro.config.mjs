import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import umami from '@yeskunall/astro-umami';

export default defineConfig({
  output: 'static',
  site: 'https://jancejka.cz',
  redirects: {
    '/vedome-uzdraveni': 'https://vedome-uzdraveni.cz/mira',
  },
  integrations: [
    sitemap(),
    umami({
        id: "60c54488-7676-4718-a4ba-75a225062620",
        endpointUrl: "https://analytics.rebma.cz"
    })
],
});
