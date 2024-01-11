import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function GameBoardList() {
  const [gameBoardList, setGameBoardList] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 데이터가 이미 가져와진 상태이면 다시 요청하지 않음
    if (!gameBoardList) {
      axios
        .get("/api/gameboard")
        .then((response) => setGameBoardList(response.data))
        .catch((error) =>
          console.error("데이터를 가져오는 중 에러 발생:", error),
        );
    }
  }, [gameBoardList]);

  return (
    <Box py={"100px"}>
      <Center>
        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>id</Th>
                <Th>title</Th>
                <Th>category</Th>
                <Th>content</Th>
                <Th>boardCount</Th>
                <Th>regTime</Th>
              </Tr>
            </Thead>

            <Tbody>
              {gameBoardList &&
                gameBoardList.map((board) => (
                  <Tr
                    key={board.id}
                    _hover={{ cursor: "pointer" }}
                    onClick={() => navigate("/gameboard/id/" + board.id)}
                  >
                    <Td>{board.id}</Td>
                    <Td>{board.title}</Td>
                    <Td>{board.category}</Td>
                    <Td>{board.board_content}</Td>
                    <Td>{board.board_count}</Td>
                    <Td>{board.reg_time}</Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Center>
      <Center>
        <Button
          my="20px"
          onClick={() => navigate("write")}
          colorScheme={"purple"}
        >
          글 작성
        </Button>
      </Center>
    </Box>
  );
}

export default GameBoardList;
