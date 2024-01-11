import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams, useResolvedPath } from "react-router-dom";
import { useImmer } from "use-immer";
import { useEffect } from "react";
import axios from "axios";

export function GearView() {
  const { gear_id } = useParams();
  const [gearboard, updateGearboard] = useImmer(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/gearboard/gear_id/" + gear_id)
      .then((response) => updateGearboard(response.data));
  }, []);

  if (gearboard == null) {
    return <Spinner />;
  }

  function handleRemove() {
    axios.delete("/api/gearboard/remove/" + gear_id).then(() => {
      toast({ description: "삭제되었습니다.", status: "error" });
      navigate("/gearlist");
    });
  }

  return (
    <Box>
      <FormControl>
        <FormLabel> {gear_id}번 게시물</FormLabel>
      </FormControl>

      <FormControl>
        <FormLabel>category</FormLabel>
        <Input value={gearboard.category} />
      </FormControl>
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input value={gearboard.gear_title} />
      </FormControl>
      <FormControl>
        <FormLabel>타이틀</FormLabel>
        <Input value={gearboard.gear_content} />
      </FormControl>
      <FormControl>
        <FormLabel>작성일</FormLabel>
        <Input value={gearboard.gear_inserted} />
      </FormControl>

      <Flex>
        <FormControl>
          <FormLabel>조회수</FormLabel>
          <Input value={gearboard.gear_views} />
        </FormControl>

        <FormControl>
          <FormLabel>추천수</FormLabel>
          <Input value={gearboard.gear_recommand} />
        </FormControl>
      </Flex>
      <Button
        colorScheme={"orange"}
        onClick={() => navigate("/gearlist/edit/" + gear_id)}
      >
        {" "}
        수정{" "}
      </Button>
      <Button colorScheme={"red"} onClick={handleRemove}>
        {" "}
        삭제
      </Button>
    </Box>
  );
}
