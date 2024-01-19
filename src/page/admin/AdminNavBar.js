import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPeopleGroup,
  faPlus,
  faTableList,
  faUser,
  faUsersLine,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export function AdminNavBar() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>관리자 페이지 입니다.</CardHeader>

      <CardBody border={"1px solid black"} bg={"black"} color={"whitesmoke"}>
        <Flex gap={10}>
          {/* 상품 등록 */}
          <FormControl>
            <Flex justify={"space-between"}>
              <FormLabel
                _hover={{ cursor: "pointer" }}
                fontWeight={"900"}
                onClick={() => navigate("/product/write/")}
              >
                상품 등록 >
              </FormLabel>
              <Box>
                <FontAwesomeIcon icon={faPlus} beatFade />
              </Box>
            </Flex>
          </FormControl>
          <Box border={"1px solid whitesmoke"}></Box>

          {/* 상품 목록 */}
          <FormControl>
            <Flex justify={"space-between"}>
              <FormLabel
                _hover={{ cursor: "pointer" }}
                fontWeight={"900"}
                // onClick={handleMemberManageClick}
              >
                상품 목록 >
              </FormLabel>
              <Box>
                <FontAwesomeIcon icon={faTableList} />
              </Box>
            </Flex>
          </FormControl>
          <Box border={"1px solid whitesmoke"}></Box>

          {/* 회원 목록 */}
          <FormControl>
            <Flex justify={"space-between"}>
              <FormLabel
                _hover={{ cursor: "pointer" }}
                fontWeight={"900"}
                // onClick={handleMemberManageClick}
              >
                회원 목록 >
              </FormLabel>
              <Box>
                <FontAwesomeIcon icon={faPeopleGroup} />
              </Box>
            </Flex>
          </FormControl>
          <Box border={"1px solid whitesmoke"}></Box>
        </Flex>
      </CardBody>
    </Card>
  );
}
