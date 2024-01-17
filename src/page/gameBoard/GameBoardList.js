import React, { useContext, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Center,
  Divider,
  Flex,
  Heading,
  Input,
  Select,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  faAngleLeft,
  faAngleRight,
  faImage,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoginContext } from "../../component/LoginProvider";
import { AddIcon, ChatIcon } from "@chakra-ui/icons";

function PageButton({ variant, pageNumber, children }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  function handleClick() {
    params.set("p", pageNumber);
    navigate("/gameboard/list?" + params);
  }

  return (
    <Button variant={variant} onClick={handleClick}>
      {children}
    </Button>
  );
}

function Pagination({ pageInfo }) {
  const pageNumbers = [];

  const navigate = useNavigate();

  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Center mt={5} mb={40}>
      <Box>
        {pageInfo.prevPageNumber && (
          <PageButton variant="ghost" pageNumber={pageInfo.prevPageNumber}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </PageButton>
        )}

        {pageNumbers.map((pageNumber) => (
          <PageButton
            key={pageNumber}
            variant={
              pageNumber === pageInfo.currentPageNumber ? "solid" : "ghost"
            }
            pageNumber={pageNumber}
          >
            {pageNumber}
          </PageButton>
        ))}

        {pageInfo.nextPageNumber && (
          <PageButton variant="ghost" pageNumber={pageInfo.nextPageNumber}>
            <FontAwesomeIcon icon={faAngleRight} />
          </PageButton>
        )}
      </Box>
    </Center>
  );
}

function SearchComponent() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  function handleSearch() {
    // /?k=keyword&c=all
    const params = new URLSearchParams();
    params.set("k", keyword);

    navigate("/gameboard/list?" + params); // 경로 수정
  }

  return (
    <Flex>
      <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <Button onClick={handleSearch}>검색</Button>
    </Flex>
  );
}

