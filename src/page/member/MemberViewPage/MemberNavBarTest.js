import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import {
  faAddressBook,
  faCreditCard,
  faHeart,
  faThumbsUp,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

export function MemberNavBarTest() {
  const navigate = useNavigate();

  const buttonStyle = {
    variant: "undefined",
    isRound: true,
    _hover: { bgColor: "orange", color: "white" },
  };

  return (
    <Flex
      flexDir="column"
      px={2}
      py={5}
      justifyContent="center"
      textAlign="center"
      // bgColor="#F4F4F4"
      bgColor="#FFF"
      boxShadow="5px 0px 5px -5px rgba(0, 0, 0, 0.1)"
    >
      <VStack spacing={10}>
        <Tooltip hasArrow label="내 정보 관리" placement="right">
          <IconButton
            {...buttonStyle}
            aria-label={"memberInfo"}
            icon={<FontAwesomeIcon icon={faUser} />}
            onClick={() => navigate("/memberPage/memberInfo")}
          />
        </Tooltip>
        <Tooltip hasArrow label="내 주소록 관리" placement="right">
          <IconButton
            {...buttonStyle}
            icon={<FontAwesomeIcon icon={faAddressBook} />}
            onClick={() => navigate("/memberPage/addressInfo")}
          />
        </Tooltip>
        <Tooltip hasArrow label="결제 내역" placement="right">
          <IconButton
            {...buttonStyle}
            icon={<FontAwesomeIcon icon={faCreditCard} />}
            onClick={() => console.log("결제 내역 페이지 이동")}
          />
        </Tooltip>
        <Tooltip hasArrow label="찜 목록" placement="right">
          <IconButton
            {...buttonStyle}
            icon={<FontAwesomeIcon icon={faHeart} />}
            onClick={() => navigate("/memberPage/productLike")}
          />
        </Tooltip>
        <Tooltip hasArrow label="추천한 게시물 보기" placement="right">
          <IconButton
            {...buttonStyle}
            icon={<FontAwesomeIcon icon={faThumbsUp} />}
            onClick={() => console.log("추천한 게시물 보기 페이지 이동")}
          />
        </Tooltip>
      </VStack>
    </Flex>
  );
}
