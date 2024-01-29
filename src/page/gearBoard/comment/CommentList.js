import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";

export function CommentList() {
  const { gear_id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const [commentList, setCommentList] = useState([]);
  useEffect(() => {
    axios
      .get("/api/gcomment/list?gear_id=" + gear_id)
      .then((response) => setCommentList(response.data));
  }, []);

  function handleDelete(id) {
    console.log(id + "삭제되었습니다.");
    axios.delete("/api/gcomment/remove/" + id).then(() => {
      toast({ description: "삭제되었습니다.", status: "error" });
      navigate("/gearlistlayout");
    });
  }

  return (
    <Card boxShadow={"none"}>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {commentList.map((comment) => (
            <Box key={comment.id}>
              <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Box>
                  <Heading size="sm">{comment.member_name} </Heading>
                  <Text pt="2" fontSize="sm">
                    {comment.comment}
                  </Text>
                  <Text color={"orange"} mt={"10px"} fontSize="xs">
                    {comment.inserted}
                  </Text>
                </Box>
                <Button
                  onClick={() => handleDelete(comment.id)}
                  size={"sm"}
                  colorScheme={"red"}
                >
                  <DeleteIcon />
                </Button>
              </Flex>
            </Box>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}
