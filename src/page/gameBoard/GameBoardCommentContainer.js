import React, { useEffect, useState } from "react";
import { Box, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { GameBoardCommentForm } from "./GameBoardCommentForm";
import { GameBoardCommentList } from "./GameBoardCommentList";

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
      .post("/api/comment/add/" + id, {
        game_board_id: id,
        comment_content: comment.comment,
        parent_id: null,
        member_id: comment.member_id,
      })
      .then(() => {
        toast({
          description: "등록 성공",
          status: "success",
        });
      })
      .catch(() => {
        toast({
          description: "로그인 후 이용 해주세요.",
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
    <Box w={"100%"} my={"50px"}>
      <GameBoardCommentForm
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
      <GameBoardCommentList
        commentList={commentList}
        setIsSubmitting={setIsSubmitting}
        onDelete={handleDelete}
      />
    </Box>
  );
}

export default GameBoardCommentContainer;
