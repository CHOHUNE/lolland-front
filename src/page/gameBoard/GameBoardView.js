import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Spinner,
  Image,
  useToast,
  VStack,
  Heading,
  Text,
  Spacer,
  Flex,
  Badge,
  AccordionPanel,
  AccordionIcon,
  Accordion,
  AccordionItem,
  AccordionButton,
  TabPanel,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  Card,
  Table,
  Th,
  Tr,
  TableCaption,
  Tbody,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import GameBoardCommentContainer from "./GameBoardCommentContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faComments,
  faEye,
  faHeart as fullHeart,
} from "@fortawesome/free-solid-svg-icons";
import { LoginContext } from "../../component/LoginProvider";
import { useNavigate, useParams } from "react-router-dom";

async function fetchBoardData(
  id,
  setBoard,
  setLike,
  setWritten,
  setWriterInfo,
) {
  try {
    const boardResponse = await axios.get(`/api/gameboard/id/${id}`);
    setBoard(boardResponse.data);

    const likeResponse = await axios.get(`/api/like/gameboard/${id}`);
    setLike(likeResponse.data);

    if (boardResponse.data !== null) {
      const writtenResponse = await axios.get(
        `/api/gameboard/list/written/post/${boardResponse.data.member_id}`,
      );
      setWritten(writtenResponse.data);

      const writerInfoResponse = await axios.get(
        `/api/gameboard/list/info/${boardResponse.data.member_id}`,
      );
      setWriterInfo(writerInfoResponse.data);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function LikeContainer({ like, onClick }) {
  const { isAuthenticated } = useContext(LoginContext);

  if (like === null) {
    return <Spinner />;
  }

  return (
    <HStack spacing={2} align="center">
      <Button
        variant="outline"
        colorScheme="blue"
        size="md"
        onClick={onClick}
        isDisabled={!isAuthenticated()}
      >
        {like.like ? (
          <FontAwesomeIcon icon={fullHeart} />
        ) : (
          <FontAwesomeIcon icon={emptyHeart} />
        )}
        좋아요
      </Button>
      <Text fontSize="md">{like.countLike}</Text>
    </HStack>
  );
}

export function GameBoardView() {
  const [board, setBoard] = useState(null);
  const [like, setLike] = useState(null);
  const [written, setWritten] = useState(null);
  const [writerInfo, setWriterInfo] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated, hasAccess, isAdmin } = useContext(LoginContext);

  useEffect(() => {
    const fetchData = async () => {
      await fetchBoardData(id, setBoard, setLike, setWritten, setWriterInfo);
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/gameboard/remove/${id}`);
      toast({
        description: `${id}번 게시물 삭제 완료`,
        status: "success",
      });
      navigate(-1);
    } catch (error) {
      toast({
        description: "실패",
        status: "error",
      });
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.post("/api/like", {
        game_board_id: board.id,
      });
      setLike(response.data);
    } catch (error) {
      toast({
        description: "로그인 후 이용 해주세요.",
        status: "error",
      });
    } finally {
      console.log("done");
    }
  };

  if (board === null) {
    return <Spinner />;
  }

  return (
    <Center>
      <VStack spacing={6} align="start" w="35%" px={4}>
        <HStack spacing={2} w="100%" justify="space-between">
          <Button onClick={() => navigate(-1)}>이전</Button>
          <Spacer />

          {(hasAccess(board.member_id) || isAdmin()) && (
            <>
              <Button
                colorScheme="purple"
                onClick={() => navigate(`/gameboard/edit/${id}`)}
              >
                수정
              </Button>
              <Button onClick={handleDelete} colorScheme="red">
                삭제
              </Button>
            </>
          )}
        </HStack>
        <Flex w="100%" justify="space-between">
          <Heading size="xl">{board.title}</Heading>
          <Spacer />
          <LikeContainer like={like} onClick={handleLike} />
        </Flex>
        <Divider />
        <HStack spacing={2} w="100%" justify="space-between">
          <Text fontSize="md" fontWeight="bold">
            작성자: {board.member_id}
          </Text>
          <Badge>
            <FontAwesomeIcon icon={faComments} />
            {board.count_comment}
          </Badge>
          <Badge>
            <FontAwesomeIcon icon={faEye} />
            {board.board_count}
          </Badge>
          <Spacer />
          <Text fontSize="md" fontWeight="bold">
            작성일: {new Date(board.reg_time).toLocaleString()}
          </Text>
        </HStack>

        <Divider my={4} />
        <Text fontSize="lg">{board.board_content}</Text>
        {board.files.map((file) => (
          <Image
            key={file.id}
            src={file.file_url}
            alt={file.file_name}
            borderRadius="md"
            boxSize="100%"
            my={4}
          />
        ))}

        <Accordion allowMultiple w="100%" as="span" isLazy defaultIndex={[0]}>
          <AccordionItem>
            <h2>
              <AccordionButton _expanded={{ bg: "whitesmoke", color: "black" }}>
                <Box
                  as="span"
                  flex="1"
                  textAlign="left"
                  width="100%"
                  paddingX={2}
                  paddingY={2}
                >
                  {board.member_id}의 정보
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Flex gap="20px" align="center">
                <Image
                  borderRadius="full"
                  boxSize="100px"
                  src="https://bit.ly/dan-abramov"
                  alt="tempProfileImg"
                />

                {writerInfo && (
                  <div>
                    <br />
                    닉네임: {writerInfo.member_name}
                    <br />
                    이메일: {writerInfo.member_email}
                    <br />
                    연락처: {writerInfo.member_phone_number}
                    <br />
                    <br />
                  </div>
                )}
              </Flex>

              <Tabs isFitted variant="enclosed">
                <TabList mb="1em">
                  <Tab>최근 글</Tab>
                  <Tab>최근 댓글</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    {written && (
                      <TableContainer>
                        <Table variant="simple">
                          <TableCaption></TableCaption>

                          <Tbody>
                            {written.map((posties) => (
                              <Tr
                                key={posties.id}
                                onClick={() => {
                                  navigate(`/gameboard/id/${posties.id}`);
                                  window.scrollTo(0, 0);
                                }}
                                _hover={{ cursor: "pointer" }}
                              >
                                <TableCaption>{posties.title}</TableCaption>
                                <Divider />
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    )}
                  </TabPanel>
                  <TabPanel></TabPanel>
                  <TabPanel></TabPanel>
                </TabPanels>
              </Tabs>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        <GameBoardCommentContainer />
      </VStack>
    </Center>
  );
}

export default GameBoardView;
