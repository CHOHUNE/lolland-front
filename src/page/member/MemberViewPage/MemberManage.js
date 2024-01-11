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
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function MemberManage() {
  const [member, setMember] = useState(null);

  useEffect(() => {
    axios.get("/api/member/memberInfo").then((response) => {
      setMember(response.data);
    });
  }, []);

  if (member == null) {
    return <Spinner />;
  }

  return (
    <Center>
      <Card w={"700px"}>
        <CardHeader>{member.member_name}_님 정보 입니다.</CardHeader>
        <CardBody>
          <FormControl mt={4}>
            <Flex>
              <FormLabel w={"100px"}>아이디</FormLabel>
              <Input readOnly value={member.member_login_id} />
            </Flex>
          </FormControl>
          <FormControl mt={4}>
            <Flex>
              <FormLabel w={"100px"}>이름</FormLabel>
              <Input readOnly value={member.member_name} />
            </Flex>
          </FormControl>
          <FormControl mt={4}>
            <Flex>
              <FormLabel w={"100px"}>이메일</FormLabel>
              <Input readOnly value={member.member_email} />
            </Flex>
          </FormControl>
          <FormControl mt={4}>
            <Flex>
              <FormLabel w={"100px"}>우편번호</FormLabel>
              <Input readOnly />
            </Flex>
          </FormControl>
          <FormControl mt={4}>
            <Flex>
              <FormLabel w={"100px"}>주소</FormLabel>
              <Input readOnly />
            </Flex>
          </FormControl>
          <FormControl mt={4}>
            <Flex>
              <FormLabel w={"100px"}>상세주소</FormLabel>
              <Input readOnly />
            </Flex>
          </FormControl>
          <FormControl mt={4}>
            <Button>내 주소록 조회 하기</Button>
          </FormControl>
        </CardBody>

        <CardFooter>
          <Flex gap={4}>
            <Button>수정하기</Button>
            <Button colorScheme={"red"}>회원 탈퇴</Button>
          </Flex>
        </CardFooter>
      </Card>
    </Center>
  );
}
