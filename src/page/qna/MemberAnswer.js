import { Form, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function MemberAnswer() {
  const { question_id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const [qnaInfo, setQnaInfo] = useState(null);
  const [question, setQuestion] = useState(null);
  const [questionCopy, setQuestionCopy] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const formattedDate = (question_reg_time) => {
    const date = new Date(question_reg_time);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
  };

  useEffect(() => {
    setIsEditing(false);
    axios
      .get(`/api/qna/member/${question_id}`)
      .then((response) => {
        const {
          question_id,
          product_name,
          question_title,
          question_content,
          answer_content,
        } = response.data;

        const questionInfoData = {
          question_id,
          question_title,
          question_content,
        };

        const answerInfoData = {
          product_name,
          answer_content,
        };

        setQnaInfo(answerInfoData);
        setQuestion(questionInfoData);
        setQuestionCopy(questionInfoData);
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast({
            title: "Internal Server Error",
            description: "백엔드 코드를 확인해보세요",
            status: "error",
          });
        } else if (error.response.status === 403) {
          toast({
            title: "접근 권한이 없습니다",
            description: "관리자 외에 문의 답변 등록이 불가능합니다",
            status: "error",
          });
          navigate("/");
        } else {
          toast({
            title: "문의 정보를 가져오는 도중 에러가 발생했습니다",
            description: "현상이 계속되면 관리자에게 문의해주세요",
            status: "error",
          });
        }
      });
  }, [question_id]);

  function handleUpdate() {
    axios
      .put("/api/qna/update", {
        question_id: question_id,
        question_title: questionCopy.question_title,
        question_content: questionCopy.question_content,
      })
      .then(() => {
        toast({
          title: "성공적으로 답변을 수정하였습니다",
          description: "다시 리스트로 되돌아갑니다",
          status: "success",
        });
        navigate("/memberPage/qna");
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast({
            title: "Internal Server Error",
            description:
              "답변을 수정하던 도중 에러가 발생했습니다. 백엔드 코드를 점검해주세요",
            status: "error",
          });
        } else if (error.response.status === 400) {
          toast({
            title: "Bad Request Error",
            description: "백엔드와 프론트 코드의 파라미터를 다시 확인해주세요",
            status: "error",
          });
        } else {
          toast({
            title: "문의 수정 중 에러 발생",
            description: "현상이 지속되면 관리자에게 문의 바랍니다",
            status: "error",
          });
        }
      });
  }

  function handleDelete() {
    axios
      .delete("/api/qna/delete", {
        params: {
          question_id: questionCopy.question_id,
        },
      })
      .then(() => {
        toast({
          title: "문의를 성공적으로 삭제하였습니다",
          description: "삭제된 문의는 다시 복구되지 않습니다",
          status: "success",
        });
        navigate("/memberPage/qna");
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast({
            title: "Internal Server Error",
            description:
              "문의를 삭제하던 도중 에러가 발생했습니다. 백엔드 코드를 점검해주세요",
            status: "error",
          });
        } else if (error.response.status === 400) {
          toast({
            title: "Bad Request Error",
            description: "백엔드와 프론트 코드의 파라미터를 다시 확인해주세요",
            status: "error",
          });
        } else {
          toast({
            title: "문의 삭제 도중 에러가 발생했습니다",
            description:
              "다시 시도해주시거나, 현상이 지속되면 관리자에게 문의 바랍니다",
            status: "error",
          });
        }
      });
  }

  if (!question) {
    return null;
  }

  return (
    <Card id="detailSection" w="full">
      <CardHeader>
        <Heading size="lg">문의 상세보기</Heading>
      </CardHeader>
      <CardBody>
        {question.question_id !== null && (
          <>
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
                    상품명
                  </Text>
                </FormLabel>
                <Input
                  p={0}
                  border="none"
                  readOnly
                  value={qnaInfo.product_name}
                />
              </FormControl>
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
                {isEditing ? (
                  <Input
                    p={0}
                    border="none"
                    value={questionCopy.question_title}
                    onChange={(e) =>
                      setQuestionCopy((prevQ) => ({
                        ...prevQ,
                        question_title: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <Input
                    p={0}
                    border="none"
                    readOnly
                    value={question.question_title}
                  />
                )}
              </FormControl>
              <FormControl mb={5}>
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
                {isEditing ? (
                  <Input
                    p={0}
                    border="none"
                    h="xs"
                    value={questionCopy.question_content}
                    onChange={(e) =>
                      setQuestionCopy((prevQ) => ({
                        ...prevQ,
                        question_content: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <Input
                    p={0}
                    border="none"
                    readOnly
                    value={question.question_content}
                  />
                )}
              </FormControl>
              <FormControl mb={5}>
                <FormLabel fontWeight="bold" mb={5}>
                  <Text
                    py={2}
                    px={5}
                    as="span"
                    border="1px solid black"
                    borderRadius={0}
                  >
                    관리자 답변
                  </Text>
                </FormLabel>
                <Input
                  p={0}
                  border="none"
                  readOnly
                  value={qnaInfo?.answer_content || "아직 답변이 없습니다"}
                />
              </FormControl>
            </Form>
          </>
        )}
      </CardBody>
      <CardFooter display="flex" justifyContent="center">
        <ButtonGroup w="full" justifyContent="center" pb="2%">
          <Button
            w="30%"
            bgColor="white"
            border="1px solid black"
            borderRadius={0}
            _hover={{ color: "white", bgColor: "black" }}
            onClick={() => {
              if (isEditing) {
                handleUpdate();
              } else {
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? "전송" : "수정"}
          </Button>
          <Button
            w="30%"
            color="white"
            bgColor={isEditing ? "black" : "red"}
            variant="undefined"
            borderRadius={0}
            onClick={() => {
              if (isEditing) {
                setQuestionCopy(question);
                setIsEditing(false);
              } else {
                handleDelete();
              }
            }}
          >
            {isEditing ? "취소" : "삭제"}
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}
