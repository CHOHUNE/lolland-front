import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
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
import { useNavigate } from "react-router-dom";

export function MemberAddress() {
  const [memberAddress, setMemberAddress] = useState([]);
  const [member, setMember] = useState("");

  const [selectedAddress, setSelectedAddress] = useState("");

  // 주소록 상태 변경 인식 코드 -----------------------------------------------------
  const [addressState, setAddressState] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  // 수정 모달 -----------------------------------------------------------------
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  // 삭제 모달 -----------------------------------------------------------------
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  // 수정 모달 열기 -----------------------------------------------------------------
  const openEditModal = () => {
    onEditOpen();
  };

  // 삭제 모달 열기 -----------------------------------------------------------------
  const openDeleteModal = (address) => {
    setSelectedAddress(address);
    onDeleteOpen();
  };

  // 페이지 랜딩시 -----------------------------------------------------------------
  useEffect(() => {
    axios
      .get("/api/memberAddress/loginUser")
      .then((response) => {
        setMemberAddress(response.data);
      })
      .catch(() => {
        toast({
          description: "로그인후 서비스를 이용해주세요.",
          status: "error",
        });
        navigate("/login");
      })
      .finally(() => {
        setAddressState(false);
      });
  }, [addressState]);

  useEffect(() => {
    axios.get("/api/member/memberInfo").then((response) => {
      setMember(response.data);
    });
  }, []);

  // 삭제 버튼 클릭 -----------------------------------------------------------------
  function handleDeleteClick() {
    axios
      .delete("/api/memberAddress/deleteAddress/" + selectedAddress.id)
      .then(() => {
        onDeleteClose();
        toast({
          description:
            selectedAddress.member_address_name + " 주소가 삭제 되었습니다.",
          status: "success",
        });
      })
      .then(() => {
        setAddressState(true);
      })
      .catch(() => {
        toast({
          description: "삭제 중 문제가 발생하였습니다.",
          status: "error",
        });
      });
  }

  return (
    <Center>
      <Card w={"1000px"}>
        <CardHeader mt={4}>
          <Flex gap={4} alignItems={"flex-end"}>
            <Box fontSize={"1.4rem"} fontWeight={"900"}>
              {member.member_name}
            </Box>
            <Box>_님의 주소 목록 입니다.</Box>
          </Flex>
        </CardHeader>
        <CardBody>
          <Table>
            <Thead>
              <Tr>
                <Th fontSize={"1.2rem"}>주소 별명</Th>
                <Th fontSize={"1.2rem"}>우편 번호</Th>
                <Th fontSize={"1.2rem"}>주소</Th>
                <Th fontSize={"1.2rem"}>상세 주소</Th>
                <Th fontSize={"1.2rem"}>기본 주소 여부</Th>
              </Tr>
            </Thead>

            <>
              {/* TODO : map 으로 주소 목록 읽어 들이자 */}
              {memberAddress != null &&
                memberAddress.map((address) => (
                  <Tbody key={address.id}>
                    <Tr>
                      <Td>{address.member_address_name}</Td>
                      <Td>{address.member_post_code}</Td>
                      <Td>{address.member_address}</Td>
                      <Td>{address.member_detail_address}</Td>
                      <Td>
                        {address.member_address_type === "main" ? (
                          <Box as="span">메인주소</Box>
                        ) : (
                          <Box as="span"> - </Box>
                        )}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td colSpan={5}>
                        <Flex gap={2} mt={2}>
                          <Button onClick={openEditModal}>수정</Button>
                          <Button onClick={() => openDeleteModal(address)}>
                            삭제
                          </Button>
                        </Flex>
                      </Td>
                    </Tr>
                  </Tbody>
                ))}
            </>
          </Table>
        </CardBody>

        <CardFooter>
          <Button onClick={() => navigate("/memberPage/addressWrite")}>
            배송지 추가
          </Button>
        </CardFooter>
      </Card>

      {/* 수정 모달 */}
      <>
        <Modal
          isCentered
          onClose={onEditClose}
          isOpen={isEditOpen}
          motionPreset="slideInBottom"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>주소 수정</ModalHeader>
            <ModalCloseButton />
            <ModalBody>수정 페이지 입니다.</ModalBody>
            <ModalFooter>
              <Button
                colorScheme="red"
                mr={3}
                onClick={() => {
                  // 여기에 수정 로직을 추가하세요
                  onEditClose();
                }}
              >
                수정
              </Button>
              <Button variant="ghost" onClick={onEditClose}>
                취소
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>

      {/* 삭제 모달 */}
      <>
        <Modal
          isCentered
          onClose={onDeleteClose}
          isOpen={isDeleteOpen}
          motionPreset="slideInBottom"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>삭제 확인</ModalHeader>
            <ModalCloseButton />
            <ModalBody>정말로 삭제하시겠습니까?</ModalBody>
            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={handleDeleteClick}>
                삭제
              </Button>
              <Button variant="ghost" onClick={onDeleteClose}>
                취소
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </Center>
  );
}
