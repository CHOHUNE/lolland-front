import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Checkbox,
  Flex,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export function MemberBoardLike() {
  // 버튼 css
  const buttonStyle = {
    background: "black",
    color: "whitesmoke",
    shadow: "1px 1px 3px 1px #dadce0",
    _hover: {
      backgroundColor: "whitesmoke",
      color: "black",
      transition:
        "background 0.5s ease-in-out, color 0.5s ease-in-out, box-shadow 0.5s ease-in-out",
      shadow: "1px 1px 3px 1px #dadce0 inset",
    },
  };

  // 회원이 좋아요 한 게임 게시글 목록
  const [gameBoardList, setGameBoardList] = useState([]);

  // 페이지 정보
  const [pageInfo, setPageInfo] = useState("");

  // 좋아요 삭제 인식
  const [deletedLikeStatus, setDeletedLikeStatus] = useState(false);

  // 체크 박스 에서 선택한 게임 게시글
  const [checkLikeGameBoard, setCheckLikeGameBoard] = useState([]);

  const toast = useToast();

  const navigate = useNavigate();

  const [params] = useSearchParams();

  const location = useLocation();

  useEffect(() => {
    axios.get("/api/member/getGameBoardLike?" + params).then((response) => {
      setGameBoardList(response.data.gameBoardLikeList);
      setPageInfo(response.data.pageInfo);
    });
  }, [deletedLikeStatus, location]);

  // 게임 좋아요 하나 삭제
  const handleLikeDeleteClick = (gameBoardId) => {
    axios
      .delete("/api/member/deleteGameBoardLike", {
        data: [gameBoardId],
      })
      .then(() => {
        setDeletedLikeStatus((prev) => !prev);
      })
      .catch(() => {
        toast({
          description: "좋아요 삭제중 문제가 발생했습니다.",
          status: "error",
        });
      });
  };

  // 좋아요 게시글의 체크
  const handleLikeRowChange = (e, gameBoardId) => {
    if (e.target.checked === true) {
      setCheckLikeGameBoard((prev) => [...prev, gameBoardId]);
    } else {
      setCheckLikeGameBoard((prev) => prev.filter((id) => id !== gameBoardId));
    }
  };

  // 전체 선택 버튼 클릭시
  const handleSelectAll = () => {
    setCheckLikeGameBoard(gameBoardList.map((gameBoard) => gameBoard.id));
  };
  // 전체 해제 버튼 클릭시
  const handleDesSelectAll = () => {
    setCheckLikeGameBoard([]);
  };

  // 선택 삭제 클릭시 선택 한것들만 지우기
  function handleSelectDeleteClick() {
    console.log(checkLikeGameBoard);
    axios
      .delete("/api/member/deleteGameBoardLike", {
        data: checkLikeGameBoard,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        setDeletedLikeStatus((prev) => !prev);
      })
      .catch(() => {
        toast({
          description: "좋아요 삭제중 문제가 발생했습니다.",
          status: "error",
        });
      });
  }

  return (
    <Center>
      <Card shadow={"1px 1px 3px 1px #dadce0"}>
        <CardHeader
          mt={4}
          textAlign={"center"}
          fontSize={"2rem"}
          fontWeight={"bold"}
          alignItems={"center"}
        >
          <Flex gap={4}>
            <Box>
              <FontAwesomeIcon
                icon={faThumbsUp}
                color={"orange"}
                fontSize={"2.5rem"}
              />
            </Box>
            <Box>좋아요한 게시글 목록</Box>
          </Flex>
        </CardHeader>

        <CardHeader>
          <Center mt={2} mb={4}>
            <Flex justifyContent="space-between" w="100%">
              <Flex gap={4}>
                <Button {...buttonStyle} onClick={handleSelectAll}>
                  전체 선택
                </Button>
                <Button {...buttonStyle} onClick={handleDesSelectAll}>
                  전체 해제
                </Button>
              </Flex>

              <Button
                {...buttonStyle}
                background={"orange"}
                color={"black"}
                onClick={handleSelectDeleteClick}
              >
                선택 삭제
              </Button>
            </Flex>
          </Center>
        </CardHeader>

        <CardBody>
          <Table textAlign={"center"}>
            <Thead>
              <Tr>
                <Th fontSize={"1.2rem"} w={"150px"} textAlign={"center"}>
                  선택
                </Th>
                <Th fontSize={"1.2rem"} w={"180px"} textAlign={"center"}>
                  카테고리
                </Th>
                <Th fontSize={"1.2rem"} w={"280px"} textAlign={"center"}>
                  제목
                </Th>
                <Th fontSize={"1.2rem"} w={"350px"} textAlign={"center"}>
                  내용
                </Th>
                <Th fontSize={"1.2rem"} w={"200px"} textAlign={"center"}>
                  좋아요 삭제
                </Th>
              </Tr>
            </Thead>

            <Tbody>
              {gameBoardList.map((gameBoard) => (
                <Tr key={gameBoard.id}>
                  <Td textAlign={"center"}>
                    <Checkbox
                      size={"lg"}
                      colorScheme={"orange"}
                      isChecked={checkLikeGameBoard.includes(gameBoard.id)}
                      onChange={(e) => handleLikeRowChange(e, gameBoard.id)}
                    ></Checkbox>
                  </Td>
                  <Td
                    textAlign={"center"}
                    _hover={{ cursor: "pointer" }}
                    onClick={() => navigate("/gameboard/id/" + gameBoard.id)}
                  >
                    {gameBoard.category}
                  </Td>
                  <Td
                    textAlign={"center"}
                    _hover={{ cursor: "pointer" }}
                    onClick={() => navigate("/gameboard/id/" + gameBoard.id)}
                  >
                    {gameBoard.title.length > 10
                      ? gameBoard.title.slice(0, 10) + "..."
                      : gameBoard.title}
                  </Td>
                  <Td
                    textAlign={"center"}
                    _hover={{ cursor: "pointer" }}
                    onClick={() => navigate("/gameboard/id/" + gameBoard.id)}
                  >
                    {gameBoard.board_content.length > 15
                      ? gameBoard.board_content.slice(0, 15) + "..."
                      : gameBoard.board_content}
                  </Td>
                  <Td textAlign={"center"} _hover={{ cursor: "pointer" }}>
                    <FontAwesomeIcon
                      icon={faXmark}
                      fontSize={"1.8rem"}
                      color={"gray"}
                      onClick={() => handleLikeDeleteClick(gameBoard.id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>

        <Center>
          <CardFooter>
            <Button onClick={() => navigate("?page=1")}>1</Button>
            <Button onClick={() => navigate("?page=2")}>2</Button>
          </CardFooter>
        </Center>
      </Card>
    </Center>
  );
}
