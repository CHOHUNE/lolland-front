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
  faCreditCard,
  faHeart,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export function MemberNavBar() {
  const navigate = useNavigate();
  // 내 정보 관리 클릭시 로직 ----------------------------------------------------
  function handleMemberManageClick() {
    navigate("/memberPage/memberInfo");
  }

  return (
    <Card>
      <CardHeader fontSize={"1.5rem"} color={"#5F625C"} fontWeight={"900"}>
        id 님의 페이지
      </CardHeader>

      <CardBody border={"1px solid black"} bg={"black"} color={"whitesmoke"}>
        <Flex gap={10}>
          <FormControl>
            <Flex justify={"space-between"}>
              <FormLabel
                _hover={{ cursor: "pointer" }}
                fontWeight={"900"}
                onClick={handleMemberManageClick}
              >
                내 정보 관리 >
              </FormLabel>
              <Box>
                <FontAwesomeIcon icon={faUser} />
              </Box>
            </Flex>
          </FormControl>
          <Box border={"1px solid whitesmoke"}></Box>
          <FormControl>
            <Flex justify={"space-between"}>
              <FormLabel _hover={{ cursor: "pointer" }} fontWeight={"900"}>
                결제 내역 >
              </FormLabel>
              <Box>
                <FontAwesomeIcon icon={faCreditCard} />
              </Box>
            </Flex>
          </FormControl>
          <Box border={"1px solid whitesmoke"}></Box>
          <FormControl>
            <Flex justify={"space-between"}>
              <FormLabel _hover={{ cursor: "pointer" }} fontWeight={"900"}>
                찜 목록 >
              </FormLabel>
              <Box>
                <FontAwesomeIcon icon={faHeart} />
              </Box>
            </Flex>
          </FormControl>
        </Flex>
      </CardBody>
    </Card>
  );
}
