import { Box, Button, Textarea } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";

export function CommentForm() {
  const [comment, setComment] = useState("");

  const { gear_id } = useParams();
  function handleSubmit() {
    axios.post("/api/gearboard/addcomment", {
      gear_id: gear_id,
      comment: comment,
    });
  }

  return (
    <Box>
      <h1>댓글폼</h1>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button onClick={handleSubmit}>쓰기</Button>
    </Box>
  );
}
