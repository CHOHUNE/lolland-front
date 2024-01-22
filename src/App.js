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
import { Cart } from "./page/Cart/Cart";
import { GearBoard } from "./page/gearBoard/GearBoard";
import { GearList } from "./page/gearBoard/GearList";
import { GearView } from "./page/gearBoard/GearView";
import { GearEdit } from "./page/gearBoard/GearEdit";
import { ProductEdit } from "./page/product/ProductEdit";
import { MemberInfo } from "./page/member/MemberViewPage/MemberInfo";
import { MemberManage } from "./page/member/MemberViewPage/MemberManage";
import { MemberAddress } from "./page/member/MemberViewPage/MemberAddress";
import { GearListlayout } from "./page/gearBoard/GearListlayout";
import { MemberAddressWrite } from "./page/member/MemberViewPage/MemberAddressWrite";
import { MemberEdit } from "./page/member/MemberViewPage/MemberEdit";
import LoginProvider from "./component/LoginProvider";
import { ProductLike } from "./page/productLike/ProductLike";
import { MemberFindId } from "./page/member/MemberFindId";
import { MemberFindPassword } from "./page/member/MemberFindPassword";
import { PasswordEdit } from "./page/member/MemberViewPage/PasswordEdit";
import { AdminView } from "./page/admin/AdminView";
import { MemberList } from "./page/admin/MemberList";
import { ProductPay } from "./ProductPay";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HomeLayout />}>
      {/* 메인페이지 */}

      {/* 상품관련 */}
      <Route path="product/write/" element={<ProductWrite />} />
      <Route path="product/list/" element={<ProductList />} />
      <Route path="product/:product_id" element={<ProductView />} />
      <Route path="edit/:product_id" element={<ProductEdit />} />
      <Route path="product/pay/:product_id" element={<ProductPay />} />

      {/* 리뷰 */}

      {/* 장바구니 */}
      <Route path="/cart" element={<Cart />} />

      {/* Q&A */}

      {/* 결제 */}

      {/* 회원관련 */}
      <Route path="signup" element={<MemberSignup />} />
      <Route path="login" element={<MemberLogin />} />
      <Route path="findId" element={<MemberFindId />} />
      <Route path="findPassword" element={<MemberFindPassword />} />
      <Route path="memberPage" element={<MemberView />}>
        <Route path="memberInfo" element={<MemberInfo />} />
        <Route path="memberInfo/memberManagePage" element={<MemberManage />} />
        <Route path="memberEdit" element={<MemberEdit />} />
        <Route path="addressInfo" element={<MemberAddress />} />
        <Route path="addressWrite" element={<MemberAddressWrite />} />
        <Route path="passwordEdit" element={<PasswordEdit />} />
        {/* 상품 찜하기 목록 - gns14585 - */}
        <Route path="productLike" element={<ProductLike />} />
      </Route>

      {/* 게시판관련 */}
      <Route path="gameboard/list" element={<GameBoardList />} />
      <Route path="gameboard/id/:id" element={<GameBoardView />} />
      <Route path="gameboard/list/write" element={<GameBoardWrite />} />
      <Route path="gameboard/edit/:id" element={<GameBoardEdit />} />

      {/* 게임 장비 커뮤니티 */}
      <Route path="gearboard" element={<GearBoard />} />
      <Route path="gearlist" element={<GearList />} />
      <Route path="gearlistlayout" element={<GearListlayout />} />
      <Route path="gearlist/gear_id/:gear_id" element={<GearView />} />
      <Route path="gearlist/edit/:gear_id" element={<GearEdit />} />

      {/* 관리자 페이지 */}
      <Route path="adminPage" element={<AdminView />}>
        <Route path="memberList" element={<MemberList />} />
      </Route>
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
