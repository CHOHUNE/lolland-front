import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Select,
  Spinner,
  Switch,
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
  const [removeMainImgs, setRemoveMainImgs] = useState({}); // 이미지삭제
  const [mainImg, setMainImg] = useState(null); // 이미지 추가

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
        setRemoveMainImgs(
          data.mainImgUrls.reduce(
            (acc, _, index) => ({ ...acc, [index]: false }),
            {},
          ),
        );
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

  // ---------------------------------- 상세옵션선택 관련 로직 ----------------------------------
  const handleInputChange = (e, index) => {
    const newOptions = [...options];
    newOptions[index] = e.target.value;
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
  function handleRemoveMainImgSwitch(index) {
    setProduct((prevProduct) => ({
      ...prevProduct,
      mainImgUrls: prevProduct.mainImgUrls.filter(
        (_, imgIndex) => imgIndex !== index,
      ),
    }));

    // 삭제할 이미지의 상태를 업데이트합니다.
    setRemoveMainImgs((prev) => {
      const newRemoveMainImgs = { ...prev };
      delete newRemoveMainImgs[index];
      return newRemoveMainImgs;
    });
  }

  // 이미지 파일이 선택되었을 때 호출될 함수
  const handleImageChange = (event) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files).map((file) => {
        return URL.createObjectURL(file); // 파일을 위한 Data URL을 생성합니다.
      });

      setPreviewImages(filesArray); // 미리보기 이미지 목록을 업데이트합니다.

      // 메모리 누수를 방지하기 위해, 컴포넌트가 언마운트될 때 URL을 해제합니다.
      return () =>
        filesArray.forEach((fileUrl) => URL.revokeObjectURL(fileUrl));
    }
  };

  function handleUpdateClick() {
    axios.putForm("/api/product/edit", {
      product_id: product_id, //
      product_name: product.product.product_name, //
      product_price: product.product.product_price, //
      product_content: product.product.product_content, //
      total_stock: product.product.total_stock, //
      company_name: product.company_name, //
      category_id: selectedCategory, //
      subcategory_id: selectedSubCategory, //
      removeMainImgs: product.mainImgUrls, // 서버에 이미 있는 이미지 URL들
      newImgs: previewImages, // 새로 업로드할 이미지 미리보기 URL들
      options: options,
    });
  }

  return (
    <Box>
      {/* ------------------- 대분류 로직 ------------------- */}
      <FormControl>
        <FormLabel>대분류</FormLabel>
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
      <FormControl>
        <FormLabel>소분류</FormLabel>
        <Select value={selectedSubCategory} onChange={handleSubCategoryChange}>
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

      <FormControl>
        <FormLabel>상품명</FormLabel>
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

      <FormControl>
        <FormLabel>금액</FormLabel>
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

      <FormControl>
        <FormLabel>상품설명</FormLabel>
        <Input
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

      <FormControl>
        <FormLabel>재고</FormLabel>
        <Input
          value={product.product.total_stock}
          onChange={(e) =>
            setProduct((prevProduct) => ({
              ...prevProduct,
              product: {
                ...prevProduct.product,
                total_stock: e.target.value,
              },
            }))
          }
        />
      </FormControl>

      <FormControl>
        <FormLabel>제조사</FormLabel>
        <Input
          value={product.company_name}
          onChange={(e) =>
            setProduct({ ...product, company_name: e.target.value })
          }
        />
      </FormControl>

      {/* ------------------- 메인이미지 로직 ------------------- */}
      <Flex>
        {product.mainImgUrls.map((imgUrl, index) => (
          <Box key={index} my="5px">
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor={`switch-${index}`}>
                <FontAwesomeIcon color="red" icon={faTrashCan} />
              </FormLabel>
              <Switch
                id={`switch-${index}`}
                isChecked={removeMainImgs[index] || false}
                colorScheme="red"
                onChange={() => handleRemoveMainImgSwitch(index)}
              />
            </FormControl>
            <Image src={imgUrl} alt={`Main Image ${index}`} w="150px" />
          </Box>
        ))}
      </Flex>

      <FormControl>
        <FormLabel>메인 이미지</FormLabel>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
      </FormControl>

      <Flex>
        {previewImages.map((image, index) => (
          <Box key={index} my="5px">
            <Image src={image} alt={`Preview ${index}`} w="150px" />
          </Box>
        ))}
      </Flex>

      {/* ------------------- 상세옵션 로직 ------------------- */}
      <Box>
        {options.map((option, index) => (
          <FormControl key={index}>
            <FormLabel>{index + 1}번째 상세옵션추가</FormLabel>
            <Input
              value={option.option_name}
              placeholder="예) 화이트/청축"
              onChange={(e) => handleInputChange(e, index)}
            />
          </FormControl>
        ))}
        <Flex justifyContent="center" mt={4}>
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
      <Button colorScheme="purple" onClick={() => navigate("/product/list")}>
        돌아가기
      </Button>
    </Box>
  );
}
