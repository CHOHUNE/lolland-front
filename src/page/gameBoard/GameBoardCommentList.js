import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  StackDivider,
} from "@chakra-ui/react";
import { GameBoardCommentItem } from "./GameBoardCommentItem";
import React from "react";

export function GameBoardCommentList({
  commentList,
  onDelete,
  setIsSubmitting,
}) {
  return (
    <Card mt={"50px"} boxShadow={"md"}>
      <CardHeader>
        <Heading size="md">댓글 리스트</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {commentList.map((comment) => (
            <GameBoardCommentItem
              key={comment.id}
              isSubmitting={false}
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
