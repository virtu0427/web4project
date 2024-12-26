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
  const { kakaoLogin } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  interface KakaoAccount {
    email: string | null;
    profile_needs_agreement: boolean;
    profile: {
      nickname: string;
      profile_image_url: string;
    };
  }

  interface KakaoAuthResponse {
    id: string;
    kakao_account: KakaoAccount;
    properties: {
      nickname: string;
      profile_image_url: string;
    };
  }
  
  interface KakaoError {
    error_code: string;
    error_message: string;
  }
  
  
  // AuthContext.tsx 또는 User 타입 정의가 있는 파일

  const handleKakaoLogin = () => {
    if (!window.Kakao) {
      console.error('Kakao SDK not loaded');
      return;
    }

    window.Kakao.Auth.login({
      success: async (authObj: KakaoAuthResponse) => {
        const { id, kakao_account, properties } = authObj;

        const kakaoUser = {
          id,
          email: kakao_account?.email,
          nickname: properties?.nickname,
        };

        kakaoLogin(kakaoUser); // AuthProvider의 kakaoLogin 호출
      },
      fail: (err: KakaoError) => {
        console.error('Kakao login failed:', err);
      },
    });
  };

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
          {/* Sign In Form */}
          <div className="form-side bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-center text-indigo-400 mb-6">로그인</h2>
            {error && !isRegistering && (
              <div className="mb-4 text-center text-red-400">{error}</div>
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
            <div className="mt-4">
              <button
                onClick={handleKakaoLogin}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
              >
                카카오로 로그인
              </button>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={toggleForm}
                className="text-indigo-400 hover:text-indigo-300"
              >
                계정이 없으신가요? 회원가입
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}