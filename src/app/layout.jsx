import "./globals.css";
import Navbar from "../components/navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Navbar />
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
