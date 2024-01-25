import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function MemberInfo() {
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

  const [password, setPassword] = useState("");

  const toast = useToast();

  const navigate = useNavigate();

  function handleMemberInfoClick() {
    axios
      .get("/api/member/checkPassword", {
        params: {
          password,
        },
      })
      .then(() =>
        toast({
          description: "정보가 일치하여 회원 정보를 조회 합니다.",
          status: "success",
        }),
      )
      .then(() => navigate("/memberPage/memberInfo/memberManagePage"))
      .catch(() => {
        toast({
          description: "비밀번호가 틀립니다.",
          status: "error",
        });
      });
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleMemberInfoClick();
    }
  };
  return (
    <Center>
      <Card w={"350px"} shadow={"1px 1px 3px 1px #dadce0"}>
        <CardHeader
          mt={4}
          textAlign={"center"}
          fontSize={"2rem"}
          fontWeight={"bold"}
          alignItems={"center"}
        >
          회원 정보 확인
        </CardHeader>
        <CardBody>
          <Box mb={10}>정보를 보호하기 위해 비밀번호를 확인 합니다.</Box>
          <Input
            shadow={"1px 1px 3px 1px #dadce0 inset"}
            w={"250px"}
            type={"password"}
            onKeyDown={handleKeyDown}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Flex justifyContent={"center"} gap={10} mt={8} mb={4}>
            <Button
              w={"130px"}
              bg={"whitesmoke"}
              color={"black"}
              shadow={"1px 1px 3px 1px #dadce0"}
              _hover={{
                backgroundColor: "black",
                color: "whitesmoke",
                transition:
                  "background 0.5s ease-in-out, color 0.5s ease-in-out, box-shadow 0.5s ease-in-out",
                shadow: "1px 1px 3px 1px #dadce0 inset",
              }}
              onClick={() => navigate("/")}
            >
              취소
            </Button>
            <Button
              {...buttonStyle}
              w={"130px"}
              onClick={handleMemberInfoClick}
            >
              확인
            </Button>
          </Flex>
        </CardBody>
      </Card>
    </Center>
  );
}
