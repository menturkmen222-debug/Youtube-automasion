// Oddiy test sahifa — deploy ishlashini  tekshirish uchun
export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>✅ YouTube OAuth Flow is Ready!</h1>
      <p>
        <a href="/api/auth/youtube/login" style={{ color: '#1a73e8', textDecoration: 'underline' }}>
          Click here to get YouTube refresh_token
        </a>
      </p>
    </div>
  );
}
