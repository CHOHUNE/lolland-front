import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { NavBar } from "../component/NavBar";
import { Footer } from "../component/Footer";
import "../global.css";

export function HomeLayout() {
  return (
    <Box
      style={{
        fontFamily: "Pretendard-Regular",
      }}
    >
      <NavBar fontWeight={"700"} />
      <Outlet />
      <Footer fontWeight={"700"} />
    </Box>
  );
}
