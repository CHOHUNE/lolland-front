import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
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

function LikeContainer({ like, onClick }) {
  const { isAuthenticated, isAdmin, hasAccess } = useContext(LoginContext);

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

export function GameBoardView(props) {
  const [board, setBoard] = useState(null);
  const [like, setLike] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated, hasAccess, isAdmin } = useContext(LoginContext);

  useEffect(() => {
    axios.get("/api/gameboard/id/" + id).then((response) => {
      setBoard(response.data);
    });
  }, [id]);

  useEffect(() => {
    axios
      .get("/api/like/gameboard/" + id)
      .then((response) => setLike(response.data));
  }, [id]);

  function handleDelete() {
    axios
      .delete("/api/gameboard/remove/" + id)
      .then((response) => {
        toast({
          description: id + "번 게시물 삭제 완료",
          status: "success",
        });
        navigate(-1);
      })
      .catch((error) => {
        toast({
          description: "실패",
          status: "error",
        });
      });
  }

  function handleLike() {
    axios
      .post("/api/like", { game_board_id: board.id })
      .then((response) => setLike(response.data))
      .catch(() =>
        toast({
          description: "로그인 후 이용 해주세요.",
          status: "error",
        }),
      )
      .finally(() => console.log("done"));
  }

  if (board === null) {
    return <Spinner />;
  }

  return (
    <Center>
      <VStack spacing={6} align="start" w="50%" px={4}>
        <HStack spacing={2} w="100%" justify="space-between">
          <Button onClick={() => navigate(-1)}>이전</Button>
          <Spacer />

          {(hasAccess(board.member_id) || isAdmin()) && (
            <>
              <Button
                colorScheme="purple"
                onClick={() => navigate("/gameboard/edit/" + id)}
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
        <GameBoardCommentContainer />
      </VStack>
    </Center>
  );
}

export default GameBoardView;
