import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Image,
  Heading,
  Input,
  Spinner,
  Stack,
  useToast,
  CardHeader,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Tabs,
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

      {/*  게시물 작성자  */}
      <Card
        w={"100%"}
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
      >
        <Image
          objectFit="cover"
          maxW={{ base: "100%", sm: "200px" }}
          src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
          alt="Caffe Latte"
        />

        <Stack>
          <Flex justifyContent={"space-between"}>
            {/*글쓴 사람 정보*/}
            <Box w={"500px"}>
              <CardHeader>
                <Heading size="md"> 글쓴사람 정보 </Heading>
              </CardHeader>
              <CardBody>
                <Text py="1">글쓴사람 닉네임</Text>
              </CardBody>
              <CardFooter>
                <Button variant="solid" colorScheme="blue">
                  Buy Latte
                </Button>
              </CardFooter>
            </Box>
            {/* 작성물 , 댓글 */}
            <Box w={"500px"}>
              <Tabs>
                <TabList h={"60px"}>
                  <Tab>
                    <CardHeader>
                      <Heading size="xs"> 작성물 </Heading>
                    </CardHeader>
                  </Tab>
                  <Tab>
                    <CardHeader>
                      <Heading size="xs"> 댓글</Heading>
                    </CardHeader>
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <CardBody>
                      <Text py="1">제가 생각한 공냉쿨러 저소음... 가설...</Text>
                      <Text py="1">마벨 히어로 컴 케이스도 있었네요</Text>
                      <Text py="1">
                        4070 super 글 보니 왜 이런 얘들 쭈구리 같죠?
                      </Text>
                    </CardBody>
                  </TabPanel>
                  <TabPanel>
                    <CardBody>
                      <Text py="1">
                        대놓고 이런 사기를 칠 수도 있나요???@@;;;;;
                      </Text>
                      <Text py="1">
                        7500f 는 진짜 대박 아이템 이긴 한가 봅니다다들 저{" "}
                      </Text>
                      <Text py="1">
                        저거 팔면 40만원돈 생기는 거죠?와...복권 당첨..
                      </Text>
                    </CardBody>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Flex>
        </Stack>
      </Card>
      <Button
        colorScheme={"orange"}
        onClick={() => navigate("/gearlist/edit/" + gear_id)}
      >
        수정
      </Button>
      <Button colorScheme={"red"} onClick={handleRemove}>
        {" "}
        삭제
      </Button>
    </Box>
  );
}
