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
  Select,
  SimpleGrid,
  Spacer,
  Spinner,
  Stack,
  StackDivider,
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
import { faCaretDown, faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoginContext } from "../../component/LoginProvider";
import { ChatIcon } from "@chakra-ui/icons";
import { GameBoardPagination } from "./GameBoardPagination";
import { SearchComponent } from "./SearchComponent";
import { GameBoardListArticle } from "./GameBoardListArticle";
import { GameBoardListYouTube } from "./GameBoardListYouTube";
import { GameBoardListTop6 } from "./GameBoardListTop6";

function GameBoardList() {
  const [gameBoardList, setGameBoardList] = useState(null);
  const [notice, setNotice] = useState(null);
  const [today, setToday] = useState(null);

  const [params] = useSearchParams();
  const [pageInfo, setPageInfo] = useState(null);
  const [sortBy, setSortBy] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useContext(LoginContext);
  const toast = useToast();

  useEffect(() => {
    // params.set("s", sortBy);

    axios.get("/api/gameboard/list?" + params).then((response) => {
      setGameBoardList(response.data.gameBoardList);
      setPageInfo(response.data.pageInfo);
    });
  }, [location, isAuthenticated, sortBy]);

  useEffect(() => {
    params.set("s", sortBy);
    navigate("/gameboard/list?" + params);
  }, [sortBy]);

  // today, notice
  useEffect(() => {
    axios
      .get("/api/gameboard/list/today")
      .then((response) => setToday(response.data));

    axios
      .get("/api/gameboard/list/notice")
      .then((response) => setNotice(response.data));
  }, []);

  // 각 카테고리에 대한 색상 매핑
  const categoryColors = {
    "리그 오브 레전드": "green",
    "로스트 아크": "blue",
    "콘솔 게임": "purple",
    "모바일 게임": "orange",
    자유: "gray",
  };

  if (gameBoardList === null || pageInfo === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Flex>
        <Center w={"100%"}>
          <VStack w={"100%"} ml={"10%"}>
            <Heading as="h2" size="lg" my={"15px"}>
              BEST 게시판
            </Heading>
            {/*TOP6 삽입 부분*/}
            <GameBoardListTop6 />
            <Center>
              <Heading as="h2" size="lg" my={"15px"}>
                일반 게시물
              </Heading>
            </Center>

            <Flex w={"80%"}>
              <ButtonGroup
                variant={"ouline"}
                spacing={"6"}
                border={"1px solid whitesmoke"}
                my={"1%"}
                mt={"15px"}
                w={"100%"}
                shadow={"1px 1px 3px 1px #dadce0"}
              >
                <Button
                  onClick={() => navigate("")}
                  _hover={{ bgColor: "whitesmoke", color: "black" }}
                >
                  전체
                </Button>

                <Button
                  onClick={() => navigate("?k=리그 오브 레전드")}
                  _hover={{ bgColor: "whitesmoke", color: "black" }}
                >
                  리그 오브 레전드
                </Button>
                <Button
                  onClick={() => navigate("?k=로스트 아크")}
                  _hover={{ bgColor: "whitesmoke", color: "black" }}
                >
                  로스트 아크
                </Button>
                <Button
                  onClick={() => navigate("?k=콘솔 게임")}
                  _hover={{ bgColor: "whitesmoke", color: "black" }}
                >
                  콘솔 게임
                </Button>
                <Button
                  onClick={() => navigate("?k=모바일 게임")}
                  _hover={{ bgColor: "whitesmoke", color: "black" }}
                >
                  모바일 게임
                </Button>
                <Button
                  onClick={() => navigate("?k=자유")}
                  _hover={{ bgColor: "whitesmoke", color: "black" }}
                >
                  자유
                </Button>
                <Spacer />
                <Stack spacing={3}>
                  <Select
                    variant={"outline"}
                    placeholder={"정렬"}
                    onChange={(e) => {
                      const selectedValue = e.target.value;

                      // 정렬 기준에 따라 상태 업데이트
                      if (selectedValue === "조회수") {
                        setSortBy((prevSortBy) =>
                          prevSortBy === "board_count" ? "" : "board_count",
                        );
                      } else if (selectedValue === "추천") {
                        setSortBy((prevSortBy) =>
                          prevSortBy === "count_like" ? "" : "count_like",
                        );
                      } else if (selectedValue === "날짜") {
                        setSortBy("");
                        params.set("s", sortBy);
                        navigate("/gameboard/list?" + params);
                      }
                    }}
                  >
                    <option value="조회수">조회수</option>
                    <option value="추천">추천</option>
                    <option value="날짜">날짜</option>
                    {/* 다른 정렬 기준이 추가될 경우 option 추가 */}
                  </Select>
                </Stack>

                <Button
                  _hover={{ bgColor: "whitesmoke", color: "black" }}
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
              </ButtonGroup>
            </Flex>

            <Center w={"100%"}>
              <TableContainer w={"80%"} shadow={"1px 1px 3px 1px #dadce0"}>
                <Table size="sm" border={"1px solid whitesmoke"}>
                  <Thead>
                    <Tr>
                      <Th
                        w="5%"
                        textAlign={"center"}
                        cursor={"pointer"}
                        onClick={() => {
                          setSortBy((prevSortBy) =>
                            prevSortBy === "count_like" ? "" : "count_like",
                          );
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
                          setSortBy((prevSortBy) =>
                            prevSortBy === "board_count" ? "" : "board_count",
                          );
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
                            <Badge
                              colorScheme={categoryColors[noticies.category]}
                            >
                              {noticies.category}
                            </Badge>
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
                            <Badge colorScheme={categoryColors[board.category]}>
                              {board.category}
                            </Badge>
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
              <VStack>
                <SearchComponent />
                <GameBoardPagination pageInfo={pageInfo} />
              </VStack>
            </Center>
          </VStack>
        </Center>

        <Box w={"25%"} margin={"15px auto"} mr={"5%"}>
          <Card shadow={"1px 1px 3px 1px #dadce0"}>
            <CardHeader>
              <Heading fontSize={"1.5rem"} textAlign={"center"}>
                오늘의 BEST 게시물
              </Heading>
            </CardHeader>

            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                {today &&
                  today.map((todayPost, index) => (
                    <Box key={todayPost.id}>
                      <Flex align={"center"}>
                        <Badge
                          variant={"subtle"}
                          colorScheme={"green"}
                          mr={"2"}
                        >
                          {" "}
                          {index + 1} 위{" "}
                        </Badge>
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
                      </Flex>
                    </Box>
                  ))}
              </Stack>
            </CardBody>
          </Card>
          <br />
          <br />
          {/*<GameBoardListYouTube />*/}
          {/*TODO : 할당량 초과시 주석 처리*/}
          <br />
          <Box>
            <Divider orientation="horizontal" color={"orange"} />
            <GameBoardListArticle />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

export default GameBoardList;
