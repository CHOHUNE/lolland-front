import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Checkbox,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";

function PageButton({ variant, pageNumber, children }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  function handleClick() {
    params.set("p", pageNumber);
    console.log(params.get("p"));
    navigate("?" + params);
  }
  return (
    <Button variant={variant} onClick={handleClick}>
      {children}
    </Button>
  );
}

function Pagination({ pageInfo }) {
  if (!pageInfo) {
    return null;
  }

  const pageNumbers = [];

  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Center>
      <Box>
        <ButtonGroup justifyContent="center">
          {pageInfo.prevPageNumber && (
            <PageButton variant="ghost" pageNumber={pageInfo.prevPageNumber}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </PageButton>
          )}

          {pageNumbers.map((pageNumber) => (
            <PageButton
              key={pageNumber}
              variant={
                pageNumber === pageInfo.currentPageNumber ? "solid" : "ghost"
              }
              pageNumber={pageNumber}
            >
              {pageNumber}
            </PageButton>
          ))}

          {pageInfo.nextPageNumber && (
            <PageButton variant="ghost" pageNumber={pageInfo.nextPageNumber}>
              <FontAwesomeIcon icon={faAngleRight} />
            </PageButton>
          )}
        </ButtonGroup>
      </Box>
    </Center>
  );
}

export function MemberReview() {
  const [reviewList, setReviewList] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const [pageInfo, setPageInfo] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    axios
      .get("/api/review/my?" + params)
      .then((response) => {
        setReviewList(response.data.reviewList);
        setPageInfo(response.data.pageInfo);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          toast({
            title: "세션이 만료되었습니다",
            description: "재로그인 후 시도해주세요",
            status: "warning",
          });
          navigate("/login");
        } else if (error.response.status === 500) {
          toast({
            title: "Internal Server Error",
            description: "백엔드 코드를 점검해주세요",
            status: "error",
          });
        } else {
          toast({
            title: error.response.data,
            description: "리뷰 불러오는 도중 에러 발생, 관리자에게 문의하세요",
            status: "error",
          });
        }
      });
  }, [location]);

  const formattedDate = (question_reg_time) => {
    const date = new Date(question_reg_time);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
  };

  function StarRating({ rate }) {
    const maxRating = 5;
    const filledStars = rate || 0;

    const stars = Array.from({ length: maxRating }, (_, index) => (
      <FontAwesomeIcon
        key={index}
        icon={faStar}
        style={{ color: index < filledStars ? "#FFE000" : "#EAEAE7" }}
      />
    ));

    return <>{stars}</>;
  }

  return (
    <VStack w="full" mr={5} spacing={5}>
      <Card w="full">
        <CardHeader>
          <Heading>리뷰 목록</Heading>
        </CardHeader>
        <CardBody>
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th textAlign="center">선택</Th>
                  <Th textAlign="center">상품명</Th>
                  <Th textAlign="center">리뷰 내용</Th>
                  <Th textAlign="center">별점</Th>
                  <Th textAlign="center">등록일자</Th>
                </Tr>
              </Thead>
              <Tbody>
                {reviewList && reviewList.length > 0 ? (
                  reviewList.map((review) => (
                    <Tr
                      key={review.review_id}
                      onClick={() => {
                        navigate(`/product/${review.product_id}`);
                        const targetElement =
                          document.getElementById("reviewSection");
                        if (targetElement) {
                          targetElement.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      <Td
                        textAlign="center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox colorScheme="orange" />
                      </Td>
                      <Td textAlign="center">{review.product_name}</Td>
                      <Td textAlign="center">{review.review_content}</Td>
                      <Td textAlign="center">
                        <StarRating rate={review.rate} />
                      </Td>
                      <Td textAlign="center">
                        <Text fontSize="xs" opacity="0.5">
                          {formattedDate(review.review_reg_time)}
                        </Text>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={3} h={5} textAlign="center">
                      아직 등록된 리뷰가 없습니다
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
        <CardFooter display="flex" justifyContent="center" id="reviewSection">
          <Pagination pageInfo={pageInfo} />
        </CardFooter>
      </Card>
      <Outlet />
    </VStack>
  );
}
