import React, { useContext, useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Image,
  Select,
  Spinner,
  Switch,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import loginProvider, { LoginContext } from "../../component/LoginProvider";

export function GameBoardEdit(props) {
  const [board, updateBoard] = useImmer(null);
  const { id } = useParams();
  const [removeFileIds, setRemoveFileIds] = useState([]);
  const [uploadFiles, setUploadFiles] = useState(null);
  const { isAuthenticated, isAdmin } = useContext(LoginContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      .putForm("/api/gameboard/edit", {
        id: board.id,
        title: board.title,
        board_content: board.board_content,
        category: board.category,
        removeFileIds,
        uploadFiles,
      })
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
      })
      .finally(() => setIsSubmitting(false));
  }

  function handleRemoveFileSwitch(e) {
    if (e.target.checked) {
      // removeFileIds 에 추가
      setRemoveFileIds([...removeFileIds, e.target.value]);
    } else {
      // removeFileIds 에서 삭제
      setRemoveFileIds(removeFileIds.filter((item) => item !== e.target.value));
    }
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
      <Box py={"100px"} w={"60%"}>
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
              style={{ height: "150px" }} // 높이 조절
              onChange={(e) =>
                updateBoard((draft) => {
                  draft.board_content = e.target.value;
                  // return { ...draft, board_content: e.target.value };
                })
              }
            />
          </FormControl>

          {/* 이미지 출력 */}
          {board.files.length > 0 &&
            board.files.map((file) => (
              <Box key={file.id} my="5px" border="3px solid black">
                <FormControl display="flex" alignItems="center">
                  <FormLabel>
                    <FontAwesomeIcon color="red" icon={faTrashCan} />
                  </FormLabel>
                  <Switch
                    value={file.id}
                    colorScheme="red"
                    onChange={handleRemoveFileSwitch}
                  />
                </FormControl>
                <Box>
                  <Image src={file.url} alt={file.name} width="100%" />
                </Box>
              </Box>
            ))}

          {/* 추가할 파일 선택 */}
          <FormControl>
            <FormLabel>이미지</FormLabel>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setUploadFiles(e.target.files)}
            />

            <FormHelperText>
              한 개 파일은 1MB 이내, 총 용량은 10MB 이내로 첨부하세요.
            </FormHelperText>
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
