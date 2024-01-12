import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  Text,
  TabPanel,
  Box,
  Heading,
  StackDivider,
  Stack,
  Card,
  CardHeader,
  CardBody,
  Flex,
} from "@chakra-ui/react";
export function GearListlayout() {
  return (
    <Box w={"80%"} margin={"15px auto"}>
      <Card>
        <CardHeader>
          <Heading size="md">오늘의 베스트</Heading>
        </CardHeader>

        <CardBody>
          <Stack divider={<StackDivider />} spacing="3">
            <Flex justify={"space-between"}>
              <Box>
                <Box>
                  <Text> 1 </Text>
                  <Text pt="2" fontSize="sm">
                    View a summary of all your clients over the last month.
                  </Text>
                </Box>
                <Box>
                  <Text pt="2" fontSize="sm">
                    Check out the overview of your clients. Check out the
                    overview of your clients. Check out the overview of your
                    clients.
                  </Text>
                </Box>
                <Box>
                  <Text pt="2" fontSize="sm">
                    See a detailed analysis of all your business clients.
                  </Text>
                </Box>
                <Box>
                  <Text pt="2" fontSize="sm">
                    See a detailed analysis of all your business clients.
                  </Text>
                </Box>
                <Box>
                  <Text pt="2" fontSize="sm">
                    See a detailed analysis of all your business clients. See a
                    detailed analysis of all your business clients.
                  </Text>
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

      <Tabs variant="unstyled">
        <TabList>
          <Tab _selected={{ color: "white", bg: "blue.500" }}>전체</Tab>
          <Tab _selected={{ color: "white", bg: "orange.400" }}>잡담</Tab>
          <Tab _selected={{ color: "white", bg: "orange.400" }}>질문</Tab>
          <Tab _selected={{ color: "white", bg: "orange.400" }}>정보</Tab>
          <Tab _selected={{ color: "white", bg: "orange.400" }}>축하</Tab>
          <Tab _selected={{ color: "white", bg: "orange.400" }}>고민</Tab>
          <Tab _selected={{ color: "white", bg: "orange.400" }}>인사</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <p>one!</p>
            <p>one!</p>
            <p>one!</p>
            <p>one!</p>
            <p>one!</p>
            <p>one!</p>
          </TabPanel>
          <TabPanel>
            <p>two!</p>
            <p>two!</p>
            <p>two!</p>
            <p>two!</p>
            <p>two!</p>
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
