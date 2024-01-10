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
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";

function CommentForm({ isSubmitting, onSubmit }) {
  const [comment, setComment] = useState("");
  const { id } = useParams();

  function handleSubmit() {
    onSubmit({ id, comment });
  }

  return (
    <Box>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button isDisabled={isSubmitting} onClick={handleSubmit}>
        쓰기
      </Button>
    </Box>
  );
}

function CommentList({ commentList, onDelete, isSubmitting }) {
  return (
    <Card>
      <CardHeader>
        <Heading size={"md"}>댓글 리스트</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing={"4"}>
          {commentList.map((comment) => (
            <Box key={comment.id}>
              <Flex justifyContent={"space-between"}>
                <Heading size={"xs"}>{comment.id}</Heading>
                <Text fontSize={"xs"}>{comment.reg_time}</Text>
              </Flex>

              <Flex justifyContent="space-between" alignItems="center">
                <Text sx={{ whiteSpace: "pre-wrap" }} pt="2" fontSize="sm">
                  {comment.comment_content}
                </Text>
                <Button
                  isDisabled={isSubmitting}
                  onClick={() => onDelete(comment.id)}
                  size="xs"
                  colorScheme="red"
                >
                  <DeleteIcon />
                </Button>
              </Flex>
            </Box>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

export function GameBoardCommentContainer({ gameboardId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    axios
      .get("/api/comment/list/" + id)
      .then((response) => setCommentList(response.data));
  }, [id, isSubmitting]);

  function handleSubmit(comment) {
    setIsSubmitting(true);

    axios
      .post("/api/comment/add", {
        game_board_id: comment.id,
        comment_content: comment.comment,
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  function handleDelete(id) {
    setIsSubmitting(true);

    axios
      .delete("/api/comment/" + id)
      .then(() => {
        toast({
          description: "삭제 성공",
          status: "success",
        });
      })
      .catch(() => {
        toast({
          description: "실패",
          status: "error",
        });
      })
      .finally(() => setIsSubmitting(false));
  }

  return (
    <Box>
      <CommentForm
        gameBoardId={id}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
      <CommentList
        gameBoardId={id}
        commentList={commentList}
        isSubmitting={isSubmitting}
        onDelete={handleDelete}
      />
    </Box>
  );
}

export default GameBoardCommentContainer;
