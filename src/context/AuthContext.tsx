import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  email?: string | null;
  nickname?: string;
  password?: string;
  id?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string) => Promise<boolean>;
  kakaoLogin: (kakaoUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();  // useNavigate 사용

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated') || sessionStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (storedAuth === 'true' && storedUser) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const register = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some((user: User) => user.email === email);

    if (userExists) {
      return false;
    }

    const newUser = { email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  };

  const login = async (email: string, password: string, rememberMe: boolean) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.email === email && u.password === password);

    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('isAuthenticated', 'true');
      storage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const kakaoLogin = (kakaoUser: User) => {
    setIsAuthenticated(true);
    setCurrentUser(kakaoUser);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUser', JSON.stringify(kakaoUser));
    navigate('/'); // 로그인 후 리다이렉트
  };

  const kakaoLogout = () => {
    if (window.Kakao) {
      // 카카오 로그아웃 API 호출
      window.Kakao.Auth.logout(() => {
        console.log("카카오 로그아웃 성공");
        setIsAuthenticated(false);
        setCurrentUser(null);
      });

      // 카카오 토큰 삭제
      window.Kakao.Auth.setAccessToken('');

      // 로컬 스토리지 및 세션 스토리지에서 카카오 정보 삭제
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('isAuthenticated');
      sessionStorage.removeItem('currentUser');

      navigate('/signin');
    }
  };

  const logout = () => {
    kakaoLogout();  // 카카오 로그아웃 처리
    setIsAuthenticated(false);
    setCurrentUser(null);

    // 로컬 스토리지에서 로그아웃 처리
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('currentUser');

    navigate('/signin');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout, register, kakaoLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
