import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import umami from '@yeskunall/astro-umami';

export default defineConfig({
  output: 'static',
  site: 'https://jancejka.cz',
  integrations: [
    sitemap(),
    umami({
        id: "94db1cb1-74f4-4a40-ad6c-962362670409",
        endpointUrl: "https://analytics.rebma.cz"
    })
],
});
