import { Card, CardBody, CardHeader, Center } from "@chakra-ui/react";
import { MemberNavBar } from "./MemberNavBar";
import { Outlet } from "react-router-dom";

export function MemberView() {
  return (
    <Center>
      <Card w={"1500px"}>
        <CardHeader>
          <MemberNavBar />
        </CardHeader>
        <CardBody>
          <Outlet />
        </CardBody>
      </Card>
    </Center>
  );
}
