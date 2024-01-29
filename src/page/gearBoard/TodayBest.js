import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Image,
  Spinner,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function TodayBest() {
  const [boardList, setBoardList] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("api/gearboard/today")
      .then((response) => setBoardList(response.data));
  }, []);

  if (boardList == null) {
    return <Spinner />;
  }

  return (
    <Card>
      <CardHeader>
        <Heading size="md" color="orange">
          최신글
        </Heading>
      </CardHeader>
      <Divider orientation="horizontal" color={"orange"} />
      <CardBody>
        <Stack divider={<StackDivider />} spacing="5">
          {boardList.map((item) => (
            <Box
              key={item.gear_id}
              onClick={() => navigate("/gearlist/gear_id/" + item.gear_id)}
            >
              <Flex gap={10} justify="space-between" alignItems="center">
                <Box>
                  <Heading size="md" mb={"15px"} textTransform="uppercase">
                    {item.gear_title}
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {item.gear_content.slice(0, 150)}
                  </Text>
                  <Text mt={"10px"} size={"sm"} color={"orange"}>
                    {/* Format the date as "2024년 1월 26일" */}
                    {new Date(item.gear_inserted).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </Box>
                <Box
                  w="280px"
                  h="150px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  overflow="hidden"
                >
                  <Image h={"100%"} src={item.mainfile} alt="Gear Image" />
                </Box>
              </Flex>
            </Box>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}
