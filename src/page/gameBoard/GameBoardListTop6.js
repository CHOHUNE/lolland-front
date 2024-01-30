import { Badge, Box, Image, SimpleGrid, Spacer, Text } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination as SwiperPagination } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faImage, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { ChatIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export function GameBoardListTop6() {
  const navigate = useNavigate();

  const [top, setTop] = useState(null);

  useEffect(() => {
    axios
      .get("/api/gameboard/list/top")
      .then((response) => setTop(response.data));
  }, []);

  const categoryColors = {
    "리그 오브 레전드": "green",
    "로스트 아크": "blue",
    "콘솔 게임": "purple",
    "모바일 게임": "orange",
    자유: "gray",
  };

  return (
    <SimpleGrid columns={3} spacing={4} w={"80%"} h={"800px"} ml={"2.5%"}>
      {top &&
        top.map((topTen) => (
          <Box
            w="90%"
            h={"90%"}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxSizing="content-box"
            shadow={"1px 1px 3px 1px #dadce0"}
          >
            <Box
              position="relative"
              w={"100%"}
              h={"75%"}
              style={{ overflow: "hidden" }}
            >
              <Swiper
                slidesPerView={1}
                pagination={{
                  clickable: true,
                }}
                modules={[Navigation, SwiperPagination]}
                className="mySwiper"
              >
                {topTen.files.map((file) => (
                  <SwiperSlide key={file.id}>
                    <Image
                      src={file.file_url}
                      alt={file.file_name}
                      objectFit={"cover"}
                      boxSize={"100%"}
                      css={{
                        transition: "transform 0.3s ease-in-out", // 변환 애니메이션 적용
                        "&:hover": {
                          transform: "scale(1.1)", // 확대 효과
                        },
                      }}
                      onClick={() => navigate("/gameboard/id/" + topTen.id)}
                      _hover={{ cursor: "pointer" }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>

            <Box p="3">
              <Box display="flex" alignItems="baseline">
                <Badge
                  borderRadius="full"
                  style={{ fontSize: "1em" }}
                  colorScheme={categoryColors[topTen.category]}
                >
                  {topTen.category}
                </Badge>
                <Badge
                  colorScheme="green"
                  variant="outline"
                  mx={"2px"} // Adjusted spacing around Badge
                  fontWeight={"bold"}
                  borderRadius={"full"}
                  style={{ fontSize: "1em" }}
                  bgColor={`rgba(0, 128, 0, ${topTen.count_like / 10})`}
                >
                  {topTen.count_like}
                  <FontAwesomeIcon icon={faThumbsUp} />
                </Badge>
                <Text color={"grey"} ml={"2%"}>
                  {new Date(topTen.reg_time).toLocaleDateString("ko-KR", {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </Text>
                <Spacer />
                <Box display="flex">
                  {topTen.count_comment !== 0 && (
                    <Badge
                      colorScheme={"green"}
                      variant="outline"
                      mx={"2%"}
                      borderRadius={"full"}
                      style={{ fontSize: "1.1em" }}
                    >
                      {topTen.count_comment}
                      <ChatIcon />
                    </Badge>
                  )}

                  {topTen.countFile !== 0 && (
                    <Badge
                      mx={"2%"}
                      borderRadius="full"
                      style={{ fontSize: "1em" }}
                    >
                      {topTen.countFile}
                      <FontAwesomeIcon icon={faImage} />
                    </Badge>
                  )}
                  {topTen.countFile !== 0 && (
                    <Badge
                      mx={"2%"}
                      borderRadius="full"
                      style={{ fontSize: "1em" }}
                    >
                      {topTen.board_count}
                      <FontAwesomeIcon icon={faEye} />
                    </Badge>
                  )}
                </Box>
              </Box>

              <Box
                mt="3"
                fontWeight="semibold"
                as="h4"
                lineHeight="tight"
                noOfLines={1}
                fontSize={"1.3em"}
                display={"flex"}
                onClick={() => navigate("/gameboard/id/" + topTen.id)}
                _hover={{ cursor: "pointer" }}
              >
                {topTen.title}
                <Spacer />
                <Box fontSize="0.8em" fontWeight="light">
                  {" "}
                  {/* 폰트 얇게 설정 */}
                  {topTen.member_id}
                </Box>
              </Box>

              <Box display="flex" mt="2" alignItems="center"></Box>
            </Box>
          </Box>
        ))}
    </SimpleGrid>
  );
}
