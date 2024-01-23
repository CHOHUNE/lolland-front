import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Heading,
  IconButton,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import axios from "axios";

function PageButton({ variant, pageNumber, children }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  function handleClick() {
    params.set("p", pageNumber);
    console.log(params.get("p"));
    navigate("?" + params);
  }
  return (
    <Button variant={variant} onClick={handleClick}>
      {children}
    </Button>
  );
}

function Pagination({ pageInfo }) {
  if (!pageInfo) {
    return null;
  }

  const pageNumbers = [];

  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Center>
      <Box>
        <ButtonGroup justifyContent="center">
          {pageInfo.prevPageNumber && (
            <PageButton variant="ghost" pageNumber={pageInfo.prevPageNumber}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </PageButton>
          )}

          {pageNumbers.map((pageNumber) => (
            <PageButton
              key={pageNumber}
              variant={
                pageNumber === pageInfo.currentPageNumber ? "solid" : "ghost"
              }
              pageNumber={pageNumber}
            >
              {pageNumber}
            </PageButton>
          ))}

          {pageInfo.nextPageNumber && (
            <PageButton variant="ghost" pageNumber={pageInfo.nextPageNumber}>
              <FontAwesomeIcon icon={faAngleRight} />
            </PageButton>
          )}
        </ButtonGroup>
      </Box>
    </Center>
  );
}

export function MemberQuestion() {
  const [questionList, setQuestionList] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const [pageInfo, setPageInfo] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    console.log(params);

    axios
      .get("/api/qna/my" + params)
      .then((response) => {
        setQuestionList(response.data.questionList);
        setPageInfo(response.data.pageInfo);
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
  }, [location]);

  const formattedDate = (question_reg_time) => {
    const date = new Date(question_reg_time);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
  };

  return (
    <VStack w="full" mr={5} spacing={5}>
      <Card w="full">
        <CardHeader>
          <Heading>문의 목록</Heading>
        </CardHeader>
        <CardBody>
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th testAlign="center">상품명</Th>
                  <Th testAlign="center">문의 제목</Th>
                  <Th testAlign="center">답변 상태</Th>
                  <Th textAlign="center">등록일자</Th>
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
                          document.getElementById("detailSection");
                        if (targetElement) {
                          targetElement.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      <Td textAlign="center">{q.product_name}</Td>
                      <Td textAlign="center">{q.question_title}</Td>
                      <Td textAlign="center">
                        <Tag
                          size="sm"
                          variant="outline"
                          colorScheme={
                            !q.answer_content ? "orange" : "blackAlpha"
                          }
                          p={2}
                        >
                          {!q.answer_id ? "답변 대기중" : "답변 완료"}
                        </Tag>
                      </Td>
                      <Td textAlign="center">
                        <Text fontSize="xs" opacity="0.5">
                          {formattedDate(q.question_reg_time)}
                        </Text>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={3} h={5} textAlign="center">
                      아직 등록된 문의가 없습니다
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
        <CardFooter display="flex" justifyContent="center">
          <Pagination pageInfo={pageInfo} />
        </CardFooter>
      </Card>
      <Outlet />
    </VStack>
  );
}
