import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Select,
  Spinner,
  Textarea,
  useToast,
} from "@chakra-ui/react";

export function GameBoardEdit(props) {
  const [board, updateBoard] = useImmer(null);
  const { id } = useParams();

  let toast = useToast();
  let navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/gameboard/id/" + id)
      .then((response) => {
        updateBoard(response.data);
      })
      .catch((error) => {
        console.error("데이터를 가져오는 중 에러 발생:", error);
      });
  }, [id]);

  if (board === null) {
    return <Spinner />;
  }

  function handlesubmit() {
    axios
      .put("/api/gameboard/edit", board)
      .then(() => {
        toast({
          description: "수정 성공",
          status: "success",
        });
        navigate(-2);
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          toast({
            description: " 400요청 에러",
            status: "error",
          });
        } else {
          toast({
            description: "수정 실패",
            status: "error",
          });
        }
      });
  }

  function handleDelete() {
    axios
      .delete("/api/gameboard/remove/" + id)
      .then(() => {
        toast({
          description: id + "번 게시물 삭제 완료",
          status: "success",
        });
        navigate(-2);
      })
      .catch((error) => {
        toast({
          description: "실패",
          status: "error",
        });
      });
  }

  return (
    <Center>
      <Box py={"200px"}>
        <h1>{id} 번 게시물 수정 </h1>
        <Box>
          <Select
            placeholder={"카테고리 선택"}
            value={board.category}
            onChange={(e) => {
              updateBoard((draft) => {
                // 새로운 상태를 반환하도록 수정
                draft.category = e.target.value;
                // return { ...draft, category: e.target.value };
              });
            }}
          >
            <option value="공지">공지</option>
            <option value="자유">자유</option>
            <option value="롤">롤</option>
          </Select>
          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input
              value={board.title}
              onChange={(e) =>
                updateBoard((draft) => {
                  draft.title = e.target.value;
                  // return { ...draft, title: e.target.value };
                })
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>본문</FormLabel>
            <Textarea
              value={board.board_content}
              onChange={(e) =>
                updateBoard((draft) => {
                  draft.board_content = e.target.value;
                  // return { ...draft, board_content: e.target.value };
                })
              }
            />
          </FormControl>

          <Button onClick={handlesubmit} colorScheme="blue">
            저장
          </Button>
          <Button onClick={handleDelete} colorScheme={"red"}>
            삭제
          </Button>
        </Box>
      </Box>
    </Center>
  );
}

export default GameBoardEdit;
