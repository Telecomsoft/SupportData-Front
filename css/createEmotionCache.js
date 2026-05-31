import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

export default function createEmotionCache() {
    return createCache({ key: 'css', prepend: true });
}
export const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [rtlPlugin,prefixer],
});