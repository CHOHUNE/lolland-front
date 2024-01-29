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
  const categories = [
    "전체",
    "모니터",
    "키보드",
    "마우스",
    "오디오",
    "최신기기",
  ];
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
        removeFileIds,
        uploadFiles,
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

  console.log(removeFileIds);

  function handleRemoveFileSwitch(e) {
    if (e.target.checked) {
      // removeFileIds 에 추가
      setRemoveFileIds([...removeFileIds, e.target.value]);
    } else {
      // removeFileIds 에서 삭제
      setRemoveFileIds(removeFileIds.filter((item) => item !== e.target.value));
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
      </FormControl>{" "}
      {/* 이미지 출력 */}
      {gearboard.files.length > 0 &&
        gearboard.files.map((file) => (
          <Box key={file.id} my="5px">
            <FormControl display="flex" alignItems="center">
              <FormLabel>
                <FontAwesomeIcon color="red" icon={faTrashCan} />
              </FormLabel>
              <Switch
                value={file.id}
                colorScheme="red"
                onChange={handleRemoveFileSwitch}
              />
            </FormControl>
            <Box>
              <Image src={file.url} alt={file.name} width="100%" />
            </Box>
          </Box>
        ))}
      {/* 추가할 파일 선택 */}
      <FormControl>
        <FormLabel>이미지</FormLabel>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setUploadFiles(e.target.files)}
        />
        <FormHelperText>
          한 개 파일은 1MB 이내, 총 용량은 10MB 이내로 첨부하세요.
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
