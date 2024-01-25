import {
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
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../../component/LoginProvider";

export function PasswordEdit() {
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

  // 반대 버튼 css
  const revButtonStyle = {
    background: "whitesmoke",
    color: "black",
    shadow: "1px 1px 3px 1px #dadce0",
    _hover: {
      backgroundColor: "black",
      color: "whitesmoke",
      transition:
        "background 0.5s ease-in-out, color 0.5s ease-in-out, box-shadow 0.5s ease-in-out",
      shadow: "1px 1px 3px 1px #dadce0 inset",
    },
  };

  // 인풋 css
  const inputStyle = {
    shadow: "1px 1px 3px 1px #dadce0 inset",
    width: "350px",
    height: "50px",
    type: "password",
  };

  const [member_password, setMember_password] = useState("");
  const [member_check_password, setMember_check_password] = useState("");

  const [editChangeCheck, setEditChangeCheck] = useState(true);

  const navigate = useNavigate();

  const toast = useToast();

  const { fetchLogin } = useContext(LoginContext);

  useEffect(() => {
    if (member_password === member_check_password) {
      setEditChangeCheck(false);
    } else {
      setEditChangeCheck(true);
    }
  }, [member_password, member_check_password]);

  function handleEditClick() {
    axios
      .put("/api/member/editPassword", {
        member_password,
      })
      .then(() => {
        toast({
          description: "비밀번호가 수정 되었습니다.",
          status: "success",
        });
      })
      .then(() => {
        axios
          .post("/api/member/logout")
          .then(() => {
            toast({
              description: "로그 아웃 되었습니다.",
              status: "success",
            });
          })
          .catch(() => {
            toast({
              description: "로그 아웃 중 문제가 발생하였습니다.",
              status: "error",
            });
          })
          .finally(() => fetchLogin());
      })
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          let errorMessage = error.response.data[0];
          toast({
            description: errorMessage,
            status: "error",
          });
        } else {
          // 기타 오류에 대한 처리
          toast({
            description: "가입에 실패하셨습니다.",
            status: "error",
          });
        }
      });
  }

  return (
    <Center>
      <Card shadow={"1px 1px 3px 1px #dadce0"}>
        <CardHeader
          mt={4}
          textAlign={"center"}
          fontSize={"2rem"}
          fontWeight={"bold"}
          alignItems={"center"}
        >
          비밀번호 수정
        </CardHeader>
        <CardBody>
          <FormControl>
            <Flex>
              <FormLabel w={"150px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                새 비밀번호
              </FormLabel>
              <Input
                {...inputStyle}
                value={member_password}
                onChange={(e) => {
                  setMember_password(e.target.value);
                }}
              />
            </Flex>
          </FormControl>

          <FormControl isInvalid={member_password != member_check_password}>
            <Flex>
              <FormLabel w={"150px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                비밀번호 다시 입력
              </FormLabel>
              <Input
                {...inputStyle}
                value={member_check_password}
                onChange={(e) => {
                  setMember_check_password(e.target.value);
                }}
              />
            </Flex>
            <Flex justifyContent={"center"} pt={0}>
              <FormLabel
                w={"150px"}
                fontSize={"1.1rem"}
                lineHeight={"50px"}
              ></FormLabel>
              <FormErrorMessage w={"300px"} h={"50px"} fontSize={"1.1rem"}>
                비밀번호가 다릅니다.
              </FormErrorMessage>
            </Flex>
          </FormControl>
        </CardBody>

        <CardFooter>
          <Flex gap={10}>
            <Button
              {...revButtonStyle}
              w="250px"
              style={{ fontSize: "1.1rem", fontWeight: "900" }}
              onClick={() => navigate(-1)}
            >
              취소 하기
            </Button>
            <Button
              {...buttonStyle}
              w={"250px"}
              onClick={handleEditClick}
              isDisabled={editChangeCheck}
            >
              변경 하기
            </Button>
          </Flex>
        </CardFooter>
      </Card>
    </Center>
  );
}
