import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Tag,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { Form, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export function QnaWrite({ setIsWriting, product_id, fetchQna }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  function handleSubmit() {
    axios
      .post("/api/qna/submit", {
        product_id: product_id,
        question_title: title,
        question_content: content,
      })
      .then(() => {
        toast({
          title: "리뷰가 성공적으로 등록되었습니다",
          description:
            "판매자가 답변을 등록하면 마이페이지에서 알림으로 확인하실 수 있습니다",
          status: "success",
        });
        setIsWriting(false);
        fetchQna();
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast({
            title: "Internal Server Error",
            description: "백엔드 코드를 점검해주세요",
            status: "error",
          });
        } else if (error.response.status === 400) {
          toast({
            title: "Bad Request",
            description: "프론트와 백엔드 파라미터를 확인해주세요",
            status: "error",
          });
        } else {
          toast({
            title: "리뷰 등록에 실패하였습니다",
            description: "계속될 경우 관리자에게 문의해주세요",
            status: "error",
          });
        }
      });
  }

  return (
    <Box mx="15%" my={10}>
      <Heading mb={10}>문의 등록</Heading>
      <Form>
        <FormControl mb={5}>
          <FormLabel fontWeight="bold" mb={5}>
            <Text
              py={2}
              px={5}
              as="span"
              border="1px solid black"
              borderRadius={0}
            >
              문의 제목
            </Text>
          </FormLabel>
          <Input
            value={title}
            placeholder="제목을 입력하세요"
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel fontWeight="bold" mb={5}>
            <Text
              py={2}
              px={5}
              as="span"
              border="1px solid black"
              borderRadius={0}
            >
              문의 내용
            </Text>
          </FormLabel>
          <Textarea
            value={content}
            h="xs"
            placeholder="문의 내용을 작성해주세요"
            onChange={(e) => setContent(e.target.value)}
          />
        </FormControl>
      </Form>
      <ButtonGroup w="full" justifyContent="center" my={10}>
        <Button
          w={"30%"}
          borderRadius={0}
          variant="undefined"
          border="1px solid black"
          bgColor="white"
          onClick={handleSubmit}
        >
          등록하기
        </Button>
        <Button
          w="30%"
          borderRadius={0}
          variant="undefined"
          bgColor="black"
          color="white"
          onClick={() => setIsWriting(false)}
        >
          닫기
        </Button>
      </ButtonGroup>
    </Box>
  );
}
