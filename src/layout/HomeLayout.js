import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { NavBar } from "../component/NavBar";
import { Footer } from "../component/Footer";

export function HomeLayout() {
  return (
    <Box fontWeight={"700"}>
      <NavBar />
      <Outlet />
      <Footer />
    </Box>
  );
}
