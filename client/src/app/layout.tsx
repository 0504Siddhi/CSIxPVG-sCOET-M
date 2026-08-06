import type { Metadata } from 'next';
import './globals.css';
import LenisScroll from '@/components/LenisScroll';
import CustomCursor from '@/components/CustomCursor';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'CSI PVG COET — Official Student Chapter HQ',
  description: 'The futuristic digital headquarters of the Computer Society of India (CSI) Student Chapter at PVG\'s COET, Pune. Innovate, Inspire, and Integrate.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-[#030303] text-[#f5f5f7]">
        <LenisScroll>
          <CustomCursor />
          <Navbar />
          {children}
        </LenisScroll>
      </body>
    </html>
  );
}
