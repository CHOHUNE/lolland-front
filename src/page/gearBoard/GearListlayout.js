import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { GearList } from "./GearList";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GearListAll } from "./GearListAll";
import axios from "axios";
import { TodayBest } from "./TodayBest";
import { FreeBest } from "./FreeBest";
import { GearNews } from "./GearNews";
import { GearNotice } from "./GearNotice";
import { GearContentMain } from "./GearContentMain";

function Pageing() {
  return null;
}

export function GearListlayout() {
  const [category, setCategory] = useState("전체");
  const navigate = useNavigate();
  const [naver, setNaver] = useState(null);

  useEffect(() => {
    axios.get("/api/gear/naver").then((response) => setNaver(response.data));
  }, []);

  return (
    <Box w={"80%"} margin={"15px auto"}>
      <Button onClick={() => navigate("/gearboard")}> 글쓰기</Button>
      <Flex>
        {/* 왼쪽 70%  오늘의 베스트 , 게시판 리스트 */}
        <Box w={"70%"} margin={"15px  auto"} mr={"20px"}>
          {/* 내용을 여기에 넣으세요 */}
          <GearContentMain />
          <br />

          {/* 오늘의 베스트*/}
          <Flex>
            <Box w={"48%"} mr={"1%"}>
              <FreeBest />
            </Box>
            <Box w={"50%"} ml={"1%"}>
              <TodayBest />
            </Box>
          </Flex>

          <br />
          <br />
          {/*공지사항*/}
          <GearNotice />

          <br />
          <br />
          {/*게시판 리스트*/}
          <Tabs variant="unstyled">
            <TabList m={"20px"} mr={"20px"}>
              <Tab
                _selected={{ color: "white", bg: "orange.400" }}
                onClick={(e) => setCategory("전체")}
              >
                전체
              </Tab>
              <Tab
                _selected={{ color: "white", bg: "orange.400" }}
                onClick={(e) => setCategory("잡담")}
              >
                잡담
              </Tab>
              <Tab
                _selected={{ color: "white", bg: "orange.400" }}
                onClick={(e) => setCategory("질문")}
              >
                질문
              </Tab>
              <Tab
                _selected={{ color: "white", bg: "orange.400" }}
                onClick={(e) => setCategory("정보")}
              >
                정보
              </Tab>
              <Tab
                _selected={{ color: "white", bg: "orange.400" }}
                onClick={(e) => setCategory("축하")}
              >
                축하
              </Tab>
              <Tab
                _selected={{ color: "white", bg: "orange.400" }}
                onClick={(e) => setCategory("고민")}
              >
                고민
              </Tab>
              <Tab
                _selected={{ color: "white", bg: "orange.400" }}
                onClick={(e) => setCategory("인사")}
              >
                인사
              </Tab>
            </TabList>

            <Divider orientation="horizontal" color={"orange"} />

            <TabPanels>
              {/* 전체 정보 */}
              <TabPanel>
                <GearListAll category={category} />
              </TabPanel>
              {/* 잡담정보 */}
              <TabPanel>
                <GearList category={category} />
              </TabPanel>
              {/* 질문정보 */}
              <TabPanel>
                <GearList category={category} />
              </TabPanel>
              {/* 정보정보 */}
              <TabPanel>
                <GearList category={category} />
              </TabPanel>
              {/* 축하정보 */}
              <TabPanel>
                <GearList category={category} />
              </TabPanel>
              {/* 고민정보 */}
              <TabPanel>
                <GearList category={category} />
              </TabPanel>
              {/* 인사정보 */}
              <TabPanel>
                <GearList category={category} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
        {/* 오른쪽 30%  자유게시판BEST , 최신 공식기사 */}
        <Box w={"30%"} margin={"15px auto"}>
          <GearNews />
          <br />
          <br />
          <br />
          <Box>
            <Card>
              <CardHeader>
                <Heading size="md" color="orange">
                  게임 관련 최신 기사
                </Heading>
              </CardHeader>
              <Divider orientation="horizontal" color={"orange"} />

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
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
