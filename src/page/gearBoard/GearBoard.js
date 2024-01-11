import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function GearBoard() {
  const [gear_title, setGear_title] = useState("");
  const [gear_content, setGear_content] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [member, setMember] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const categories = ["전체", "잡담", "질문", "정보", "축하", "고민", "인사"];

  // useEffect(() => {
  //   axios.get("/api/gearboard/getm").then((response) => response.data);
  // }, []);

  function handleSave() {
    axios
      .post("/api/gearboard/save", {
        gear_title,
        gear_content,
        category: selectedCategory,
      })
      .then(() => {
        toast({ description: "글쓰기가 완료되었습니다", status: "success" });
        navigate("/gearlist");
      })

      .catch((error) => {
        console.error("Error saving the gear post:", error);
        toast({ description: "글쓰기 실패", status: "error" });
      });
  }

  return (
    <Box>
      <h1>게임 장비 게시판</h1>
      <VStack spacing={2} align="start">
        <FormControl>
          <FormLabel>카테고리</FormLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </FormControl>
      </VStack>
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input
          value={gear_title}
          onChange={(e) => setGear_title(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>컨텐츠</FormLabel>
        <Textarea
          value={gear_content}
          onChange={(e) => setGear_content(e.target.value)}
        />
      </FormControl>

      {/*<FormControl>*/}
      {/*  <FormLabel>작성자</FormLabel>*/}
      {/*  <Input*/}
      {/*    value={member_name}*/}
      {/*    onChange={(e) => setGear_title(e.target.value)}*/}
      {/*  />*/}
      {/*</FormControl>*/}
      <Button onClick={handleSave} colorScheme={"orange"}>
        글쓰기
      </Button>
    </Box>
  );
}
