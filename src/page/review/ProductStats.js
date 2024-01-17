import { Box, Flex, Heading, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";
import RatingChart from "./RatingChart";

export const ProductStats = ({ product_id }) => {
  const [ratingDistribution, setRatingDistribution] = useState({});

  useEffect(() => {
    axios
      .get(`/api/review/rating-distribution?product_id=${product_id}`)
      .then((response) => {
        setRatingDistribution(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("별점 분포도 가져오는 도중 에러 발생:", error);
      });
  }, [product_id]);

  return (
    <Flex border="1px dashed black" justifyContent="space-between" my={10}>
      <Box
        w="30%"
        h="250px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        border="1px dashed red"
      >
        동일 카테고리 내 평점 순위
      </Box>
      <VStack
        w="30%"
        spacing={10}
        justifyContent="center"
        textAlign="center"
        border="1px dashed gold"
      >
        <Heading size="md">별점 분포도</Heading>
        <RatingChart ratingDistribution={ratingDistribution} />
      </VStack>
      <Box
        w="30%"
        h="250px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        border="1px dashed green"
      >
        옵션 구매 선호도
      </Box>
    </Flex>
  );
};
