import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";

export function QnaAnswer() {
  const [questionList, setQuestionList] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/qna/view")
      .then((response) => {
        setQuestionList(response.data);
        console.log(questionList);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          toast({
            title: "세션이 만료되었습니다",
            description: "재로그인 후 시도해주세요",
            status: "warning",
          });
          navigate("/login");
        } else if (error.response.status === 500) {
          toast({
            title: "Internal Server Error",
            description: "백엔드 코드를 점검해주세요",
            status: "error",
          });
        } else {
          toast({
            title: error.response.data,
            description: "문의 불러오는 도중 에러 발생, 관리자에게 문의하세요",
            status: "error",
          });
        }
      });
  }, []);

  const formattedDate = (question_reg_time) => {
    const date = new Date(question_reg_time);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
  };

  return (
    <VStack spacing={5} w="full" my={10}>
      <Card w="full" px="3%">
        <CardHeader>
          <Heading size="lg">문의 목록</Heading>
        </CardHeader>
        <CardBody>
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th textAlign="center">상품명</Th>
                  <Th textAlign="center">문의 제목</Th>
                  <Th textAlign="center">문의 등록일자</Th>
                </Tr>
              </Thead>
              <Tbody>
                {questionList && questionList.length > 0 ? (
                  questionList.map((q) => (
                    <Tr
                      key={q.question_id}
                      onClick={() => {
                        navigate(`write/${q.question_id}`);
                        const targetElement =
                          document.getElementById("answerSection");
                        if (targetElement) {
                          targetElement.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      <Td textAlign="center">{q.product_name}</Td>
                      <Td textAlign="center">{q.question_title}</Td>
                      <Td textAlign="center">
                        {formattedDate(q.question_reg_time)}
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={3} h={5}>
                      아직 등록된 문의가 없습니다
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>
      <Outlet />
    </VStack>
  );
}
