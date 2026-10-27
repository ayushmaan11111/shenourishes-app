import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isValidEmail, isValidMobile, evaluatePasswordStrength } from '../utils/validation';

export const AuthScreen: React.FC = () => {
  const { login, signUp, signInWithGoogle, resetPassword, isFirebaseActive } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Sign up form state
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Reset password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Status & Validation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const passwordStrength = evaluatePasswordStrength(signupPassword);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const errors: Record<string, string> = {};

    if (!loginEmail.trim() || !isValidEmail(loginEmail)) {
      errors.loginEmail = 'Please enter a valid email address';
    }
    if (!loginPassword) {
      errors.loginPassword = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await login(loginEmail, loginPassword);
    } catch (err: unknown) {
      setAuthError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const errors: Record<string, string> = {};

    if (!fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }
    if (!signupEmail.trim() || !isValidEmail(signupEmail)) {
      errors.signupEmail = 'Please enter a valid email address';
    }
    if (!mobileNumber.trim() || !isValidMobile(mobileNumber)) {
      errors.mobileNumber = 'Please enter a valid mobile number';
    }
    if (!signupPassword || signupPassword.length < 6) {
      errors.signupPassword = 'Password must be at least 6 characters';
    }
    if (signupPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!agreedToTerms) {
      errors.terms = 'Please accept the Terms & Privacy Policy to continue';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await signUp(fullName.trim(), signupEmail.trim(), mobileNumber.trim(), signupPassword);
    } catch (err: unknown) {
      setAuthError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      setAuthError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !isValidEmail(forgotEmail)) {
      alert('Please enter a valid email address');
      return;
    }
    setIsSubmitting(true);
    try {
      await resetPassword(forgotEmail);
      setForgotSent(true);
    } catch (err: unknown) {
      alert((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        flex: 1,
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100%',
        backgroundColor: '#F8F6EF',
      }}
    >
      <div>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', margin: '20px 0 24px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '18px',
              backgroundColor: '#66734A',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFDF8',
              boxShadow: '0 8px 20px rgba(102, 115, 74, 0.2)',
              marginBottom: '14px',
            }}
          >
            <Sparkles size={28} />
          </div>
          <h1 className="font-serif" style={{ fontSize: '26px', fontWeight: 600, color: '#242820' }}>
            She Nourishes
          </h1>
          <p style={{ fontSize: '13px', color: '#6B7063', marginTop: '4px' }}>
            {mode === 'login' ? 'Welcome back to your personalized wellness' : 'Start your personalized nutrition journey'}
          </p>

          {!isFirebaseActive && (
            <div
              style={{
                display: 'inline-block',
                marginTop: '10px',
                padding: '3px 10px',
                borderRadius: '9999px',
                fontSize: '11px',
                backgroundColor: '#F1EEDF',
                color: '#4F5C38',
                border: '1px solid #D9D8CC',
              }}
            >
              Demo Sandbox Mode (Local Persistence)
            </div>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="segmented-control" style={{ marginBottom: '22px' }}>
          <button
            type="button"
            className={`segmented-btn ${mode === 'login' ? 'is-active' : ''}`}
            onClick={() => {
              setMode('login');
              setAuthError(null);
              setFieldErrors({});
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`segmented-btn ${mode === 'signup' ? 'is-active' : ''}`}
            onClick={() => {
              setMode('signup');
              setAuthError(null);
              setFieldErrors({});
            }}
          >
            Create Account
          </button>
        </div>

        {/* Global Auth Error Alert */}
        {authError && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '12px',
              backgroundColor: '#FDF0EE',
              border: '1px solid #E69C90',
              color: '#C85A48',
              fontSize: '13px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{authError}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="name@example.com"
                className={`form-input ${fieldErrors.loginEmail ? 'has-error' : ''}`}
                autoComplete="email"
              />
              {fieldErrors.loginEmail && (
                <span className="form-error-text">{fieldErrors.loginEmail}</span>
              )}
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="login-password">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  style={{ fontSize: '12px', color: '#66734A', fontWeight: 600 }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`form-input ${fieldErrors.loginPassword ? 'has-error' : ''}`}
                  autoComplete="current-password"
                  style={{ paddingRight: '42px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6B7063',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.loginPassword && (
                <span className="form-error-text">{fieldErrors.loginPassword}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ marginTop: '10px' }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Social Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: '20px 0 16px',
              }}
            >
              <div style={{ flex: 1, height: '1px', backgroundColor: '#D9D8CC' }} />
              <span style={{ fontSize: '12px', color: '#6B7063', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                or
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#D9D8CC' }} />
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '13px 18px',
                borderRadius: '16px',
                backgroundColor: '#FFFDF8',
                border: '1.5px solid #D9D8CC',
                color: '#242820',
                fontWeight: 600,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 2px 6px rgba(36, 40, 32, 0.04)',
                cursor: 'pointer',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>
        ) : (
          /* SIGN UP FORM */
          <form onSubmit={handleSignupSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-name">
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className={`form-input ${fieldErrors.fullName ? 'has-error' : ''}`}
              />
              {fieldErrors.fullName && (
                <span className="form-error-text">{fieldErrors.fullName}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">
                Email Address
              </label>
              <input
                id="signup-email"
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="name@example.com"
                className={`form-input ${fieldErrors.signupEmail ? 'has-error' : ''}`}
                autoComplete="email"
              />
              {fieldErrors.signupEmail && (
                <span className="form-error-text">{fieldErrors.signupEmail}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-mobile">
                Mobile Number
              </label>
              <input
                id="signup-mobile"
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className={`form-input ${fieldErrors.mobileNumber ? 'has-error' : ''}`}
                autoComplete="tel"
              />
              {fieldErrors.mobileNumber && (
                <span className="form-error-text">{fieldErrors.mobileNumber}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-password">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="signup-password"
                  type={showSignupPassword ? 'text' : 'password'}
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className={`form-input ${fieldErrors.signupPassword ? 'has-error' : ''}`}
                  autoComplete="new-password"
                  style={{ paddingRight: '42px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6B7063',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Password strength meter */}
              {signupPassword.length > 0 && (
                <div style={{ marginTop: '6px' }}>
                  <div style={{ display: 'flex', gap: '4px', height: '4px' }}>
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        style={{
                          flex: 1,
                          backgroundColor:
                            step <= passwordStrength.score ? passwordStrength.color : '#E6E2CF',
                          borderRadius: '2px',
                          transition: 'background-color 0.2s',
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: '11px', color: passwordStrength.color, marginTop: '4px', fontWeight: 600 }}>
                    Strength: {passwordStrength.label}
                  </div>
                </div>
              )}
              {fieldErrors.signupPassword && (
                <span className="form-error-text">{fieldErrors.signupPassword}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-confirm-password">
                Confirm Password
              </label>
              <input
                id="signup-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className={`form-input ${fieldErrors.confirmPassword ? 'has-error' : ''}`}
                autoComplete="new-password"
              />
              {fieldErrors.confirmPassword && (
                <span className="form-error-text">{fieldErrors.confirmPassword}</span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', margin: '14px 0 18px' }}>
              <button
                type="button"
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '6px',
                  border: `2px solid ${agreedToTerms ? '#66734A' : '#D9D8CC'}`,
                  backgroundColor: agreedToTerms ? '#66734A' : '#FFFDF8',
                  color: '#FFFDF8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                {agreedToTerms && <Check size={14} strokeWidth={3} />}
              </button>
              <label
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                style={{ fontSize: '12px', color: '#6B7063', cursor: 'pointer', lineHeight: 1.4 }}
              >
                I agree to the She Nourishes <strong style={{ color: '#242820' }}>Terms of Service</strong> &{' '}
                <strong style={{ color: '#242820' }}>Privacy Policy</strong>
              </label>
            </div>
            {fieldErrors.terms && (
              <span className="form-error-text" style={{ marginBottom: '12px', display: 'block' }}>
                {fieldErrors.terms}
              </span>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Creating Account...
                </>
              ) : (
                'Create Account & Begin Assessment'
              )}
            </button>

            {/* Social Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: '20px 0 16px',
              }}
            >
              <div style={{ flex: 1, height: '1px', backgroundColor: '#D9D8CC' }} />
              <span style={{ fontSize: '12px', color: '#6B7063', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                or
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#D9D8CC' }} />
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '13px 18px',
                borderRadius: '16px',
                backgroundColor: '#FFFDF8',
                border: '1.5px solid #D9D8CC',
                color: '#242820',
                fontWeight: 600,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 2px 6px rgba(36, 40, 32, 0.04)',
                cursor: 'pointer',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Sign up with Google</span>
            </button>
          </form>
        )}
      </div>

      {/* Footer toggle */}
      <div style={{ textAlign: 'center', marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
        {mode === 'login' ? (
          <p style={{ fontSize: '13px', color: '#6B7063', margin: 0 }}>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setAuthError(null);
                setFieldErrors({});
              }}
              style={{ color: '#66734A', fontWeight: 600 }}
            >
              Create Account
            </button>
          </p>
        ) : (
          <p style={{ fontSize: '13px', color: '#6B7063', margin: 0 }}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setAuthError(null);
                setFieldErrors({});
              }}
              style={{ color: '#66734A', fontWeight: 600 }}
            >
              Sign In
            </button>
          </p>
        )}

        {/* Direct Admin Access Link */}
        <div style={{ paddingTop: '8px', borderTop: '1px dashed #D9D8CC', width: '100%', maxWidth: '280px' }}>
          <button
            type="button"
            onClick={() => {
              window.location.hash = 'admin';
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              backgroundColor: '#0A1C44',
              color: '#E8CA56',
              fontSize: '11.5px',
              fontWeight: 700,
              border: '1px solid #E8CA56',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <Sparkles size={13} color="#E8CA56" />
            <span>Open Nutritionist & Admin Portal</span>
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(36, 40, 32, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            className="wellness-card"
            style={{ width: '100%', maxWidth: '360px', backgroundColor: '#FFFDF8' }}
          >
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Reset Password</h3>
            {forgotSent ? (
              <div>
                <p style={{ fontSize: '13px', color: '#4F5C38', marginBottom: '16px' }}>
                  If an account exists with that email, a password reset link has been dispatched.
                </p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSent(false);
                  }}
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <p style={{ fontSize: '13px', color: '#6B7063', marginBottom: '14px' }}>
                  Enter your email address to receive password reset instructions.
                </p>
                <div className="form-group">
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="form-input"
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowForgotModal(false)}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary"
                    style={{ flex: 1 }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
