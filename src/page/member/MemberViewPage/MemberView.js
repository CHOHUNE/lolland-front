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
import { MemberNavBarTest } from "../../admin/MemberNavBarTest";

export function MemberView() {
  return (
    <Card shadow={"none"}>
      <Flex position="relative" justifyContent="space-between">
        <MemberNavBarTest />
        <Box
          w="full"
          display="flex"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
        >
          <Outlet />
        </Box>
      </Flex>
      {/* 기존 */}
      {/*<Card w={"1500px"}>*/}
      {/*  <CardHeader>*/}
      {/*    <MemberNavBar />*/}
      {/*  </CardHeader>*/}
      {/*  <CardBody>*/}
      {/*    <Outlet />*/}
      {/*  </CardBody>*/}
      {/*</Card>*/}
    </Card>
  );
}
