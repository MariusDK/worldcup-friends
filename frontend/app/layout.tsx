import type {Metadata} from 'next';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Football Friends Predictor',
  description: 'An independent fan-made football score prediction game for private groups.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
