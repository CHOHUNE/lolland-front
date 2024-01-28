import {
  Badge,
  Box,
  Button,
  Spinner,
  Table,
  Tbody,
  Td,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faImage } from "@fortawesome/free-solid-svg-icons";
import { faImages } from "@fortawesome/free-regular-svg-icons";

export function GearListAll() {
  const [gearboardList, setGearboardList] = useState(null);
  const toast = useToast();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("/api/gearboard/listAll?" + params)
      .then((response) => setGearboardList(response.data));
  }, [params]);

  return (
    <Box>
      <Table>
        <Thead>
          <Tr>
            <Td>추천</Td>
            {/*<Td>카테고리</Td>*/}
            <Td>제목</Td>
            <Td>컨텐츠</Td>
            {/*<Td>날짜</Td>*/}
          </Tr>
        </Thead>
        <Tbody>
          {gearboardList == null ? (
            <Spinner />
          ) : (
            gearboardList.map((item) => (
              <Tr
                key={item.gear_id}
                onClick={() => navigate("/gearlist/gear_id/" + item.gear_id)}
              >
                <Td>{item.countLike}</Td>
                {/*<Td>{item.category}</Td>*/}
                <Td>
                  {item.gear_title.slice(0, 30)}
                  {item.countFile > 0 && (
                    <Badge
                      style={{ backgroundColor: "white", color: "orange" }}
                    >
                      <FontAwesomeIcon icon={faImages} />
                      {item.countFile}
                    </Badge>
                  )}
                  {item.commnetcount > 0 && (
                    <Badge
                      style={{ backgroundColor: "white", color: "orange" }}
                    >
                      <FontAwesomeIcon icon={faComment} />
                      {item.commnetcount}
                    </Badge>
                  )}
                </Td>
                {/*<Td>{item.gear_content}</Td>*/}
                <Td>{item.gear_content.slice(0, 90)}</Td>

                {/*<Td>{item.gear_inserted}</Td>*/}
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      <br />
      <Box justifyContent="center" textAlign="center" bg="white" p={4}>
        <Button
          onClick={() => navigate("/gearlistlayout?p=1")}
          mr={2}
          color="black"
          bg="white"
        >
          1
        </Button>
        <Button
          onClick={() => navigate("/gearlistlayout?p=2")}
          mr={2}
          color="black"
          bg="white"
        >
          2
        </Button>
        <Button
          onClick={() => navigate("/gearlistlayout?p=3")}
          mr={2}
          color="black"
          bg="white"
        >
          3
        </Button>
        <Button
          onClick={() => navigate("/gearlistlayout?p=4")}
          mr={2}
          color="black"
          bg="white"
        >
          4
        </Button>
        <Button
          onClick={() => navigate("/gearlistlayout?p=5")}
          mr={2}
          color="black"
          bg="white"
        >
          5
        </Button>
        <Button
          onClick={() => navigate("/gearlistlayout?p=6")}
          mr={2}
          color="black"
          bg="white"
        >
          6
        </Button>
        <Button
          onClick={() => navigate("/gearlistlayout?p=7")}
          mr={2}
          color="black"
          bg="white"
        >
          7
        </Button>
        <Button
          onClick={() => navigate("/gearlistlayout?p=8")}
          mr={2}
          color="black"
          bg="white"
        >
          8
        </Button>
        <Button
          onClick={() => navigate("/gearlistlayout?p=9")}
          mr={2}
          color="black"
          bg="white"
        >
          9
        </Button>
        <Button
          onClick={() => navigate("/gearlistlayout?p=10")}
          color="black"
          bg="white"
        >
          10
        </Button>
      </Box>
    </Box>
  );
}
