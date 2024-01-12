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
import { GearBoard } from "./page/gearBoard/GearBoard";
import { GearList } from "./page/gearBoard/GearList";
import { GearView } from "./page/gearBoard/GearView";
import { GearEdit } from "./page/gearBoard/GearEdit";
import { ProductEdit } from "./ProductEdit";
import { MemberInfo } from "./page/member/MemberViewPage/MemberInfo";
import { MemberManage } from "./page/member/MemberViewPage/MemberManage";
import { MemberAddress } from "./page/member/MemberViewPage/MemberAddress";
import { GearListlayout } from "./page/gearBoard/GearListlayout";

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
        <Route path="addressInfo" element={<MemberAddress />} />
      </Route>

      {/* 게시판관련 */}
      <Route path="gameboard" element={<GameBoardList />} />
      <Route path="gameboard/id/:id" element={<GameBoardView />} />
      <Route path="gameboard/write" element={<GameBoardWrite />} />
      <Route path="gameboard/edit/:id" element={<GameBoardEdit />} />

      {/* 게임 장비 커뮤니티 */}
      <Route path="gearboard" element={<GearBoard />} />
      <Route path="gearlist" element={<GearList />} />
      <Route path="gearlistlayout" element={<GearListlayout />} />

      <Route path="gearlist/gear_id/:gear_id" element={<GearView />} />
      <Route path="gearlist/edit/:gear_id" element={<GearEdit />} />
    </Route>,
  ),
);

function App() {
  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
