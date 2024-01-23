import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretLeft,
  faCaretRight,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronDownIcon } from "@chakra-ui/icons";

// 페이지 버튼
function Pagination({ pageInfo }) {
  const navigate = useNavigate();

  const [params] = useSearchParams();
  const listPage = params.get("page");

  const pageNumbers = [];

  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box mt={10} mb={10}>
      {pageInfo.prevPageNumber && (
        <Button
          bg={"white"}
          color={"black"}
          _hover={{ backgroundColor: "black", color: "whitesmoke" }}
          onClick={() => navigate("?page=" + pageInfo.prevPageNumber)}
        >
          <FontAwesomeIcon icon={faCaretLeft} />
        </Button>
      )}
      {pageNumbers.map((pageNumber) => (
        <Button
          bg={listPage === pageNumber.toString() ? "black" : "white"}
          color={listPage === pageNumber.toString() ? "white" : "black"}
          _hover={{ backgroundColor: "black", color: "whitesmoke" }}
          ml={2}
          key={pageNumber}
          onClick={() => {
            navigate("?page=" + pageNumber);
          }}
        >
          {pageNumber}
        </Button>
      ))}
      {pageInfo.nextPageNumber && (
        <Button
          bg={"white"}
          color={"black"}
          _hover={{ backgroundColor: "black", color: "whitesmoke" }}
          ml={2}
          onClick={() => navigate("?page=" + pageInfo.nextPageNumber)}
        >
          <FontAwesomeIcon icon={faCaretRight} />
        </Button>
      )}
    </Box>
  );
}

// 회원 이름으로 찾기 버튼
function SearchMember() {
  // 인풋 css
  const inputStyle = {
    shadow: "1px 1px 3px 1px #dadce0 inset",
  };
  // 버튼 css
  const buttonStyle = {
    background: "black",
    color: "whitesmoke",
    shadow: "1px 1px 3px 1px #dadce0",
    _hover: {
      backgroundColor: "whitesmoke",
      color: "black",
      transition:
        "background 0.5s ease-in-out, color 0.5s ease-in-out, box-shadow 0.5s ease-in-out",
      shadow: "1px 1px 3px 1px #dadce0 inset",
    },
  };

  const [keyword, setKeyword] = useState("");
  const [findType, setFindType] = useState("id");

  const navigate = useNavigate();

  // 회원명 검색 클릭
  function handleSearch() {
    const params = new URLSearchParams();
    params.set(findType, keyword);

    navigate("/adminPage/memberList?" + params);
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Flex justifyContent={"center"} mt={10} gap={2}>
      <Menu>
        <MenuButton
          {...inputStyle}
          as={Button}
          rightIcon={<ChevronDownIcon />}
          w={"130px"}
          h={"50px"}
          bg={"white"}
          border={"1px solid gray"}
        >
          {findType === "id" && "아이디"}
          {findType === "name" && "이름"}
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => setFindType("id")}>아이디</MenuItem>
          <MenuItem onClick={() => setFindType("name")}>이름</MenuItem>
        </MenuList>
      </Menu>
      <Input
        {...inputStyle}
        w={"300px"}
        h={"50px"}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder={"검색어를 입력해 주세요."}
        onKeyDown={handleKeyDown}
      />
      <Button {...buttonStyle} w={"100px"} h={"50px"} onClick={handleSearch}>
        검색
      </Button>
    </Flex>
  );
}

