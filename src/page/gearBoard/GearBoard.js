import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider";

export function GearBoard() {
  const [gear_title, setGear_title] = useState("");
  const [gear_content, setGear_content] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const [uploadFiles, setUploadFiles] = useState(null);
  const categories = [
    "전체",
    "모니터",
    "키보드",
    "마우스",
    "오디오",
    "최신기기",
  ];
  const { isAuthenticated } = useContext(LoginContext);

  function handleSave() {
    setIsSubmitting(true);
    axios
      .postForm("/api/gearboard/saves", {
        gear_title,
        gear_content,
        category: selectedCategory,
        uploadFiles,
      })
      .then(() => {
        toast({ description: "글쓰기가 완료되었습니다", status: "success" });
        navigate("/gearlistlayout");
      })

      .catch(() => {
        toast({ description: "글쓰기 실패", status: "error" });
      })
      .finally(() => setIsSubmitting(true));
  }

  return (
    <Box w={"80%"} textAlign={"center"} m={"0 auto"}>
      <br />
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
          style={{ height: "200px" }}
          value={gear_content}
          onChange={(e) => setGear_content(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>이미지</FormLabel>
        <Input
          type="file"
          multiple // 글을 쓸때  여러개의 파일을 읽을 수 잇따 .
          accept="image/*"
          onChange={(e) => setUploadFiles(e.target.files)}
        />
        <br />
        <FormHelperText>
          한 개 파일은 1MB 이내, 총 용량으 10MB 이내로 첨부 하세요.
        </FormHelperText>
      </FormControl>
      <br />
      <Button
        isDisabled={isSubmitting}
        onClick={handleSave}
        colorScheme={"orange"}
      >
        글쓰기
      </Button>
    </Box>
  );
}
