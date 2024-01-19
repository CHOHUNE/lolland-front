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
      .catch(() => {
        toast({
          description: "수정 중 문제가 발생하였습니다.",
          status: "error",
        });
      });
  }

  return (
    <Center>
      <Card>
        <CardHeader fontSize={"1.2rem"} fontWeight={"900"} textAlign={"center"}>
          비밀번호 수정
        </CardHeader>
        <CardBody>
          <FormControl>
            <Flex>
              <FormLabel w={"150px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                새 비밀번호
              </FormLabel>
              <Input
                w={"350px"}
                h={"50px"}
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
                w={"350px"}
                h={"50px"}
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
              w="250px"
              style={{ fontSize: "1.1rem", fontWeight: "900" }}
              onClick={() => navigate(-1)}
            >
              취소 하기
            </Button>
            <Button
              w={"250px"}
              style={{
                color: "whitesmoke",
                backgroundColor: "black",
                fontSize: "1.1rem",
                fontWeight: "900",
              }}
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
