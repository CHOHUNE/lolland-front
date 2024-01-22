import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
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
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router-dom";

export function MemberList() {
  const [memberList, setMemberList] = useState([]);
  const [selectMember, setSelectMember] = useState("");

  // 회원 탈퇴 처리 인식
  const [checkMember, setCheckMember] = useState(false);

  const toast = useToast();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const [params] = useSearchParams();

  useEffect(() => {
    axios
      .get("/api/member/listAll?" + params)
      .then((response) => {
        setMemberList(response.data);
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
  }, [checkMember]);

  // 삭제 버튼 클릭시 동작
  const handleMemberDeleteClick = (e) => {
    console.log(e);
    setSelectMember(e);
    onOpen();
  };

  // 모달내 삭제 버튼 클릭시 실제 삭제
  const handleModalDeleteClick = (e) => {
    console.log(e.id);
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
      <Card>
        <CardHeader>회원 목록 입니다.</CardHeader>
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
                      >
                        탈퇴
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
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
                  <Box
                    mr={2}
                    fontSize={"1.2rem"}
                    fontWeight={"900"}
                    color={"yellowgreen"}
                  >
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
                <Button colorScheme={"red"}>
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    onClick={() => handleModalDeleteClick(selectMember)}
                  />
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      </Card>
    </Center>
  );
}
