import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Spinner,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import React, { useEffect, useState } from "react";
import axios from "axios";

export function GearEdit() {
  const { gear_id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [gearboard, updateGearboard] = useImmer(null);
  const categories = ["전체", "잡담", "질문", "정보", "축하", "고민", "인사"];

  useEffect(() => {
    axios
      .get("/api/gearboard/gear_id/" + gear_id)
      .then((response) => updateGearboard(response.data));
  }, []);

  if (gearboard == null) {
    return <Spinner />;
  }

  function handleSave() {
    axios
      .put("/api/gearboard/saveup", {
        gear_id: gearboard.gear_id,
        category: selectedCategory,
        gear_title: gearboard.gear_title,
        gear_content: gearboard.gear_content,
      })
      .then(() => {
        toast({ description: "수정이 완료 되었습니다", status: "success" });
        navigate("/gearlist");
      });
  }

  return (
    <Box>
      <FormControl>
        <FormLabel> {gear_id}번 게시물</FormLabel>
      </FormControl>

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
          value={gearboard.gear_title}
          onChange={(e) =>
            updateGearboard((draft) => {
              draft.gear_title = e.target.value;
            })
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel>타이틀</FormLabel>
        <Textarea
          value={gearboard.gear_content}
          onChange={(e) =>
            updateGearboard((draft) => {
              draft.gear_content = e.target.value;
            })
          }
        ></Textarea>
      </FormControl>
      <Button colorScheme={"blue"} onClick={handleSave}>
        저장
      </Button>
      <Button colorScheme={"red"} onClick={() => navigate(-2)}>
        취소
      </Button>
    </Box>
  );
}