export function MemberList() {
  // 탈퇴 버튼 css
  const buttonStyle = {
    background: "orange",
    color: "black",
    shadow: "1px 1px 3px 1px #dadce0",
    _hover: {
      backgroundColor: "whitesmoke",
      color: "black",
      transition:
        "background 0.5s ease-in-out, color 0.5s ease-in-out, box-shadow 0.5s ease-in-out",
      shadow: "1px 1px 3px 1px #dadce0 inset",
    },
  };
  const [memberList, setMemberList] = useState([]);
  const [pageInfo, setPageInfo] = useState("");
  const [selectMember, setSelectMember] = useState("");

  // 회원 탈퇴 처리 인식
  const [checkMember, setCheckMember] = useState(false);

  const toast = useToast();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const [params] = useSearchParams();

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    axios
      .get("/api/member/listAll?" + params)
      .then((response) => {
        setMemberList(response.data.allMember);
        setPageInfo(response.data.pageInfo);
      })
      .catch(() => {
        toast({
          description: "회원 목록 조회에 실패 했습니다.",
          status: "error",
        });
      })
      .finally(() => {
        setCheckMember(false);
      });
  }, [checkMember, location]);

  // 삭제 버튼 클릭시 동작
  const handleMemberDeleteClick = (e) => {
    console.log(e);
    setSelectMember(e);
    onOpen();
  };

  // 모달내 삭제 버튼 클릭시 실제 삭제
  const handleModalDeleteClick = (e) => {
    axios
      .delete("/api/member/DeleteMember/" + e.id)
      .then(() => {
        toast({
          description: e.member_login_id + " 님 이 삭체 처리 되었습니다.",
          status: "success",
        });
      })
      .then(() => {
        setCheckMember(true);
      })
      .catch(() => {
        toast({
          title: "탈퇴는 관리자만 가능합니다.",
          description: "로그인 상태를 확인해주세요.",
          status: "error",
        });
      })
      .finally(() => onClose());
  };

  return (
    <Center>
      <Card shadow={"1px 1px 3px 1px #dadce0"}>
        <CardHeader
          mt={4}
          textAlign={"center"}
          fontSize={"2rem"}
          fontWeight={"bold"}
          alignItems={"center"}
        >
          회원 목록
        </CardHeader>
        <CardBody>
          <Table textAlign={"center"}>
            <Thead>
              <Tr>
                <Th fontSize={"1.2rem"} w={"180px"} textAlign={"center"}>
                  아이디
                </Th>
                <Th fontSize={"1.2rem"} w={"180px"} textAlign={"center"}>
                  이름
                </Th>
                <Th fontSize={"1.2rem"} w={"200px"} textAlign={"center"}>
                  핸드폰번호
                </Th>
                <Th fontSize={"1.2rem"} w={"250px"} textAlign={"center"}>
                  이메일
                </Th>
                <Th fontSize={"1.2rem"} w={"200px"} textAlign={"center"}>
                  가입일
                </Th>
                <Th fontSize={"1.2rem"} w={"200px"} textAlign={"center"}>
                  탈퇴 처리
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {memberList.map((member) => {
                const formatDate = (dateString) => {
                  const date = new Date(dateString);
                  const year = date.getFullYear();
                  const month = (date.getMonth() + 1)
                    .toString()
                    .padStart(2, "0");
                  const day = date.getDate().toString().padStart(2, "0");
                  return `${year}년 ${month}월 ${day}일`;
                };

                return (
                  <Tr key={member.id}>
                    <Td textAlign={"center"}>{member.member_login_id}</Td>
                    <Td textAlign={"center"}>{member.member_name}</Td>
                    <Td textAlign={"center"}>{member.member_phone_number}</Td>
                    <Td textAlign={"center"}>{member.member_email}</Td>
                    <Td textAlign={"center"}>{formatDate(member.reg_time)}</Td>
                    <Td textAlign={"center"}>
                      <Button
                        colorScheme={"yellow"}
                        onClick={() => handleMemberDeleteClick(member)}
                        {...buttonStyle}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>

          <SearchMember />
          <Pagination pageInfo={pageInfo} />
        </CardBody>

        {/* 탈퇴 모달 */}
        <>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg={"black"} color={"white"}>
              <ModalHeader>회원 탈퇴 처리</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Flex mb={2}>
                  <Box mr={2} fontSize={"1.2rem"} fontWeight={"900"}>
                    {selectMember.member_login_id}
                  </Box>
                  <Box>님을 탈퇴 처리 합니다.</Box>
                </Flex>
                <Box>탈퇴 처리후 복구 불가능 합니다.</Box>
              </ModalBody>

              <ModalFooter>
                <Button mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button
                  colorScheme={"red"}
                  onClick={() => {
                    handleModalDeleteClick(selectMember);
                  }}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      </Card>
    </Center>
  );
}
