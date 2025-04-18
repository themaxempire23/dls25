import { AppProps } from 'next/app';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        <Component {...pageProps} />
      </div>
    </>
  );
}
