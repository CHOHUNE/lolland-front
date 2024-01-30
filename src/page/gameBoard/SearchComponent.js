import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Flex, Input, Select } from "@chakra-ui/react";

export function SearchComponent() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("");
  const navigate = useNavigate();

  function handleSearch() {
    // /?k=keyword&c=all
    const params = new URLSearchParams();
    params.set("k", keyword);
    params.set("c", category);
    params.set("s", sortBy);

    navigate("/gameboard/list?" + params); // 경로 수정
  }

  const buttonStyle = {
    background: "black",
    color: "whitesmoke",
    shadow: "1px 1px 3px 1px #dadce0",
    _hover: {
      backgroundColor: "whitesmoke",
      color: "black",
      transition:
        "background 0.5s ease-in-out, color 0.5s ease-in-out, box-shadow 0.5s ease-in-out",
      shadow: "1px 1px 3px 1px #dadce0 inset",
    },
  };

  return (
    <Flex mt={"10px"}>
      <Box>
        <Select
          defaultValue="default"
          w={"120px"}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">최신순</option>
          <option value="count_like">추천순</option>
          <option value="board_count">조회수순</option>
        </Select>
      </Box>
      <Box>
        <Select
          defaultValue="all"
          w={"100px"}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">전체</option>
          <option value="title">제목</option>
          <option value="content">본문</option>
        </Select>
      </Box>
      <Input
        ml={2}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <Button onClick={handleSearch} {...buttonStyle}>
        검색
      </Button>
    </Flex>
  );
}
