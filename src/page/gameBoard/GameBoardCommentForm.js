import React, { useContext, useState } from "react";
import { LoginContext } from "../../component/LoginProvider";
import { Box, Button, Textarea, Tooltip } from "@chakra-ui/react";

export function GameBoardCommentForm({ isSubmitting, onSubmit }) {
  const [comment, setComment] = useState("");
  const { isAuthenticated } = useContext(LoginContext);

  function handleSubmit() {
    if (!comment.trim()) {
      // If the comment is empty or contains only whitespace, don't submit
      return;
    }
    onSubmit({ comment });
    setComment(""); // Clear the input field after submission
  }

  return (
    <Box display="flex" alignItems="center">
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        width="100%"
        padding={2}
        borderRadius="md"
        boxShadow="md"
        height="auto" // 자동으로 높이 조절
        placeholder={"댓글을 입력 해주세요."}
      />
      <Tooltip isDisabled={!isAuthenticated()} hasArrow label="로그인 하세요">
        <Button
          isDisabled={isSubmitting}
          onClick={handleSubmit}
          marginLeft={2}
          paddingX={4}
          height="80px"
          width={"80px"}
        >
          쓰기
        </Button>
      </Tooltip>
    </Box>
  );
}
