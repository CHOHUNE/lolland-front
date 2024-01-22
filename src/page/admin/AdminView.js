import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
} from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { AdminNavBar } from "./AdminNavBar";

export function AdminView() {
  return (
    <>
      <Flex position="relative" justifyContent="space-between">
        <AdminNavBar />
        <Box
          w="full"
          mx={5}
          display="flex"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
        >
          <Outlet />
        </Box>
      </Flex>
      {/*<Center>*/}
      {/*  <Card w={"1500px"}>*/}
      {/*    <CardHeader>*/}
      {/*      <AdminNavBar />*/}
      {/*    </CardHeader>*/}
      {/*    <CardBody>*/}
      {/*      <Outlet />*/}
      {/*    </CardBody>*/}
      {/*  </Card>*/}
      {/*</Center>*/}
    </>
  );
}
