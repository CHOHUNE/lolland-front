import React, { useContext, useEffect, useState } from "react";
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
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  NotAllowedIcon,
} from "@chakra-ui/icons";

// 댓글 작성 폼
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

// ---------------코멘트 아이템 -------------------------- 개별 댓글 - 수정 및 삭제 기능
function CommentItem({ comment, onDelete, setIsSubmitting, isSubmitting }) {
  // const hasAccess = useContext(LoginContext);

  const [isEditing, setIsEditing] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [commentEdited, setCommentEdited] = useState(comment.comment_content);
  const [duplicateReplyComment, setDuplicateReplyComment] = useState(null);
  const [replyComment, setReplyComment] = useState();
  const toast = useToast();

  function handleDuplicateSubmit() {
    console.log(comment.id);
    console.log(comment.game_board_id);

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
        if (error.response.status === 401 || error.response.status === 403) {
          toast({ description: "실패", status: "error" });
        }
        if (error.response.status === 400) {
          toast({
            description: "입력 값 확인",
            status: "warning",
          });
        }
      })
      .finally(() => {
        setIsSubmitting(false);
        setIsWriting(false);
        // setReplyComment(null);
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
        if (error.response.status === 401 || error.response.status === 403) {
          toast({ description: "실패", status: "error" });
        }
        if (error.response.status === 400) {
          toast({
            description: "입력 값 확인",
            status: "warning",
          });
        }
      })
      .finally(() => {
        setIsSubmitting(false);
        setIsEditing(false);
      });
  }

  return (
    <Box>
      <Flex justifyContent="space-between">
        <Heading size="xs">{comment.id}</Heading>
        <Text fontSize="xs">{comment.reg_time}</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Box flex={1}>
          <Text sx={{ whiteSpace: "pre-wrap" }} pt="2" fontSize="sm">
            {comment.comment_content}
          </Text>
          {isEditing && (
            <Box>
              <Textarea
                value={replyComment}
                onChange={(e) => setCommentEdited(e.target.value)}
              />
              <Button
                colorScheme={"blue"}
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
                colorScheme={"blue"}
                isDisabled={isSubmitting}
                onClick={handleDuplicateSubmit}
              >
                댓글-댓글 저장
              </Button>
            </Box>
          )}
        </Box>

        {/*{hasAccess(comment.memberId) && (*/}

        {isWriting || (
          <Box>
            <Button
              size={"xs"}
              colorScheme={"green"}
              onClick={() => setIsWriting(true)}
            >
              <AddIcon />
            </Button>
          </Box>
        )}
        {isWriting && (
          <Box>
            <Button
              size={"xs"}
              colorScheme={"gray"}
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
        {/*)}*/}
      </Flex>
    </Box>
  );
}

//  코멘트 아이템 끝 -------------------------------

// 여러개의 댓글 - CommentList
function CommentList({ commentList, onDelete, isSubmitting, setIsSubmitting }) {
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
              isSubmitting={isSubmitting}
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

// ------------------------------코멘트 컨테이너 ----------------------- 최상위 컨테이너
export function GameBoardCommentContainer() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    axios
      .get("/api/comment/list/" + id)
      .then((response) => setCommentList(response.data));
  }, [isSubmitting]);

  function handleSubmit(comment) {
    setIsSubmitting(true);

    axios
      .post("/api/comment/add", {
        game_board_id: comment.id,
        comment_content: comment.comment,
        parent_id: comment.parent_id,
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
        setIsSubmitting={setIsSubmitting}
        isSubmitting={isSubmitting}
        onDelete={handleDelete}
      />
    </Box>
  );
}

export default GameBoardCommentContainer;