function GameBoardList() {
  const [gameBoardList, setGameBoardList] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();
  const { isAuthenticated } = useContext(LoginContext);
  const toast = useToast();
  const [notice, setNotice] = useState(null);
  const [top, setTop] = useState(null);

  useEffect(() => {
    axios.get("/api/gameboard/list?" + params).then((response) => {
      setGameBoardList(response.data.gameBoardList);
      setPageInfo(response.data.pageInfo);
    });
  }, [location, isAuthenticated]);

  useEffect(() => {
    axios.get("/api/gameboard/list/notice").then((response) => {
      setNotice(response.data);
    });
  }, []);

  useEffect(() => {
    axios
      .get("/api/gameboard/list/top")
      .then((response) => setTop(response.data));
  }, []);

  if (gameBoardList === null || pageInfo === null) {
    return <Spinner />;
  }

  return (
    <Box py={"100px"}>
      <Center>
        <Heading mb={"10px"}>베스트 게시물</Heading>
      </Center>
      <Center>
        <TableContainer w={"50%"}>
          <Table size="sm" border={"1px solid whitesmoke"}>
            <Thead>
              <Tr>
                <Th w="5%" textAlign={"center"}>
                  추천
                </Th>
                <Th w="5%" pl="0">
                  분류
                </Th>
                <Th w="40%" colSpan={2} textAlign={"center"}>
                  제목
                </Th>
                <Th w="10%">조회수</Th>
                <Th w="10%">작성자</Th>
                <Th w="10%">날짜</Th>
              </Tr>
            </Thead>
            <Tbody>
              {top &&
                top.map((topTen) => (
                  <Tr key={topTen.id} borderRadius="10px">
                    <Td w="10%" textAlign={"center"}>
                      <Badge
                        colorScheme="green"
                        variant="outline"
                        mx={"2px"} // Adjusted spacing around Badge
                        fontWeight={"bold"}
                        bgColor={`rgba(0, 128, 0, ${topTen.count_like / 10})`}
                      >
                        {topTen.count_like}
                      </Badge>
                    </Td>

                    <Td w="5%" pl="0">
                      {topTen.category}
                    </Td>
                    <Td
                      w="40%"
                      colSpan={2}
                      textAlign={"center"}
                      onClick={() => navigate("/gameboard/id/" + topTen.id)}
                      _hover={{ cursor: "pointer" }}
                    >
                      <span style={{ marginLeft: "+10%" }}>{topTen.title}</span>

                      {topTen.count_comment !== 0 && (
                        <Badge
                          colorScheme={"green"}
                          variant="outline"
                          mx={"1%"}
                        >
                          {topTen.count_comment}
                          <ChatIcon />
                        </Badge>
                      )}

                      {topTen.countFile !== 0 && (
                        <Badge mx={"1%"}>
                          {topTen.countFile}
                          <FontAwesomeIcon icon={faImage} />
                        </Badge>
                      )}
                    </Td>
                    <Td w="10%">{topTen.board_count}</Td>
                    <Td w="10%">{topTen.member_id}</Td>
                    <Td w="10%">
                      {new Date(topTen.reg_time).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Center>
      <Center>
        <Heading as="h2" size="lg" mb={4} mt={"2%"}>
          공지사항
        </Heading>
      </Center>
      <Center>
        <TableContainer w={"40%"}>
          <Table size="sm" border={"1px solid whitesmoke"}>
            <Thead>
              <Tr>
                <Th w="5%" textAlign={"center"}>
                  분류
                </Th>
                <Th w="40%" colSpan={2} textAlign={"center"}>
                  제목
                </Th>
                <Th w="10%">조회수</Th>
                <Th w="10%">작성자</Th>
                <Th w="10%">날짜</Th>
              </Tr>
            </Thead>
            <Tbody>
              {notice &&
                notice.map((noticies) => (
                  <Tr key={noticies.id} borderRadius="10px">
                    <Td w="5%" textAlign={"center"}>
                      {noticies.category}
                    </Td>
                    <Td
                      w="40%"
                      colSpan={2}
                      textAlign={"center"}
                      onClick={() => navigate("/gameboard/id/" + noticies.id)}
                      _hover={{ cursor: "pointer" }}
                    >
                      <span style={{ marginLeft: "+10%" }}>
                        {noticies.title}
                      </span>
                      {noticies.count_comment !== 0 && (
                        <Badge
                          colorScheme={"green"}
                          variant="outline"
                          mx={"1%"}
                        >
                          <ChatIcon />
                          {noticies.count_comment}
                        </Badge>
                      )}
                      {noticies.countFile !== 0 && (
                        <Badge mx={"1%"}>
                          {noticies.countFile}
                          <FontAwesomeIcon icon={faImage} />
                        </Badge>
                      )}{" "}
                    </Td>
                    <Td w="10%">{noticies.board_count}</Td>
                    <Td w="10%">{noticies.member_id}</Td>
                    <Td w="10%">
                      {new Date(noticies.reg_time).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Center>

      {/* 그 외의 게시물 게시판 */}
      <Center>
        <Heading as="h2" size="lg" mt={"1%"}>
          일반 게시물
        </Heading>
      </Center>

      <Center>
        <ButtonGroup
          variant={"ouline"}
          spacing={"6"}
          border={"1px solid whitesmoke"}
          my={"1%"}
        >
          <Button
            onClick={() => navigate("")}
            _hover={{ bgColor: "whitesmoke", color: "black" }}
          >
            전체
          </Button>
          <Button
            onClick={() => navigate("?k=공지")}
            _hover={{ bgColor: "whitesmoke", color: "black" }}
          >
            공지
          </Button>
          <Button
            colorScheme={"blue"}
            onClick={() => navigate("?k=잡담")}
            _hover={{ bgColor: "whitesmoke", color: "black" }}
          >
            잡담
          </Button>
          <Button
            colorScheme={"blue"}
            onClick={() => navigate("?k=질문")}
            _hover={{ bgColor: "whitesmoke", color: "black" }}
          >
            질문
          </Button>
          <Button
            colorScheme={"blue"}
            onClick={() => navigate("?k=정보")}
            _hover={{ bgColor: "whitesmoke", color: "black" }}
          >
            정보
          </Button>
        </ButtonGroup>
      </Center>

      <Center>
        <TableContainer w={"50%"}>
          <Table size="sm" border={"1px solid whitesmoke"}>
            <Thead>
              <Tr>
                <Th w="5%" textAlign={"center"}>
                  추천
                </Th>
                <Th w="5%" pl="0">
                  분류
                </Th>
                <Th w="40%" colSpan={2} textAlign={"center"}>
                  제목
                </Th>
                <Th w="10%">조회수</Th>
                <Th w="10%">작성자</Th>
                <Th w="10%">날짜</Th>
              </Tr>
            </Thead>
            <Tbody>
              {gameBoardList &&
                gameBoardList.map((board) => (
                  <Tr key={board.id} borderRadius="10px">
                    <Td w="10%" textAlign={"center"}>
                      <Badge
                        colorScheme="green"
                        variant="outline"
                        mx={"2px"} // Adjusted spacing around Badge
                        fontWeight={"bold"}
                        bgColor={`rgba(0, 128, 0, ${board.count_like / 10})`}
                      >
                        {board.count_like}
                      </Badge>
                    </Td>

                    <Td w="5%" pl="0">
                      {board.category}
                    </Td>
                    <Td
                      w="40%"
                      colSpan={2}
                      textAlign={"center"}
                      _hover={{ cursor: "pointer" }}
                      onClick={() => navigate("/gameboard/id/" + board.id)}
                    >
                      <span style={{ marginLeft: "+10%" }}>{board.title}</span>
                      {board.count_comment !== 0 && (
                        <Badge
                          colorScheme={"green"}
                          variant="outline"
                          mx={"1%"}
                        >
                          <ChatIcon />
                          {board.count_comment}
                        </Badge>
                      )}{" "}
                      {board.countFile !== 0 && (
                        <Badge mx={"1%"}>
                          <FontAwesomeIcon icon={faImage} />
                          {board.countFile}
                        </Badge>
                      )}
                    </Td>
                    <Td w="10%">{board.board_count}</Td>
                    <Td w="10%">{board.member_id}</Td>
                    <Td w="10%">
                      {new Date(board.reg_time).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Center>
      <Center>
        <Button
          my="20px"
          onClick={() => {
            if (isAuthenticated()) {
              // 괄호 추가
              navigate("write");
            } else {
              toast({ description: "로그인 후 글 작성" });
            }
          }}
        >
          글 작성
        </Button>
      </Center>
      <Center>
        <VStack>
          <SearchComponent />
          <Pagination pageInfo={pageInfo} />
        </VStack>
      </Center>
    </Box>
  );
}

export default GameBoardList;
