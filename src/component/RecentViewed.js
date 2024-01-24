import React, { useState } from "react";
import { Box, Flex, Heading, Image, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const Recent = () => {
  const navigate = useNavigate();
  const [recent, setRecent] = useState([]);

  const truncateText = (str, num) => {
    if (str && str.length > num) {
      return str.slice(0, num) + "...";
    }
    return str;
  };

  const handleNavigateToProduct = (e, item) => {
    e.stopPropagation(); // 부모타입으로 이벤트를 안넘기는것
    navigate(`/product/${item.product_id}`);
    addRecentViewed(item);
  };

  const addRecentViewed = (e, newItem) => {
    setRecent((prevItems) => {
      // 이미 목록에 있는 상품인지 확인
      const isExist = prevItems.some(
        (item) => item.hid === newItem.hid || item.tid === newItem.tid,
      );

      // 존재하지 않는 경우에만 목록에 추가
      if (!isExist) {
        const updatedItems = [newItem, ...prevItems];
        localStorage.setItem("recent", JSON.stringify(updatedItems));
        return updatedItems;
      }

      return prevItems;
    });
  };

  return (
    <Box fontSize={"10px"}>
      <Heading size="md" mb={3}>
        최근 본 상품
      </Heading>
      {recent.map((item, index) => (
        <Flex
          key={index}
          align="center"
          cursor="pointer"
          onClick={(e) => handleNavigateToProduct(e, item)}
          borderBottom={"1px solid gray"}
        >
          <VStack>
            <Image
              src={item.mainImgUrl || "이미지 없음"}
              alt={item.name}
              boxSize="50px"
              mb={1}
              mt={1}
            />
            <Box ml="3">
              <Text fontWeight="bold" noOfLines={1}>
                {truncateText(item.product_name || item.product_name, 10)}
              </Text>
            </Box>
          </VStack>
        </Flex>
      ))}
    </Box>
  );
};
