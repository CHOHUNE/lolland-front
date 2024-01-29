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
  HStack,
  Image,
  Input,
  Select,
  SimpleGrid,
  Spacer,
  Spinner,
  Stack,
  StackDivider,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
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
  faEye,
  faImage,
  faSearch,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoginContext } from "../../component/LoginProvider";
import { AddIcon, ChatIcon, StarIcon } from "@chakra-ui/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination as SwiperPagination } from "swiper/modules";
import YouTube from "react-youtube";

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

  return (
    <Flex mt={"10px"}>
      <Box>
        <Select
          defaultValue="default"
          w={"120px"}
          onChange={(e) => setSortBy(e.target.value)}
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
      <Input
        ml={2}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <Button onClick={handleSearch} {...buttonStyle}>
        검색
      </Button>
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

  const [pc, setPc] = useState(null);
  const [console, setConsole] = useState(null);
  const [mobile, setMobile] = useState(null);

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

  // top, today, notice

  useEffect(() => {
    axios
      .get("/api/gameboard/list/top")
      .then((response) => setTop(response.data));
    axios
      .get("/api/gameboard/list/today")
      .then((response) => setToday(response.data));

    axios
      .get("/api/gameboard/list/notice")
      .then((response) => setNotice(response.data));
  }, []);

  // 기사
  useEffect(() => {
    axios.get("/api/gameboard/pc").then((response) => {
      setPc(response.data);

      axios.get("/api/gameboard/console").then((response) => {
        setConsole(response.data);
      });

      axios.get("/api/gameboard/mobile").then((response) => {
        setMobile(response.data);
      });
    });
  }, []);

  const opts = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 0,
    },
  };

  // TODO : 유튜브 할당량 제한으로 잠시 주석 처리

  const [searchedVideos, setSearchedVideos] = useState([]);

  // useEffect(() => {
  //   const params = {
  //     key: process.env.REACT_APP_YOUTUBE_API_KEY,
  //     q: "게임 리뷰",
  //     part: "snippet",
  //     type: "video",
  //     maxResults: 4,
  //     fields: "items(id, snippet(title))",
  //     videoEmbeddable: true,
  //   };
  //
  //   axios
  //     .get("https://www.googleapis.com/youtube/v3/search", {
  //       params,
  //     })
  //     .then((response) => {
  //       const videos = response.data.items.map((item) => {
  //         return {
  //           videoId: item.id.videoId,
  //           title: item.snippet.title,
  //         };
  //       });
  //
  //       setSearchedVideos(videos);
  //     });
  // }, []);

  // 각 카테고리에 대한 색상 매핑
  const categoryColors = {
    "리그 오브 레전드": "green",
    "로스트 아크": "blue",
    "콘솔 게임": "purple",
    "모바일 게임": "orange",
    기타: "gray",
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
            {/*추가 할 부분 */}

            <SimpleGrid
              columns={3}
              spacing={4}
              w={"80%"}
              h={"800px"}
              mb={"30px"}
              ml={"2.5%"}
            >
              {top &&
                top.map((topTen) => (
                  <Box
                    w="90%"
                    h={"100%"}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    boxSizing="content-box"
                    shadow={"1px 1px 3px 1px #dadce0"}
                  >
                    <Box
                      position="relative"
                      w={"100%"}
                      h={"75%"}
                      style={{ overflow: "hidden" }}
                    >
                      <Swiper
                        slidesPerView={1}
                        pagination={{
                          clickable: true,
                        }}
                        modules={[Navigation, SwiperPagination]}
                        className="mySwiper"
                      >
                        {topTen.files.map((file) => (
                          <SwiperSlide key={file.id}>
                            <Image
                              src={file.file_url}
                              alt={file.file_name}
                              objectFit={"cover"}
                              boxSize={"100%"}
                              css={{
                                transition: "transform 0.3s ease-in-out", // 변환 애니메이션 적용
                                "&:hover": {
                                  transform: "scale(1.1)", // 확대 효과
                                },
                              }}
                              onClick={() =>
                                navigate("/gameboard/id/" + topTen.id)
                              }
                              _hover={{ cursor: "pointer" }}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </Box>

                    <Box p="5">
                      <Box display="flex" alignItems="baseline">
                        <Badge
                          borderRadius="full"
                          style={{ fontSize: "1.2em" }}
                          colorScheme={categoryColors[topTen.category]}
                        >
                          {topTen.category}
                        </Badge>
                        <Badge
                          colorScheme="green"
                          variant="outline"
                          mx={"2px"} // Adjusted spacing around Badge
                          fontWeight={"bold"}
                          borderRadius={"full"}
                          style={{ fontSize: "1.2em" }}
                          bgColor={`rgba(0, 128, 0, ${topTen.count_like / 10})`}
                        >
                          {topTen.count_like}
                          <FontAwesomeIcon icon={faThumbsUp} />
                        </Badge>
                        <Text color={"grey"} ml={"2%"}>
                          {new Date(topTen.reg_time).toLocaleDateString(
                            "ko-KR",
                            {
                              year: "2-digit",
                              month: "2-digit",
                              day: "2-digit",
                            },
                          )}
                        </Text>
                        <Spacer />
                        <Box display="flex">
                          {topTen.count_comment !== 0 && (
                            <Badge
                              colorScheme={"green"}
                              variant="outline"
                              mx={"2%"}
                              borderRadius={"full"}
                              style={{ fontSize: "1.1em" }}
                            >
                              {topTen.count_comment}
                              <ChatIcon />
                            </Badge>
                          )}

                          {topTen.countFile !== 0 && (
                            <Badge
                              mx={"2%"}
                              borderRadius="full"
                              style={{ fontSize: "1.1em" }}
                            >
                              {topTen.countFile}
                              <FontAwesomeIcon icon={faImage} />
                            </Badge>
                          )}
                          {topTen.countFile !== 0 && (
                            <Badge
                              mx={"2%"}
                              borderRadius="full"
                              style={{ fontSize: "1.1em" }}
                            >
                              {topTen.board_count}
                              <FontAwesomeIcon icon={faEye} />
                            </Badge>
                          )}
                        </Box>
                      </Box>

                      <Box
                        mt="1"
                        fontWeight="semibold"
                        as="h4"
                        lineHeight="tight"
                        noOfLines={1}
                        fontSize={"1.2rem"}
                        display={"flex"}
                        onClick={() => navigate("/gameboard/id/" + topTen.id)}
                        _hover={{ cursor: "pointer" }}
                      >
                        {topTen.title}
                        <Spacer />
                        {topTen.member_id}
                      </Box>

                      <Box display="flex" mt="2" alignItems="center"></Box>
                    </Box>
                  </Box>
                ))}
            </SimpleGrid>

            {/* 그 외의 게시물 게시판 */}
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
                  onClick={() => navigate("?k=기타")}
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
                <Pagination pageInfo={pageInfo} />
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
          <Card>
            <CardHeader size={"md"}>
              <Heading fontSize={"1.5rem"} textAlign={"center"} p={"20px"}>
                실시간 인기 게임 영상
              </Heading>
            </CardHeader>
            <CardBody>
              <div
                style={{
                  margin: 20,
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  width: "100%",
                }}
              >
                <Swiper
                  slidesPerView={1}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[Navigation, SwiperPagination]}
                  className="mySwiper"
                >
                  {searchedVideos &&
                    searchedVideos.map((item) => (
                      <SwiperSlide key={item.videoId}>
                        <Box key={item.videoId}>
                          <YouTube videoId={item.videoId} opts={opts} />
                          <div style={{ width: 400 }}>
                            {item.title.replace(/&QUOT;/gi, '"')}
                          </div>
                        </Box>
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>
            </CardBody>
          </Card>
          <br />
          <Box>
            <Divider orientation="horizontal" color={"orange"} />

            <Card shadow={"1px 1px 3px 1px #dadce0"}>
              <Heading fontSize={"1.5rem"} textAlign={"center"} p={"20px"}>
                게임 관련 기사
              </Heading>
              <Tabs isFitted variant={"enclosed"}>
                <CardHeader>
                  <TabList>
                    <Tab fontSize={"1.1rem"} fontWeight={"bold"}>
                      PC 게임
                    </Tab>
                    <Tab fontSize={"1.1rem"} fontWeight={"bold"}>
                      Console 게임
                    </Tab>
                    <Tab fontSize={"1.1rem"} fontWeight={"bold"}>
                      Mobile 게임
                    </Tab>
                  </TabList>
                </CardHeader>

                <CardBody>
                  <TabPanels>
                    <TabPanel>
                      <Stack divider={<StackDivider />} spacing="4">
                        {pc &&
                          pc.items !== null &&
                          pc.items.map((news) => (
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
                    </TabPanel>
                    <TabPanel>
                      <Stack divider={<StackDivider />} spacing="4">
                        {console &&
                          console.items !== null &&
                          console.items.map((news) => (
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
                    </TabPanel>
                    <TabPanel>
                      <Stack divider={<StackDivider />} spacing="4">
                        {mobile &&
                          mobile.items !== null &&
                          mobile.items.map((news) => (
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
                    </TabPanel>
                  </TabPanels>
                </CardBody>
              </Tabs>
            </Card>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

export default GameBoardList;
