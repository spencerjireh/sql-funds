import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h1>404</h1>
      <p style={{ color: 'var(--color-text-secondary)', margin: '1rem 0 2rem' }}>
        This page does not exist.
      </p>
      <Link to="/">Back to Home</Link>
    </div>
  );
}
