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
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDaumPostcodePopup } from "react-daum-postcode";

export function MemberSignup() {
  const [member_name, setMember_name] = useState("");
  const [member_login_id, setMember_login_id] = useState("");
  const [member_password, setMember_password] = useState("");

  // 맴버 비밀번호 확인 ------------------------------------------------------------------------------
  const [member_password_checked, setMember_password_checked] = useState("");

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
  const [member_address, setMember_address] = useState("");
  const [member_detail_address, setMember_detail_address] = useState("");
  const [member_address_type, setMember_address_type] = useState("");
  const [member_address_name, setMember_address_name] = useState("");
  // 우편번호 --------------------------------------------------------------------------------------
  const [member_post_code, setMember_post_code] = useState("");
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
    setMember_address_name("기본주소1");
    setMember_address_type("main");
  };

  // 맴버 가입시 타입을 유저로 --------------------------------------------------------------------------
  const [member_type, setMember_type] = useState("user");

  // 이메일 인증번호 상태 체크 -------------------------------------------------------------------------
  const [sendNumber, setSendNumber] = useState(false);

  // 네비게이트 -------------------------------------------------------------------------------------
  const navigate = useNavigate();

  // 토스트 ---------------------------------------------------------------------------------------
  const toast = useToast();

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

  function handleEmailCodeClick() {
    setSendNumber(true);
  }

  function handleSingUpClick() {
    setMember_type("user");
    axios
      .post("/api/member/signUp", {
        // 회원정보
        member_name,
        member_login_id,
        member_password,
        member_phone_number,
        member_email,
        member_type,

        // 주소정보
        member_address_name,
        member_address,
        member_detail_address,
        member_post_code,
        member_address_type,
      })
      .then(() => {
        toast({
          description: "회원가입 성공하였습니다.",
          status: "success",
        });
        navigate("/");
      })
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
      })
      .finally();
  }

  // 핸드폰 인풋 1 ---------------------------------------------------------------------------------------
  const handlePhoneInput1Change = (e) => {
    setMember_phone_number1(e.target.value);
    if (e.target.value.length === 3) {
      phoneInput2Ref.current.focus();
    }
  };

  // 핸드폰 인풋 2 ---------------------------------------------------------------------------------------
  const handlePhoneInput2Change = (e) => {
    setMember_phone_number2(e.target.value);
    if (e.target.value.length === 4) {
      phoneInput3Ref.current.focus();
    }
  };
  const handlePostCodeClick = () => {
    openPostcodePopup({ onComplete: handleComplete });
  };

  return (
    <Center mt={8} mb={8}>
      <Card w={"1000px"}>
        <CardHeader fontSize={"1.5rem"} color={"#5F625C"} textAlign={"center"}>
          회원가입
        </CardHeader>
        <CardBody>
          {/* 이름 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                이 름
              </FormLabel>
              <Input
                value={member_name}
                w={"500px"}
                h={"50px"}
                borderRadius={"0"}
                onChange={(e) => {
                  setMember_name(e.target.value);
                }}
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
                w={"350px"}
                h={"50px"}
                borderRadius={"0"}
                value={member_login_id}
                onChange={(e) => setMember_login_id(e.target.value)}
              />
              <Button w={"140px"} h={"50px"} ml={"10px"}>
                중복확인
              </Button>
            </Flex>
          </FormControl>
          {/* 비밀번호 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                비밀번호
              </FormLabel>
              <Input
                type={"password"}
                w={"500px"}
                h={"50px"}
                borderRadius={"0"}
                value={member_password}
                onChange={(e) => setMember_password(e.target.value)}
              />
            </Flex>
          </FormControl>
          {/* 비밀번호 체크 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                비밀번호 확인
              </FormLabel>
              <Input
                value={member_password_checked}
                type={"password"}
                w={"500px"}
                h={"50px"}
                borderRadius={"0"}
                onChange={(e) => setMember_password_checked(e.target.value)}
              />
            </Flex>
            <FormErrorMessage>비밀번호가 다릅니다.</FormErrorMessage>
          </FormControl>
          {/* 핸드폰번호 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                휴대폰번호
              </FormLabel>
              <Input
                id="member_phone_number1"
                value={member_phone_number1}
                maxLength={3}
                w={"140px"}
                h={"50px"}
                borderRadius={"0"}
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
                id="member_phone_number2"
                ref={phoneInput2Ref}
                value={member_phone_number2}
                maxLength={4}
                w={"140px"}
                h={"50px"}
                borderRadius={"0"}
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
                id="member_phone_number3"
                ref={phoneInput3Ref}
                value={member_phone_number3}
                maxLength={4}
                w={"140px"}
                h={"50px"}
                borderRadius={"0"}
                onChange={(e) => setMember_phone_number3(e.target.value)}
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
                value={member_email1}
                w={"175px"}
                h={"50px"}
                borderRadius={"0"}
                onChange={(e) => setMember_email1(e.target.value)}
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
                value={member_email2}
                w={"175px"}
                h={"50px"}
                borderRadius={"0"}
                onChange={(e) => setMember_email2(e.target.value)}
              />
              <Button
                w={"90px"}
                h={"50px"}
                ml={"10px"}
                fontSize={"0.8rem"}
                onClick={handleEmailCodeClick}
              >
                인증번호 발송
              </Button>
            </Flex>
          </FormControl>
          {/* 인증번호 입력 */}
          {sendNumber && (
            <FormControl mt={2}>
              <Flex justifyContent={"center"}>
                <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                  인증번호 입력
                </FormLabel>
                <Input
                  placeholder={"메일로 전송된 인증번호를 입력해 주세요."}
                  w={"500px"}
                  h={"50px"}
                  borderRadius={"0"}
                />
              </Flex>
            </FormControl>
          )}

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
                w={"500px"}
                h={"50px"}
                borderRadius={"0"}
                value={member_detail_address}
                onChange={(e) => setMember_detail_address(e.target.value)}
              />
            </Flex>
          </FormControl>
        </CardBody>

        <Flex justifyContent={"center"}>
          <CardFooter>
            <FormControl>
              <Button w={"250px"} h={"50px"} onClick={() => navigate(-1)}>
                취소하기
              </Button>
            </FormControl>
            <FormControl ml={5}>
              <Button
                w={"250px"}
                h={"50px"}
                style={{ backgroundColor: "#5F625C" }}
                color={"whitesmoke"}
                onClick={handleSingUpClick}
              >
                가입하기
              </Button>
            </FormControl>
          </CardFooter>
        </Flex>
      </Card>
    </Center>
  );
}
