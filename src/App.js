import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { HomeLayout } from "./layout/HomeLayout";
import GameBoardWrite from "./page/gameBoard/GameBoardWrite";
import GameBoardList from "./page/gameBoard/GameBoardList";
import GameBoardEdit from "./page/gameBoard/GameBoardEdit";
import GameBoardView from "./page/gameBoard/GameBoardView";


const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HomeLayout />}>
      {/* 메인페이지 */}

      {/* 상품관련 */}

      {/* 리뷰 */}

      {/* 장바구니 */}

      {/* 찜하기 */}

      {/* Q&A */}

      {/* 결제 */}

      {/* 회원관련 */}

      {/* 게시판관련 */}
        <Route path="gameboard" element={<GameBoardList/>}/>
        <Route path="gameboard/:id" element={<GameBoardView/>}/>
        <Route path="gameboard/write" element={<GameBoardWrite/>}/>
        <Route path="gameboard/edit:id" element={<GameBoardEdit/>}/>



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
