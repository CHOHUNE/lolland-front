import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  faArrowRightFromBracket,
  faBagShopping,
  faUser,
  faUserPlus,
  faMagnifyingGlass,
  faPowerOff,
  faUsersGear,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoginContext } from "./LoginProvider";

export function NavBar() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [index, setIndex] = useState(null);
  const toast = useToast();
  const { fetchLogin, isAdmin, isAuthenticated, hasAccess } =
    useContext(LoginContext);

  // 카테고리 불러오기
  useEffect(() => {
    axios
      .get("/api/product/category")
      .then((response) => {
        const uniqueCategories = response.data.reduce((acc, category) => {
          const existingCategory = acc.find(
            (c) => c.category_id === category.category_id,
          );
          if (!existingCategory) {
            acc.push(category);
          }
          return acc;
        }, []);
        setCategories(uniqueCategories);
      })
      .catch((error) => {
        toast({
          title: "카테고리 불러오는 도중 에러 발생",
          description: error.response.data,
          status: "error",
        });
      });
  }, []);

  // 카테고리 재배열 함수 4x4, 변경 시 chuckSize 수정
  const createSubcategoryArrays = (subCategories) => {
    const result = [];
    const chunkSize = 4;

    for (let i = 0; i < subCategories.length; i += chunkSize) {
      result.push(subCategories.slice(i, i + chunkSize));
    }

    return result;
  };

  //로그아웃
  function handleLogoutClick() {
    axios
      .post("/api/member/logout")
      .then(() => {
        toast({
          description: "로그 아웃 되었습니다.",
          status: "success",
        });
        navigate("/");
      })
      .catch(() => {
        toast({
          description: "로그 아웃 중 문제가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => fetchLogin());
  }

  const [overlayVisible, setOverlayVisible] = useState(false);

  return (
    <>
      <Box>
        {/* ------------------- 상단 네브 바 ------------------- */}
        <Flex
          top={0}
          justifyContent="space-between"
          p={5}
          w="full"
          px="3%"
          shadow="sm"
          position="fixed"
          zIndex={100}
          backgroundColor="white"
        >
          <Flex>
            <ButtonGroup variant="undefined" size="md" alignItems={"center"}>
              <Button onClick={() => navigate("/")}>HOME</Button>
              <Button>신상품</Button>
              <Button>인기글</Button>
              <Button>이벤트</Button>
            </ButtonGroup>
          </Flex>

          <Box ml={"-20px"}>
            {/* --------- 로고 --------- */}
            <Box
              w="100px"
              // border="1px dashed black"
              display="flex"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              onClick={() => navigate("/")}
              _hover={{
                cursor: "pointer",
              }}
            >
              <Image src="/logo.png" boxSize="100%" objectFit="fit" />
            </Box>
          </Box>

          <ButtonGroup variant="undefined" size="lg" alignItems={"center"}>
            <IconButton icon={<FontAwesomeIcon icon={faMagnifyingGlass} />} />
            <IconButton
              icon={<FontAwesomeIcon icon={faBagShopping} />}
              onClick={() => {
                if (isAuthenticated()) {
                  navigate("/cart");
                } else {
                  navigate("/login");
                }
              }}
            />
            {isAuthenticated() ? (
              <>
                <IconButton
                  icon={<FontAwesomeIcon icon={faUser} />}
                  onClick={() => navigate("/memberPage")}
                />
                {isAdmin() && (
                  <IconButton
                    icon={
                      <FontAwesomeIcon
                        icon={faUsersGear}
                        onClick={() => {
                          navigate("adminPage");
                        }}
                      />
                    }
                  />
                )}
                <IconButton
                  icon={<FontAwesomeIcon icon={faArrowRightFromBracket} />}
                  onClick={handleLogoutClick}
                />
              </>
            ) : (
              <>
                <Tooltip
                  label="로그인 해주세요!"
                  hasArrow
                  fontSize="xs"
                  bgColor="orange"
                  color="black"
                  fontWeight="bold"
                  borderRadius={10}
                  gutter={0}
                  isOpen={true}
                >
                  <IconButton
                    icon={<FontAwesomeIcon icon={faPowerOff} />}
                    onClick={() => navigate("/login")}
                  />
                </Tooltip>
                <IconButton
                  icon={<FontAwesomeIcon icon={faUserPlus} />}
                  onClick={() => navigate("/signup")}
                />
              </>
            )}
          </ButtonGroup>
        </Flex>

        {/* ------------------- 하단 네브바 ------------------- */}
        <Tabs
          index={index}
          variant="soft-rounded"
          colorScheme="blackAlpha"
          mt="100px"
          justifyContent={"center"}
          display={"flex"}
          alignItems={"center"}
          background={"white"}
        >
          <TabList px={10} py={3}>
            <HStack spacing={2}>
              <Tab
                onClick={() => navigate("/gameboard/list")}
                onMouseEnter={() => {
                  setIndex(0);
                  setOverlayVisible(true);
                }}
                onMouseLeave={() => {
                  setIndex(null);
                  setOverlayVisible(false);
                }}
              >
                커뮤니티
              </Tab>
              {categories.map((category) => (
                <Tab
                  key={category.category_id}
                  onMouseEnter={() => {
                    setIndex(category.category_id);
                    setOverlayVisible(true);
                  }}
                  onMouseLeave={() => {
                    setIndex(null);
                    setOverlayVisible(false);
                  }}
                  onClick={() => navigate(`/category/${category.category_id}`)}
                >
                  {category.category_name}
                </Tab>
              ))}
            </HStack>
          </TabList>
          <TabPanels
            px={10}
            left={0}
            right={0}
            top="53px"
            zIndex={100}
            backgroundColor="white"
            position="absolute"
          >
            <TabPanel
              py={10}
              px={"23%"}
              fontSize="sm"
              onMouseEnter={() => {
                setIndex(0);
                setOverlayVisible(true);
              }}
              onMouseLeave={() => {
                setIndex(null);
                setOverlayVisible(false);
              }}
            >
              <VStack spacing={2} align="flex-start">
                <Text>게임 커뮤니티</Text>
                <Text onClick={() => navigate("/gearlistlayout")}>
                  게임 장비 커뮤니티
                </Text>
              </VStack>
            </TabPanel>
            {categories.map((category) => (
              <TabPanel
                key={category.category_id}
                display="flex"
                py={10}
                px={"23%"}
                onMouseEnter={() => {
                  setIndex(category.category_id);
                  setOverlayVisible(true);
                }}
                onMouseLeave={() => {
                  setIndex(null);
                  setOverlayVisible(false);
                }}
              >
                {createSubcategoryArrays(category.subCategory).map(
                  (subCategoryArray, arrayIndex) => (
                    <VStack
                      key={arrayIndex}
                      align="start"
                      spacing={2}
                      w="200px"
                      mr={10}
                    >
                      {subCategoryArray.map((subCategory) => (
                        <Text
                          key={subCategory.subcategory_id}
                          fontSize="sm"
                          _hover={{
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            navigate(
                              `/category/${category.category_id}/${subCategory.subcategory_id}`,
                            )
                          }
                        >
                          {subCategory.subcategory_name}
                        </Text>
                      ))}
                    </VStack>
                  ),
                )}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>
      {overlayVisible && (
        <Box
          w="full"
          h="100vh"
          bgColor="#000000"
          opacity={0.2}
          position="fixed"
          zIndex={99}
        />
      )}
    </>
  );
}
