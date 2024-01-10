import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { HomeLayout } from "./layout/HomeLayout";
import { ReviewView } from "./page/review/ReviewView";
import { Cart } from "./page/Cart/Cart";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HomeLayout />}>
      {/* 메인페이지 */}

      {/* 상품관련 */}

      {/* 리뷰 */}
      <Route path="/review" element={<ReviewView />} />

      {/* 장바구니 */}
      {/* 이걸로 로그인 완성되면 수정 <Route path="/cart/:member_id" element={<Cart />} />*/}
      <Route path="/cart" element={<Cart />} />

      {/* 찜하기 */}

      {/* Q&A */}

      {/* 결제 */}

      {/* 회원관련 */}

      {/* 게시판관련 */}
      {/*<Route path="gameBoard" element={<GameBoard />} />*/}
      {/*<Route path="gameBoard/:id" element={<GameBoardView />} />*/}
      {/*<Route path="gameBoard/write" element={<GameBoardWrite />} />*/}
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
