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
  faAddressBook,
  faCreditCard,
  faHeart,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export function MemberNavBar() {
  const [member, setMember] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/member/memberInfo").then((response) => {
      setMember(response.data);
    });
  }, []);

  // 내 정보 관리 클릭시 로직 ----------------------------------------------------
  function handleMemberManageClick() {
    navigate("/memberPage/memberInfo");
  }

  // 내 주소록 관리 클릭시 로직
  function handleAddressClick() {
    navigate("/memberPage/addressInfo");
  }

  return (
    <Card>
      <CardHeader fontSize={"1.5rem"} color={"#5F625C"} fontWeight={"900"}>
        <Flex justifyContent={"space-between"}>
          <Box>{member.member_login_id} 님의 페이지</Box>
          {member.member_type === "user" && <Box>일반 회원 입니다.</Box>}
          {member.member_type === "seller" && <Box>판매자 입니다.</Box>}
          {member.member_type === "admin" && <Box>관리자 입니다.</Box>}
        </Flex>
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
              <FormLabel
                _hover={{ cursor: "pointer" }}
                fontWeight={"900"}
                onClick={handleAddressClick}
              >
                내 주소록 관리 >
              </FormLabel>
              <Box>
                <FontAwesomeIcon icon={faAddressBook} />
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
