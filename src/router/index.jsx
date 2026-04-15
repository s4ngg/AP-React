import { createBrowserRouter } from 'react-router-dom';
import SignupPage         from '../pages/member/SignupPage';
import VerifyEmailPage    from '../pages/member/VerifyEmailPage';
import InterestsPage      from '../pages/member/InterestsPage';
import TermsPage          from '../pages/member/TermsPage';
import SignupCompletePage from '../pages/member/SignupCompletePage';
import LoginPage          from '../pages/member/LoginPage';
import FindEmailPage      from '../pages/member/FindEmailPage';
import FindPasswordPage   from '../pages/member/FindPasswordPage';
import ResetPasswordPage  from '../pages/member/ResetPasswordPage';

const router = createBrowserRouter([
  { path: '/signup',               element: <SignupPage /> },
  { path: '/signup/verify-email',  element: <VerifyEmailPage /> },
  { path: '/signup/interests',     element: <InterestsPage /> },
  { path: '/signup/terms',         element: <TermsPage /> },
  { path: '/signup/complete',      element: <SignupCompletePage /> },
  { path: '/login',                element: <LoginPage /> },
  { path: '/find-email',           element: <FindEmailPage /> },
  { path: '/find-password',        element: <FindPasswordPage /> },
  { path: '/reset-password',       element: <ResetPasswordPage /> },
]);

export default router;
