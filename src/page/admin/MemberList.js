import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

export function MemberList() {
  return (
    <Center>
      <Card>
        <CardHeader>회원 목록 입니다.</CardHeader>
        <CardBody>
          <Table textAlign={"center"}>
            <Thead>
              <Tr>
                <Th fontSize={"1.2rem"} w={"180px"} textAlign={"center"}>
                  아이디
                </Th>
                <Th fontSize={"1.2rem"} w={"180px"} textAlign={"center"}>
                  이름
                </Th>
                <Th fontSize={"1.2rem"} w={"200px"} textAlign={"center"}>
                  핸드폰번호
                </Th>
                <Th fontSize={"1.2rem"} w={"250px"} textAlign={"center"}>
                  이메일
                </Th>
                <Th fontSize={"1.2rem"} w={"200px"} textAlign={"center"}>
                  가입일
                </Th>
                <Th fontSize={"1.2rem"} w={"200px"} textAlign={"center"}>
                  탈퇴 처리
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td textAlign={"center"}>user</Td>
                <Td textAlign={"center"}>유저</Td>
                <Td textAlign={"center"}>010-1111-2222</Td>
                <Td textAlign={"center"}>user@gmail.com</Td>
                <Td textAlign={"center"}>2024년 01월 19일</Td>
                <Td textAlign={"center"}>
                  <Button colorScheme={"red"}>탈퇴</Button>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Center>
  );
}
