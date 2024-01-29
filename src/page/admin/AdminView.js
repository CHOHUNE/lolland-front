import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
} from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";
import { AdminNavBar } from "./AdminNavBar";
import { useContext, useEffect } from "react";
import { LoginContext } from "../../component/LoginProvider";

export function AdminView() {
  const { isAdmin } = useContext(LoginContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/");
    }
  }, [isAdmin]);

  if (!isAdmin()) {
    return null;
  }

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
