
import '@/styles.css';
import { appWithTranslation } from 'next-i18next';
export default appWithTranslation(function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
});
