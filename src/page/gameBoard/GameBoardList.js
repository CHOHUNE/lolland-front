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
  const [pageInfo, setPageInfo] = useState(null);
  const [sortBy, setSortBy] = useState("");

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();
  const { isAuthenticated } = useContext(LoginContext);
  const toast = useToast();
  const [notice, setNotice] = useState(null);
  const [top, setTop] = useState(null);

  useEffect(() => {
    // params.set("s", sortBy);

    console.log({ sortBy });
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
                오늘의 BEST
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
              <Heading size="md">자유게시판 BEST(추천순)</Heading>
            </CardHeader>

            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Summary
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    View a summary of all your clients over the last month.
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Overview
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    Check out the overview of your clients.
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Analysis
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    See a detailed analysis of all your business clients.
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Analysis
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    See a detailed analysis of all your business clients.
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Analysis
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    See a detailed analysis of all your business clients.
                  </Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>
          <br />
          <br />
          <br />
          <Box>
            <Heading size="md">최신 공식 기사</Heading>
            <br />
            <Divider orientation="horizontal" color={"orange"} />
            <Flex>
              <Card maxW="sm">
                <CardBody>
                  <Image
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                    alt="Green double couch with wooden legs"
                    borderRadius="lg"
                  />
                  <Stack mt="6" spacing="3">
                    <Heading size="md">Living room Sofa</Heading>
                  </Stack>
                </CardBody>
              </Card>
              <Card maxW="sm">
                <CardBody>
                  <Image
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                    alt="Green double couch with wooden legs"
                    borderRadius="lg"
                  />
                  <Stack mt="6" spacing="3">
                    <Heading size="md">Living room Sofa</Heading>
                  </Stack>
                </CardBody>
              </Card>
            </Flex>
            <Flex>
              <Card maxW="sm">
                <CardBody>
                  <Image
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                    alt="Green double couch with wooden legs"
                    borderRadius="lg"
                  />
                  <Stack mt="6" spacing="3">
                    <Heading size="md">Living room Sofa</Heading>
                  </Stack>
                </CardBody>
              </Card>
              <Card maxW="sm">
                <CardBody>
                  <Image
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                    alt="Green double couch with wooden legs"
                    borderRadius="lg"
                  />
                  <Stack mt="6" spacing="3">
                    <Heading size="md">Living room Sofa</Heading>
                  </Stack>
                </CardBody>
              </Card>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

export default GameBoardList;
