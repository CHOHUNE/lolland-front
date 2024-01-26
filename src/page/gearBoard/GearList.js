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

export function GearList({ category }) {
  const [gearboardList, setGearboardList] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/gearboard/list?category=" + category)
      .then((response) => setGearboardList(response.data));
  }, [category]);

  // Function to format the date in "YYYY년 M월 D일" format
  const formatKoreanDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Adding 1 because months are zero-indexed
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  return (
    <Box>
      <Table>
        <Thead>
          <Tr>
            <Td>카테고리</Td>
            <Td>제목</Td>
            <Td>컨텐츠</Td>
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
                <Td>{item.category}</Td>
                <Td>
                  {item.gear_title.slice(0, 17)}
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
                <Td>{item.gear_content.slice(0, 80)}</Td>
                <Td>{formatKoreanDate(item.gear_inserted)}</Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
}
