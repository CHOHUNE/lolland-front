import React from "react";
import { Form, useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function FailPage(props) {
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");
  const navigate = useNavigate();

  ///fail?code={ERROR_CODE}&message={ERROR_MESSAGE}
  // &orderId={ORDER_ID}
  return (
    <Card mx="35%" my="5%" shadow="md">
      <CardHeader textAlign="center">
        <Text color="#EC7500" fontSize="6xl">
          <FontAwesomeIcon icon={faTriangleExclamation} />
        </Text>
        <Heading>결제에 실패했습니다</Heading>
      </CardHeader>
      <CardBody my={5}>
        <Box bgColor="#FDF1E5" color="#EC7500" p={3} borderRadius={10}>
          <Text fontSize="sm" fontWeight="bold">
            <Text as="span">ERROR CODE</Text> {errorCode}
          </Text>
          <Text fontSize="sm">
            <Text as="span">실패 사유:</Text> {errorMessage}
          </Text>
        </Box>
      </CardBody>
      <CardFooter display="flex" justifyContent="center">
        <Button onClick={() => navigate("/")}>홈으로 돌아가기</Button>
      </CardFooter>
    </Card>
  );
}

export default FailPage;
