import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider";

export function MemberLogin() {
  const { fetchLogin } = useContext(LoginContext);

  // 회원 로그인 정보 입력
  const [member_login_id, setMember_login_id] = useState("");
  const [member_password, setMember_password] = useState("");

  const navigate = useNavigate();

  const toast = useToast();

  // 로그인 버튼 클릭
  function handleLoginClick() {
    axios
      .post("/api/member/login", {
        member_login_id,
        member_password,
      })
      .then(() => {
        toast({ description: "로그인에 성공 하였습니다.", status: "success" });
        navigate("/");
      })
      .catch(() => {
        toast({ description: "로그인에 실패 하셨습니다.", status: "error" });
      })
      .finally(() => {
        fetchLogin();
      });
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleLoginClick();
    }
  };
  return (
    <Center mt={8} mb={20}>
      <Card w={"1000px"}>
        <CardHeader fontSize={"1.5rem"} color={"#5F625C"} textAlign={"center"}>
          로그인
        </CardHeader>

        <CardBody>
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                아이디
              </FormLabel>
              <Input
                value={member_login_id}
                w={"500px"}
                h={"50px"}
                borderRadius={"0"}
                onChange={(e) => setMember_login_id(e.target.value)}
              />
            </Flex>
          </FormControl>
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                비밀번호
              </FormLabel>
              <Input
                onKeyDown={handleKeyDown}
                value={member_password}
                type={"password"}
                w={"500px"}
                h={"50px"}
                borderRadius={"0"}
                onChange={(e) => setMember_password(e.target.value)}
              />
            </Flex>
          </FormControl>
          <FormControl mt={4}>
            <Flex justifyContent={"center"}>
              <Button
                w={"600px"}
                h={"50px"}
                borderRadius={"0"}
                color={"whitesmoke"}
                bg={"black"}
                _hover={{ backgroundColor: "whitesmoke", color: "black" }}
                onClick={handleLoginClick}
              >
                로그인
              </Button>
            </Flex>
          </FormControl>
          <FormControl mt={4}>
            <Flex justifyContent={"center"}>
              <Button
                w={"200px"}
                h={"20px"}
                borderRadius={"0"}
                style={{ backgroundColor: "white" }}
              >
                아이디 찾기
              </Button>
              <Box>|</Box>
              <Button
                w={"200px"}
                h={"20px"}
                borderRadius={"0"}
                bg={"none"}
                style={{ backgroundColor: "white" }}
              >
                비밀번호 찾기
              </Button>
            </Flex>
          </FormControl>
          <FormControl mt={20} mb={10}>
            <Flex justifyContent={"center"}>
              <Button
                w={"600px"}
                h={"50px"}
                borderRadius={"0"}
                color={"black"}
                bg={"whitesmoke"}
                _hover={{ backgroundColor: "black", color: "whitesmoke" }}
              >
                회원 가입하기
              </Button>
            </Flex>
          </FormControl>
        </CardBody>
      </Card>
    </Center>
  );
}
