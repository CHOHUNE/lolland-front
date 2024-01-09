import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function GameBoardWrite(props) {
  const [title, setTitle] = useState("");
  const [board_content, setBoard_content] = useState("");
  const [category, setCategory] = useState("");
  // const [isSubmitting, setIsSubmitting] = useState(false);

  let toast = useToast();
  let navigate = useNavigate();

  function handleSubmit() {
    // setIsSubmitting(true);
    axios
      .post("/api/gameboard/write", {
        title,
        board_content,
        category,
      })
      .then((response) => {
        toast({
          description: "글 작성 완료",
          status: "success",
        });
        // navigate("/gameboardlist")
      })
      .catch(() => {
        toast({
          description: "작성 실패",
          status: "error",
        });
      });
    // .finally(() => setIsSubmitting(true));
  }

  return (
    <Center>
      <Box py={"200px"}>
        <h1>게시물 작성</h1>
        <Box>
          <Select
            placeholder={"카테고리 선택"}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            <option value="공지">공지</option>
            <option value="자유">자유</option>
            <option value="롤">롤</option>
          </Select>
          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>본문</FormLabel>
            <Textarea
              value={board_content}
              onChange={(e) => setBoard_content(e.target.value)}
            />
          </FormControl>

          <Button
            onClick={handleSubmit}
            colorScheme="blue"
            // isDisabled={isSubmitting}
          >
            저장
          </Button>
        </Box>
      </Box>
    </Center>
  );
}

export default GameBoardWrite;
