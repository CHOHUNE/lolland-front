import { Box } from "@chakra-ui/react";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";

export function GearCommentContainer() {
  return (
    <Box>
      <CommentList />
      <CommentForm />
    </Box>
  );
}
