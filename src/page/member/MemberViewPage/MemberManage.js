import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function MemberManage() {
  const [member, setMember] = useState(null);

  const toast = useToast();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const navigate = useNavigate();

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

  useEffect(() => {
    axios.get("/api/member/memberInfo").then((response) => {
      setMember(response.data);
    });
  }, []);

  if (member == null) {
    return <Spinner />;
  }

  // 회원 탈퇴 버튼 클릭
  function handleMemberDeleteClick() {
    axios
      .delete("/api/member")
      .then(() =>
        toast({ description: "회원자격을 상실 하셨습니다.", status: "error" }),
      )
      .then(() => navigate("/"))
      .catch(() =>
        toast({
          description: "탈퇴 처리중 문제가 발생하였습니다.",
          colorScheme: "gray",
        }),
      );
  }

  return (
    <Center>
      <Card w={"700px"}>
        <CardHeader
          textAlign={"left"}
          lineHeight={"70px"}
          fontSize={"1.7rem"}
          fontWeight={"bold"}
        >
          <Flex>
            <Box fontSize={"1.8rem"} color={"#E87F06"}>
              {member.member_name}
            </Box>
            <Box>님 정보 입니다.</Box>
          </Flex>
        </CardHeader>
        <CardBody>
          {/* 프로필 사진 */}
          <FormControl mt={4}>
            <Flex>
              <FormLabel w={"100px"}>프로필 사진</FormLabel>
              <Image
                borderRadius="full"
                boxSize="150px"
                src={member.memberImageDto.file_url}
                alt={member.memberImageDto.file_name}
              />
            </Flex>
            {member.memberImageDto.image_type === "default" && (
              <FormHelperText ml={"110px"}>기본 이미지 입니다.</FormHelperText>
            )}
          </FormControl>

          {/* 이름 */}
          <FormControl mt={6}>
            <Flex>
              <FormLabel w={"100px"}>이름</FormLabel>
              <Input readOnly value={member.member_name} />
            </Flex>
          </FormControl>

          {/* 아이디 */}
          <FormControl mt={4}>
            <Flex>
              <FormLabel w={"100px"}>아이디</FormLabel>
              <Input readOnly value={member.member_login_id} />
            </Flex>
          </FormControl>

          {/* 휴대폰 번호 */}
          <FormControl mt={4}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                휴대폰번호
              </FormLabel>
              <Input
                maxLength={3}
                h={"50px"}
                readOnly
                value={member.member_phone_number}
              />
            </Flex>
          </FormControl>

          {/* 이메일 */}
          <FormControl mt={4}>
            <Flex>
              <FormLabel w={"100px"}>이메일</FormLabel>
              <Input readOnly value={member.member_email} />
            </Flex>
          </FormControl>

          {/* 우편번호 */}
          <FormControl mt={4}>
            <Flex>
              <FormLabel w={"100px"}>우편번호</FormLabel>
              <Input
                readOnly
                value={member.memberAddressDto.member_post_code}
              />
            </Flex>
          </FormControl>

          {/* 주소 */}
          <FormControl mt={4}>
            <Flex>
              <FormLabel w={"100px"}>주소</FormLabel>
              <Input readOnly value={member.memberAddressDto.member_address} />
            </Flex>
          </FormControl>

          {/* 상세 주소 */}
          <FormControl mt={4}>
            <Flex>
              <FormLabel w={"100px"}>상세주소</FormLabel>
              <Input
                readOnly
                value={member.memberAddressDto.member_detail_address}
              />
            </Flex>
          </FormControl>

          {/* 자기 소개 */}
          <FormControl mt={4}>
            <Flex>
              <FormLabel w={"100px"}>자기소개</FormLabel>
              {member.member_introduce.length !== 0 ? (
                <Textarea
                  h={"150px"}
                  readOnly
                  value={member.member_introduce}
                />
              ) : (
                <Textarea
                  h={"150px"}
                  readOnly
                  value={"자기 소개를 작성해 주세요."}
                />
              )}
            </Flex>
          </FormControl>
        </CardBody>

        <CardFooter>
          <Flex gap={60}>
            {/* 내 주소록 조회 버튼 */}
            <Button
              bg={"none"}
              shadow={"3px 3px 3px 3px #f5f6f6"}
              w={"180px"}
              {...buttonStyle}
              onClick={() => navigate("/memberPage/addressInfo")}
            >
              내 주소록 조회 하기
            </Button>
            <Flex gap={2}>
              <Button
                bg={"none"}
                w={"100px"}
                {...buttonStyle}
                onClick={() => navigate("/memberPage/memberEdit")}
              >
                수정하기
              </Button>
              <Button {...buttonStyle} w={"100px"} bg={"red"} onClick={onOpen}>
                회원 탈퇴
              </Button>
            </Flex>
          </Flex>
        </CardFooter>
      </Card>

      {/* 삭제 모달창 */}
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>회원 탈퇴 😭</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box>정말 탈퇴 하시겠습니까?</Box>
              <Box color={"red"}>탈퇴 버튼 클릭시 즉시 탈퇴 처리 됩니다.</Box>
            </ModalBody>

            <ModalFooter>
              <Button mr={3} onClick={onClose}>
                취소
              </Button>
              <Button colorScheme={"red"} onClick={handleMemberDeleteClick}>
                탈퇴
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </Center>
  );
}
