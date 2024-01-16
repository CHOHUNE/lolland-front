import {
  Box,
  Button,
  ButtonGroup,
  Collapse,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Skeleton,
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
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Fragment, useEffect, useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import axios from "axios";
import { QnaWrite } from "../qna/QnaWrite";

export function QnaView({
  product_id,
  formattedDate,
  formattedLogId,
  isAuthenticated,
}) {
  const [qnaList, setQnaList] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  const [openId, setOpenId] = useState(null);
  const [isWriting, setIsWriting] = useState(false);

  useEffect(() => {
    fetchQna();
  }, []);

  function fetchQna() {
    axios
      .get("/api/qna/list", { params: { product_id: product_id } })
      .then((response) => {
        setQnaList(response.data);
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
          <Flex justifyContent="center" mx="25%" gap={2} my={10}>
            <InputGroup>
              <Input borderRadius={0} placeholder="검색어를 입력해주세요" />
              <InputRightElement bgColor="black">
                <FontAwesomeIcon icon={faMagnifyingGlass} color="white" />
              </InputRightElement>
            </InputGroup>
            <ButtonGroup size="md">
              <Button
                borderRadius={0}
                variant="undefined"
                border="1px solid black"
                bgColor="white"
              >
                내 글 보기
              </Button>
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
                        {/*<Td textAlign="center">*/}
                        {/*  <Tag*/}
                        {/*    size="sm"*/}
                        {/*    // variant="outline"*/}
                        {/*    colorScheme={*/}
                        {/*      qna.answer_status === "답변대기중"*/}
                        {/*        ? "orange"*/}
                        {/*        : "blackAlpha"*/}
                        {/*    }*/}
                        {/*    p={2}*/}
                        {/*  >*/}
                        {/*    {qna.answer_status}*/}
                        {/*  </Tag>*/}
                        {/*</Td> TODO: 답변 있없 유무로 프론트에서 처리하기*/}
                        <Td textAlign="center">
                          {formattedDate(qna.question_reg_time)}
                        </Td>
                      </Tr>
                      {openId === qna.question_id && (
                        <>
                          <Tr>
                            <Td colSpan={4} px={10}>
                              <Text whiteSpace="pre-wrap" lineHeight="30px">
                                {qna.question_content}
                              </Text>
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
        </>
      )}
    </>
  );
}
