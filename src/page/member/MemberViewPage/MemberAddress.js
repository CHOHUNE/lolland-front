import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Table,
  Td,
  Th,
  Tr,
} from "@chakra-ui/react";
import { useEffect } from "react";
import axios from "axios";

export function MemberAddress() {
  useEffect(() => {
    axios.get("/api/");
  }, []);

  return (
    <Center>
      <Card w={"1000px"}>
        <CardHeader>_님의 주소 목록 입니다.</CardHeader>
        <CardBody>
          <Table>
            <Tr>
              <Th fontSize={"1.2rem"}>주소 별명</Th>
              <Th fontSize={"1.2rem"}>우편 번호</Th>
              <Th fontSize={"1.2rem"}>주소</Th>
              <Th fontSize={"1.2rem"}>상세 주소</Th>
              <Th fontSize={"1.2rem"}>기본 주소 여부</Th>
            </Tr>

            {/* TODO : map 으로 주소 목록 읽어 들이자 */}
            <Tr>
              <Td>1</Td>
              <Td>2</Td>
              <Td>3</Td>
              <Td>4</Td>
              <Td>5</Td>
            </Tr>
            <Button>수정</Button>
            <Button>삭제</Button>
            <Tr>
              <Td>1</Td>
              <Td>2</Td>
              <Td>3</Td>
              <Td>4</Td>
              <Td>5</Td>
            </Tr>
            <Button>수정</Button>
            <Button>삭제</Button>
          </Table>
        </CardBody>

        <CardFooter>
          <Button>배송지 추가</Button>
        </CardFooter>
      </Card>
    </Center>
  );
}
