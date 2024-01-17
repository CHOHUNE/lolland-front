import {
  Box,
  Button,
  ButtonGroup,
  Center,
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
  VStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentSlash,
  faPaperPlane,
  faPenToSquare,
  faStar,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { QnaView } from "../qna/QnaView";
import { useNavigate } from "react-router-dom";
import loginProvider, { LoginContext } from "../../component/LoginProvider";
import { ProductStats } from "./ProductStats";

// 리뷰 등록할 때 별점 부분
const StarRating = ({ rate, setRate }) => {
  const [hover, setHover] = useState(null);
  return (
    <Flex justifyContent="space-evenly" p={3} my={2} mx="40%">
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;
        return (
          <Box
            as="label"
            key={index}
            color={ratingValue <= (hover || rate) ? "#FFE000" : "#EAEAE7"}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(null)}
          >
            <FontAwesomeIcon
              icon={faStar}
              cursor={"pointer"}
              size="2xl"
              transition="color 200ms"
              onClick={() => setRate(rate === ratingValue ? 0 : ratingValue)}
            />
          </Box>
        );
      })}
    </Flex>
  );
};

// fetch에서 가져온 rate로 각 리뷰의 별점을 형식에 맞춰(5-입력한 별점 = 회색별) 출력하는 부분
const Star = ({ initialRate, onRateChange, isEditing }) => {
  const [currentRate, setCurrentRate] = useState(initialRate);

  // 첫 rendering : review.rate 표시 (currentRate에 저장)
  // 만약 사용자가 새로운 rate로 변경하면 onClick을 통해 currentRate 수정
  // 만약 사용자가 같은 rate를 반복해서 누르면 (currentRate === ratingValue) 0으로 변경
  const handleClick = (ratingValue) => {
    console.log("===================");
    console.log("ratingValue: " + ratingValue);
    console.log("currentRate: " + currentRate);
    if (isEditing) {
      const newRating = currentRate === ratingValue ? 0 : ratingValue;
      console.log("newRating: " + newRating);
      // currentRate = newRating;
      setCurrentRate(newRating);
      onRateChange(newRating);
    }
    console.log("new Current rate: " + currentRate);
  };

  const realRate = isEditing ? currentRate : initialRate;

  const totalStars = 5;
  const stars = Array.from({ length: totalStars }).map((_, index) => {
    const ratingValue = index + 1;
    const starColor = ratingValue <= realRate ? "#FFE000" : "#EAEAE7";

    return (
      <FontAwesomeIcon
        key={index}
        icon={faStar}
        color={starColor}
        size="sm"
        onClick={() => handleClick(ratingValue)}
        cursor={isEditing ? "pointer" : "default"}
      />
    );
  });

  return <HStack spacing={1}>{stars}</HStack>;
};

