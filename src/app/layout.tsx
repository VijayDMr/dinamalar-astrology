import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "தினமலர் ஜோதிடம் - த்ரிடி பிரபஞ்ச சக்கரம் | Dinamalar Astrology 3D",
  description: "தினமலர் ஜோதிட பக்கத்தில் 3D பிரபஞ்ச சக்கரம், தினசரி ராசிபலன்கள், கிரக ஓரைகள், நல்ல நேரங்கள், சுப முகூர்த்தங்கள் மற்றும் முக்கிய ஜோதிட உபகரணங்கள்.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ta">
      <body className="antialiased">{children}</body>
    </html>
  );
}
