import {
  background,
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

  const inputStyle = {
    shadow: "1px 1px 3px 1px #dadce0 inset",
  };

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

  // 로그인 버튼 클릭
  function handleLoginClick() {
    axios
      .post("/api/member/login", {
        member_login_id,
        member_password,
      })
      .then(() => {
        toast({ description: "로그인에 성공 하였습니다.", status: "success" });
        navigate(-1);
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
      <Card w={"1000px"} shadow={"1px 1px 3px 1px #dadce0"}>
        <CardHeader
          mt={4}
          textAlign={"center"}
          fontSize={"2rem"}
          fontWeight={"bold"}
          alignItems={"center"}
        >
          로그인
        </CardHeader>

        <CardBody>
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                아이디
              </FormLabel>
              <Input
                {...inputStyle}
                value={member_login_id}
                w={"500px"}
                h={"50px"}
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
                {...inputStyle}
                onKeyDown={handleKeyDown}
                value={member_password}
                type={"password"}
                w={"500px"}
                h={"50px"}
                onChange={(e) => setMember_password(e.target.value)}
              />
            </Flex>
          </FormControl>
          <FormControl mt={4}>
            <Flex justifyContent={"center"}>
              <Button
                {...buttonStyle}
                w={"600px"}
                h={"50px"}
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
                onClick={() => navigate("/findId")}
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
                onClick={() => navigate("/findPassword")}
              >
                비밀번호 찾기
              </Button>
            </Flex>
          </FormControl>
          <FormControl mt={20} mb={10}>
            <Flex justifyContent={"center"}>
              <Button
                {...buttonStyle}
                w={"600px"}
                h={"50px"}
                color={"black"}
                bg={"whitesmoke"}
                _hover={{
                  backgroundColor: "black",
                  color: "whitesmoke",
                  transition:
                    "background 0.5s ease-in-out, color 0.5s ease-in-out, box-shadow 0.5s ease-in-out",
                  shadow: "1px 1px 3px 1px #dadce0 inset",
                }}
                onClick={() => navigate("/signup")}
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
