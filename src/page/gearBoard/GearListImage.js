import {
  Button,
  Card,
  CardBody,
  Image,
  Text,
  Box,
  CardFooter,
  Heading,
  Stack,
  Spinner,
  Badge,
  FormLabel,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages } from "@fortawesome/free-regular-svg-icons";

export function GearListImage() {
  const [gearboard, setGearboard] = useState(null);

  useEffect(() => {
    axios
      .get("/api/gearboard/image")
      .then((response) => setGearboard(response.data));
  }, []);

  if (gearboard == null) {
    return <Spinner />;
  }

  return (
    <Box>
      {gearboard.map((item) => (
        <Card
          key={item.gear_id}
          direction={{ base: "column", sm: "row" }}
          overflow="hidden"
          variant="outline"
        >
          <Stack>
            <CardBody>
              <Heading size="md">{item.gear_title}</Heading>
              <Text py="2">{item.gear_content}</Text>
            </CardBody>

            <CardFooter>
              <Button variant="solid" colorScheme="blue">
                Buy {item.gear_title}
              </Button>
            </CardFooter>
          </Stack>

          {/*<FormLabel>이미지</FormLabel>*/}
          {/*{gearboard.files.map((file) => (*/}
          {/*  <Box key={file.id} my="5px">*/}
          {/*    <Image width="100%" src={file.url} alt={file.name} />*/}
          {/*  </Box>*/}
          {/*))}*/}
        </Card>
      ))}
    </Box>
  );
}
