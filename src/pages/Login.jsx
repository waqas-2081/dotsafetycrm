import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const APP_NAME = import.meta.env.VITE_APP_NAME || 'DOT Safety Services';
const APP_LOGO =
  import.meta.env.VITE_APP_LOGO ||
  'https://dotsafetyservice.com/assets/images/logo/logo.png';

export default function Login() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      await login(email, password, remember);
      navigate('/', { replace: true });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setErrors(data.errors);
      } else if (data?.message) {
        setErrors({ email: [data.message] });
      } else {
        setErrors({ email: ['These credentials do not match our records.'] });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page-body">
      <div className="login-container">
        <div className="login-header">
          <img src={APP_LOGO} alt={`${APP_NAME} Logo`} className="mb-4" />
          <h4>Welcome Back!</h4>
          <p className="text-muted">Please sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-floating">
            <input
              type="email"
              className={`form-control${errors.email ? ' is-invalid' : ''}`}
              id="email"
              name="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            <label htmlFor="email">Email address</label>
            {errors.email && (
              <span className="invalid-feedback" role="alert">
                <strong>{errors.email[0]}</strong>
              </span>
            )}
          </div>

          <div className="form-floating">
            <input
              type="password"
              className={`form-control${errors.password ? ' is-invalid' : ''}`}
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
            {errors.password && (
              <span className="invalid-feedback" role="alert">
                <strong>{errors.password[0]}</strong>
              </span>
            )}
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              name="remember"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="remember">
              Remember me
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-login" disabled={submitting}>
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
