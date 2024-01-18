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
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function MemberFindPassword() {
  // 아이디
  const [member_login_id, setMember_login_id] = useState("");
  // 이메일
  const [member_email, setMember_email] = useState("");
  const [email1, setEmail1] = useState("");
  const [email2, setEmail2] = useState("");

  // 임시 비밀번호
  const [randomPassword, setRandomPassword] = useState("");

  const toast = useToast();

  const navigate = useNavigate();

  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    setMember_email(email1 + "@" + email2);
  }, [email1, email2]);

  // 비밀번호 찾기 버튼 클릭 --------------------------------------
  function handleFindPasswordClick() {
    // 찾기 버튼을 누르면 난수 생성 하기 ( 문자열과 숫자를 섞어서 생성 )----------------------------
    const randomNumber = Math.random().toString(36).substr(2, 9);

    // 해당 맴버가 DB에 존재 하는지 확인 ----------------------------
    axios
      .get("/api/member/findPassword", {
        params: {
          member_login_id,
          member_email,
        },
      })
      .then(() => setRandomPassword(randomNumber))
      .then(() => {
        // 임시 비밀 번호 발급 모달 띄우기
        onOpen();
      })
      .catch(() => {
        toast({ description: "회원 정보가 없습니다.", status: "error" });
      });
  }

  // 모달 창 내의 발송 버튼 클릭시 로직 --------------------------------------------------
  function handleModalSendClick() {
    // 메일로 임시 비밀 번호 발송 하기 --------------------------------------------------
    axios
      .post("/api/memberEmail/findPassword", {
        member_email,
        message: randomPassword,
      })
      .then(() => {
        // 임시 비밀번호가 발송 되면 회원의 비밀번호 변경 하기 -------------------------------
        axios.put("/api/member/setRandomPassword", {
          member_login_id,
          member_password: randomPassword,
        });
      })
      .then(() =>
        toast({
          description: "등록된 메일로 임시 비밀번호가 발급 되었습니다.",
          status: "success",
        }),
      )
      .then(() => navigate("/login"))
      .catch(() => {
        toast({
          description: "메일 발송중 문제가 발생 하였습니다.",
          status: "error",
        });
      })
      .finally(onClose);
  }

  return (
    <Center mt={8} mb={20}>
      <Card w={"1000px"}>
        <CardHeader fontSize={"1.5rem"} color={"#5F625C"} textAlign={"center"}>
          비밀번호 찾기
        </CardHeader>

        <CardBody>
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                아이디
              </FormLabel>
              <Input
                w={"500px"}
                h={"50px"}
                borderRadius={"0"}
                value={member_login_id}
                onChange={(e) => setMember_login_id(e.target.value)}
              />
            </Flex>
          </FormControl>

          {/* 이메일 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                이메일
              </FormLabel>
              <Input
                id="member_email1"
                w={"225px"}
                h={"50px"}
                borderRadius={"0"}
                value={email1}
                onChange={(e) => {
                  setEmail1(e.target.value);
                }}
              />
              <Box
                fontSize={"1.1rem"}
                lineHeight={"50px"}
                ml={"15px"}
                mr={"15px"}
              >
                @
              </Box>
              <Input
                id="member_email2"
                w={"225px"}
                h={"50px"}
                borderRadius={"0"}
                value={email2}
                onChange={(e) => {
                  setEmail2(e.target.value);
                }}
              />
            </Flex>
          </FormControl>
        </CardBody>

        <Flex justifyContent={"center"} pt={"0px"} mb={"20px"}>
          <CardFooter>
            <Button
              w={"250px"}
              h={"50px"}
              style={{
                backgroundColor: "black",
                color: "whitesmoke",
                fontSize: "1.1rem",
                fontWeight: "900",
              }}
              onClick={handleFindPasswordClick}
            >
              비밀번호 찾기
            </Button>
          </CardFooter>
        </Flex>
      </Card>

      {/* 아이디 찾기 성공시 오픈할 모달 */}
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent textAlign={"center"}>
            <ModalHeader fontSize={"1.5rem"} fontWeight={"900"}>
              비밀 번호를 재발급 받으시겠습니까?
            </ModalHeader>
            <ModalBody>
              <Box mt={4}>등록된 이메일 : {member_email}</Box>
              <Box mt={2} fontWeight={"bold"}>
                임시 비밀번호가 발송 됩니다.
              </Box>
            </ModalBody>

            <ModalFooter mt={4}>
              <Flex gap={2}>
                <Button
                  w={"80px"}
                  bg={"whitesmoke"}
                  color={"black"}
                  _hover={{ backgroundColor: "black", color: "whitesmoke" }}
                  mr={3}
                  onClick={onClose}
                >
                  취소
                </Button>
                <Button
                  w={"80px"}
                  bg={"black"}
                  color={"whitesmoke"}
                  _hover={{ backgroundColor: "whitesmoke", color: "black" }}
                  mr={3}
                  onClick={handleModalSendClick}
                >
                  발송
                </Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </Center>
  );
}
