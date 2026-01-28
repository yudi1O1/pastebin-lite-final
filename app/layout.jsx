export default function RootLayout({ children }) {
  return (
    <html>
      <body style={{ fontFamily: "system-ui" }}>{children}</body>
    </html>
  );
}