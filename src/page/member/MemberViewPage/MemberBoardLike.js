import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Checkbox,
  Flex,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export function MemberBoardLike() {
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

  const [gameBoardList, setGameBoardList] = useState([]);

  useEffect(() => {
    // axios.get("/api/");
  }, []);

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
          좋아요한 게시글 목록
        </CardHeader>

        <CardBody>
          <Table textAlign={"center"}>
            <Thead>
              <Tr>
                <Th fontSize={"1.2rem"} w={"150px"} textAlign={"center"}>
                  선택
                </Th>
                <Th fontSize={"1.2rem"} w={"180px"} textAlign={"center"}>
                  카테고리
                </Th>
                <Th fontSize={"1.2rem"} w={"280px"} textAlign={"center"}>
                  제목
                </Th>
                <Th fontSize={"1.2rem"} w={"350px"} textAlign={"center"}>
                  내용
                </Th>
                <Th fontSize={"1.2rem"} w={"200px"} textAlign={"center"}>
                  좋아요 삭제
                </Th>
              </Tr>
            </Thead>

            <Tbody>
              {gameBoardList.map((gameBoard) => (
                <Tr key={gameBoard.id}>
                  <Td textAlign={"center"}>
                    <Checkbox size={"lg"} colorScheme={"orange"}></Checkbox>
                  </Td>
                  <Td textAlign={"center"}>{gameBoard.category}</Td>
                  <Td textAlign={"center"}>{gameBoard.title}</Td>
                  <Td textAlign={"center"}>{gameBoard.board_content}</Td>
                  <Td textAlign={"center"}>
                    <FontAwesomeIcon
                      icon={faXmark}
                      fontSize={"1.4rem"}
                      color={"gray"}
                    />
                  </Td>
                </Tr>
              ))}

              <Tr key={1}>
                <Td textAlign={"center"}>
                  <Checkbox size={"lg"} colorScheme={"orange"}></Checkbox>
                </Td>
                <Td textAlign={"center"}>{"gameBoard.category"}</Td>
                <Td textAlign={"center"}>{"gameBoard.title"}</Td>
                <Td textAlign={"center"}>{"gameBoard.board_content"}</Td>
                <Td textAlign={"center"}>
                  <FontAwesomeIcon
                    icon={faXmark}
                    fontSize={"1.4rem"}
                    color={"gray"}
                  />
                </Td>
              </Tr>
            </Tbody>
          </Table>
          <Center mt={16} mb={20}>
            <Flex gap={10}>
              <Button {...buttonStyle}>전체 선택</Button>
              <Button {...buttonStyle} background={"orange"} color={"black"}>
                선택 삭제
              </Button>
            </Flex>
          </Center>
        </CardBody>
      </Card>
    </Center>
  );
}
