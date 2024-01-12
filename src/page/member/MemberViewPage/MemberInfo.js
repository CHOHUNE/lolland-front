import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
  FormControl,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function MemberInfo() {
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
      <Card>
        <CardHeader>회원 정보 확인</CardHeader>
        <CardBody>
          <Box mb={10}>id_님 정보를 보호하기 위해 비밀번호를 확인 합니다.</Box>
          <Input
            type={"password"}
            onKeyDown={handleKeyDown}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Flex justifyContent={"center"} gap={10} mt={6}>
            <Button
              w={"130px"}
              bg={"whitesmoke"}
              color={"black"}
              _hover={{ backgroundColor: "black", color: "whitesmoke" }}
              onClick={() => navigate("/")}
            >
              취소
            </Button>
            <Button
              w={"130px"}
              bg={"black"}
              color={"whitesmoke"}
              _hover={{ backgroundColor: "whitesmoke", color: "black" }}
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
