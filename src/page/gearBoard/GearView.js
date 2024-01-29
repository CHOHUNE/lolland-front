import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as PropTypes from "prop-types";
import { GearCommentContainer } from "./comment/GearCommentContainer";
import { faHeart as em } from "@fortawesome/free-regular-svg-icons";
import { faHeart as ful } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";

// Import Swiper styles
import "../../component/swiper.css";
function LikeContainer({ like, onClick }) {
  if (like === null) {
    return <Spinner />;
  }
  return (
    <Button variant="ghost" size="xl" onClick={onClick}>
      {/*<FontAwesomeIcon icon={faHeart} size="xl" />*/}
      <Flex gap={2}>
        <Text> 게시물 추천</Text>
        {like.gearLike && <FontAwesomeIcon icon={ful} size="xl" />}
        {like.gearLike || <FontAwesomeIcon icon={em} size="xl" />}
      </Flex>
      {/*{like.countLike}*/}
    </Button>
  );
}

export function GearView() {
  const { gear_id } = useParams();
  const [gearboard, setGearboard] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const [like, setLike] = useState(null);

  useEffect(() => {
    axios
      .get("/api/gearboard/gear_id/" + gear_id)
      .then((response) => setGearboard(response.data));
  }, []);

  useEffect(() => {
    axios
      .get("/api/gearlike/board/" + gear_id)
      .then((response) => setLike(response.data));
  }, []);

  if (gearboard == null) {
    return <Spinner />;
  }

  function handleRemove() {
    axios.delete("/api/gearboard/remove/" + gear_id).then(() => {
      toast({ description: "삭제되었습니다.", status: "error" });
      navigate("/gearlist");
    });
  }

  function handleLike() {
    axios
      .post("/api/gearlike", { gearboardId: gearboard.gear_id })
      .then((response) => setLike(response.data))
      .catch(() => console.log("bad"))
      .finally(() => console.log("done"));
  }

  return (
    <Box>
      <Box h={"596px"} w={"100vw"} overflow={"hidden"}>
        {gearboard.files.length > 0 && (
          <Box key={gearboard.files[0].id} my="5px">
            <Image
              width="100%"
              src={gearboard.files[0].url}
              alt={gearboard.files[0].name}
            />
          </Box>
        )}
      </Box>
      <br />
      <br />
      <Box w={"40%"} m={"0 auto"}>
        <Heading size="lg" m={"10px"}>
          {gearboard.gear_title}
        </Heading>
        <br />

        {gearboard.gear_content}

        {/* 이미지 출력*/}
        {gearboard.files.map((file) => (
          <Box key={file.id} my="5px">
            <Image width="100%" src={file.url} alt={file.name} />
          </Box>
        ))}

        <br />
        <br />
        <Flex justifyContent={"space-between"}>
          <Box>
            <Text>작성일 : {gearboard.gear_inserted}</Text>
            <Text>추천수 : {gearboard.countLike}</Text>
            <Text>댓글수 : {gearboard.commnetcount}</Text>
          </Box>
          {/* 좋아요 표시*/}
          <LikeContainer like={like} onClick={handleLike} />
          <Button
            colorScheme={"orange"}
            onClick={() => navigate("/gearlist/edit/" + gear_id)}
          >
            수정
          </Button>
          <Button colorScheme={"red"} onClick={handleRemove}>
            삭제
          </Button>
        </Flex>
        <br />
        <br />
        {/*  게시물 작성자  */}
        <Flex align="center" gap={5}>
          <Image
            objectFit="cover"
            width={{ base: "25%", sm: "75px" }}
            height={{ base: "25%", sm: "75px" }}
            src={gearboard.file_url}
            alt={gearboard.file_name}
            style={{ borderRadius: "50%" }}
          />
          <Box>
            <Heading size="md">{gearboard.member_name}</Heading>
            <Text>{gearboard.member_introduce}</Text>
          </Box>

          <Button ml="auto" variant="solid" colorScheme="twitter">
            팔로우
          </Button>
        </Flex>
        <br />

        <Box>
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={true}
            modules={[EffectCoverflow, Pagination]}
            className="mySwiper"
          >
            {gearboard.files.map((file) => (
              <SwiperSlide key={file.id}>
                <img src={file.url} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        <Box display="flex" justifyContent="space-between">
          {gearboard.files.map((file) => (
            <Box key={file.id} my="5px">
              <Image
                style={{ borderRadius: "5%" }}
                width="150px"
                height="150px"
                src={file.url}
                alt={file.name}
              />
            </Box>
          ))}
        </Box>

        <br />
        <br />

        {/* 댓글 기능 추가 */}
        <Flex gap={2}>
          <Heading size="md">댓글 </Heading>
          <Heading color={"orange"} size="md">
            {gearboard.commentcount}
          </Heading>
        </Flex>

        <GearCommentContainer />
      </Box>
    </Box>
  );
}
