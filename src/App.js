import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { HomeLayout } from "./layout/HomeLayout";
import { MemberSignup } from "./page/member/MemberSignup";
import { MemberLogin } from "./page/member/MemberLogin";
import { MemberView } from "./page/member/MemberViewPage/MemberView";
import GameBoardWrite from "./page/gameBoard/GameBoardWrite";
import GameBoardList from "./page/gameBoard/GameBoardList";
import GameBoardEdit from "./page/gameBoard/GameBoardEdit";
import GameBoardView from "./page/gameBoard/GameBoardView";
import { ProductWrite } from "./page/product/ProductWrite";
import { ProductList } from "./page/product/ProductList";
import { ProductView } from "./page/product/ProductView";
import { ReviewView } from "./page/review/ReviewView";
import { Cart } from "./page/Cart/Cart";
import { ProductEdit } from "./ProductEdit";
import { MemberInfo } from "./page/member/MemberViewPage/MemberInfo";
import { MemberManage } from "./page/member/MemberViewPage/MemberManage";
import { MemberAddress } from "./page/member/MemberViewPage/MemberAddress";
import { MemberAddressWrite } from "./page/member/MemberViewPage/MemberAddressWrite";
import { MemberEdit } from "./page/member/MemberViewPage/MemberEdit";
import { createContext, useEffect, useState } from "react";
import axios from "axios";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HomeLayout />}>
      {/* 메인페이지 */}

      {/* 상품관련 */}
      <Route path="product/write/" element={<ProductWrite />} />
      <Route path="product/list/" element={<ProductList />} />
      <Route path="product/:product_id" element={<ProductView />} />
      <Route path="edit/:product_id" element={<ProductEdit />} />

      {/* 리뷰 */}
      <Route path="/review" element={<ReviewView />} />

      {/* 장바구니 */}
      {/* 이걸로 로그인 완성되면 수정 <Route path="/cart/:member_id" element={<Cart />} />*/}
      <Route path="/cart" element={<Cart />} />

      {/* 찜하기 */}

      {/* Q&A */}

      {/* 결제 */}

      {/* 회원관련 */}
      <Route path="signup" element={<MemberSignup />} />
      <Route path="login" element={<MemberLogin />} />
      <Route path="memberPage" element={<MemberView />}>
        <Route path="memberInfo" element={<MemberInfo />} />
        <Route path="memberInfo/memberManagePage" element={<MemberManage />} />
        <Route path="memberEdit" element={<MemberEdit />} />
        <Route path="addressInfo" element={<MemberAddress />} />
        <Route path="addressWrite" element={<MemberAddressWrite />} />
      </Route>

      {/* 게시판관련 */}
      <Route path="gameboard" element={<GameBoardList />} />
      <Route path="gameboard/id/:id" element={<GameBoardView />} />
      <Route path="gameboard/write" element={<GameBoardWrite />} />
      <Route path="gameboard/edit/:id" element={<GameBoardEdit />} />
    </Route>,
  ),
);

export const LoginContext = createContext(null);

function App() {
  const [login, setLogin] = useState("");

  useEffect(() => {
    fetchLogin();
  }, []);

  console.log(login);

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
      <RouterProvider router={routes} />
    </LoginContext.Provider>
  );
}

export default App;
