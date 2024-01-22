import {
  Badge,
  Box,
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
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faImage } from "@fortawesome/free-solid-svg-icons";
import { faImages } from "@fortawesome/free-regular-svg-icons";

export function GearListAll({ category }) {
  const [gearboardList, setGearboardList] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/gearboard/listAll")
      .then((response) => setGearboardList(response.data));
  }, [category]);

  return (
    <Box>
      <Table>
        <Thead>
          <Tr>
            <Td>추천</Td>
            <Td>카테고리</Td>
            <Td>제목</Td>
            <Td>컨텐츠</Td>
            <Td>조회수</Td>
            <Td>날짜</Td>
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
                <Td>{item.gear_recommand}</Td>
                <Td>{item.category}</Td>
                <Td>
                  {item.gear_title}
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
                <Td>{item.gear_content}</Td>
                <Td>{item.gear_views}</Td>
                <Td>{item.gear_inserted}</Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
}
