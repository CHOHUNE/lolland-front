import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  HStack,
  IconButton,
  Radio,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faStar } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";

const StarRating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(null);
  return (
    <HStack spacing={2} p={2} mb={2}>
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;
        return (
          <Box
            as="label"
            key={index}
            color={ratingValue <= (hover || rating) ? "#FFE000" : "#EAEAE7"}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(null)}
          >
            <FontAwesomeIcon
              icon={faStar}
              cursor={"pointer"}
              size="xl"
              transition="color 200ms"
              onClick={() =>
                setRating(rating === ratingValue ? 0 : ratingValue)
              }
            />
          </Box>
        );
      })}
    </HStack>
  );
};

export function ReviewView() {
  const [rating, setRating] = useState(0);
  const id = 1; //TODO: product id 가져오는 거 만들기 (useParam이나 전달받기)
  const [review, setReview] = useState("");
  // const [reviewList, setReviewList] = useState([]);
  const toast = useToast();

  // useEffect(() => {
  //   fetchReview();
  // }, []);

  const member = { id: 1, member_login_id: "user", member_type: "user" };

  const reviewList = [
    {
      review_id: 1,
      product_id: 1,
      member_login_id: member.member_login_id,
      review_content: "테스트아무말1",
      rating: 5,
    },
    {
      review_id: 2,
      product_id: 1,
      member_login_id: member.member_login_id,
      review_content: "테스트아무말2",
      rating: 2,
    },
    {
      review_id: 3,
      product_id: 1,
      member_login_id: member.member_login_id,
      review_content: "테스트아무말3",
      rating: 0,
    },
  ];

  const Star = ({ rating }) => {
    const stars = Array.from({ length: rating }).map((_, index) => (
      <FontAwesomeIcon key={index} icon={faStar} color="#FFE000" size="sm" />
    ));
    return <HStack spacing={1}>{stars}</HStack>;
  };

  function fetchReview() {
    axios
      .get("/api/review/fetch", {
        product_id: id,
      })
      .then((response) => {
        console.log(response.data);
        // setReviewList(response.data);
      })
      .catch((error) => {
        toast({
          title: "댓글을 불러오는 도중 오류가 발생했습니다",
          description: error.response.data,
          status: "error",
        });
      });
  }

  function handleSubmit() {
    axios
      .post("/api/review/submit", {
        product_id: id,
        member_id: 1,
        review_content: review,
        rate: rating,
      })
      .then((response) => {
        toast({
          description: "리뷰를 성공적으로 등록했습니다",
          status: "success",
        });
        fetchReview();
      })
      .catch((error) => {
        toast({
          title: "댓글 등록에 실패했습니다",
          description: error.response.data,
          status: "error",
        });
      });
  }

  // function updateReview() {
  //   axios
  //     .put("/api/review/update", {
  //       review_id: review_id,
  //       review_content: review,
  //       rate: rating,
  //     })
  //     .then(() => {
  //       toast({
  //         description: "리뷰를 성공적으로 수정하였습니다",
  //         status: "success",
  //       });
  //       fetchReview();
  //     })
  //     .catch((error) => {
  //       if(error.response.status === 500) {
  //         toast({
  //           title: "수정 중 오류 발생",
  //           description: "백엔드 코드를 점검해주세요",
  //           status: "error"
  //         });
  //       } else {
  //         toast({
  //           title: "수정 중 오류 발생",
  //           description: "다시 한번 시도해주시거나, 관리자에게 문의해주세요",
  //           status: "error"
  //         })
  //       }
  //     });
  // }

  // function deleteReview() {
  //   axios
  //     .delete("/api/review/delete", { review_id })
  //     .then((response) => {
  //       toast({
  //         description: "리뷰가 성공적으로 삭제되었습니다",
  //         status: "success",
  //       });
  //     })
  //     .catch((error) => {
  //       if (error.response.status === 500) {
  //         toast({
  //           title: "리뷰 삭제 중 에러 발생",
  //           description: "백엔드 코드를 점검해주세요",
  //           status: "error",
  //         });
  //       } else {
  //         toast({
  //           title: "리뷰 삭제 중 에러 발생",
  //           description: "다시 한번 시도해주시거나, 관리자에게 문의해주세요",
  //           status: "error",
  //         });
  //       }
  //     });
  // }

  return (
    <Card>
      <CardHeader>
        <StarRating rating={rating} setRating={setRating} />
        <Flex justifyContent="center">
          <Textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="리뷰를 작성해주세요"
            mr={2}
          />
          <IconButton
            colorScheme="blue"
            height="undefined"
            icon={<FontAwesomeIcon icon={faPaperPlane} />}
            onClick={handleSubmit}
          />
        </Flex>
      </CardHeader>
      <CardBody>
        {reviewList && reviewList.length > 0 ? (
          reviewList.map((review, index) => (
            <Box key={review.review_id}>
              <HStack spacing={5} my={2}>
                <Text color="blue">{review.member_login_id}</Text>
                <Star rating={review.rating} />
              </HStack>
              <Text mb={5}>{review.review_content}</Text>
              {index < reviewList.length - 1 && <Divider />}
            </Box>
          ))
        ) : (
          <Box justifyContent="center">아직 리뷰가 없는 상품입니다.</Box>
        )}
      </CardBody>
      <CardFooter>페이지네이션</CardFooter>
    </Card>
  );
}
