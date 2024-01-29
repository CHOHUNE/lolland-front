import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  Stack,
  StackDivider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function GearAppleNews() {
  const [naver, setNaver] = useState(null);
  useEffect(() => {
    axios.get("/api/gear/gearnews").then((response) => setNaver(response.data));
  }, []);

  return (
    <Card bg="orange.100" color="blacks">
      {" "}
      {/* Set background color to orange and text color to white */}
      <CardHeader>
        <Heading size="md">컴퓨터 장비 최신 기사</Heading>
      </CardHeader>
      <Divider orientation="horizontal" borderColor="orange" />
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {naver &&
            naver.items !== null &&
            naver.items.map((news) => (
              <Box key={news.link}>
                <Heading
                  size="xs"
                  textTransform="uppercase"
                  _hover={{ cursor: "pointer" }}
                  onClick={() => window.open(news.link, "_blank")}
                >
                  {news.title
                    .replace(/&quot;/g, "") // &quot; 제거
                    .replace(/<b>/g, "") // <b> 제거
                    .replace(/<\/b>/g, "") + "..."}
                </Heading>
              </Box>
            ))}
        </Stack>
      </CardBody>
    </Card>
  );
}
