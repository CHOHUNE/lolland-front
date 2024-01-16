import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Collapse,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
  Select,
  Skeleton,
  Spinner,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faMagnifyingGlass,
  faPaperPlane,
  faPenToSquare,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Fragment, useEffect, useState } from "react";
import {
  Form,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import { QnaWrite } from "../qna/QnaWrite";

function PageButton({ variant, pageNumber, children, product_id }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  function handleClick() {
    params.set("product_id", product_id);
    params.set("p", pageNumber);
    navigate("/?" + params);
  }

  return (
    <Button variant={variant} onClick={handleClick}>
      {children}
    </Button>
  );
}

function Pagination({ pageInfo, product_id }) {
  const pageNumbers = [];

  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Center mt={5} mb={40}>
      <Box>
        <Flex justifyContent="center">
          {pageInfo.prevPageNumber && (
            <PageButton
              variant="ghost"
              product_id={product_id}
              pageNumber={pageInfo.prevPageNumber}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </PageButton>
          )}

          {pageNumbers.map((pageNumber) => (
            <PageButton
              key={pageNumber}
              variant={
                pageNumber === pageInfo.currentPageNumber ? "solid" : "ghost"
              }
              product_id={product_id}
              pageNumber={pageNumber}
            >
              {pageNumber}
            </PageButton>
          ))}

          {pageInfo.nextPageNumber && (
            <PageButton
              variant="ghost"
              product_id={product_id}
              pageNumber={pageInfo.nextPageNumber}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </PageButton>
          )}
        </Flex>
      </Box>
    </Center>
  );
}

