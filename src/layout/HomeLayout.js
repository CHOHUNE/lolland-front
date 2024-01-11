import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { NavBar } from "../component/NavBar";
import { Footer } from "../component/Footer";

export function HomeLayout() {
  return (
    <Box>
      <NavBar fontWeight={"700"} />
      <Outlet />
      <Footer fontWeight={"700"} />
    </Box>
  );
}
