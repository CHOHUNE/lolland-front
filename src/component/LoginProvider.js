import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const LoginContext = createContext(null);
function LoginProvider({ children }) {
  const [login, setLogin] = useState("");

  useEffect(() => {
    fetchLogin();
  }, []);

  function fetchLogin() {
    axios
      .get("/api/member/homepageLogin")
      .then((response) => setLogin(response.data));
  }

  // 로그인 상태 검증
  function isAuthenticated() {
    return login !== "";
  }

  // 로그인한 유저가 (댓글, 작성글, 등등 의 주인) 자신인지 검증
  // hasAccess 검증을 이용 하려면 회원 로그인 아이디를 프롭으로 전달 해주어야 합니다.
  function hasAccess(userId) {
    return login.member_login_id === userId;
  }

  // 관리자인지 검증
  function isAdmin() {
    return login.member_type === "admin";
  }

  // 판매자인지 검증
  function isSeller() {
    return login.member_type === "seller";
  }

  // 일반 회원인지 검증
  function isUser() {
    return login.member_type === "user";
  }

  return (
    <LoginContext.Provider
      value={{
        login,
        fetchLogin,
        isAuthenticated,
        hasAccess,
        isAdmin,
        isSeller,
        isUser,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export default LoginProvider;