export const ReviewView = ({ product_id }) => {
  const [rate, setRate] = useState(1);
  const [review, setReview] = useState("");
  const { hasAccess, isAdmin, isAuthenticated } = useContext(LoginContext);
  const [reviewList, setReviewList] = useState([]);
  const [page, setPage] = useState(0);
  const [isEditing, setIsEditing] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const [editableRating, setEditableRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const handleRatingChange = (newRating) => {
    setEditableRating(newRating);
  };

  // 첫 로딩 시 리뷰 리스트 가져오기
  useEffect(() => {
    fetchReview();
  }, [page]);

  function fetchReview() {
    console.log("fetchReview Triggered");
    axios
      .get("/api/review/fetch", {
        params: { product_id: product_id, page: page },
      })
      .then((response) => {
        const { reviewList, totalReviews } = response.data;
        setReviewList((prevReviews) => {
          const uniqueReviews = reviewList.filter(
            (newReview) =>
              !prevReviews.some(
                (prevReview) => prevReview.review_id === newReview.review_id,
              ),
          );
          return [...prevReviews, ...uniqueReviews];
        });
        setTotalReviews(totalReviews);
      })
      .catch((error) => {
        toast({
          title: "댓글을 불러오는 도중 오류가 발생했습니다",
          description: error.response.data,
          status: "error",
        });
      });
  }

  function handleSeeMore() {
    setPage((prevPage) => prevPage + 1);
  }

  function handleSubmit() {
    if (isAuthenticated()) {
      axios
        .post("/api/review/submit", {
          product_id: product_id,
          review_content: review,
          rate: rate,
        })
        .then((response) => {
          toast({
            description: "리뷰를 성공적으로 등록했습니다",
            status: "success",
          });
          setReviewList([]);
          setPage(0);
          fetchReview();
        })
        .catch((error) => {
          toast({
            title: "댓글 등록에 실패했습니다",
            description: error.response.data,
            status: "error",
          });
        });
    } else {
      toast({
        title: "비회원은 리뷰를 등록할 수 없습니다",
        description: "로그인 후 다시 시도해주세요",
        status: "error",
      });
      navigate("/login");
    }
  }

  // ------------------------- 리뷰 수정 ------------------------- //

  // 수정하는 리뷰 설정
  const handleEditReview = (review) => {
    setIsEditing(true);
    setEditingReview(review);
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingReview(null);
  };

  // 수정 요청
  const handleUpdateReview = () => {
    updateReview(editingReview);
    setIsEditing(false);
    setEditingReview(null);
  };

  // 수정된 리뷰 전송
  function updateReview(editedReview) {
    console.log(editedReview);
    axios
      .put("/api/review/update", {
        review_id: editedReview.review_id,
        review_content: editedReview.review_content,
        rate: editedReview.rate,
      })
      .then(() => {
        toast({
          description: "리뷰를 성공적으로 수정하였습니다",
          status: "success",
        });
        setReviewList([]);
        setPage(0);
        fetchReview();
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast({
            title: "수정 중 오류 발생",
            description: "백엔드 코드를 점검해주세요",
            status: "error",
          });
        } else {
          toast({
            title: "수정 중 오류 발생",
            description: "다시 한번 시도해주시거나, 관리자에게 문의해주세요",
            status: "error",
          });
        }
      });
  }

  // 리뷰 삭제 요청
  function deleteReview(review_id) {
    axios
      .delete(`/api/review/delete?review_id=${review_id}`)
      .then((response) => {
        toast({
          description: "리뷰가 성공적으로 삭제되었습니다",
          status: "success",
        });
        setReviewList([]);
        setPage(0);
        fetchReview();
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast({
            title: "리뷰 삭제 중 에러 발생",
            description: "백엔드 코드를 점검해주세요",
            status: "error",
          });
        } else {
          toast({
            title: "리뷰 삭제 중 에러 발생",
            description: "다시 한번 시도해주시거나, 관리자에게 문의해주세요",
            status: "error",
          });
        }
      });
  }

  const tabStyles = {
    w: "30%",
    fontSize: "2xl",
    color: "#B4B4B4",
    _selected: { fontWeight: "bold", color: "black" },
  };

  const formattedDate = (question_reg_time) => {
    const date = new Date(question_reg_time);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  function formattedLogId(member_login_id) {
    const formattedLoginId = member_login_id;
    if (formattedLoginId) {
      const maskedLoginId =
        member_login_id.slice(0, 2) + "*".repeat(formattedLoginId.length - 2);
      return maskedLoginId;
    }
    return "";
  }

  return (
    <>
      <ProductStats product_id={product_id} />
      <Tabs position="relative" variant="unstyled">
        <TabList p={5} justifyContent="space-evenly" align="center">
          <Tab {...tabStyles}>상품 설명</Tab>
          <Tab {...tabStyles}>리뷰 ({totalReviews})</Tab>
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
            {/* -------------------------- 리뷰 입력란 -------------------------- */}
            <StarRating rate={rate} setRate={setRate} />
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
            {/* -------------------------- 리뷰 출력란 -------------------------- */}
            {reviewList.length > 0 ? (
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
                    {/* -------------------------- 별점 출력란 -------------------------- */}
                    <Star
                      initialRate={review.rate}
                      onRateChange={handleRatingChange}
                      isEditing={isEditing}
                    />
                    {/* -------------------------- 시간 출력란 -------------------------- */}
                    <Text opacity={0.6} fontSize="xs">
                      {formattedDate(review.review_reg_time)}
                    </Text>
                    {/* -------------------------- 수정(취소) / 삭제 버튼 출력란 --------------------------*/}
                    <ButtonGroup>
                      {(hasAccess(review.member_login_id) || isAdmin()) && (
                        <>
                          {isEditing &&
                          editingReview.review_id === review.review_id ? (
                            <>
                              <IconButton
                                icon={<FontAwesomeIcon icon={faPaperPlane} />}
                                size="sm"
                                variant="ghost"
                                colorScheme="blue"
                                onClick={handleUpdateReview}
                              />
                              <IconButton
                                icon={<FontAwesomeIcon icon={faXmark} />}
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                onClick={handleCancelEdit}
                              />
                            </>
                          ) : (
                            <>
                              <IconButton
                                icon={<FontAwesomeIcon icon={faPenToSquare} />}
                                size="sm"
                                variant="ghost"
                                colorScheme="purple"
                                onClick={() => handleEditReview(review)}
                              />
                              <IconButton
                                icon={<FontAwesomeIcon icon={faTrashCan} />}
                                size="sm"
                                variant="ghost"
                                color="black"
                                _hover={{ color: "white", bgColor: "black" }}
                                onClick={() => deleteReview(review.review_id)}
                              />
                            </>
                          )}
                        </>
                      )}
                    </ButtonGroup>
                  </HStack>
                  {isEditing && editingReview.review_id === review.review_id ? (
                    <Textarea
                      value={editingReview.review_content}
                      onChange={(e) => {
                        setEditingReview((prevReview) => ({
                          ...prevReview,
                          review_content: e.target.value,
                        }));
                      }}
                      mb={6}
                      whiteSpace="pre-wrap"
                    />
                  ) : (
                    <Text mb={6} whiteSpace="pre-wrap">
                      {review.review_content}
                    </Text>
                  )}
                  {index < reviewList.length - 1 && <Divider />}
                  {index === reviewList.length - 1 &&
                    reviewList.length !== totalReviews && (
                      <Center>
                        <Button
                          bgColor="black"
                          color="white"
                          borderRadius={25}
                          px="10%"
                          onClick={handleSeeMore}
                          mt={4}
                        >
                          더보기
                        </Button>
                      </Center>
                    )}
                </Box>
              ))
            ) : (
              <Box
                h="xs"
                fontSize="md"
                textAlign="center"
                display="flex"
                alignItems="center"
                justifyContent="center"
              ></Box>
            )}
          </TabPanel>
          {/* -------------------------- Q&A -------------------------- */}
          <TabPanel>
            <QnaView
              product_id={product_id}
              formattedLogId={formattedLogId}
              formattedDate={formattedDate}
              isAuthenticated={isAuthenticated}
              hasAccess={hasAccess}
              isAdmin={isAdmin}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};
