import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoginContext } from "./LoginProvider";

export function NavBar() {
  const { fetchLogin, isAuthenticated } = useContext(LoginContext);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [index, setIndex] = useState(null);
  const toast = useToast();

  // 카테고리 불러오기
  useEffect(() => {
    axios
      .get("/api/product/write")
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
          shadow="sm"
          position="fixed"
          zIndex={100}
          backgroundColor="white"
        >
          <Flex>
            <Box
              w="200px"
              border="1px dashed black"
              display="flex"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
            >
              로고
            </Box>
            <ButtonGroup variant="undefined" size="lg">
              <Button onClick={() => navigate("/")}>HOME</Button>
              <Button>신상품</Button>
              <Button>인기글</Button>
              <Button>이벤트</Button>
            </ButtonGroup>
          </Flex>
          <ButtonGroup variant="undefined" size="lg">
            <IconButton icon={<FontAwesomeIcon icon={faMagnifyingGlass} />} />
            <IconButton
              icon={<FontAwesomeIcon icon={faBagShopping} />}
              onClick={() => navigate("/cart")}
            />
            {isAuthenticated() && (
              <IconButton
                icon={<FontAwesomeIcon icon={faUser} />}
                onClick={() => navigate("/memberPage")}
              />
            )}
            {isAuthenticated() || (
              <IconButton
                icon={<FontAwesomeIcon icon={faUserPlus} />}
                onClick={() => navigate("/signup")}
              />
            )}
            {isAuthenticated() || (
              <IconButton
                icon={<FontAwesomeIcon icon={faPowerOff} />}
                onClick={() => navigate("/login")}
              />
            )}
            {isAuthenticated() && (
              <IconButton
                icon={<FontAwesomeIcon icon={faArrowRightFromBracket} />}
                onClick={handleLogoutClick}
              />
            )}
          </ButtonGroup>
        </Flex>
        {/* ------------------- 하단 네브바 ------------------- */}
        <Tabs
          index={index}
          variant="soft-rounded"
          colorScheme="blackAlpha"
          mt="90px"
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
                게임 커뮤니티
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
                >
                  {category.category_name}
                </Tab>
              ))}
              <Tab
                onMouseEnter={() => {
                  setIndex(categories.length + 1);
                  setOverlayVisible(true);
                }}
                onMouseLeave={() => {
                  setIndex(null);
                  setOverlayVisible(false);
                }}
              >
                관리자
              </Tab>
            </HStack>
          </TabList>
          <TabPanels
            px={10}
            left={0}
            right={0}
            top="54px"
            zIndex={100}
            backgroundColor="white"
            position="absolute"
          >
            <TabPanel
              p={10}
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
              <Text>게임 장비 커뮤니티</Text>
            </TabPanel>
            {categories.map((category) => (
              <TabPanel
                key={category.category_id}
                display="flex"
                p={10}
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
                        <Text key={subCategory.subcategory_id} fontSize="sm">
                          {subCategory.subcategory_name}
                        </Text>
                      ))}
                    </VStack>
                  ),
                )}
              </TabPanel>
            ))}
            <TabPanel
              p={10}
              fontSize="sm"
              onMouseEnter={() => {
                setIndex(categories.length + 1);
                setOverlayVisible(true);
              }}
              onMouseLeave={() => {
                setIndex(null);
                setOverlayVisible(false);
              }}
            >
              <Text mb={2} onClick={() => navigate("product/write/")}>
                상품등록
              </Text>
              <Text onClick={() => navigate("product/list/")}>상품리스트</Text>
            </TabPanel>
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
