import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
  Input,
  Select,
  Spinner,
  Switch,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

export function GearEdit() {
  const { gear_id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [gearboard, updateGearboard] = useImmer(null);
  const categories = ["전체", "잡담", "질문", "정보", "축하", "고민", "인사"];
  const [removeFileIds, setRemoveFileIds] = useState([]);
  const [uploadFiles, setUploadFiles] = useState(null);

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
      .putForm("/api/gearboard/saveup", {
        uploadFiles,
        removeFileIds,
        gear_id: gearboard.gear_id,
        category: selectedCategory,
        gear_title: gearboard.gear_title,
        gear_content: gearboard.gear_content,
      })
      .then(() => {
        toast({ description: "수정이 완료 되었습니다", status: "success" });
        navigate("/gearlistlayout");
      });
  }
  //e 이벤트 객체 받기
  function handleRemoveFileSwitch(e) {
    if (e.target.checked) {
      // removefileid 에 추가
      setRemoveFileIds([...removeFileIds, e.target.value]);
    } else {
      // removeFileids에 삭제
      setRemoveFileIds(removeFileIds.filter((item) => item !== e.target));
    }
  }

  return (
    <Box w={"80%"} m={"0 auto"}>
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
      {gearboard.files.length > 0 &&
        gearboard.files.map((file) => (
          <Box key={file.id} my={"5px"}>
            <FormControl display={"flex"} alignItems={"center"}>
              <FormLabel>
                <FontAwesomeIcon color={"orange"} icon={faTrashCan} />
              </FormLabel>
              <Switch
                vlaue={file.id}
                colorScheme={"orange"}
                onChange={handleRemoveFileSwitch}
              />
            </FormControl>
            <Box>
              <Image src={file.url} alt={file.name} w={"100%"} />
            </Box>
          </Box>
        ))}
      <FormControl>
        <FormLabel>이미지</FormLabel>
        <Input
          type="file"
          multiple // 글을 쓸때  여러개의 파일을 읽을 수 잇따 .
          accept="image/*"
          onChange={(e) => setUploadFiles(e.target.files)}
        />
        <FormHelperText>
          한 개 파일은 1MB 이내, 총 용량으 10MB 이내로 첨부 하세요.
        </FormHelperText>
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
