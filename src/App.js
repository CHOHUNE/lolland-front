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
import { ProductEdit } from "./page/product/ProductEdit";
import { MemberInfo } from "./page/member/MemberViewPage/MemberInfo";
import { MemberManage } from "./page/member/MemberViewPage/MemberManage";
import { MemberAddress } from "./page/member/MemberViewPage/MemberAddress";
import { MemberAddressWrite } from "./page/member/MemberViewPage/MemberAddressWrite";
import { MemberEdit } from "./page/member/MemberViewPage/MemberEdit";
import LoginProvider from "./component/LoginProvider";
import { ProductLike } from "./page/productLike/ProductLike";

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
      <Route path="/cart" element={<Cart />} />

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
        {/* 상품 찜하기 목록 - gns14585 - */}
        <Route path="productLike" element={<ProductLike />} />
      </Route>

      {/* 게시판관련 */}
      <Route path="gameboard/list" element={<GameBoardList />} />
      <Route path="gameboard/id/:id" element={<GameBoardView />} />
      <Route path="gameboard/list/write" element={<GameBoardWrite />} />
      <Route path="gameboard/edit/:id" element={<GameBoardEdit />} />
    </Route>,
  ),
);

function App() {
  return (
    <LoginProvider>
      <RouterProvider router={routes} />
    </LoginProvider>
  );
}

export default App;
