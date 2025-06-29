// app/layout.tsx
import './globals.css';


export const metadata = {
  title: 'StockPilot',
  description: 'Your stock management solution',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
    
        <main>{children}</main>
      </body>
    </html>
  );
}
