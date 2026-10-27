/**
 * Human-friendly mappings for Firebase Authentication error codes.
 */
export function getFriendlyAuthErrorMessage(errorCode: string, rawMessage?: string): string {
  switch (errorCode) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email or password is incorrect. Please check and try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please log in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Your password is too weak. Please use at least 6 characters with a combination of letters and numbers.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please reach out to She Nourishes support.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Access is temporarily locked for your security. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network unavailable. Please check your internet connection and try again.';
    case 'auth/requires-recent-login':
      return 'Please log in again to continue this action.';
    case 'auth/operation-not-allowed':
      return 'This sign-in provider is not enabled in your Firebase Console. Please verify it is enabled under Authentication > Sign-in method.';
    case 'auth/unauthorized-domain':
      return 'Domain not authorized. In Firebase Console > Authentication > Settings > Authorized domains, add "localhost" or your current domain.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before completing. Please try again.';
    case 'auth/popup-blocked':
      return 'The sign-in popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email using a different sign-in method (e.g. Email/Password).';
    case 'auth/cancelled-popup-request':
      return 'Sign-in request was cancelled. Please try again.';
    default:
      if (rawMessage && !rawMessage.includes('[object Object]')) {
        return rawMessage.replace(/Firebase: /i, '').replace(/\(auth\/[^)]+\)/i, '').trim();
      }
      return errorCode ? `Authentication error (${errorCode}). Please check your Firebase settings.` : 'An unexpected authentication error occurred. Please try again.';
  }
}
