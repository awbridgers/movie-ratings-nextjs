import '../styles/globals.css';
import type {AppProps} from 'next/app';
import FirebaseProvider from '../firebase/provider';
import AuthProvider from '../firebase/authProvider';
import Layout from '../components/layout';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({Component, pageProps}: AppProps) {
  return (
    <AuthProvider>
      <FirebaseProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </FirebaseProvider>
    </AuthProvider>
  );
}
export default MyApp;
