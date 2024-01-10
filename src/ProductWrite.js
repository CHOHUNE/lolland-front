import { useEffect, useState } from "react";
import axios from "axios";
import { Select, useToast } from "@chakra-ui/react";

export function ProductWrite() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const toast = useToast();

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

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = categories.find(
      (category) => category.category_id === parseInt(selectedCategoryId),
    );
    setSelectedCategory(selectedCategory);
  };

  return (
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
        <Select>
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
  );
}
