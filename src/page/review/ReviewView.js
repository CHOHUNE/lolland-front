import {
  Box,
  Divider,
  Flex,
  HStack,
  IconButton,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faStar } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";
import { Qna } from "../qna/Qna";

const StarRating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(null);
  return (
    <Flex justifyContent="space-evenly" p={3} my={2} mx="40%">
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
              size="2xl"
              transition="color 200ms"
              onClick={() =>
                setRating(rating === ratingValue ? 0 : ratingValue)
              }
            />
          </Box>
        );
      })}
    </Flex>
  );
};

export const ReviewView = () => {
  const [rating, setRating] = useState(0);
  const id = 1; //TODO: product id 가져오는 거 만들기 (useParam이나 전달받기)
  const [review, setReview] = useState("");
  // const [reviewList, setReviewList] = useState([]);
  const toast = useToast();

  // useEffect(() => {
  //   fetchReview();
  // }, []);

  const member = { id: 1, member_login_id: "Admin", member_type: "user" };

  const reviewList = [
    {
      review_id: 1,
      product_id: 1,
      member_login_id: member.member_login_id,
      review_content: "테스트아무말1",
      review_reg_time: "2019-01-21T05:47:08.644",
      rating: 5,
    },
    {
      review_id: 2,
      product_id: 1,
      member_login_id: member.member_login_id,
      review_content: "테스트아무말2",
      review_reg_time: "2019-01-21T05:47:08.644",
      rating: 2,
    },
    {
      review_id: 3,
      product_id: 1,
      member_login_id: member.member_login_id,
      review_content: "테스트아무말3",
      review_reg_time: "2019-01-21T05:47:08.644",
      rating: 0,
    },
  ];

  const Star = ({ rating }) => {
    const totalStars = 5;

    const stars = Array.from({ length: totalStars }).map((_, index) => {
      const starColor = index < rating ? "#FFE000" : "#EAEAE7";

      return (
        <FontAwesomeIcon
          key={index}
          icon={faStar}
          color={starColor}
          size="sm"
        />
      );
    });

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

  const tabStyles = {
    w: "30%",
    fontSize: "2xl",
    color: "#B4B4B4",
    _selected: { fontWeight: "bold", color: "black" },
  };

  function formattedLogId(member_login_id) {
    const formattedLoginId = member_login_id;
    if (formattedLoginId) {
      const maskedLoginId =
        member_login_id.slice(0, 3) + "*".repeat(formattedLoginId.length - 3);
      return maskedLoginId;
    }
    return "";
  }

  const formattedDate = (question_reg_time) => {
    const date = new Date(question_reg_time);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <>
      <Tabs position="relative" variant="unstyled">
        <TabList p={5} justifyContent="space-evenly" align="center">
          <Tab {...tabStyles}>상품 설명</Tab>
          <Tab {...tabStyles}>리뷰 & 댓글 ({reviewList.length})</Tab>
          <Tab {...tabStyles}>Q&A</Tab>
        </TabList>
        <TabIndicator mt="-1.5px" height="2px" bg="black" borderRadius="1px" />
        <TabPanels px={10}>
          {/* -------------------------- 상품 설명 -------------------------- */}
          <TabPanel>
            <Text size="md">
              {"{"} product.product.content {"}"}
            </Text>
          </TabPanel>

          {/* -------------------------- 리뷰 & 댓글 -------------------------- */}
          <TabPanel>
            <StarRating rating={rating} setRating={setRating} />
            <Flex justifyContent="center" mx="20%" mb={10}>
              <Textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="리뷰를 작성해주세요"
                mr={2}
              />
              <IconButton
                w="10%"
                bgColor="black"
                color="white"
                height="undefined"
                icon={<FontAwesomeIcon icon={faPaperPlane} />}
                onClick={handleSubmit}
              />
            </Flex>
            {reviewList && reviewList.length > 0 ? (
              reviewList.map((review, index) => (
                <Box key={review.review_id} mx="20%" my={5}>
                  <HStack spacing={5} mb={5}>
                    <Text
                      color="white"
                      bgColor="black"
                      borderRadius={20}
                      px={2}
                      fontSize="xs"
                    >
                      {formattedLogId(review.member_login_id)}
                    </Text>
                    <Star rating={review.rating} />
                    <Text opacity={0.6}>
                      {formattedDate(review.review_reg_time)}
                    </Text>
                  </HStack>
                  <Text mb={6}>{review.review_content}</Text>
                  {index < reviewList.length - 1 && <Divider />}
                </Box>
              ))
            ) : (
              <Box justifyContent="center">아직 리뷰가 없는 상품입니다.</Box>
            )}
          </TabPanel>
          {/* -------------------------- Q&A -------------------------- */}
          <TabPanel>
            <Qna
              formattedLogId={formattedLogId}
              formattedDate={formattedDate}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};
