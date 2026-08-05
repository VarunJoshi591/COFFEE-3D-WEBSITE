import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
const inter = Inter({
subsets: ['latin'],
variable: '--font-inter'
});
const playfair = Playfair_Display({
subsets: ['latin'],
variable: '--font-playfair'
});
export const metadata: Metadata = {
title: 'Artisan Coffee | Experience Excellence',
description: 'Premium coffee experiences crafted to perfection',
};
export const viewport: Viewport = {
width: 'device-width',
initialScale: 1,
maximumScale: 1,
userScalable: false,
themeColor: '#1A0F0A',
};
export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
return (
<html lang="en" className={`${inter.variable} ${playfair.variable}`}>
<body>{children}</body>
</html>
);
}
