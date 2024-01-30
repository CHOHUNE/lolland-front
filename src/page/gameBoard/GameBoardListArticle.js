import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  StackDivider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";

export function GameBoardListArticle() {
  const [pc, setPc] = useState(null);
  const [console, setConsole] = useState(null);
  const [mobile, setMobile] = useState(null);

  useEffect(() => {
    axios.get("/api/gameboard/pc").then((response) => {
      setPc(response.data);

      axios.get("/api/gameboard/console").then((response) => {
        setConsole(response.data);
      });

      axios.get("/api/gameboard/mobile").then((response) => {
        setMobile(response.data);
      });
    });
  }, []);

  return (
    <Card shadow={"1px 1px 3px 1px #dadce0"}>
      <Heading fontSize={"1.5rem"} textAlign={"center"} p={"20px"}>
        게임 관련 기사
      </Heading>
      <Tabs isFitted variant={"enclosed"}>
        <CardHeader>
          <TabList>
            <Tab fontSize={"1.1rem"} fontWeight={"bold"}>
              PC 게임
            </Tab>
            <Tab fontSize={"1.1rem"} fontWeight={"bold"}>
              Console 게임
            </Tab>
            <Tab fontSize={"1.1rem"} fontWeight={"bold"}>
              Mobile 게임
            </Tab>
          </TabList>
        </CardHeader>

        <CardBody>
          <TabPanels>
            <TabPanel>
              <Stack divider={<StackDivider />} spacing="4">
                {pc &&
                  pc.items !== null &&
                  pc.items.map((news) => (
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
            </TabPanel>
            <TabPanel>
              <Stack divider={<StackDivider />} spacing="4">
                {console &&
                  console.items !== null &&
                  console.items.map((news) => (
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
            </TabPanel>
            <TabPanel>
              <Stack divider={<StackDivider />} spacing="4">
                {mobile &&
                  mobile.items !== null &&
                  mobile.items.map((news) => (
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
            </TabPanel>
          </TabPanels>
        </CardBody>
      </Tabs>
    </Card>
  );
}
