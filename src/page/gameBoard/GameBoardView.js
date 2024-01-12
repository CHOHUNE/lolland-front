import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Spinner,
  useToast,
  VStack,
} from "@chakra-ui/react";
import GameBoardCommentContainer from "./GameBoardCommentContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeartBroken } from "@fortawesome/free-solid-svg-icons/faHeartBroken";

function LikeContainer({ like, onClick }) {
  if (like === null) {
    return <Spinner />;
  }

  return (
    <Button variant="ghost" size="xl" onClick={onClick}>
      {like.like && <FontAwesomeIcon icon={faHeart} size={"xl"} />}
      {/*<FontAwesomeIcon icon={faHeart} size={"xl"} />*/}
      {like.like || <FontAwesomeIcon icon={faHeartBroken} size={"xl"} />}
    </Button>
  );
}
export function GameBoardView(props) {
  const [board, setBoard] = useState(null);
  const [like, setLike] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    axios
      .get("/api/gameboard/id/" + id)
      .then((response) => {
        setBoard(response.data);
      })
      .catch((error) => {
        console.error("데이터를 가져오는 중 에러 발생:", error);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get("/api/like/gameboard/" + id)
      .then((response) => setLike(response.data));
  }, []);

  function handleDelete() {
    axios
      .delete("/api/gameboard/remove/" + id)
      .then((response) => {
        toast({
          description: id + "번 게시물 삭제 완료",
          status: "success",
        });
        navigate(-1);
      })
      .catch((error) => {
        toast({
          description: "실패",
          status: "error",
        });
      });
  }

  function handleLike() {
    axios
      .post("/api/like", { game_board_id: board.id })
      .then((response) => {
        setLike(response.data);
        console.log(like);
        toast({ description: "성공", status: "success" });
      })
      .catch(() => {
        toast({ description: "실패", status: "error" });
      });
  }

  if (board === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Center>
        <VStack py={"100px"}>
          <HStack>
            <Button onClick={() => navigate(-1)}> 이전 </Button>
            <Button
              colorScheme={"purple"}
              onClick={() => navigate("/gameboard/edit/" + id)}
            >
              수정
            </Button>
            <Button onClick={handleDelete} colorScheme={"red"}>
              삭제
            </Button>
            <LikeContainer onClick={handleLike} like={like} />
          </HStack>
          <Box
            border={"1px solid grey"}
            borderRadius={"10px"}
            textAlign={"center"}
            py={"10px"}
          >
            <h1> 글 보기 </h1>
            <Divider />
            <p> id :{board.id}</p>
            <Divider />
            <p> title :{board.title}</p>
            <Divider />
            <p> count: {board.board_count}</p>
            <Divider />
            <p> content :{board.board_content}</p>
            <Divider />
            <p> reg_ time: {board.reg_time}</p>
          </Box>
          <HStack px={"10px"}>
            <GameBoardCommentContainer />
          </HStack>
        </VStack>
      </Center>
    </Box>
  );
}

export default GameBoardView;
