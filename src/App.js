import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { HomeLayout } from "./layout/HomeLayout";
import { ProductWrite } from "./page/product/ProductWrite";
import { ProductList } from "./page/product/ProductList";
import { ProductView } from "./page/product/ProductView";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HomeLayout />}>
      {/* 메인페이지 */}

      {/* 상품관련 */}
      <Route path="product/write/" element={<ProductWrite />} />
      <Route path="product/list/" element={<ProductList />} />
      <Route path="product/:product_id" element={<ProductView />} />

      {/* 리뷰 */}

      {/* 장바구니 */}

      {/* 찜하기 */}

      {/* Q&A */}

      {/* 결제 */}

      {/* 회원관련 */}

      {/* 게시판관련 */}
      {/*  <Route path="gameBoard" element={<GameBoard/>}/>*/}
      {/*  <Route path="gameBoard/:id" element={<GameBoardView/>}/>*/}
      {/*  <Route path="gameBoard/write" element={<GameBoardWrite/>}/>*/}
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