export function QnaView({
  product_id,
  formattedDate,
  formattedLogId,
  isAuthenticated,
  hasAccess,
  isAdmin,
}) {
  const [qnaList, setQnaList] = useState([]);
  const [pageInfo, setPageInfo] = useState();
  const toast = useToast();
  const navigate = useNavigate();

  const [openId, setOpenId] = useState(null);
  const [isWriting, setIsWriting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState([]);
  const [viewMode, setViewMode] = useState(false);

  const location = useLocation();

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");

  function handleSearch() {
    const paramsSearch = new URLSearchParams();
    paramsSearch.set("product_id", product_id);
    paramsSearch.set("k", keyword);
    paramsSearch.set("c", category);
    axios
      .get("/api/qna/list?" + paramsSearch)
      .then((response) => {
        console.log(response);
        setQnaList(response.data.qnaList);
        setPageInfo(response.data.pageInfo);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          toast({
            title: "Bad Request",
            description: "프론트엔드 코드와 백엔드 파라미터를 확인해주세요",
            status: "error",
          });
        } else if (error.response.status === 500) {
          toast({
            title: "Internal Server Error",
            description: "백엔드 코드를 확인해주세요",
            status: "error",
          });
        } else {
          toast({
            title: "QNA 리스트 불러오기에 실패하였습니다",
            description: "계속되면 관리자에게 문의해주세요",
            status: "error",
          });
        }
      });
  }

  useEffect(() => {
    fetchQna();
  }, []);

  function fetchQna() {
    const params = new URLSearchParams({
      product_id: product_id,
      k: keyword,
      c: category,
    });

    axios
      .get("/api/qna/list?" + params)
      .then((response) => {
        console.log(response);
        setQnaList(response.data.qnaList);
        setPageInfo(response.data.pageInfo);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          toast({
            title: "Bad Request",
            description: "프론트엔드 코드와 백엔드 파라미터를 확인해주세요",
            status: "error",
          });
        } else if (error.response.status === 500) {
          toast({
            title: "Internal Server Error",
            description: "백엔드 코드를 확인해주세요",
            status: "error",
          });
        } else {
          toast({
            title: "QNA 리스트 불러오기에 실패하였습니다",
            description: "계속되면 관리자에게 문의해주세요",
            status: "error",
          });
        }
      });
  }

  const handleToggle = (questionId) => {
    if (openId && questionId === openId) {
      setOpenId(null);
    } else {
      setOpenId(questionId);
    }
  };

  if (pageInfo === null) {
    return <Spinner />;
  }

  function handleViewMember() {
    axios
      .get("/api/qna/fetchMine", {
        params: {
          product_id: product_id,
        },
      })
      .then((response) => {
        console.log(response.data);
        setQnaList(response.data);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          toast({
            title: "Bad Request",
            description: "프론트와 백엔드 파라미터를 확인해보세요",
            status: "error",
          });
        } else if (error.response.status === 500) {
          toast({
            title: "Internal Server Error",
            description: "백엔드 코드를 점검해보세요",
            status: "error",
          });
        } else {
          toast({
            title: "내 리뷰를 찾는데 실패하였습니다",
            description: "다시 한번 시도해보시거나, 관리자에게 문의하세요",
            status: "error",
          });
        }
      });
  }

  function handleEditQna() {
    setIsEditing(false);
    axios
      .put("/api/qna/update", {
        question_id: editedQuestion.question_id,
        question_title: editedQuestion.question_title,
        question_content: editedQuestion.question_content,
      })
      .then(() => {
        toast({
          title: "문의 수정에 성공하였습니다",
          description: "판매자가 새로운 답변을 달 때까지 기다려주세요",
          status: "success",
        });
        fetchQna();
        setEditedQuestion([]);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          toast({
            title: "Bad Request",
            description: "프론트와 백엔드 파라미터를 확인해보세요",
            status: "error",
          });
        } else if (error.response.status === 500) {
          toast({
            title: "Internal Server Error",
            description: "백엔드 코드를 점검해보세요",
            status: "error",
          });
        } else {
          toast({
            title: "리뷰 수정에 실패하였습니다",
            description: "다시 한번 시도해보시거나, 관리자에게 문의하세요",
            status: "error",
          });
        }
      });
  }

  function handleDeleteQna(qna) {
    axios
      .delete("/api/qna/delete", {
        params: {
          question_id: qna.question_id,
        },
      })
      .then((response) => {
        toast({
          description: "문의 내용이 성공적으로 삭제되었습니다",
          status: "success",
        });
        fetchQna();
      })
      .catch((error) => {
        if (error.response.status === 400) {
          toast({
            title: "Bad Request",
            description: "프론트와 백엔드 파라미터를 확인해보세요",
            status: "error",
          });
        } else if (error.response.status === 500) {
          toast({
            title: "Internal Server Error",
            description: "백엔드 코드를 점검해보세요",
            status: "error",
          });
        } else {
          toast({
            title: "리뷰 삭제에 실패하였습니다",
            description: "다시 한번 시도해보시거나, 관리자에게 문의하세요",
            status: "error",
          });
        }
      });
  }

  return (
    <>
      {isWriting ? (
        <QnaWrite
          setIsWriting={setIsWriting}
          product_id={product_id}
          fetchQna={fetchQna}
        />
      ) : (
        <>
          <Flex justifyContent="center" mx="15%" gap={2} my={10}>
            <InputGroup>
              <InputLeftElement w="20%">
                <Select
                  border="1px solid black"
                  borderRadius={0}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option selected value="all">
                    전체
                  </option>
                  <option value="title">제목</option>
                  <option value="content">내용</option>
                  <option value="id">아이디</option>
                </Select>
              </InputLeftElement>
              <Input
                borderRadius={0}
                textIndent="20%"
                placeholder="검색어를 입력해주세요"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <InputRightElement bgColor="black" onClick={handleSearch}>
                <FontAwesomeIcon icon={faMagnifyingGlass} color="white" />
              </InputRightElement>
            </InputGroup>
            <ButtonGroup size="md">
              {viewMode ? (
                <Button
                  borderRadius={0}
                  w="100px"
                  variant="undefined"
                  border="1px solid black"
                  bgColor="white"
                  onClick={() => {
                    setViewMode(false);
                    fetchQna();
                  }}
                >
                  전체 보기
                </Button>
              ) : (
                <Button
                  w="100px"
                  borderRadius={0}
                  variant="undefined"
                  border="1px solid black"
                  bgColor="white"
                  onClick={() => {
                    if (isAuthenticated()) {
                      setViewMode(true);
                      handleViewMember();
                    } else {
                      toast({
                        title: "문의는 로그인 후 열람 가능합니다",
                        description: "먼저 로그인 해주세요",
                        status: "error",
                      });
                      navigate("/login");
                    }
                  }}
                >
                  내 글 보기
                </Button>
              )}
              <Button
                variant="undefined"
                borderRadius={0}
                color="white"
                bgColor="black"
                onClick={() => {
                  if (isAuthenticated()) {
                    setIsWriting(true);
                  } else {
                    toast({
                      title: "문의는 로그인 후 작성 가능합니다",
                      description: "먼저 로그인 해주세요",
                      status: "error",
                    });
                    navigate("/login");
                  }
                }}
              >
                작성하기
              </Button>
            </ButtonGroup>
          </Flex>
          <TableContainer mx="15%">
            <Table variant="undefined">
              <Thead borderTop="2px solid black" borderBottom="1px solid black">
                <Tr>
                  <Th textAlign="center" fontSize="sm" w="60%">
                    제목
                  </Th>
                  <Th textAlign="center" fontSize="sm">
                    아이디
                  </Th>
                  <Th textAlign="center" fontSize="sm">
                    답변상태
                  </Th>
                  <Th textAlign="center" fontSize="sm">
                    작성일
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {qnaList && qnaList.length > 0 ? (
                  qnaList.map((qna) => (
                    <>
                      <Tr key={qna.question_id}>
                        <Td
                          textAlign="left"
                          fontWeight="bold"
                          onClick={() => {
                            handleToggle(qna.question_id);
                          }}
                        >
                          {qna.question_title}
                        </Td>
                        <Td textAlign="center">
                          {formattedLogId(qna.member_login_id)}
                        </Td>
                        <Td textAlign="center">
                          <Tag
                            size="sm"
                            variant="outline"
                            colorScheme={
                              !qna.answer_content ? "orange" : "blackAlpha"
                            }
                            p={2}
                          >
                            {!qna.answer_content ? "답변 대기중" : "답변 완료"}
                          </Tag>
                        </Td>
                        <Td textAlign="center">
                          {formattedDate(qna.question_reg_time)}
                        </Td>
                      </Tr>
                      {openId === qna.question_id && (
                        <>
                          <Tr>
                            <Td colSpan={4} border="1px solid black">
                              {(hasAccess(qna.member_login_id) ||
                                isAdmin()) && (
                                <ButtonGroup
                                  size="sm"
                                  display="flex"
                                  justifyContent="flex-end"
                                >
                                  {isEditing ? (
                                    <>
                                      <Input
                                        border="1px solid black"
                                        value={editedQuestion.question_title}
                                        onChange={(e) => {
                                          setEditedQuestion((prevQ) => {
                                            return {
                                              ...prevQ,
                                              question_title: e.target.value,
                                            };
                                          });
                                        }}
                                      />
                                      <IconButton
                                        icon={
                                          <FontAwesomeIcon
                                            icon={faPaperPlane}
                                          />
                                        }
                                        colorScheme="blue"
                                        variant="ghost"
                                        onClick={() => handleEditQna()}
                                      />
                                      <IconButton
                                        icon={
                                          <FontAwesomeIcon icon={faXmark} />
                                        }
                                        colorScheme="red"
                                        variant="ghost"
                                        onClick={() => {
                                          setEditedQuestion(qna);
                                          setIsEditing(false);
                                        }}
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <IconButton
                                        icon={
                                          <FontAwesomeIcon
                                            icon={faPenToSquare}
                                          />
                                        }
                                        variant="ghost"
                                        colorScheme="blackAlpha"
                                        onClick={() => {
                                          setIsEditing(true);
                                          setEditedQuestion(qna);
                                        }}
                                      />
                                      <IconButton
                                        icon={
                                          <FontAwesomeIcon icon={faTrashCan} />
                                        }
                                        variant="ghost"
                                        colorScheme="red"
                                        onClick={() => handleDeleteQna(qna)}
                                      />
                                    </>
                                  )}
                                </ButtonGroup>
                              )}
                              {isEditing ? (
                                <Textarea
                                  mt={5}
                                  value={editedQuestion.question_content}
                                  onChange={(e) => {
                                    setEditedQuestion((prevQ) => {
                                      return {
                                        ...prevQ,
                                        question_content: e.target.value,
                                      };
                                    });
                                  }}
                                />
                              ) : (
                                <Text whiteSpace="pre-wrap" lineHeight="30px">
                                  {qna.question_content}
                                </Text>
                              )}
                            </Td>
                          </Tr>
                          {qna.answer_content && (
                            <Tr>
                              <Td colSpan={4} px={10} py={6} bgColor="#F4F4F4">
                                <Text whiteSpace="pre-wrap" lineHeight="30px">
                                  {qna.answer_content}
                                </Text>
                              </Td>
                            </Tr>
                          )}
                        </>
                      )}
                    </>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={4} h="xs" textAlign="center">
                      아직 등록된 Q&A가 없습니다
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
          <Pagination product_id={product_id} pageInfo={pageInfo} />
        </>
      )}
    </>
  );
}
