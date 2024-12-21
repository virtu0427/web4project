import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowSuccess(false);

    try {
      if (isRegistering) {
        if (!termsAccepted) {
          setError('서비스 이용약관에 동의해주세요.');
          return;
        }
        if (password !== confirmPassword) {
          setError('비밀번호가 일치하지 않습니다.');
          return;
        }
        const success = await register(email, password);
        if (success) {
          setShowSuccess(true);
          setTimeout(async () => {
            await login(email, password, false);
            navigate('/');
          }, 2000);
        } else {
          setError('이미 존재하는 이메일입니다.');
        }
      } else {
        const success = await login(email, password, rememberMe);
        if (success) {
          navigate('/');
        } else {
          setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      setError('인증에 실패했습니다.');
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setTermsAccepted(false);
    setError('');
    setShowSuccess(false);
  };

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center perspective-1000">
      <div className="auth-container">
        <div className={`auth-form ${isRegistering ? 'flipped' : ''}`}>
          {/* Sign In Form - Front */}
          <div className="form-side bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-center text-indigo-400 mb-6">로그인</h2>
            {error && !isRegistering && (
              <div className="mb-4 text-center text-red-400">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-gray-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  로그인 상태 유지
                </label>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                로그인
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={toggleForm}
                className="text-indigo-400 hover:text-indigo-300"
              >
                계정이 없으신가요? 회원가입
              </button>
            </div>
          </div>

          {/* Register Form - Back */}
          <div className="form-side back bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-center text-indigo-400 mb-6">회원가입</h2>
            {error && isRegistering && (
              <div className="mb-4 text-center text-red-400">
                {error}
              </div>
            )}
            {showSuccess && (
              <div className="mb-4 text-center text-green-400">
                회원가입이 완료되었습니다. 자동으로 로그인됩니다.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-gray-300">
                  이메일
                </label>
                <input
                  type="email"
                  id="register-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-gray-300">
                  비밀번호
                </label>
                <input
                  type="password"
                  id="register-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-gray-700"
                    />
                  </div>
                  <div className="ml-2">
                    <label htmlFor="terms" className="text-sm text-gray-300">
                      서비스 이용약관 및 개인정보 처리방침에 동의합니다
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      회원가입 시 JoMovie의 서비스 이용약관과 개인정보 처리방침에 동의하게 됩니다.
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                회원가입
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={toggleForm}
                className="text-indigo-400 hover:text-indigo-300"
              >
                이미 계정이 있으신가요? 로그인
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}