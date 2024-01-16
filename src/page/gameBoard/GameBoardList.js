import React, { useContext, useEffect, useState } from "react";
import {
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
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoginContext } from "../../component/LoginProvider";

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

  if (gameBoardList === null) {
    return <Spinner />;
  }

  return (
    <Box py={"100px"}>
      <Center>
        <Heading>베스트 게시물</Heading>
      </Center>
      <Center>
        <TableContainer>
          <Table size="sm" border={"1px solid whitesmoke"}>
            <Thead>
              <Tr>
                <Th>id</Th>
                <Th>title</Th>
                <Th>category</Th>
                <Th>content</Th>
                <Th>boardClickCount</Th>
                <Th>boardLikeCount</Th>
                <Th>boardCommentCount</Th>
                <Th>boardCountFile</Th>
                <Th>regTime</Th>
              </Tr>
            </Thead>
            <Tbody>
              {top.map((topTen) => (
                <Tr
                  key={topTen.id}
                  _hover={{ cursor: "pointer" }}
                  onClick={() => navigate("/gameboard/id/" + topTen.id)}
                  borderRadius="10px"
                >
                  <Td>{topTen.id}</Td>
                  <Td>{topTen.title}</Td>
                  <Td>{topTen.category}</Td>
                  <Td>{topTen.board_content}</Td>
                  <Td>{topTen.board_count}</Td>
                  <Td>{topTen.count_like}</Td>
                  <Td>{topTen.count_comment}</Td>
                  <Td>{topTen.countFile}</Td>
                  <Td>
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
        <ButtonGroup
          variant={"ouline"}
          spacing={"6"}
          border={"1px solid grey"}
          my={"50px"}
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
        <Heading as="h2" size="lg" mb={4}>
          공지사항
        </Heading>
      </Center>
      <Center>
        <TableContainer>
          <Table size="sm" border={"1px solid whitesmoke"}>
            <Thead>
              <Tr>
                <Th>id</Th>
                <Th>title</Th>
                <Th>category</Th>
                <Th>content</Th>
                <Th>boardClickCount</Th>
                <Th>boardLikeCount</Th>
                <Th>boardCommentCount</Th>
                <Th>boardCountFile</Th>
                <Th>regTime</Th>
              </Tr>
            </Thead>
            <Tbody>
              {notice.map((noticies) => (
                <Tr
                  key={noticies.id}
                  _hover={{ cursor: "pointer" }}
                  onClick={() => navigate("/gameboard/id/" + noticies.id)}
                  borderRadius="10px"
                  bgColor={noticies.category === "공지" ? "grey" : undefined}
                >
                  <Td>{noticies.id}</Td>
                  <Td>{noticies.title}</Td>
                  <Td>{noticies.category}</Td>
                  <Td>{noticies.board_content}</Td>
                  <Td>{noticies.board_count}</Td>
                  <Td>{noticies.count_like}</Td>
                  <Td>{noticies.count_comment}</Td>
                  <Td>{noticies.countFile}</Td>
                  <Td>
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
        <Heading as="h2" size="lg" mb={4} mt={"20px"}>
          일반 게시물
        </Heading>
      </Center>
      <Center>
        <TableContainer>
          <Table size="sm" border={"1px solid whitesmoke"}>
            <Thead>
              <Tr>
                <Th>id</Th>
                <Th>title</Th>
                <Th>category</Th>
                <Th>content</Th>
                <Th>boardClickCount</Th>
                <Th>boardLikeCount</Th>
                <Th>boardCommentCount</Th>
                <Th>boardCountFile</Th>
                <Th>regTime</Th>
              </Tr>
            </Thead>
            <Tbody>
              {gameBoardList.map((board) => (
                <Tr
                  key={board.id}
                  _hover={{ cursor: "pointer" }}
                  onClick={() => navigate("/gameboard/id/" + board.id)}
                  borderRadius="10px"
                >
                  <Td>{board.id}</Td>
                  <Td>{board.title}</Td>
                  <Td>{board.category}</Td>
                  <Td>{board.board_content}</Td>
                  <Td>{board.board_count}</Td>
                  <Td>{board.count_like}</Td>
                  <Td>{board.count_comment}</Td>
                  <Td>{board.countFile}</Td>
                  <Td>
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
