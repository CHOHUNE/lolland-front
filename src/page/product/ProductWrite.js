import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

export function ProductWrite() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [seletedSubCategory, setSeletedSubCategory] = useState(null);
  const toast = useToast();

  const [name, setName] = useState(""); // 제목
  const [content, setContent] = useState(""); // 상품설명
  const [price, setPrice] = useState(""); // 금액
  const [manufacturer, setManufacturer] = useState(""); // 제조사
  const [stock, setStock] = useState("");
  const [mainImg, setMainImg] = useState(null); // 메인이미지
  const [details, setDetails] = useState([]); // 상세선택 배열 상태

  // ---------------------------------- 대분류,소분류 렌더링 로직 ----------------------------------
  useEffect(() => {
    axios
      .get("/api/product/write")
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
  };

  // ---------------------------------- 소분류 관련 로직 ----------------------------------
  const handleSubCategoryChange = (e) => {
    const selectedSubCategoryId = e.target.value;
    setSeletedSubCategory(selectedSubCategoryId);
  };

  // ---------------------------------- 저장 버튼 클릭 로직 ----------------------------------
  function handleSubmit() {
    axios
      .postForm("/api/product/add", {
        product_name: name,
        product_content: content,
        product_price: price,
        company_name: manufacturer,
        total_stock: stock,
        mainImg,
        category_id: selectedCategory?.category_id,
        subcategory_id: seletedSubCategory,
      })

      .then((response) => {
        toast({
          description: "상품이 등록되었습니다.",
          status: "success",
        });
      })
      .catch((error) => {
        toast({
          description: "오류발생",
          status: "error",
        });
      });
  }

  return (
    <Box>
      <h1>상품 작성</h1>
      {/* ---------------------------------- 대분류 , 소분류 나누는 로직 ---------------------------------- */}
      <Box>
        <>
          {/* categories가 없을 때 (초기값, 에러) 대비해 null return으로 처리 */}
          {categories.length === 0 ? null : (
            <Select onChange={handleCategoryChange}>
              <option value="">---대분류 선택---</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
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

        <FormControl>
          <FormLabel>상품설명</FormLabel>
          <Input value={content} onChange={(e) => setContent(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>제조사</FormLabel>
          <Input
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>판매가</FormLabel>
          <Input value={price} onChange={(e) => setPrice(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>재고</FormLabel>
          <Input value={stock} onChange={(e) => setStock(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>메인 이미지</FormLabel>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setMainImg(e.target.files)}
          />
        </FormControl>

        <Button mt={10} colorScheme="blue" onClick={handleSubmit}>
          저장
        </Button>
      </Box>
    </Box>
  );
}
