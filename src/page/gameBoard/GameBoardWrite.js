import React, { useContext, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider";

export function GameBoardWrite(props) {
  const [title, setTitle] = useState("");
  const [board_content, setBoard_content] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadFiles, setUploadFiles] = useState(null);
  const { isAuthenticated, isAdmin } = useContext(LoginContext);

  let toast = useToast();
  let navigate = useNavigate();

  function handleSubmit() {
    // 사진 파일 필수
    // Check if uploadFiles is null
    // if (uploadFiles === null) {
    //   toast({
    //     description: "사진을 업로드해주세요.",
    //     status: "error",
    //   });
    //   return; // Stop further execution if uploadFiles is null
    // }

    setIsSubmitting(true);
    axios
      .postForm("/api/gameboard/write", {
        title,
        board_content,
        category,
        uploadFiles,
      })
      .then((response) => {
        toast({
          description: "글 작성 완료",
          status: "success",
        });
        navigate("/gameboard/list");
      })
      .catch(() => {
        toast({
          description: "작성 실패",
          status: "error",
        });
      })
      .finally(() => setIsSubmitting(false));
  }

  return (
    <Center>
      <Box py={"100px"} w={"60%"}>
        <h1>게시물 작성</h1>
        <Box>
          <Select
            placeholder={"카테고리 선택"}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            {isAdmin() && <option value="공지">공지</option>}
            <option value="리그 오브 레전드">리그 오브 레전드</option>
            <option value="로스트 아크">로스트 아크</option>
            <option value="콘솔 게임">콘솔 게임</option>
            <option value="모바일 게임">모바일 게임</option>
            <option value="자유">자유</option>
          </Select>
          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              목
              placeholder={"제목"}
            />
          </FormControl>
          <FormControl>
            <FormLabel>본문</FormLabel>
            <Textarea
              value={board_content}
              onChange={(e) => setBoard_content(e.target.value)}
              style={{ height: "150px" }} // 높이 조절
              placeholder={"본문 내용을 입력 해주세요."}
            />
          </FormControl>
          <FormControl>
            <FormLabel>이미지</FormLabel>
            <Input
              type={"file"}
              accept={"image/*"}
              multiple
              onChange={(e) => setUploadFiles(e.target.files)}
            />
            <FormHelperText>
              한 개 파일은 1MB 이내, 총 용량으 10MB 이내로 첨부 하세요.
            </FormHelperText>
          </FormControl>
          <Button
            onClick={handleSubmit}
            colorScheme="whitesmoke"
            isDisabled={isSubmitting}
            variant={"outline"}
            mt={"10px"}
          >
            저장
          </Button>
        </Box>
      </Box>
    </Center>
  );
}

export default GameBoardWrite;
