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
import { Cart } from "./page/order/Cart";
import { GearBoard } from "./page/gearBoard/GearBoard";
import { GearList } from "./page/gearBoard/GearList";
import { GearListAll } from "./page/gearBoard/GearListAll";
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
import { QnaAnswer } from "./page/qna/QnaAnswer";
import { QnaWriteAnswer } from "./page/qna/QnaWriteAnswer";
import { ProductPay } from "./page/order/ProductPay";
import { MemberQuestion } from "./page/qna/MemberQuestion";
import { MemberReview } from "./page/review/MemberReview";
import { MemberAnswer } from "./page/qna/MemberAnswer";
import { AdminIndex } from "./page/admin/AdminIndex";
import { MemberBoardLike } from "./page/member/MemberViewPage/MemberBoardLike";
import { HomeBody } from "./component/HomeBody";
import { ProductMainList } from "./page/product/ProductMainList";
import { ProductSubList } from "./page/product/ProductSubList";
import { CompanyList } from "./page/product/CompanyList";
import PaymentPage from "./page/order/PaymentPage";
import SuccessPage from "./page/order/SuccessPage";
import FailPage from "./page/order/FailPage";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HomeLayout />}>
      {/* 메인페이지 */}
      <Route index element={<HomeBody />} />
      {/* 상품관련 */}
      <Route path="category/:category_id" element={<ProductMainList />} />
      <Route
        path="category/:category_id/:subcategory_id"
        element={<ProductSubList />}
      />
      <Route path="company/:company_id" element={<CompanyList />} />

      <Route path="product/list/" element={<ProductList />} />
      <Route path="product/:product_id" element={<ProductView />} />
      <Route path="edit/:product_id" element={<ProductEdit />} />

      {/* 리뷰 */}

      {/* 장바구니 */}
      <Route path="cart" element={<Cart />} />

      {/* Q&A */}

      {/* 결제 */}
      <Route path="pay" element={<ProductPay />} />
      <Route path="payment" element={<PaymentPage />} />
      <Route path="success" element={<SuccessPage />} />
      <Route path="fail" element={<FailPage />} />

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
        <Route path="boardLike" element={<MemberBoardLike />} />
        {/* 상품 찜하기 목록 - gns14585 - */}
        <Route path="productLike" element={<ProductLike />} />
        <Route path="qna" element={<MemberQuestion />}>
          <Route path="answer/:question_id" element={<MemberAnswer />} />
        </Route>
        <Route path="review" element={<MemberReview />} />
      </Route>

      {/* 게시판관련 */}
      <Route path="gameboard/list" element={<GameBoardList />} />
      <Route path="gameboard/id/:id" element={<GameBoardView />} />
      <Route path="gameboard/list/write" element={<GameBoardWrite />} />
      <Route path="gameboard/edit/:id" element={<GameBoardEdit />} />

      {/* 게임 장비 커뮤니티 */}
      <Route path="gearboard" element={<GearBoard />} />
      <Route path="gearlist" element={<GearList />} />
      <Route path="gearlistall" element={<GearListAll />} />
      <Route path="gearlistlayout" element={<GearListlayout />} />
      <Route path="gearlist/gear_id/:gear_id" element={<GearView />} />
      <Route path="gearlist/edit/:gear_id" element={<GearEdit />} />

      {/* 관리자 페이지 */}
      <Route path="adminPage" element={<AdminView />}>
        <Route index element={<AdminIndex />} />
        <Route path="product/write/" element={<ProductWrite />} />
        <Route path="memberList" element={<MemberList />} />
        <Route path="qna" element={<QnaAnswer />}>
          <Route path="write/:question_id" element={<QnaWriteAnswer />} />
        </Route>
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
