import React, { useState, useEffect } from "react";
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
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  NotAllowedIcon,
} from "@chakra-ui/icons";
import { useParams } from "react-router-dom";

function CommentForm({ isSubmitting, onSubmit }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    onSubmit({ comment });
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

function CommentItem({ comment, onDelete, setIsSubmitting, isSubmitting }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [commentEdited, setCommentEdited] = useState(comment.comment_content);
  const [replyComment, setReplyComment] = useState("");
  const toast = useToast();

  function handleDuplicateSubmit() {
    setIsSubmitting(true);

    axios
      .post("/api/comment/add", {
        parent_id: comment.id,
        comment_content: replyComment,
        game_board_id: comment.game_board_id,
      })
      .then(() => {
        toast({ description: "성공", status: "success" });
      })
      .catch((error) => {
        // handle errors
      })
      .finally(() => {
        setIsSubmitting(false);
        setIsWriting(false);
        setReplyComment("");
      });
  }

  function handleEditSubmit() {
    setIsSubmitting(true);

    axios
      .put("/api/comment/edit", {
        id: comment.id,
        comment_content: commentEdited,
      })
      .then(() => {
        toast({ description: "성공", status: "success" });
      })
      .catch((error) => {
        // handle errors
      })
      .finally(() => {
        setIsSubmitting(false);
        setIsEditing(false);
      });
  }

  return (
    <Box ml={`${comment.depth * 20}px`}>
      <Flex justifyContent="space-between">
        <Heading size="xs">
          ID:{comment.id} PID:{comment.parent_id}
        </Heading>
        <Text fontSize="xs">{comment.reg_time}</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Box flex={1}>
          <Text sx={{ whiteSpace: "pre-wrap" }} pt="2" fontSize="sm">
            내용: {comment.comment_content}
          </Text>
          {isEditing && (
            <Box>
              <Textarea
                value={commentEdited}
                onChange={(e) => setCommentEdited(e.target.value)}
              />
              <Button
                colorScheme="blue"
                isDisabled={isSubmitting}
                onClick={handleEditSubmit}
              >
                수정 - 저장
              </Button>
            </Box>
          )}

          {isWriting && (
            <Box>
              <Textarea
                value={replyComment}
                onChange={(e) => setReplyComment(e.target.value)}
              />
              <Button
                colorScheme="blue"
                isDisabled={isSubmitting}
                onClick={handleDuplicateSubmit}
              >
                댓글-댓글 저장
              </Button>
            </Box>
          )}
        </Box>

        {isWriting || (
          <Box>
            <Button
              size="xs"
              colorScheme="green"
              onClick={() => setIsWriting(true)}
            >
              <AddIcon />
            </Button>
          </Box>
        )}
        {isWriting && (
          <Box>
            <Button
              size="xs"
              colorScheme="gray"
              onClick={() => setIsWriting(false)}
            >
              <NotAllowedIcon />
            </Button>
          </Box>
        )}

        <Box>
          {isEditing || (
            <Button
              size="xs"
              colorScheme="purple"
              onClick={() => setIsEditing(true)}
            >
              <EditIcon />
            </Button>
          )}
          {isEditing && (
            <Button
              size="xs"
              colorScheme="gray"
              onClick={() => setIsEditing(false)}
            >
              <NotAllowedIcon />
            </Button>
          )}
          <Button
            onClick={() => onDelete(comment.id)}
            size="xs"
            colorScheme="red"
          >
            <DeleteIcon />
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}

function CommentList({ commentList, onDelete, setIsSubmitting }) {
  return (
    <Card>
      <CardHeader>
        <Heading size="md">댓글 리스트</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {commentList.map((comment) => (
            <CommentItem
              key={comment.id}
              isSubmitting={false} // Assuming isSubmitting is not needed here
              setIsSubmitting={setIsSubmitting}
              comment={comment}
              onDelete={onDelete}
            />
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

export function GameBoardCommentContainer() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const toast = useToast();

  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    axios.get("/api/comment/list/" + id).then((response) => {
      setCommentList(response.data);
    });
  }, [isSubmitting, id]);

  function handleSubmit(comment) {
    setIsSubmitting(true);

    axios
      .post("/api/comment/add", {
        game_board_id: id,
        comment_content: comment.comment,
        parent_id: null,
      })
      .then(() => {
        toast({
          description: "등록 성공",
          status: "success",
        });
      })
      .catch(() => {
        toast({
          description: "실패",
          status: "error",
        });
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
      <CommentForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
      <CommentList
        commentList={commentList}
        setIsSubmitting={setIsSubmitting}
        onDelete={handleDelete}
      />
    </Box>
  );
}

export default GameBoardCommentContainer;
