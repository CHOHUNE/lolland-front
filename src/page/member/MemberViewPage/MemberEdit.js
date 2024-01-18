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
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useImmer } from "use-immer";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDaumPostcodePopup } from "react-daum-postcode";

export function MemberEdit() {
  // 맴버 고유 id --------------------------------------------------------------------------------
  const [id, setId] = useState("");

  // 맴버 이름 --------------------------------------------------------------------------------
  const [member_name, setMember_name] = useState("");

  // 맴버 로그인 id --------------------------------------------------------------------------------
  const [member_login_id, setMember_login_id] = useState("");

  // 맴버 비밀번호 --------------------------------------------------------------------------------
  const [member_password, setMember_password] = useState("");

  // 맴버 핸드폰 번호 --------------------------------------------------------------------------------
  const [member_phone_number, setMember_phone_number] = useState("");
  const [member_phone_number1, setMember_phone_number1] = useState("");
  const [member_phone_number2, setMember_phone_number2] = useState("");
  const [member_phone_number3, setMember_phone_number3] = useState("");
  // 맴버 핸드폰 Ref --------------------------------------------------------------------------------
  const phoneInput2Ref = useRef();
  const phoneInput3Ref = useRef();

  // 맴버 이메일 ------------------------------------------------------------------------------------
  const [member_email, setMember_email] = useState("");
  const [member_email1, setMember_email1] = useState("");
  const [member_email2, setMember_email2] = useState("");

  // 주소 --------------------------------------------------------------------------------------
  const [member_post_code, setMember_post_code] = useState("");
  const [member_address, setMember_address] = useState("");
  const [member_detail_address, setMember_detail_address] = useState("");

  // 맴버 타입 --------------------------------------------------------------------------------------
  const [member_type, setMember_type] = useState("");

  // 회원 정보 변경 인식 --------------------------------------------------------------------------------------
  // true 면 수정하기 버튼 비활셩화 false 일때 수정하기 버튼 활성화 되게 함
  const [editChangeCheck, setEditChangeCheck] = useState(true);

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
    setEditChangeCheck(false);
  };

  useEffect(() => {
    axios.get("/api/member/memberInfo").then((response) => {
      setId(response.data.id);
      setMember_name(response.data.member_name);
      setMember_login_id(response.data.member_login_id);

      const phoneNumber = response.data.member_phone_number.split("-");
      setMember_phone_number1(phoneNumber[0]);
      setMember_phone_number2(phoneNumber[1]);
      setMember_phone_number3(phoneNumber[2]);

      const email = response.data.member_email.split("@");
      setMember_email1(email[0]);
      setMember_email2(email[1]);

      setMember_type(response.data.member_type);

      setMember_post_code(response.data.memberAddressDto.member_post_code);
      setMember_address(response.data.memberAddressDto.member_address);
      setMember_detail_address(
        response.data.memberAddressDto.member_detail_address,
      );
    });
  }, []);

  // 이메일이나 핸드폰 번호가 input칸 하나라도 변경 되면 해당 데이터가 수정 되도록 작동 하는 useEffect ------------
  useEffect(() => {
    setMember_email(member_email1 + "@" + member_email2);
    setMember_phone_number(
      member_phone_number1 +
        "-" +
        member_phone_number2 +
        "-" +
        member_phone_number3,
    );
  }, [
    member_email1,
    member_email2,
    member_phone_number1,
    member_phone_number2,
    member_phone_number3,
  ]);

  // 주소 찾기 클릭시 ----------------------------------------------------------
  const handlePostCodeClick = () => {
    setMember_detail_address("");
    openPostcodePopup({ onComplete: handleComplete });
  };

  // 핸드폰 인풋 1 ---------------------------------------------------------------------------------------
  const handlePhoneInput1Change = (e) => {
    setEditChangeCheck(false);
    setMember_phone_number1(e.target.value);
    if (e.target.value.length === 3) {
      phoneInput2Ref.current.focus();
    }
  };

  // 핸드폰 인풋 2 ---------------------------------------------------------------------------------------
  const handlePhoneInput2Change = (e) => {
    setEditChangeCheck(false);
    setMember_phone_number2(e.target.value);
    if (e.target.value.length === 4) {
      phoneInput3Ref.current.focus();
    }
  };

  // 수정 하기 버튼 클릭시 ----------------------------------------------------------
  function handleEditClick() {
    axios
      .put("/api/member/edit", {
        member: {
          id,
          member_name,
          member_login_id,
          member_phone_number,
          member_email,
          member_type,
        },
        memberAddress: {
          member_address,
          member_detail_address,
          member_post_code,
        },
      })
      .then(() =>
        toast({
          description: "회원 정보가 수정 되었습니다.",
          status: "success",
        }),
      )
      .then(() => navigate("/memberPage/memberInfo/memberManagePage"))
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
            description: "정보 수정중 문제가 발생하였습니다.",
            status: "error",
          });
        }
      })
      .finally();
  }

  // 비밀번호 수정 버튼 클릭시 ---------------------------------------------
  function handleEditPasswordClick() {
    navigate("/memberPage/passwordEdit");
  }

  return (
    <Center>
      <Card w={"700px"}>
        <CardHeader>맴버 수정페이지에요</CardHeader>

        <CardBody>
          {/* 이름 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                이 름
              </FormLabel>
              <Input
                w={"500px"}
                h={"50px"}
                borderRadius={"0"}
                readOnly
                value={member_name}
              />
            </Flex>
          </FormControl>

          {/* 아이디 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                아이디
              </FormLabel>
              <Input
                w={"500px"}
                h={"50px"}
                borderRadius={"0"}
                readOnly
                value={member_login_id}
              />
            </Flex>
            <Center mb={4}>
              <FormHelperText fontSize={"1.1rem"}>
                이름과 아이디는 수정 불가능 합니다.
              </FormHelperText>
            </Center>
          </FormControl>

          {/* 비밀번호 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                비밀번호
              </FormLabel>
              <Button
                type={"password"}
                w={"500px"}
                h={"50px"}
                borderRadius={"0"}
                style={{
                  backgroundColor: "black",
                  color: "whitesmoke",
                  fontWeight: "700",
                }}
                onClick={handleEditPasswordClick}
              >
                비밀번호 수정
              </Button>
            </Flex>
          </FormControl>

          {/* 핸드폰번호 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                휴대폰번호
              </FormLabel>
              <Input
                type={"number"}
                id="member_phone_number1"
                maxLength={3}
                w={"140px"}
                h={"50px"}
                borderRadius={"0"}
                value={member_phone_number1}
                onChange={handlePhoneInput1Change}
              />
              <Box
                fontSize={"1.1rem"}
                lineHeight={"50px"}
                ml={"15px"}
                mr={"15px"}
              >
                -
              </Box>
              <Input
                type={"number"}
                id="member_phone_number2"
                ref={phoneInput2Ref}
                maxLength={4}
                w={"140px"}
                h={"50px"}
                borderRadius={"0"}
                value={member_phone_number2}
                onChange={handlePhoneInput2Change}
              />
              <Box
                fontSize={"1.1rem"}
                lineHeight={"50px"}
                ml={"15px"}
                mr={"15px"}
              >
                -
              </Box>
              <Input
                type={"number"}
                id="member_phone_number3"
                ref={phoneInput3Ref}
                maxLength={4}
                w={"140px"}
                h={"50px"}
                borderRadius={"0"}
                value={member_phone_number3}
                onChange={(e) => {
                  setMember_phone_number3(e.target.value);
                  setEditChangeCheck(false);
                }}
              />
            </Flex>
          </FormControl>

          {/* 이메일 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                이메일
              </FormLabel>
              <Input
                id="member_email1"
                w={"225px"}
                h={"50px"}
                borderRadius={"0"}
                value={member_email1}
                onChange={(e) => {
                  setMember_email1(e.target.value);
                  setEditChangeCheck(false);
                }}
              />
              <Box
                fontSize={"1.1rem"}
                lineHeight={"50px"}
                ml={"15px"}
                mr={"15px"}
              >
                @
              </Box>
              <Input
                id="member_email2"
                w={"225px"}
                h={"50px"}
                borderRadius={"0"}
                value={member_email2}
                onChange={(e) => {
                  setMember_email2(e.target.value);
                  setEditChangeCheck(false);
                }}
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
                w={"350px"}
                h={"50px"}
                borderRadius={"0"}
                readOnly
                defaultValue={member_post_code}
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
                readOnly
                defaultValue={member_address}
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
                w={"500px"}
                h={"50px"}
                borderRadius={"0"}
                value={member_detail_address}
                onChange={(e) => {
                  setMember_detail_address(e.target.value);
                  setEditChangeCheck(false);
                }}
              />
            </Flex>
          </FormControl>
        </CardBody>

        <CardFooter>
          <Flex gap={10}>
            <Button
              w="300px"
              style={{ fontSize: "1.1rem", fontWeight: "900" }}
              onClick={() => navigate(-1)}
            >
              수정 취소
            </Button>
            <Button
              w={"300px"}
              style={{
                color: "whitesmoke",
                backgroundColor: "black",
                fontSize: "1.1rem",
                fontWeight: "900",
              }}
              onClick={handleEditClick}
              isDisabled={editChangeCheck}
            >
              수정 하기
            </Button>
          </Flex>
        </CardFooter>
      </Card>
    </Center>
  );
}
