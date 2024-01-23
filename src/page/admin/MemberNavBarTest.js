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
  faCircleQuestion,
  faComments,
  faCreditCard,
  faHeart,
  faThumbsUp,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export function MemberNavBarTest() {
  const [member, setMember] = useState("");
  const navigate = useNavigate();

  const buttonStyle = {
    variant: "undefined",
    isRound: true,
    _hover: { bgColor: "orange", color: "white" },
  };

  return (
    <Flex
      flexDir="column"
      mx={5}
      my={5}
      px={2}
      py={5}
      justifyContent="center"
      borderRadius={20}
      textAlign="center"
      bgColor="#FFF"
      shadow="md"
    >
      <VStack spacing={10}>
        <Tooltip hasArrow label="내 정보 관리" placement="right">
          <IconButton
            {...buttonStyle}
            aria-label={"memberInfo"}
            icon={<FontAwesomeIcon icon={faUser} />}
            onClick={() => navigate("memberInfo")}
          />
        </Tooltip>
        <Tooltip hasArrow label="내 주소록 관리" placement="right">
          <IconButton
            {...buttonStyle}
            icon={<FontAwesomeIcon icon={faAddressBook} />}
            onClick={() => navigate("addressInfo")}
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
            onClick={() => navigate("productLike")}
          />
        </Tooltip>
        <Tooltip hasArrow label="내 문의 보기" placement="right">
          <IconButton
            {...buttonStyle}
            icon={<FontAwesomeIcon icon={faCircleQuestion} />}
            onClick={() => navigate("qna")}
          />
        </Tooltip>
        <Tooltip hasArrow label="내가 남긴 리뷰 보기" placement="right">
          <IconButton
            {...buttonStyle}
            icon={<FontAwesomeIcon icon={faComments} />}
            onClick={() => navigate("review")}
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
