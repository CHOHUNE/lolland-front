import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
  HStack,
} from "@chakra-ui/react";
import { MemberNavBar } from "./MemberNavBar";
import { Outlet } from "react-router-dom";
import { MemberNavBarTest } from "./MemberNavBarTest";

export function MemberView() {
  return (
    <>
      <Flex
        // border="1px dashed blue"
        position="relative"
        justifyContent="space-between"
      >
        <MemberNavBarTest />
        <Box
          w="full"
          h="80vh"
          // border="1px dashed red"
          display="flex"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
        >
          Outlet
        </Box>
      </Flex>
      {/* 기존 */}
      <Card w={"1500px"}>
        <CardHeader>
          <MemberNavBar />
        </CardHeader>
        <CardBody>
          <Outlet />
        </CardBody>
      </Card>
      <Center></Center>
    </>
  );
}
