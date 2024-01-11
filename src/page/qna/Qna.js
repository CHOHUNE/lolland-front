import {
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

export function Qna() {
  const testQna = [
    {
      question_id: 1,
      question_title: "반품 신청 방법",
      question_content: "개졸림",
      member_login_id: "testforqna",
      answer_status: "답변완료",
      question_reg_time: "2019-01-21T05:47:08.644",
    },
    {
      question_id: 2,
      question_title: "환불해주삼",
      member_login_id: "admin",
      question_content: "어떻게 환불해야하나요",
      answer_status: "답변완료",
      question_reg_time: "2019-01-21T05:47:08.644",
    },
    {
      question_id: 3,
      question_title: "대시보드 타입 부착 문의",
      question_content:
        "대시보드 타입은 부착시에 3M 테이프 같은 양면테이프인가요? 아니면 젤 타입으로 물에 세척 후 반 영구적으로 사용할 수 있는 타입인가요?",
      member_login_id: "question",
      answer_status: "답변대기중",
      question_reg_time: "2019-01-21T05:47:08.644",
    },
    {
      question_id: 4,
      question_title: "혹시",
      question_content: "이거 삼성 호환되나요?",
      member_login_id: "answer",
      answer_status: "답변대기중",
      question_reg_time: "2019-01-21T05:47:08.644",
    },
    {
      question_id: 5,
      question_title: "갤럭시에선 작동 안하나요?",
      member_login_id: "testforqna",
      question_content:
        "구매했었는데요 팬과 엘이디가 안해서 문의 드리니\n" +
        "\n" +
        "충전 작동중일때만 동작한다고 답변주셔서\n" +
        "\n" +
        "그냥 보관하다 이번에 신형 갤럭시23으로 폰을\n" +
        "\n" +
        "바꿨는데 충전은 되는데 여전히 팬과 엘이디는\n" +
        "\n" +
        "동작을 안하네요 갤럭시는 호환이 안되는\n" +
        "\n" +
        "제품인가요???",
      answer_status: "답변완료",
      question_reg_time: "2019-01-21T05:47:08.644",
    },
    {
      question_id: 6,
      question_title:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
      member_login_id: "boardqna",
      question_content:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque corporis deserunt " +
        "laboriosam odit omnis! Alias doloribus eaque officia officiis saepe.\n",
      answer_status: "답변대기중",
      question_reg_time: "2019-01-21T05:47:08.644",
    },
  ];

  function formattedLogId(member_login_id) {
    const formattedLoginId = member_login_id;
    if (formattedLoginId) {
      const maskedLoginId =
        member_login_id.slice(0, 3) + "*".repeat(formattedLoginId.length - 3);
      return maskedLoginId;
    }
    return "";
  }

  const formattedDate = (question_reg_time) => {
    const date = new Date(question_reg_time);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

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
        <>
          <Heading mb={10}>문의 등록</Heading>
          <Form>
            <FormControl>
              <FormLabel fontWeight="bold">
                <Tag size="lg" borderRadius={0} bgColor="black" color="white">
                  제목
                </Tag>
              </FormLabel>
              <Input placeholder="제목을 입력하세요" mb={3} />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold">
                <Tag size="lg" borderRadius={0} bgColor="black" color="white">
                  문의 내용
                </Tag>
              </FormLabel>
              <Textarea h="xs" placeholder="문의 내용을 작성해주세요" />
            </FormControl>
          </Form>
          <ButtonGroup w="full" justifyContent="center" my={5}>
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
        </>
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
                {testQna.map((question) => (
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
                      <Tr>
                        <Td colSpan={4} px={10}>
                          <Collapse
                            in={openId === question.question_id}
                            animateOpacity
                          >
                            <Text whiteSpace="pre-wrap" lineHeight="30px">
                              {question.question_content}
                            </Text>
                          </Collapse>
                        </Td>
                      </Tr>
                    )}
                  </>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
}
