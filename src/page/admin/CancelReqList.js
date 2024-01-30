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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

export function CancelReqList() {
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
          취소 요청 목록
        </CardHeader>
        <CardBody>
          <Table textAlign={"center"}>
            <Thead>
              <Tr>
                <Th fontSize={"1.2rem"} w={"180px"} textAlign={"center"}>
                  주문번호
                </Th>
                <Th fontSize={"1.2rem"} w={"180px"} textAlign={"center"}>
                  상품명
                </Th>
                <Th fontSize={"1.2rem"} w={"200px"} textAlign={"center"}>
                  가격
                </Th>
                <Th fontSize={"1.2rem"} w={"250px"} textAlign={"center"}>
                  아이디
                </Th>
                <Th fontSize={"1.2rem"} w={"200px"} textAlign={"center"}>
                  연락처
                </Th>
                <Th fontSize={"1.2rem"} w={"200px"} textAlign={"center"}>
                  취소 승인
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {/*{memberList.map((member) => */}
              {/*{*/}
              {/*  const formatDate = (dateString) => {*/}
              {/*    const date = new Date(dateString);*/}
              {/*    const year = date.getFullYear();*/}
              {/*    const month = (date.getMonth() + 1)*/}
              {/*      .toString()*/}
              {/*      .padStart(2, "0");*/}
              {/*    const day = date.getDate().toString().padStart(2, "0");*/}
              {/*    return `${year}년 ${month}월 ${day}일`;*/}
              {/*  };*/}
              return (
              <Tr key={"아이디"}>
                <Td textAlign={"center"}>{"member.member_login_id"}</Td>
                <Td textAlign={"center"}>{"member.member_name"}</Td>
                <Td textAlign={"center"}>{"member.member_phone_number"}</Td>
                <Td textAlign={"center"}>{"member.member_email"}</Td>
                <Td textAlign={"center"}>{"formatDate(member.reg_time)"}</Td>
                <Td textAlign={"center"}>
                  <Button
                  // onClick={() => handleMemberDeleteClick(member)}
                  // {...buttonStyle}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </Button>
                </Td>
              </Tr>
              ){/*}*/}
              {/*)}*/}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Center>
  );
}
