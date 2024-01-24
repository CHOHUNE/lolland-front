import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Checkbox,
  Flex,
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
  const [params1] = useSearchParams();
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    console.log(params);

    axios
      .get("/api/qna/my?" + params)
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

  const buttonStyles = {
    variant: "outline",
    border: "1px solid black",
    _hover: { bgColor: "black", color: "white" },
    borderRadius: 0,
  };

  function handleDelete(selectedQuestions) {
    axios
      .delete("/api/qna/delete/selected", {
        headers: {
          "Content-Type": "application/json",
        },
        data: selectedQuestions,
      })
      .then(() => {
        toast({
          description: "선택한 문의들을 삭제하였습니다",
          status: "success",
        });
        setSelectedQuestions([]);
        navigate("/memberPage/qna");
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast({
            title: "선택한 문의들을 삭제하는데 실패하였습니다",
            description: "백엔드 로그를 확인해보세요",
            status: "error",
          });
        } else {
          toast({
            title: "선택한 문의들을 삭제하는데 실패하였습니다",
            description: "다시 한번 시도해보시거나, 관리자에게 문의하세요",
            status: "error",
          });
        }
      });
  }

  function handleDeleteAll() {
    axios
      .delete("/api/qna/delete/all")
      .then(() => {
        toast({
          description: "모든 문의를 삭제하였습니다",
          status: "success",
        });
        navigate("/memberPage/qna");
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast({
            title: "문의 전체 삭제에 실패하였습니다",
            description: "백엔드 코드를 확인해보세요",
            status: "error",
          });
        } else if (error.response.status === 400) {
          toast({
            title: "Bad Request - 요청이 잘못되었습니다",
            description: "백엔드와 프론트엔드 코드 연동을 확인해보세요",
            status: "error",
          });
        } else if (error.response.status === 401) {
          toast({
            title: "접근 권한이 없습니다",
            description: "로그인 해주세요",
            status: "error",
          });
        } else {
          toast({
            title: "문의 전체 삭제에 실패하였습니다",
            description: "다시 시도하시거나 관리자에게 문의하세요",
            status: "error",
          });
        }
      });
  }

  function handleSelectAllQuestions(checked) {
    if (checked) {
      setSelectedQuestions(questionList.map((q) => q.question_id));
    } else {
      setSelectedQuestions([]);
    }
  }

  function handleCheckBoxChange(q) {
    const questionIdentifier = q.question_id;

    setSelectedQuestions((prevSelectedQ) =>
      prevSelectedQ.includes(questionIdentifier)
        ? prevSelectedQ.filter((id) => id !== questionIdentifier)
        : [...prevSelectedQ, questionIdentifier],
    );
  }

  return (
    <VStack w="full" mr={5} spacing={5}>
      <Card w="full">
        <CardHeader>
          <Heading>문의 목록</Heading>
        </CardHeader>
        <CardBody>
          <Flex justifyContent="space-between" mx={10} mb={5}>
            <Checkbox
              py={2}
              px={3}
              colorScheme="orange"
              isChecked={
                questionList?.length > 0 &&
                selectedQuestions?.length === questionList?.length
              }
              onChange={(e) => handleSelectAllQuestions(e.target.checked)}
            >
              전체 선택
            </Checkbox>
            <ButtonGroup>
              <Button
                {...buttonStyles}
                onClick={() => handleDelete(selectedQuestions)}
              >
                선택 삭제
              </Button>
              <Button {...buttonStyles} onClick={() => handleDeleteAll()}>
                전체 삭제
              </Button>
            </ButtonGroup>
          </Flex>
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th textAlign="center">선택</Th>
                  <Th textAlign="center">상품명</Th>
                  <Th textAlign="center">문의 제목</Th>
                  <Th textAlign="center">답변 상태</Th>
                  <Th textAlign="center">등록일자</Th>
                </Tr>
              </Thead>
              <Tbody>
                {questionList && questionList.length > 0 ? (
                  questionList.map((q) => (
                    <Tr
                      key={q.question_id}
                      onClick={() => {
                        navigate(`answer/${q.question_id}?` + params1);
                        const targetElement =
                          document.getElementById("detailSection");
                        if (targetElement) {
                          targetElement.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      <Td
                        textAlign="center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          colorScheme="orange"
                          isChecked={selectedQuestions.includes(q.question_id)}
                          onChange={() => {
                            handleCheckBoxChange(q);
                          }}
                        />
                      </Td>
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
                    <Td colSpan={5} h={5} textAlign="center">
                      아직 등록된 문의가 없습니다
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
        <CardFooter display="flex" justifyContent="center" id="detailSection">
          <Pagination pageInfo={pageInfo} />
        </CardFooter>
      </Card>
      <Outlet />
    </VStack>
  );
}
