import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function ProductWrite() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [seletedSubCategory, setSeletedSubCategory] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [selectedSubCategoryName, setSelectedSubCategoryName] = useState("");

  const toast = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(""); // 제목
  const [content, setContent] = useState(""); // 상품설명
  const [price, setPrice] = useState(""); // 금액
  const [manufacturer, setManufacturer] = useState(""); // 제조사
  const [stock, setStock] = useState("");
  const [mainImg, setMainImg] = useState(null); // 메인이미지
  const [contentImg, setContentImg] = useState(null); // 설명 이미지
  const [options, setOptions] = useState([{ option_name: "", stock: 0 }]); // 초기값 수정
  const [showAddOptionMessage, setShowAddOptionMessage] = useState(true);

  // ---------------------------------- 대분류,소분류 렌더링 로직 ----------------------------------
  useEffect(() => {
    axios
      .get("/api/product/category")
      .then((response) => {
        //left join했기 때문에 자바스크립트 reduce 함수 이용해서 대분류 중복 제거한 데이터 리턴
        const uniqueCategories = response.data.reduce((acc, category) => {
          //카테고리가 존재하는지 category_id로 확인 (existingCategory : 논리값)
          const existingCategory = acc.find(
            (c) => c.category_id === category.category_id,
          );
          // 없으면 추가, 있으면 스킵
          if (!existingCategory) {
            acc.push(category);
          }
          //acc(누산기) 리턴해서 반복
          return acc;
        }, []);
        setCategories(uniqueCategories);
      })
      .catch((error) => {
        toast({
          title: "카테고리 불러오는 도중 에러 발생",
          description: error.response.data,
          status: "error",
        });
      });
  }, []);

  // ---------------------------------- 대분류 관련 로직 ----------------------------------
  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = categories.find(
      (category) => category.category_id === parseInt(selectedCategoryId),
    );
    setSelectedCategory(selectedCategory);
    setSelectedCategoryName(selectedCategory?.category_name); // 이름 저장
  };

  // ---------------------------------- 소분류 관련 로직 ----------------------------------
  const handleSubCategoryChange = (e) => {
    const selectedSubCategoryId = e.target.value;
    const selectedSubCategory = selectedCategory.subCategory.find(
      (subCategory) =>
        subCategory.subcategory_id === parseInt(selectedSubCategoryId),
    );
    setSeletedSubCategory(selectedSubCategoryId); // ID 저장
    setSelectedSubCategoryName(selectedSubCategory?.subcategory_name); // 이름 저장
  };

  // ---------------------------------- 저장 버튼 클릭 로직 ----------------------------------
  function handleSubmit() {
    options.map((option) => console.log(option));

    axios
      .postForm("/api/product/add", {
        product_name: name,
        product_content: content,
        product_price: price,
        company_name: manufacturer,
        mainImg,
        contentImg,
        category_id: selectedCategory?.category_id,
        subcategory_id: seletedSubCategory,
        options: JSON.stringify(options),
      })

      .then((response) => {
        toast({
          description: "상품이 등록되었습니다.",
          status: "success",
        });
        navigate("/product/list/");
      })
      .catch((error) => {
        toast({
          description: "오류발생",
          status: "error",
        });
      });
  }

  // ---------------------------------- 상세옵션선택 관련 로직 ----------------------------------
  const handleOptionChange = (index, field, value) => {
    const updatedOptions = options.map((option, i) => {
      if (i === index) {
        return { ...option, [field]: value };
      }
      return option;
    });
    setOptions(updatedOptions);
  };

  // ---------------------------------- 상세옵션선택 추가 로직 ----------------------------------
  const handleAddOption = () => {
    setOptions([...options, { option_name: "", stock: 1 }]);
  };

  // ---------------------------------- 상세옵션선택 감소 로직 ----------------------------------
  const handleRemoveOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <Box mt={5} mb={5}>
      <Text
        fontSize={"2rem"}
        fontWeight={"bold"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        상품등록
      </Text>
      <Center mt={5} boxShadow={"md"} p={5}>
        {/* ---------------------------------- 대분류 , 소분류 나누는 로직 ---------------------------------- */}
        <Box>
          <>
            {/* categories가 없을 때 (초기값, 에러) 대비해 null return으로 처리 */}
            {categories.length === 0 ? null : (
              <Select onChange={handleCategoryChange}>
                <option value="">---대분류 선택---</option>
                {categories.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.category_name}
                  </option>
                ))}
              </Select>
            )}
            {selectedCategory && (
              <Select onChange={handleSubCategoryChange}>
                <option value="">---소분류 선택---</option>
                {selectedCategory.subCategory.map((subCategory) => (
                  <option
                    key={subCategory.subcategory_id}
                    value={subCategory.subcategory_id}
                  >
                    {subCategory.subcategory_name}
                  </option>
                ))}
              </Select>
            )}
          </>

          <FormControl mt={10}>
            <FormLabel>상품명</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>

          <FormControl mt={3}>
            <FormLabel>상품설명</FormLabel>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </FormControl>

          <FormControl mt={3}>
            <FormLabel>제조사</FormLabel>
            <Input
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
            />
          </FormControl>

          <FormControl mt={3}>
            <FormLabel>판매가</FormLabel>
            <Input value={price} onChange={(e) => setPrice(e.target.value)} />
          </FormControl>

          <FormControl mt={3}>
            <FormLabel>메인 이미지</FormLabel>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setMainImg(e.target.files)}
            />
          </FormControl>

          <FormControl mt={3}>
            <FormLabel>설명 이미지</FormLabel>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setContentImg(e.target.files)}
            />
          </FormControl>

          <Box mt={3}>
            {options.map((option, index) => (
              <Flex key={index} align="center">
                <FormControl mr={2}>
                  <FormLabel>{`옵션 ${index + 1}`}</FormLabel>
                  <Input
                    value={option.option_name}
                    placeholder="예) 화이트/청축"
                    onChange={(e) =>
                      handleOptionChange(index, "option_name", e.target.value)
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>수량</FormLabel>
                  <Input
                    type="number"
                    value={option.stock}
                    onChange={(e) =>
                      handleOptionChange(index, "stock", e.target.value)
                    }
                  />
                </FormControl>
                <Button
                  ml={2}
                  mt={8}
                  onClick={() => handleRemoveOption(index)}
                  colorScheme="pink"
                >
                  삭제
                </Button>
              </Flex>
            ))}
            {showAddOptionMessage && (
              <Text color={"red"} fontSize={"md"}>
                옵션은 최소 1개 이상 작성해주세요.
                <br />
                ex) 옵션 : 기본제품 / 수량 : 5
              </Text>
            )}
            <Flex justifyContent="center" mt={4}>
              <Button
                colorScheme="teal"
                onClick={() => {
                  handleAddOption();
                  setShowAddOptionMessage(false); // Hide the message when the button is clicked
                }}
              >
                상세 옵션 추가
              </Button>
            </Flex>
          </Box>

          <Button mt={10} colorScheme="blue" onClick={handleSubmit}>
            저장
          </Button>
        </Box>
      </Center>
    </Box>
  );
}
