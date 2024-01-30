import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { LoginContext } from "../../component/LoginProvider";
import axios from "axios";
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  NotAllowedIcon,
} from "@chakra-ui/icons";

export function GameBoardCommentItem({
  comment,
  onDelete,
  setIsSubmitting,
  isSubmitting,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [commentEdited, setCommentEdited] = useState(comment.comment_content);
  const [replyComment, setReplyComment] = useState("");
  const toast = useToast();
  const { isAuthenticated, hasAccess, isAdmin } = useContext(LoginContext);

  function handleDuplicateSubmit() {
    setIsSubmitting(true);

    axios
      .post("/api/comment/add/" + comment.game_board_id, {
        parent_id: comment.id,
        comment_content: replyComment,
        game_board_id: comment.game_board_id,
        member_id: comment.member_id,
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
    <Flex
      justifyContent={"flex-start"}
      alignItems={"center"}
      ml={`${comment.depth * 20}px`}
    >
      <Image
        borderRadius={"full"}
        boxSize={"70px"}
        src={comment.file_url}
        alt="프로필 이미지"
      ></Image>

      <Box w={"100%"} ml={"10px"}>
        <Flex justifyContent="space-between">
          <Heading fontSize="1.2rem">{comment.member_id}</Heading>
          <Text fontSize="1rem">{comment.ago}</Text>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Box flex={1}>
            <Text sx={{ whiteSpace: "pre-wrap" }} pt="2" fontSize="1rem">
              {comment.comment_content}
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
                  placeholder={"댓글을 입력 해주세요."}
                />
                <Button
                  colorScheme="blue"
                  isDisabled={isSubmitting}
                  onClick={handleDuplicateSubmit}
                  글
                >
                  댓글-댓글 저장
                </Button>
              </Box>
            )}
          </Box>

          <Box>
            {isAuthenticated() && (
              <>
                {isWriting || (
                  <Button
                    size="xs"
                    colorScheme="green"
                    onClick={() => setIsWriting(true)}
                  >
                    <AddIcon />
                  </Button>
                )}
                {isWriting && (
                  <Button
                    size="xs"
                    colorScheme="gray"
                    onClick={() => setIsWriting(false)}
                  >
                    <NotAllowedIcon />
                  </Button>
                )}
              </>
            )}
          </Box>

          {(hasAccess(comment.member_id) || isAdmin()) && (
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
          )}
        </Flex>
      </Box>
    </Flex>
  );
}
