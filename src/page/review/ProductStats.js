import {Box, Flex, Heading, Spinner, Text, VStack} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";
import RatingChart from "./RatingChart";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';


export const ProductStats = ({ product_id }) => {
  const [ratingDistribution, setRatingDistribution] = useState({});
  const [product, setProduct] = useState(null);

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

  useEffect(() => {
    axios
      .get("/api/product/product_id/" + product_id)
      .then((response) => setProduct(response.data));
  }, []);

  const renderStars = (rate) => {
    // 평점이 없거나 0인 경우 빈 별 5개로 출력
    if (rate == null || rate === 0) {
      return Array.from({ length: 5 }, (_, i) => (
        <FontAwesomeIcon icon={farStar} color="#EAEAE7" key={i} />
      ));
    }
    let stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rate)) {
        // 꽉찬 별
        stars.push(<FontAwesomeIcon icon={faStar} color="#FFE000" key={i} />);
      } else if (i === Math.floor(rate) && !Number.isInteger(rate)) {
        // 반쪽 별
        stars.push(
          <FontAwesomeIcon icon={faStarHalfAlt} color="#FFE000" key={i} />,
        );
      } else {
        // 빈 별
        stars.push(<FontAwesomeIcon icon={farStar} color="#EAEAE7" key={i} />);
      }
    }
    return stars;
  };

  if (product === null) {
    return <Spinner />
  }


  return (
    <Flex
      border="1px dashed black"
      justifyContent="space-between"
      my={10}
      minW="1200px"
    >
      <Box
        w="30%"
        h="250px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        border="1px dashed red"
      >
        <Box>
          <Text>전체 만족도 평점</Text>
          <Text fontSize={"2rem"} mt={5}>{renderStars(product.product.average_rate)}</Text>
          <Text fontWeight={"bold"} fontSize={"2.7rem"} mt={2}>{product.product.average_rate !== null
            ? product.product.average_rate.toFixed(1)
            : "0"}
          </Text>
        </Box>
      </Box>
      <Box
        w="30%"
        h="250px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        border="1px dashed gold"
      >
        <RatingChart
          ratingDistribution={ratingDistribution}
          boxDimensions={{ width: "100%", height: "100%" }}
        />
      </Box>
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
