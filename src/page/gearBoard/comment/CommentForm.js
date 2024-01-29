import { Box, Button, Flex, Input, Textarea, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function CommentForm() {
  const [comment, setComment] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const { gear_id } = useParams();
  function handleSubmitt() {
    axios
      .post("/api/gcomment/add", {
        boardid: gear_id,
        comment: comment,
      })
      .then(() => {
        toast({ description: "댓글이 작성되었습니다.", status: "success" });
        navigate("/gearlistlayout");
      });
  }

  return (
    <Box>
      <br />
      <Flex gap={1}>
        <Input
          placeholder={"칭찬과 격려의 댓글을 작성자에게 큰 힘이 됩니다:)"}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button colorScheme={"orange"} onClick={handleSubmitt}>
          쓰기
        </Button>
      </Flex>
      <br />
    </Box>
  );
}
