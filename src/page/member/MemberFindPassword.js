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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export function MemberFindPassword() {
  // 아이디
  const [member_login_id, setMember_login_id] = useState("");
  // 이메일
  const [member_email, setMember_email] = useState("");
  const [email1, setEmail1] = useState("");
  const [email2, setEmail2] = useState("");

  useEffect(() => {
    setMember_email(email1 + "@" + email2);
  }, [email1, email2]);

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
              // onClick={handleFindIdClick}
            >
              비밀번호 찾기
            </Button>
          </CardFooter>
        </Flex>
      </Card>

      {/* 아이디 찾기 성공시 오픈할 모달 */}
      <>
        <Modal
        // isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign={"center"}>
              가입하신 이메일로 ID 를 발송 하였습니다.
            </ModalHeader>
            <ModalBody>
              {/*<Box fontSize={"10rem"} textAlign={"center"}>*/}
              {/*  {showSpinner && (*/}
              {/*    <FontAwesomeIcon icon={faSpinner} spinPulse color={"black"} />*/}
              {/*  )}*/}
              {/*  {showCheckCircle && (*/}
              {/*    <FontAwesomeIcon*/}
              {/*      icon={faCheckCircle}*/}
              {/*      bounce={1}*/}
              {/*      color={"green"}*/}
              {/*    />*/}
              {/*  )}*/}
              {/*</Box>*/}
            </ModalBody>

            <ModalFooter>
              <Button
                bg={"black"}
                color={"whitesmoke"}
                _hover={{ backgroundColor: "whitesmoke", color: "black" }}
                mr={3}
                // onClick={handleModalCloseClick}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </Center>
  );
}
