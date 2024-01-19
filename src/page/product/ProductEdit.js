import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Select,
  Spinner,
  Switch,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

export function ProductEdit() {
  const navigate = useNavigate();
  const { product_id } = useParams();

  const [product, setProduct] = useState(null);
  const [options, setOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [removeMainImgs, setRemoveMainImgs] = useState([]); // 메인이미지삭제
  const [mainImg, setMainImg] = useState([]); // 메인이미지
  const [removeContentImgs, setRemoveContentImgs] = useState([]); // 삭제할 설명 이미지 ID 목록
  const [newContentImgs, setNewContentImgs] = useState([]); // 새로 추가할 설명 이미지 파일 목록

  const [previewImages, setPreviewImages] = useState([]);

  const toast = useToast();

  // -------------------------------- 상품 렌더링 로직 --------------------------------
  useEffect(() => {
    // Fetch product data
    axios
      .get(`/api/product/product_id/${product_id}`)
      .then((response) => {
        const data = response.data;
        setProduct(data);
        setSelectedCategory(data.product.category_id);
        setSelectedSubCategory(data.product.subcategory_id);
      })
      .catch((error) =>
        toast({
          description: error.response?.data.message || error.message,
          status: "error",
        }),
      );
    // -------------------------------- 상세옵션 렌더링 로직 --------------------------------
    axios
      .get(`/api/product/option/${product_id}`)
      .then((response) => setOptions(response.data));

    // -------------------------------- 대분류 / 소분류 렌더링 로직 --------------------------------
    axios
      .get("/api/product/write")
      .then((response) => {
        const uniqueCategories = response.data.reduce((acc, category) => {
          const existing = acc.find(
            (c) => c.category_id === category.category_id,
          );
          if (!existing) acc.push(category);
          return acc;
        }, []);
        setCategories(uniqueCategories);
      })
      .catch((error) =>
        toast({
          title: "Error loading categories",
          description: error.response?.data.message || error.message,
          status: "error",
        }),
      );
  }, [product_id]);

  // -------------------------------- 대분류 변경 로직 --------------------------------
  const handleCategoryChange = (e) => {
    const newCategoryId = e.target.value;
    setSelectedCategory(newCategoryId);
    // Reset subcategory selection when category changes
    setSelectedSubCategory("");
  };

  // -------------------------------- 소분류 변경 로직 --------------------------------
  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(e.target.value);
  };

  if (product === null) {
    return <Spinner />;
  }

  // ---------------------------------- 상세옵션선택 상품명 로직 ----------------------------------
  const handleInputChange = (e, index) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], option_name: e.target.value };
    setOptions(newOptions);
  };
  // ---------------------------------- 상세옵션선택 수량 로직 ----------------------------------
  const handleStockChange = (e, index) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], stock: e.target.value };
    setOptions(newOptions);
  };

  // ---------------------------------- 상세옵션선택 추가 로직 ----------------------------------
  const handleAddInput = () => {
    setOptions([...options, ""]);
  };

  // ---------------------------------- 상세옵션선택 감소 로직 ----------------------------------
  const handleRemoveInput = (index) => {
    if (options.length > 1) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  // ------------------------------ 메인이미지 삭제 로직 ------------------------------
  function handleRemoveMainImgSwitch(imgId) {
    setRemoveMainImgs((prevImgs) => {
      const findIndex = prevImgs.findIndex((item) => item === imgId);
      if (findIndex > -1) {
        // 이미 배열에 ID가 있으면 제거합니다.
        return prevImgs.filter((item) => item !== imgId);
      } else {
        // 배열에 ID가 없으면 추가합니다.
        return [...prevImgs, imgId];
      }
    });
  }

  // 이미지 파일이 선택되었을 때 호출될 함수
  const handleImageChange = (event) => {
    setMainImg(event.target.files);

    if (event.target.files) {
      const filesArray = Array.from(event.target.files).map((file) => {
        return URL.createObjectURL(file);
      });
      setPreviewImages(filesArray);
      return () =>
        filesArray.forEach((fileUrl) => URL.revokeObjectURL(fileUrl));
    }
  };

  // 새로운 설명 이미지 파일 목록을 상태에 추가
  const handleContentImageChange = (event) => {
    setNewContentImgs(event.target.files);
  };

  // 설명 이미지 삭제 핸들러
  const handleRemoveContentImage = (imgId) => {
    setRemoveContentImgs((prevImgs) => {
      if (prevImgs.includes(imgId)) {
        // 이미 배열에 ID가 있으면 제거합니다.
        return prevImgs.filter((item) => item !== imgId);
      } else {
        // 배열에 ID가 없으면 추가합니다.
        return [...prevImgs, imgId];
      }
    });
  };

  // ------------------------------ 저장 버튼 클릭시 실행될 로직 ------------------------------
  function handleUpdateClick() {
    axios
      .putForm("/api/product/edit", {
        product_id: product_id, //
        product_name: product.product.product_name,
        product_price: product.product.product_price,
        product_content: product.product.product_content,
        total_stock: product.product.total_stock,
        company_name: product.company_name,
        category_id: selectedCategory,
        subcategory_id: selectedSubCategory,
        removeMainImgs, // 메인이미지 변경
        newImgs: mainImg, // 메인이미지 추가
        removeContentImgs,
        newContentImgs: newContentImgs, // 설명이미지 추가
        options: JSON.stringify(options),
      })
      .then(() => {
        toast({
          description: product.product_name + "상품 변경 되었습니다.",
          status: "success",
        });
        navigate("/product/list");
      })
      .catch(() => {
        toast({
          description: "변경 중 오류 발생하였습니다.",
          status: "error",
        });
      });
  }

  return (
    <Box mt={10}>
      <Text
        fontSize={"1.5rem"}
        fontWeight={"bold"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        상품수정
      </Text>
      <Center>
        <Box>
          {/* ------------------- 대분류 로직 ------------------- */}
          <FormControl mt={3}>
            <FormLabel fontWeight={"bold"}>대분류</FormLabel>
            <Select value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">---Select Category---</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </Select>
          </FormControl>

          {/* ------------------- 소분류 로직 ------------------- */}
          <FormControl mt={3}>
            <FormLabel fontWeight={"bold"}>소분류</FormLabel>
            <Select
              value={selectedSubCategory}
              onChange={handleSubCategoryChange}
            >
              <option value="">---Select Subcategory---</option>
              {selectedCategory &&
                categories
                  .find((c) => c.category_id === parseInt(selectedCategory))
                  ?.subCategory.map((subCategory) => (
                    <option
                      key={subCategory.subcategory_id}
                      value={subCategory.subcategory_id}
                    >
                      {subCategory.subcategory_name}
                    </option>
                  ))}
            </Select>
          </FormControl>

          <FormControl mt={3}>
            <FormLabel fontWeight={"bold"}>상품명</FormLabel>
            <Input
              value={product.product.product_name}
              onChange={(e) =>
                setProduct((prevProduct) => ({
                  ...prevProduct,
                  product: {
                    ...prevProduct.product,
                    product_name: e.target.value,
                  },
                }))
              }
            />
          </FormControl>

          <FormControl mt={3}>
            <FormLabel fontWeight={"bold"}>금액</FormLabel>
            <Input
              value={product.product.product_price}
              onChange={(e) =>
                setProduct((prevProduct) => ({
                  ...prevProduct,
                  product: {
                    ...prevProduct.product,
                    product_price: e.target.value,
                  },
                }))
              }
            />
          </FormControl>

          <FormControl mt={3}>
            <FormLabel fontWeight={"bold"}>상품설명</FormLabel>
            <Textarea
              value={product.product.product_content}
              onChange={(e) =>
                setProduct((prevProduct) => ({
                  ...prevProduct,
                  product: {
                    ...prevProduct.product,
                    product_content: e.target.value,
                  },
                }))
              }
            />
          </FormControl>

          <FormControl mt={3}>
            <FormLabel fontWeight={"bold"}>제조사</FormLabel>
            <Input
              value={product.company_name}
              onChange={(e) =>
                setProduct({ ...product, company_name: e.target.value })
              }
            />
          </FormControl>

          {/* ------------------- 메인이미지 로직 ------------------- */}
          <Flex mt={3}>
            {product.productImgs.map((productImg, index) => (
              <Box key={productImg.main_img_id} my="5px">
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor={`switch-${index}`}>
                    <FontAwesomeIcon color="red" icon={faTrashCan} />
                  </FormLabel>
                  <Switch
                    id={`switch-${index}`}
                    isChecked={removeMainImgs.includes(productImg.main_img_id)}
                    colorScheme="red"
                    onChange={() =>
                      handleRemoveMainImgSwitch(productImg.main_img_id)
                    }
                  />
                </FormControl>
                <Image
                  src={productImg.main_img_uri}
                  alt={`Main Image ${index}`}
                  w="150px"
                />
              </Box>
            ))}
          </Flex>

          <FormControl mt={3}>
            <FormLabel fontWeight={"bold"}>메인 이미지</FormLabel>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </FormControl>

          <Flex mt={3}>
            {previewImages.map((image, index) => (
              <Box key={index} my="5px">
                <Image src={image} alt={`Preview ${index}`} w="150px" />
              </Box>
            ))}
          </Flex>

          {/* ------------------- 설명이미지 로직 ------------------- */}
          <Flex mt={3}>
            {product.productDetailsImgs.map((productDetailsImg, index) => (
              <Box key={productDetailsImg.details_img_id} my="5px">
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor={`switch-${index}`}>
                    <FontAwesomeIcon color="red" icon={faTrashCan} />
                  </FormLabel>
                  <Switch
                    id={`content-switch-${index}`} // 고유한 id를 사용해야 합니다.
                    isChecked={removeContentImgs.includes(
                      productDetailsImg.details_img_id,
                    )}
                    colorScheme="red"
                    onChange={() =>
                      handleRemoveContentImage(productDetailsImg.details_img_id)
                    }
                  />
                </FormControl>
                <Image
                  src={productDetailsImg.sub_img_uri}
                  alt={`Main Image ${index}`}
                  w="150px"
                />
              </Box>
            ))}
          </Flex>

          <FormControl mt={3}>
            <FormLabel fontWeight={"bold"}>설명 이미지</FormLabel>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleContentImageChange}
            />
          </FormControl>

          {/* ------------------- 상세옵션 로직 ------------------- */}
          <Box mt={3}>
            {options.map((option, index) => (
              <Flex mt={3} gap={3}>
                <FormControl key={index}>
                  <FormLabel fontWeight={"bold"}>
                    {index + 1}번째 상세옵션추가
                  </FormLabel>
                  <Input
                    value={option.option_name}
                    placeholder="예) 화이트/청축"
                    onChange={(e) => handleInputChange(e, index)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight={"bold"}>수량</FormLabel>
                  <Input
                    type="number"
                    value={option.stock || ""} // 수량이 없으면 빈 문자열
                    onChange={(e) => handleStockChange(e, index)}
                  />
                </FormControl>
              </Flex>
            ))}
            <Flex justifyContent="center" mt={4} mb={10}>
              <Button colorScheme="teal" onClick={handleAddInput}>
                상세 옵션 추가
              </Button>
              <Button
                colorScheme="pink"
                onClick={() => handleRemoveInput(options.length - 1)}
                isDisabled={options.length === 1} // 옵션이 하나만 있을 때는 비활성화
                ml={2}
              >
                마지막 상세 옵션 삭제
              </Button>
            </Flex>
          </Box>

          <Button colorScheme="blue" onClick={handleUpdateClick}>
            저장
          </Button>
          <Button
            colorScheme="purple"
            onClick={() => navigate("/product/list")}
          >
            돌아가기
          </Button>
        </Box>
      </Center>
    </Box>
  );
}
