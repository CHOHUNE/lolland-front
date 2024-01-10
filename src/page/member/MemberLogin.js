import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

export function MemberLogin() {
  return (
    <Center mt={8} mb={20}>
      <Card w={"1000px"}>
        <CardHeader fontSize={"1.5rem"} color={"#5F625C"} textAlign={"center"}>
          로그인
        </CardHeader>

        <CardBody>
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                아이디
              </FormLabel>
              <Input
                w={"500px"}
                h={"50px"}
                borderRadius={"0"}
                onChange={(e) => {}}
              />
            </Flex>
          </FormControl>
          <FormControl mt={2}>
            <Flex justifyContent={"center"}>
              <FormLabel w={"100px"} fontSize={"1.1rem"} lineHeight={"50px"}>
                비밀번호
              </FormLabel>
              <Input
                w={"500px"}
                h={"50px"}
                borderRadius={"0"}
                onChange={(e) => {}}
              />
            </Flex>
          </FormControl>
          <FormControl mt={4}>
            <Flex justifyContent={"center"}>
              <Button
                w={"600px"}
                h={"50px"}
                borderRadius={"0"}
                color={"whitesmoke"}
                bg={"black"}
                _hover={{ backgroundColor: "whitesmoke", color: "black" }}
              >
                로그인
              </Button>
            </Flex>
          </FormControl>
          <FormControl mt={4}>
            <Flex justifyContent={"center"}>
              <Button
                w={"200px"}
                h={"20px"}
                borderRadius={"0"}
                bg={"none"}
                _hover={"none"}
              >
                아이디 찾기
              </Button>
              <Box>|</Box>
              <Button
                w={"200px"}
                h={"20px"}
                borderRadius={"0"}
                bg={"none"}
                _hover={"none"}
              >
                비밀번호 찾기
              </Button>
            </Flex>
          </FormControl>
          <FormControl mt={20} mb={10}>
            <Flex justifyContent={"center"}>
              <Button
                w={"600px"}
                h={"50px"}
                borderRadius={"0"}
                color={"black"}
                bg={"whitesmoke"}
                _hover={{ backgroundColor: "black", color: "whitesmoke" }}
              >
                회원 가입하기
              </Button>
            </Flex>
          </FormControl>
        </CardBody>
      </Card>
    </Center>
  );
}
