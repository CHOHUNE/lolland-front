import { Box, Button, Textarea, useToast } from "@chakra-ui/react";
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
      <h1>댓글폼</h1>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button onClick={handleSubmitt}>쓰기</Button>
    </Box>
  );
}
