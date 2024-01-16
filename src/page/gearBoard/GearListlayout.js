import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  Text,
  TabPanel,
  Box,
  Kbd,
  Heading,
  StackDivider,
  Stack,
  Image,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { GearList } from "./GearList";
import { useState } from "react";

function Pageing() {
  return null;
}

export function GearListlayout() {
  const [category, setCategory] = useState("전체");

  return (
    <Box w={"80%"} margin={"15px auto"}>
      <Flex>
        {/* 왼쪽 70%  오늘의 베스트 , 게시판 리스트 */}
        <Box w={"70%"} margin={"15px  auto"} mr={"20px"}>
          {/* 오늘의 베스트*/}
          <Card>
            <CardHeader>
              <Heading size="md">오늘의 베스트</Heading>
            </CardHeader>
            <Divider orientation="horizontal" color={"orange"} />
            <CardBody>
              <Stack divider={<StackDivider />} spacing="3">
                <Flex justify={"space-between"}>
                  <Box pt="2" fontSize="sm">
                    <Box>
                      <Flex>
                        <kbd> 1 </kbd>
                        <Text>
                          View a summary of all your clients over the last
                          month.
                        </Text>
                      </Flex>
                    </Box>
                    <Box>
                      <Flex>
                        <Text> 2 </Text>
                        <Text>
                          Check out the overview of your clients. Check out the
                          overview of your clients. Check out the overview of
                          your clients.
                        </Text>
                      </Flex>
                    </Box>
                    <Box>
                      <Flex>
                        <Text> 3 </Text>
                        <Text>
                          See a detailed analysis of all your business clients.
                        </Text>
                      </Flex>
                    </Box>
                    <Box>
                      <Flex>
                        <Text> 4 </Text>
                        <Text> 비즈니스 고객의 상세한 분석을 확인하세요</Text>
                      </Flex>
                    </Box>
                    <Box>
                      <Flex>
                        <Text> 5 </Text>
                        <Text>
                          See a detailed analysis of all your business clients.
                          See a detailed analysis of all your business clients.
                        </Text>
                      </Flex>
                    </Box>
                  </Box>
                  <Box>
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        Summary
                      </Heading>
                      <Text pt="2" fontSize="sm">
                        View a summary of all your clients over the last month.
                      </Text>
                    </Box>
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        Overview
                      </Heading>
                      <Text pt="2" fontSize="sm">
                        Check out the overview of your clients. Check out the
                        overview of your clients. overview of your clients.
                      </Text>
                    </Box>
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        Analysis
                      </Heading>
                      <Text pt="2" fontSize="sm">
                        See a detailed analysis of all your business clients.
                      </Text>
                    </Box>
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        Analysis
                      </Heading>
                      <Text pt="2" fontSize="sm">
                        See a detailed analysis of all your business clients.
                      </Text>
                    </Box>
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        Analysis
                      </Heading>
                      <Text pt="2" fontSize="sm">
                        See a detailed analysis of all your business clients.
                      </Text>
                    </Box>
                  </Box>
                </Flex>
              </Stack>
            </CardBody>
          </Card>

          {/*게시판 리스트*/}
          <Tabs variant="unstyled">
            <TabList m={"20px"} mr={"20px"}>
              <Tab
                _selected={{ color: "white", bg: "blue.500" }}
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
            <TabPanels>
              {/* 전체 정보 */}
              <TabPanel>
                <GearList category={category} />
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
          <Card>
            <CardHeader>
              <Heading size="md">자유게시판 BEST(추천순)</Heading>
            </CardHeader>

            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Summary
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    View a summary of all your clients over the last month.
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Overview
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    Check out the overview of your clients.
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Analysis
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    See a detailed analysis of all your business clients.
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Analysis
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    See a detailed analysis of all your business clients.
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Analysis
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    See a detailed analysis of all your business clients.
                  </Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>
          <br />
          <br />
          <br />
          <Box>
            <Heading size="md">최신 공식 기사</Heading>
            <br />
            <Divider orientation="horizontal" color={"orange"} />
            <Flex>
              <Card maxW="sm">
                <CardBody>
                  <Image
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                    alt="Green double couch with wooden legs"
                    borderRadius="lg"
                  />
                  <Stack mt="6" spacing="3">
                    <Heading size="md">Living room Sofa</Heading>
                  </Stack>
                </CardBody>
              </Card>
              <Card maxW="sm">
                <CardBody>
                  <Image
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                    alt="Green double couch with wooden legs"
                    borderRadius="lg"
                  />
                  <Stack mt="6" spacing="3">
                    <Heading size="md">Living room Sofa</Heading>
                  </Stack>
                </CardBody>
              </Card>
            </Flex>
            <Flex>
              <Card maxW="sm">
                <CardBody>
                  <Image
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                    alt="Green double couch with wooden legs"
                    borderRadius="lg"
                  />
                  <Stack mt="6" spacing="3">
                    <Heading size="md">Living room Sofa</Heading>
                  </Stack>
                </CardBody>
              </Card>
              <Card maxW="sm">
                <CardBody>
                  <Image
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                    alt="Green double couch with wooden legs"
                    borderRadius="lg"
                  />
                  <Stack mt="6" spacing="3">
                    <Heading size="md">Living room Sofa</Heading>
                  </Stack>
                </CardBody>
              </Card>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
