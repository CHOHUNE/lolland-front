import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Image,
  SimpleGrid,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

export function ProductLike() {
  const [productLike, setProductLike] = useState([]);
  const [productChecked, setProductChecked] = useState([]); // 각 상품의 체크박스 상태를 관리하는 배열

  const navigate = useNavigate();
  const toast = useToast();

  // --------------------------------------- 좋아요 목록 렌더링 ---------------------------------------
  useEffect(() => {
    axios.get("/api/productLike/details").then((response) => {
      setProductLike(response.data);
      // 상품 개수에 맞게 productChecked 배열 초기화
      setProductChecked(new Array(response.data.length).fill(false));
    });
  }, []);

  // --------------------------------------- 가격 ,(쉼표) 표시 ---------------------------------------
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", { style: "decimal" }).format(price);
  };

  // --------------------------------------- x버튼 누를때 실행되는 로직 ---------------------------------------
  const handleDislike = async (productLikeId) => {
    try {
      const response = await axios.delete(
        `/api/productLike/like/${productLikeId}`,
      );
      if (response.status === 200) {
        // 상태 업데이트하여 UI에서 제거
        const updatedProductLike = productLike.filter(
          (item) => item.like_id !== productLikeId,
        );
        setProductLike(updatedProductLike);

        // 체크박스 상태도 업데이트
        const updatedProductChecked = productChecked.slice();
        updatedProductChecked.splice(productLikeId, 1); // 해당 상품의 체크박스 상태 삭제
        setProductChecked(updatedProductChecked);

        toast({
          description: "좋아요가 삭제되었습니다.",
          status: "success",
        });
      }
    } catch (error) {
      toast({
        description:
          "좋아요 삭제중 오류 발생, 관리자에게 문의해주시기 바랍니다.",
        status: "error",
      });
    }
  };

  // 전체선택 버튼을 눌렀을 때 실행되는 로직
  const handleSelectAll = () => {
    setProductChecked(new Array(productLike.length).fill(true));
  };

  // 선택해제 버튼을 눌렀을 때 실행되는 로직
  const handleDeselectAll = () => {
    setProductChecked(new Array(productLike.length).fill(false));
  };

  // 체크박스를 클릭했을 때 실행되는 로직
  const handleCheckboxClick = (index) => {
    const updatedProductChecked = productChecked.slice();
    updatedProductChecked[index] = !updatedProductChecked[index];
    setProductChecked(updatedProductChecked);
  };

  // 전체삭제 버튼을 클릭했을 때 실행되는 로직
  const handleDeleteSelectedProducts = async () => {
    try {
      // 선택된 모든 상품의 ID 배열 생성
      const selectedProductIds = productLike
        .filter((_, index) => productChecked[index])
        .map((item) => item.like_id);

      if (selectedProductIds.length === 0) {
        toast({
          description: "선택된 상품이 없습니다.",
          status: "info",
        });
        return;
      }

      // 선택된 모든 상품에 대해 삭제 요청
      await Promise.all(
        selectedProductIds.map((productLikeId) =>
          axios.delete(`/api/productLike/like/${productLikeId}`),
        ),
      );

      // UI에서 선택된 상품들 제거
      const updatedProductLike = productLike.filter(
        (item) => !selectedProductIds.includes(item.like_id),
      );
      setProductLike(updatedProductLike);

      // 체크박스 초기화
      setProductChecked(new Array(updatedProductLike.length).fill(false));

      toast({
        description: "선택한 상품이 삭제되었습니다.",
        status: "success",
      });
    } catch (error) {
      console.error("Error during batch product deletion:", error);
      toast({
        description: "상품 삭제중 오류 발생, 관리자에게 문의해주시기 바랍니다.",
        status: "error",
      });
    }
  };

  // -------------------------------- 글자수가 특정개수 이상일때 자르기 --------------------------------
  const truncateText = (str, num) => {
    if (str && str.length > num) {
      return str.slice(0, num) + "...";
    }
    return str;
  };

  return (
    <Box mt={5}>
      <Flex gap={4}>
        <FontAwesomeIcon
          icon={faHeart}
          style={{ color: "#f70202" }}
          fontSize={"2.5rem"}
        />
        <Text mt={-1} fontWeight={"bold"} fontSize={"2rem"}>
          좋아요한 상품 목록
        </Text>
      </Flex>
      <SimpleGrid columns={4} gap={5} mt={10}>
        {productLike.map((bucket, index) => (
          <Box
            key={bucket.product_id}
            p={5}
            shadow="md"
            borderWidth="1px"
            align="center"
            w={"300px"}
            h={"320px"}
            border={"1px solid #eeeeee"}
            transition="0.3s ease-in-out"
            position="relative" // 상위 Box를 relative로 설정
            _hover={{
              cursor: "pointer",
              transform: "scale(1.1)",
            }}
          >
            <VStack boxSize="150px" flexShrink={0}>
              <Button
                position="absolute"
                top="0"
                right="0"
                m={1}
                size="sm"
                bg={"none"}
                _hover={{
                  background: "none",
                  color: "red",
                }}
                onClick={(event) => {
                  event.stopPropagation(); // 버블링 방지
                  handleDislike(bucket.like_id); // 좋아요 삭제 핸들러 호출
                }}
              >
                x
              </Button>
              <Checkbox
                position="absolute"
                top="2"
                left="0"
                m={1}
                size="md"
                bg={"none"}
                _hover={{
                  background: "none",
                  color: "red",
                }}
                isChecked={productChecked[index]}
                onChange={() => handleCheckboxClick(index)}
              />
              <Box mt={3}>
                <Image
                  boxSize="150px"
                  objectFit="cover"
                  src={bucket.main_img_uri}
                  alt={bucket.product_name}
                  onClick={() => navigate("/product/" + bucket.product_id)}
                />
                <Text textAlign="left" paddingLeft={2} fontWeight={"bold"}>
                  [{bucket.company_name}]
                </Text>
                <Text
                  paddingLeft={2}
                  textAlign="left"
                  fontSize="md"
                  fontWeight="bold"
                  w={"300px"}
                  color={"gray"}
                  mt={2}
                >
                  {truncateText(bucket.product_name, 58)}
                </Text>
                <Text
                  mt={1}
                  paddingLeft={2}
                  textAlign="left"
                  fontSize="md"
                  fontWeight={"bold"}
                >
                  {formatPrice(bucket.product_price)}원
                </Text>
              </Box>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      <Box mt={10}>
        <Flex
          gap={5}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Button
            borderRadius={"15px"}
            style={{ background: "black", color: "white" }}
            onClick={handleSelectAll}
            shadow="md"
          >
            전체선택
          </Button>
          <Button
            borderRadius={"15px"}
            style={{ background: "black", color: "white" }}
            onClick={handleDeselectAll}
            shadow="md"
          >
            선택해제
          </Button>
          <Button
            borderRadius={"15px"}
            colorScheme="red"
            onClick={handleDeleteSelectedProducts}
            shadow="md"
          >
            선택상품삭제
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
