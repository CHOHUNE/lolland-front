import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
} from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination as SwiperPagination } from "swiper/modules";
import YouTube from "react-youtube";

export function GameBoardListYouTube() {
  const [searchedVideos, setSearchedVideos] = useState([]);

  const opts = {
    width: "550px",
    height: "400px",
    playerVars: {
      autoplay: 0,
    },
  };

  useEffect(() => {
    const params = {
      key: process.env.REACT_APP_YOUTUBE_API_KEY,
      q: "게임 리뷰",
      part: "snippet",
      type: "video",
      maxResults: 3,
      fields: "items(id, snippet(title))",
      videoEmbeddable: true,
    };

    axios
      .get("https://www.googleapis.com/youtube/v3/search", {
        params,
      })
      .then((response) => {
        const videos = response.data.items.map((item) => {
          return {
            videoId: item.id.videoId,
            title: item.snippet.title,
          };
        });

        setSearchedVideos(videos);
      });
  }, []);

  return (
    <Card>
      <CardHeader size={"md"}>
        <Heading fontSize={"1.5rem"} textAlign={"center"} p={"20px"}>
          실시간 인기 게임 영상
        </Heading>
      </CardHeader>
      <CardBody>
        <Box>
          <Swiper
            slidesPerView={1}
            pagination={{
              clickable: true,
            }}
            modules={[Navigation, SwiperPagination]}
            className="mySwiper"
          >
            {searchedVideos &&
              searchedVideos.map((item) => (
                <SwiperSlide key={item.videoId}>
                  <Box key={item.videoId} mb={"50px"}>
                    <YouTube videoId={item.videoId} opts={opts} />
                    <Box w={"400px"} fontWeight={"bold"}>
                      {item.title.replace(/&QUOT;/gi, '"')}
                    </Box>
                  </Box>
                </SwiperSlide>
              ))}
          </Swiper>
        </Box>
      </CardBody>
    </Card>
  );
}
