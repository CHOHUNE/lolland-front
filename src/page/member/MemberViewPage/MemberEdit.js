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
import { useImmer } from "use-immer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

export function MemberEdit() {
  const [member, updateMember] = useImmer();

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/member/memberInfo");
  }, []);

  return (
    <Center>
      <Card w={"700px"}>
        <CardHeader>맴버 수정페이지에요</CardHeader>

        <CardBody>
          {/* 이름 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                이 름
              </FormLabel>
              <Input w={"500px"} h={"50px"} borderRadius={"0"} />
            </Flex>
          </FormControl>
          {/* 아이디 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                아이디
              </FormLabel>
              <Input w={"350px"} h={"50px"} borderRadius={"0"} />
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
                type={"password"}
                w={"500px"}
                h={"50px"}
                borderRadius={"0"}
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
                id="member_phone_number1"
                maxLength={3}
                w={"140px"}
                h={"50px"}
                borderRadius={"0"}
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
                id="member_phone_number2"
                maxLength={4}
                w={"140px"}
                h={"50px"}
                borderRadius={"0"}
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
                id="member_phone_number3"
                maxLength={4}
                w={"140px"}
                h={"50px"}
                borderRadius={"0"}
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
              />
            </Flex>
          </FormControl>
          {/* 인증번호 입력 */}

          {/* 우편번호 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                우편번호
              </FormLabel>
              <Input w={"350px"} h={"50px"} borderRadius={"0"} readOnly />
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
              <Input w={"500px"} h={"50px"} borderRadius={"0"} readOnly />
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

        <CardFooter>
          <Flex gap={10}>
            <Button w="300px" onClick={() => navigate(-1)}>
              수정 취소
            </Button>
            <Button
              w={"300px"}
              style={{ color: "whitesmoke", backgroundColor: "black" }}
            >
              수정 완료
            </Button>
          </Flex>
        </CardFooter>
      </Card>
    </Center>
  );
}
