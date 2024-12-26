declare global {
    interface Window {
      Kakao: any; // Kakao 객체에 대한 전역 선언
    }
  }
  
  export {}; // 파일을 모듈로 만들어 전역 선언이 유효하도록 보장
  