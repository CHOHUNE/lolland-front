import { Card, CardBody, CardHeader, Center } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { AdminNavBar } from "./AdminNavBar";

export function AdminView() {
  return (
    <Center>
      <Card w={"1500px"}>
        <CardHeader>
          <AdminNavBar />
        </CardHeader>
        <CardBody>
          <Outlet />
        </CardBody>
      </Card>
    </Center>
  );
}
