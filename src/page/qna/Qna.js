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
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Fragment, useState } from "react";
import { Form } from "react-router-dom";

export function Qna({ formattedDate, formattedLogId }) {
  const [qnaList, setQnaList] = useState([]);

  const [openId, setOpenId] = useState(null);
  const [isWriting, setIsWriting] = useState(false);

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
        <Box mx="15%" my={10}>
          <Heading mb={10}>문의 등록</Heading>
          <Form>
            <FormControl mb={5}>
              <FormLabel fontWeight="bold" mb={5}>
                <Tag size="lg" borderRadius={0} bgColor="black" color="white">
                  제목
                </Tag>
              </FormLabel>
              <Input placeholder="제목을 입력하세요" />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" mb={5}>
                <Tag size="lg" borderRadius={0} bgColor="black" color="white">
                  문의 내용
                </Tag>
              </FormLabel>
              <Textarea h="xs" placeholder="문의 내용을 작성해주세요" />
            </FormControl>
          </Form>
          <ButtonGroup w="full" justifyContent="center" my={10}>
            <Button
              w={"30%"}
              borderRadius={0}
              variant="undefined"
              border="1px solid black"
              bgColor="white"
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
                onClick={() => setIsWriting(true)}
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
                  qnaList.map((question) => (
                    <>
                      <Tr key={question.question_id}>
                        <Td
                          textAlign="left"
                          fontWeight="bold"
                          onClick={() => {
                            handleToggle(question.question_id);
                          }}
                        >
                          {question.question_title}
                        </Td>
                        <Td textAlign="center">
                          {formattedLogId(question.member_login_id)}
                        </Td>
                        <Td textAlign="center">
                          <Tag
                            size="sm"
                            // variant="outline"
                            colorScheme={
                              question.answer_status === "답변대기중"
                                ? "orange"
                                : "blackAlpha"
                            }
                            p={2}
                          >
                            {question.answer_status}
                          </Tag>
                        </Td>
                        <Td textAlign="center">
                          {formattedDate(question.question_reg_time)}
                        </Td>
                      </Tr>
                      {openId === question.question_id && (
                        <>
                          <Tr>
                            <Td colSpan={4} px={10}>
                              <Text whiteSpace="pre-wrap" lineHeight="30px">
                                {question.question_content}
                              </Text>
                            </Td>
                          </Tr>
                          {question.answer_content && (
                            <Tr>
                              <Td colSpan={4} px={10} py={6} bgColor="#F4F4F4">
                                <Text whiteSpace="pre-wrap" lineHeight="30px">
                                  {question.answer_content}
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
