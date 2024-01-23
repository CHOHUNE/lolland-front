import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
  Input,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDaumPostcodePopup } from "react-daum-postcode";

export function MemberEdit() {
  // 인풋 css
  const inputStyle = {
    shadow: "1px 1px 3px 1px #dadce0 inset",
  };

  // 버튼 css
  const buttonStyle = {
    background: "black",
    color: "whitesmoke",
    shadow: "1px 1px 3px 1px #dadce0",
    _hover: {
      backgroundColor: "whitesmoke",
      color: "black",
      transition:
        "background 0.5s ease-in-out, color 0.5s ease-in-out, box-shadow 0.5s ease-in-out",
      shadow: "1px 1px 3px 1px #dadce0 inset",
    },
  };

  const fileInputRef = useRef();

  // 맴버 고유 id --------------------------------------------------------------------------------
  const [id, setId] = useState("");

  // 맴버 이름 --------------------------------------------------------------------------------
  const [member_name, setMember_name] = useState("");

  // 맴버 로그인 id --------------------------------------------------------------------------------
  const [member_login_id, setMember_login_id] = useState("");

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

  // 회원 자기 소개 ----------------------------------------------------------------
  const [member_introduce, setMember_introduce] = useState("");

  // 회원 프로필 사진 ----------------------------------------------------------------
  // 이미지 이름
  const [file_name, setFile_name] = useState("");
  // 이미지 경로
  const [file_url, setFile_url] = useState("");
  // 이미지 타입
  const [image_type, setImage_type] = useState("");
  // 사진변경 체크박스 인식
  const [changeImageCheck, setChangeImageCheck] = useState(false);
  // 새로운 이미지
  const [file, setFile] = useState(null);
  // 이미지 업로드창 가능 불가능 하게 바꾸기
  const [fileInputStatus, setFileInputStatus] = useState(false);

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

      // 회원 자기 소개
      setMember_introduce(response.data.member_introduce);

      // 회원 프로필 사진
      setFile_name(response.data.memberImageDto.file_name);
      setFile_url(response.data.memberImageDto.file_url);
      setImage_type(response.data.memberImageDto.image_type);
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
  async function handleEditClick() {
    try {
      await axios.put("/api/member/edit", {
        member: {
          id,
          member_name,
          member_login_id,
          member_phone_number,
          member_email,
          member_type,
          member_introduce,
        },
        memberAddress: {
          member_address,
          member_detail_address,
          member_post_code,
        },
      });
      await axios.putForm("/api/memberImage/editMemberImage", {
        file,
        image_type,
      });
      toast({
        description: "회원 정보가 수정 되었습니다.",
        status: "success",
      });
    } catch (error) {
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
    } finally {
      navigate("/memberPage/memberInfo/memberManagePage");
    }
  }

  // 비밀번호 수정 버튼 클릭시 ---------------------------------------------
  function handleEditPasswordClick() {
    navigate("/memberPage/passwordEdit");
  }

  // 사진 변경 체크 박스 클릭시 로직
  function handleImageChangeClick(e) {
    setChangeImageCheck(e.target.checked);
    // 사진 변경을 다시 해제 할 경우
    if (e.target.checked === false) {
      setFile(null);
    }
  }

  return (
    <Center>
      <Card w={"700px"}>
        <CardHeader
          mt={4}
          textAlign={"center"}
          fontSize={"2rem"}
          fontWeight={"bold"}
          alignItems={"center"}
        >
          회원 정보 수정 페이지 입니다.
        </CardHeader>

        <CardBody>
          {/* 프로필 사진 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                프로필 사진
              </FormLabel>
              <Image
                borderRadius="full"
                boxSize="200px"
                src={file_url}
                alt={file_name}
              />
              <Checkbox
                mt={"180px"}
                ml={"100px"}
                w={"200px"}
                size={"lg"}
                colorScheme={"orange"}
                onChange={handleImageChangeClick}
              >
                사진을 변경합니다.
              </Checkbox>
            </Flex>
            {image_type === "default" && (
              <FormHelperText ml={"180px"}>기본 이미지 입니다.</FormHelperText>
            )}
          </FormControl>

          {/* 새 프로필 사진 등록 하기 */}
          {changeImageCheck && (
            <FormControl mt={6}>
              <Flex justifyContent={"center"} alignItems={"center"}>
                <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                  변경할 사진
                </FormLabel>
                <Input
                  ref={fileInputRef}
                  mt={2}
                  border={"none"}
                  type={"file"}
                  accept="image/*"
                  w={"250px"}
                  h={"50px"}
                  borderRadius={"0"}
                  alignItems={"center"}
                  isDisabled={fileInputStatus}
                  onChange={(e) => {
                    setEditChangeCheck(false);
                    setFile(e.target.files[0]);
                    setImage_type("new");
                  }}
                />
                <Checkbox
                  mt={-2}
                  ml={"50px"}
                  w={"200px"}
                  size={"lg"}
                  colorScheme={"orange"}
                  onChange={(e) => {
                    if (e.target.checked === true) {
                      // 기본 이미지 체크 상태
                      setEditChangeCheck(false);
                      setFile(null); // 체크 전 추가 된 이미지 지우기
                      fileInputRef.current.value = ""; // 추가된 이미지 지운후 client에도 보이게 적용
                      setFileInputStatus(true); // 기본이미지로 사용 할꺼 라면 파일 선택 못 하도록 막기
                      setImage_type("default");
                    } else {
                      // 기본 이미지 체크가 해제된 상태
                      setEditChangeCheck(true);
                      fileInputRef.current.value = ""; // 기본 이미지가 해제 되면 다시 이미지 선택을 인식 시키도록
                      setFileInputStatus(false); // 기본 이미지 체크가 해제 되면 다시 파일 선택하도록 하기
                      setImage_type("new");
                    }
                  }}
                >
                  기본 이미지로 변경
                </Checkbox>
              </Flex>
            </FormControl>
          )}

          {/* 이름 */}
          <FormControl mt={6}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                이 름
              </FormLabel>
              <Input
                {...inputStyle}
                w={"500px"}
                h={"50px"}
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
                {...inputStyle}
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
                {...buttonStyle}
                type={"password"}
                w={"500px"}
                h={"50px"}
                style={{
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
                {...inputStyle}
                type={"number"}
                id="member_phone_number1"
                maxLength={3}
                w={"140px"}
                h={"50px"}
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
                {...inputStyle}
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
                {...inputStyle}
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
                {...inputStyle}
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
                {...inputStyle}
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
                readOnly
                defaultValue={member_post_code}
              />
              <Button
                w={"140px"}
                h={"50px"}
                ml={"10px"}
                onClick={handlePostCodeClick}
                {...buttonStyle}
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
                {...inputStyle}
                value={member_detail_address}
                onChange={(e) => {
                  setMember_detail_address(e.target.value);
                  setEditChangeCheck(false);
                }}
              />
            </Flex>
          </FormControl>

          {/* 자기소개 */}
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                자기소개
              </FormLabel>
              <Textarea
                w={"500px"}
                h={"150px"}
                {...inputStyle}
                value={member_introduce}
                onChange={(e) => {
                  setMember_introduce(e.target.value);
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
              {...buttonStyle}
              style={{
                fontSize: "1.1rem",
                fontWeight: "900",
              }}
              bg={"whitesmoke"}
              color="black"
              _hover={{
                backgroundColor: "black",
                color: "whitesmoke",
                transition:
                  "background 0.5s ease-in-out, color 0.5s ease-in-out, box-shadow 0.5s ease-in-out",
                shadow: "1px 1px 3px 1px #dadce0 inset",
              }}
              onClick={() => navigate(-1)}
            >
              수정 취소
            </Button>
            <Button
              w={"300px"}
              {...buttonStyle}
              style={{
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
