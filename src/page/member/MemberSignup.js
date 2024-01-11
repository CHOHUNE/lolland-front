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
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export function MemberSignup() {
  const [member_name, setMember_name] = useState("");
  const [member_login_id, setMember_login_id] = useState("");
  const [member_password, setMember_password] = useState("");
  const [member_password_checked, setMember_password_checked] = useState("");
  const [member_phone_number, setMember_phone_number] = useState("");
  const [member_phone_number1, setMember_phone_number1] = useState("");
  const [member_phone_number2, setMember_phone_number2] = useState("");
  const [member_phone_number3, setMember_phone_number3] = useState("");
  const [member_email, setMember_email] = useState("");
  const [member_email1, setMember_email1] = useState("");
  const [member_email2, setMember_email2] = useState("");
  const [sendNumber, setSendNumber] = useState(false);

  useEffect(() => {
    setMember_email(member_email1 + "@" + member_email2);
    setMember_phone_number(
      member_phone_number1 +
        "-" +
        member_phone_number2 +
        "-" +
        member_phone_number3,
    );
  }, [
    member_email1,
    member_email2,
    member_phone_number1,
    member_phone_number2,
    member_phone_number3,
  ]);

  function handleEmailCodeClick() {
    setSendNumber(true);
    console.log(member_email);
    console.log(member_phone_number);
  }

  return (
    <Center mt={8} mb={8}>
      <Card w={"1000px"}>
        <CardHeader fontSize={"1.5rem"} color={"#5F625C"} textAlign={"center"}>
          회원가입
        </CardHeader>
        <CardBody>
          {/* 이름 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                이 름
              </FormLabel>
              <Input
                value={member_name}
                w={"500px"}
                h={"50px"}
                borderRadius={"0"}
                onChange={(e) => {
                  setMember_name(e.target.value);
                }}
              />
            </Flex>
          </FormControl>
          {/* 아이디 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                아이디
              </FormLabel>
              <Input
                w={"350px"}
                h={"50px"}
                borderRadius={"0"}
                value={member_login_id}
                onChange={(e) => setMember_login_id(e.target.value)}
              />
              <Button w={"140px"} h={"50px"} ml={"10px"}>
                중복확인
              </Button>
            </Flex>
          </FormControl>
          {/* 비밀번호 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                비밀번호
              </FormLabel>
              <Input
                type={"password"}
                w={"500px"}
                h={"50px"}
                borderRadius={"0"}
                value={member_password}
                onChange={(e) => setMember_password(e.target.value)}
              />
            </Flex>
          </FormControl>
          {/* 비밀번호 체크 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                비밀번호 확인
              </FormLabel>
              <Input
                value={member_password_checked}
                type={"password"}
                w={"500px"}
                h={"50px"}
                borderRadius={"0"}
                onChange={(e) => setMember_password_checked(e.target.value)}
              />
            </Flex>
            <FormErrorMessage>비밀번호가 다릅니다.</FormErrorMessage>
          </FormControl>
          {/* 핸드폰번호 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                휴대폰번호
              </FormLabel>
              <Input
                value={member_phone_number1}
                w={"140px"}
                h={"50px"}
                borderRadius={"0"}
                onChange={(e) => setMember_phone_number1(e.target.value)}
              />
              <Box
                fontSize={"1.1rem"}
                lineHeight={"50px"}
                ml={"15px"}
                mr={"15px"}
              >
                -
              </Box>
              <Input
                value={member_phone_number2}
                w={"140px"}
                h={"50px"}
                borderRadius={"0"}
                onChange={(e) => setMember_phone_number2(e.target.value)}
              />
              <Box
                fontSize={"1.1rem"}
                lineHeight={"50px"}
                ml={"15px"}
                mr={"15px"}
              >
                -
              </Box>
              <Input
                value={member_phone_number3}
                w={"140px"}
                h={"50px"}
                borderRadius={"0"}
                onChange={(e) => setMember_phone_number3(e.target.value)}
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
                value={member_email1}
                w={"170px"}
                h={"50px"}
                borderRadius={"0"}
                onChange={(e) => setMember_email1(e.target.value)}
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
                value={member_email2}
                w={"170px"}
                h={"50px"}
                borderRadius={"0"}
                onChange={(e) => setMember_email2(e.target.value)}
              />
              <Button
                w={"90px"}
                h={"50px"}
                ml={"10px"}
                fontSize={"0.8rem"}
                onClick={handleEmailCodeClick}
              >
                인증번호 발송
              </Button>
            </Flex>
          </FormControl>
          {/* 인증번호 입력 */}
          {sendNumber && (
            <FormControl mt={2}>
              <Flex justifyContent={"center"}>
                <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                  인증번호 입력
                </FormLabel>
                <Input
                  placeholder={"메일로 전송된 인증번호를 입력해 주세요."}
                  w={"500px"}
                  h={"50px"}
                  borderRadius={"0"}
                />
              </Flex>
            </FormControl>
          )}

          {/* 우편번호 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                우편번호
              </FormLabel>
              <Input w={"350px"} h={"50px"} borderRadius={"0"} />
              <Button w={"140px"} h={"50px"} ml={"10px"}>
                주소검색
              </Button>
            </Flex>
          </FormControl>
          {/* 주소 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                주소
              </FormLabel>
              <Input w={"500px"} h={"50px"} borderRadius={"0"} />
            </Flex>
          </FormControl>
          {/* 상세주소 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                상세주소
              </FormLabel>
              <Input w={"500px"} h={"50px"} borderRadius={"0"} />
            </Flex>
          </FormControl>
        </CardBody>

        <Flex justifyContent={"center"}>
          <CardFooter>
            <FormControl>
              <Button w={"250px"} h={"50px"}>
                취소하기
              </Button>
            </FormControl>
            <FormControl ml={5}>
              <Button
                w={"250px"}
                h={"50px"}
                style={{ backgroundColor: "#5F625C" }}
                color={"whitesmoke"}
              >
                가입하기
              </Button>
            </FormControl>
          </CardFooter>
        </Flex>
      </Card>
    </Center>
  );
}
