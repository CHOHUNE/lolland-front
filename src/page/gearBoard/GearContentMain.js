import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Spinner, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export function GearContentMain() {
  const navigate = useNavigate();
  const [gearboard, setGearboard] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const toast = useToast();

  // useEffect(() => {
  //   axios
  //     .get("/api/gearboard/gear_id/" + 91)
  //     .then((response) => setGearboard(response.data));
  // }, []);

  // if (gearboard == null) {
  //   return <Spinner />;
  // }

  const handlePrevClick = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + gearboard.files.length) % gearboard.files.length,
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % gearboard.files.length);
  };

  return (
    <Box
      style={{
        width: "100%",
        height: "500px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box>
        {/* 이미지 출력 */}
        {gearboard &&
          gearboard.files.map((file, index) => (
            <Box
              onClick={() => navigate("/gearlist/gear_id/91")}
              key={file.id}
              my="5px"
              display={index === currentIndex ? "block" : "none"}
            >
              <Image width="100%" src={file.url} alt={file.name} />
            </Box>
          ))}
      </Box>
      {/* 좌우 버튼 */}
      <Box
        position="absolute"
        top="50%"
        transform="translateY(-50%)"
        left="5px"
        cursor="pointer"
        onClick={handlePrevClick}
        display={gearboard && currentIndex > 0 ? "block" : "none"}
      >
        <FontAwesomeIcon icon={faArrowLeft} size="2x" color={"white"} />
      </Box>
      <Box
        position="absolute"
        top="50%"
        transform="translateY(-50%)"
        right="5px"
        cursor="pointer"
        onClick={handleNextClick}
        display={
          gearboard && currentIndex < gearboard.files.length - 1
            ? "block"
            : "none"
        }
      >
        <FontAwesomeIcon icon={faArrowRight} size="2x" color={"white"} />
      </Box>
      {/* 추가 이미지 및 텍스트 */}
      {gearboard && (
        <Box
          mt="10px"
          textAlign="left"
          position="absolute"
          right={"-30px"}
          bottom="20px"
          width="100%"
          color="white"
        >
          <Text fontSize="30px" fontWeight="bold" color={"white"}>
            {gearboard.gear_title}
          </Text>
          <Flex gap={3} alignItems={"center"}>
            <Image
              objectFit="cover"
              width={{ base: "25%", sm: "55px" }}
              height={{ base: "25%", sm: "55px" }}
              src={gearboard.file_url}
              alt={gearboard.file_name}
              style={{ borderRadius: "50%" }}
            />
            <Text fontSize={"20px"}>{gearboard.member_name}</Text>
          </Flex>
        </Box>
      )}
    </Box>
  );
}
