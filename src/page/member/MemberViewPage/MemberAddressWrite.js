import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Switch,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function MemberAddressWrite() {
  // 주소 --------------------------------------------------------------------------------------
  const [member_address, setMember_address] = useState("");
  const [member_detail_address, setMember_detail_address] = useState("");
  const [member_address_type, setMember_address_type] = useState("sub");
  const [member_address_name, setMember_address_name] = useState("");
  // 우편번호 --------------------------------------------------------------------------------------
  const [member_post_code, setMember_post_code] = useState("");

  const navigate = useNavigate();
  const toast = useToast();

  // Daum Postcode 스크립트 URL
  const scriptUrl =
    "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  // Daum Postcode 팝업을 여는 함수
  const openPostcodePopup = useDaumPostcodePopup(scriptUrl);
  // 주소 검색 완료 핸들러
  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    setMember_address(fullAddress); // 선택된 주소를 상태에 저장
    setMember_post_code(data.zonecode);
  };

  const handlePostCodeClick = () => {
    openPostcodePopup({ onComplete: handleComplete });
  };

  // 메인 주소 설정 --------------------------------------------------------------------
  function handleMainAddressSwitch(e) {
    if (e.target.checked) {
      setMember_address_type("main");
    } else {
      setMember_address_type("sub");
    }
  }

  // 등록 버튼 클릭 --------------------------------------------------------------------
  function handleSubmitClick() {
    axios
      .post("/api/memberAddress", {
        member_address,
        member_detail_address,
        member_address_name,
        member_address_type,
        member_post_code,
      })
      .then(() =>
        toast({
          description: "주소 등록에 성공하였습니다.",
          status: "success",
        }),
      )
      .then(() => navigate("/memberPage/addressInfo"))
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          let errorMessage = error.response.data[0];
          toast({
            description: errorMessage,
            status: "error",
          });
        } else {
          // 기타 오류에 대한 처리
          toast({
            description: "가입에 실패하셨습니다.",
            status: "error",
          });
        }
      });
  }

  return (
    <Center>
      <Card>
        <CardHeader fontSize={"1.5rem"} color={"#5F625C"} textAlign={"center"}>
          배송지 추가
        </CardHeader>
        <CardBody>
          {/* 주소 별명 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                주소 별명
              </FormLabel>
              <Input
                w={"500px"}
                h={"50px"}
                borderRadius={"0"}
                placeholder={"주소 별명을 입력해 주세요."}
                value={member_address_name}
                onChange={(e) => setMember_address_name(e.target.value)}
              />
            </Flex>
          </FormControl>
          {/* 우편번호 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                우편번호
              </FormLabel>
              <Input
                placeholder={"주소 검색을 클릭 해주세요."}
                w={"350px"}
                h={"50px"}
                borderRadius={"0"}
                readOnly
                value={member_post_code}
              />
              <Button
                w={"140px"}
                h={"50px"}
                ml={"10px"}
                onClick={handlePostCodeClick}
              >
                주소검색
              </Button>
            </Flex>
          </FormControl>
          {/* 주소 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                주소
              </FormLabel>
              <Input
                w={"500px"}
                h={"50px"}
                borderRadius={"0"}
                value={member_address}
                readOnly
              />
            </Flex>
          </FormControl>
          {/* 상세주소 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                상세주소
              </FormLabel>
              <Input
                placeholder={"상세주소를 입력해 주세요"}
                w={"500px"}
                h={"50px"}
                borderRadius={"0"}
                value={member_detail_address}
                onChange={(e) => setMember_detail_address(e.target.value)}
              />
            </Flex>
          </FormControl>
          <FormControl mt={2}>
            <Flex align="center" justify="center">
              <FormLabel w={"130px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                기본 주소 설정
              </FormLabel>
              <Box
                w={"470px"}
                h={"50px"}
                display={"flex"}
                alignItems={"center"}
              >
                <Switch
                  size="lg"
                  colorScheme={"gray"}
                  onChange={handleMainAddressSwitch}
                />
              </Box>
            </Flex>
          </FormControl>
        </CardBody>

        <CardFooter>
          <Flex gap={4}>
            <Button onClick={() => navigate("/memberPage/addressInfo")}>
              취소
            </Button>
            <Button
              bg={"black"}
              color={"whitesmoke"}
              _hover={{ background: "whitesmoke", color: "black" }}
              onClick={handleSubmitClick}
            >
              등록
            </Button>
          </Flex>
        </CardFooter>
      </Card>
    </Center>
  );
}
