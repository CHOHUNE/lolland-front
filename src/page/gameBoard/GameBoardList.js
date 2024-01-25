import React, { useContext, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Center,
  Divider,
  Flex,
  Heading,
  Image,
  Input,
  Select,
  Spinner,
  Stack,
  StackDivider,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
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
  faCaretDown,
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
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("");
  const navigate = useNavigate();

  function handleSearch() {
    // /?k=keyword&c=all
    const params = new URLSearchParams();
    params.set("k", keyword);
    params.set("c", category);
    params.set("s", sortBy);

    navigate("/gameboard/list?" + params); // 경로 수정
  }

  return (
    <Flex>
      <Box>
        <Select
          defaultValue="default"
          w={"120px"}
          onChange={(e) => setSortBy(e.target.value)}
          ml={4}
        >
          <option value="">최신순</option>
          <option value="count_like">추천순</option>
          <option value="board_count">조회수순</option>
        </Select>
      </Box>
      <Box>
        <Select
          defaultValue="all"
          w={"100px"}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">전체</option>
          <option value="title">제목</option>
          <option value="content">본문</option>
        </Select>
      </Box>

      <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <Button onClick={handleSearch}>검색</Button>
    </Flex>
  );
}

function GameBoardList() {
  const [gameBoardList, setGameBoardList] = useState(null);
  const [notice, setNotice] = useState(null);
  const [top, setTop] = useState(null);
  const [today, setToday] = useState(null);

  const [params] = useSearchParams();
  const [pageInfo, setPageInfo] = useState(null);
  const [sortBy, setSortBy] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useContext(LoginContext);
  const toast = useToast();

  const [naver, setNaver] = useState(null);

  useEffect(() => {
    // params.set("s", sortBy);

    axios.get("/api/gameboard/list?" + params).then((response) => {
      setGameBoardList(response.data.gameBoardList);
      setPageInfo(response.data.pageInfo);
    });
  }, [location, isAuthenticated, sortBy]);

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

  useEffect(() => {
    axios
      .get("/api/gameboard/list/today")
      .then((response) => setToday(response.data));
  }, []);

  useEffect(() => {
    axios.get("/api/gameboard/naver").then((response) => {
      setNaver(response.data);
    });
  }, []);

  if (gameBoardList === null || pageInfo === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Flex>
        <Center w={"100%"}>
          <VStack w={"100%"} ml={"10%"}>
            <Center>
              <Heading as="h2" size="lg" my={"15px"}>
                BEST 게시판
              </Heading>
            </Center>
            <Center w={"75%"}>
              <TableContainer w={"100%"}>
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
                              bgColor={`rgba(0, 128, 0, ${
                                topTen.count_like / 10
                              })`}
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
                            onClick={() =>
                              navigate("/gameboard/id/" + topTen.id)
                            }
                            _hover={{ cursor: "pointer" }}
                          >
                            <span style={{ marginLeft: "+10%" }}>
                              {topTen.title}
                            </span>

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
                            {new Date(topTen.reg_time).toLocaleDateString(
                              "ko-KR",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Center>

            {/* 그 외의 게시물 게시판 */}
            <Center>
              <Heading as="h2" size="lg" my={"15px"}>
                일반 게시물
              </Heading>
            </Center>

            <Center>
              <ButtonGroup
                variant={"ouline"}
                spacing={"6"}
                border={"1px solid whitesmoke"}
                my={"1%"}
                mt={"15px"}
              >
                <Button
                  onClick={() => navigate("")}
                  _hover={{ bgColor: "whitesmoke", color: "black" }}
                >
                  전체
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

            <Center w={"100%"}>
              <TableContainer w={"75%"}>
                <Table size="sm" border={"1px solid whitesmoke"}>
                  <Thead>
                    <Tr>
                      <Th
                        w="5%"
                        textAlign={"center"}
                        cursor={"pointer"}
                        onClick={() => {
                          setSortBy("count_like");
                          params.set("s", sortBy);
                          navigate("/gameboard/list?" + params);
                        }}
                      >
                        추천
                        <FontAwesomeIcon icon={faCaretDown} />
                      </Th>
                      <Th w="5%" pl="0">
                        분류
                      </Th>
                      <Th w="40%" colSpan={2} textAlign={"center"}>
                        제목
                      </Th>
                      <Th
                        w="10%"
                        cursor={"pointer"}
                        onClick={() => {
                          setSortBy("board_count");
                          params.set("s", sortBy);
                          navigate("/gameboard/list?" + params);
                        }}
                      >
                        조회수
                        <FontAwesomeIcon icon={faCaretDown} />
                      </Th>
                      <Th w="10%">작성자</Th>
                      <Th
                        w="10%"
                        cursor={"pointer"}
                        onClick={() => {
                          setSortBy("");
                          params.set("s", sortBy);
                          navigate("/gameboard/list?" + params);
                        }}
                      >
                        날짜
                        <FontAwesomeIcon icon={faCaretDown} />
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {notice &&
                      notice.map((noticies) => (
                        <Tr
                          key={noticies.id}
                          borderRadius="10px"
                          bgColor={"whitesmoke"}
                        >
                          <Td w="10%" textAlign={"center"}>
                            <Badge
                              colorScheme="green"
                              variant="outline"
                              mx={"2px"}
                              fontWeight={"bold"}
                              bgColor={`rgba(0, 128, 0, ${
                                noticies.count_like / 10
                              })`}
                            >
                              {noticies.count_like}
                            </Badge>
                          </Td>
                          <Td w="5%" pl={"0"}>
                            {noticies.category}
                          </Td>
                          <Td
                            w="40%"
                            colSpan={2}
                            textAlign={"center"}
                            onClick={() =>
                              navigate("/gameboard/id/" + noticies.id)
                            }
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
                            {new Date(noticies.reg_time).toLocaleDateString(
                              "ko-KR",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </Td>
                        </Tr>
                      ))}

                    {gameBoardList &&
                      gameBoardList.map((board) => (
                        <Tr key={board.id} borderRadius="10px">
                          <Td w="10%" textAlign={"center"}>
                            <Badge
                              colorScheme="green"
                              variant="outline"
                              mx={"2px"} // Adjusted spacing around Badge
                              fontWeight={"bold"}
                              bgColor={`rgba(0, 128, 0, ${
                                board.count_like / 10
                              })`}
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
                            onClick={() =>
                              navigate("/gameboard/id/" + board.id)
                            }
                          >
                            <span style={{ marginLeft: "+10%" }}>
                              {board.title}
                            </span>
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
                            {new Date(board.reg_time).toLocaleDateString(
                              "ko-KR",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
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
          </VStack>
        </Center>

        <Box w={"25%"} margin={"15px auto"} mr={"5%"}>
          <Card>
            <CardHeader>
              <Heading size="md">오늘의 BEST</Heading>
            </CardHeader>

            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                {today &&
                  today.map((todayPost) => (
                    <Box key={todayPost.id}>
                      <Heading
                        size="xs"
                        textTransform="uppercase"
                        _hover={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate("/gameboard/id/" + todayPost.id)
                        }
                      >
                        {todayPost.title}
                      </Heading>
                    </Box>
                  ))}
              </Stack>
            </CardBody>
          </Card>
          <br />
          <br />
          <br />
          <Box>
            <Divider orientation="horizontal" color={"orange"} />
            <Card>
              <CardHeader>
                <Heading size="md">게임 관련 최신 기사</Heading>
              </CardHeader>

              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  {naver &&
                    naver.items !== null &&
                    naver.items.map((news) => (
                      <Box key={news.link}>
                        <Heading
                          size="xs"
                          textTransform="uppercase"
                          _hover={{ cursor: "pointer" }}
                          onClick={() => window.open(news.link, "_blank")}
                        >
                          {news.title
                            .replace(/&quot;/g, "") // &quot; 제거
                            .replace(/<b>/g, "") // <b> 제거
                            .replace(/<\/b>/g, "") + "..."}
                        </Heading>
                      </Box>
                    ))}
                </Stack>
              </CardBody>
            </Card>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

export default GameBoardList;
