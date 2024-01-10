import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Text,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function CommentForm({ gameBoardId }) {
  const [comment, setComment] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  function hadleSubmit() {
    axios
      .post("/api/comment/add", {
        game_board_id: id,
        comment_content: comment,
      })
      .then(() => navigate(0));
  }

  return (
    <Box>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button onClick={hadleSubmit}> 쓰기 </Button>
    </Box>
  );
}

function CommentList({ gameBoardId }) {
  const [commentList, setCommentList] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    // const params = new URLSearchParams();
    // params.set("id", gameBoardId);
    axios
      .get("/api/comment/list/" + id)
      .then((response) => setCommentList(response.data));
  }, []);
  return (
    <Card>
      <CardHeader>
        <Heading size={"md"}> 댓글 리스트</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing={"4"}>
          {commentList.map((comment) => (
            <Box>
              <Flex justifyContent={"space-between"}>
                <Heading size={"xs"}>{comment.id}</Heading>
                <Text fontSize={"xs"}>{comment.reg_time}</Text>
              </Flex>
              <Text sx={{ whiteSpace: "pre-wrap" }} pt="2" fontSize={"sm"}>
                {comment.comment_content}
              </Text>
            </Box>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

export function GameBoardCommentContainer({ gameBoardId }) {
  return (
    <Box>
      <CommentForm gameBoardId={gameBoardId} />
      <CommentList gameBoardId={gameBoardId} />
    </Box>
  );
}

export default GameBoardCommentContainer;
