import React from "react";
import { Box, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

function Pagination({ pageInfo }) {
  const navigate = useNavigate(); // Always call hooks at the top level

  if (!pageInfo) {
    return null;
  }

  const pageNumbers = [];
  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box>
      {pageInfo.prevPageNumber && (
        <Button
          onClick={() =>
            navigate("/gearlistlayout?p=" + pageInfo.prevPageNumber)
          }
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </Button>
      )}
      {pageNumbers.map((pageNumber) => (
        <Button
          key={pageNumber}
          variant={
            pageNumber === pageInfo.currentPageNubmer ? "solid" : "ghost"
          }
          onClick={() => navigate("/gearlistlayout?p=" + pageNumber)}
        >
          {pageNumber}
        </Button>
      ))}
      {pageInfo.nextPageNumber && (
        <Button
          onClick={() =>
            navigate("/gearlistlayout?p=" + pageInfo.nextPageNumber)
          }
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </Button>
      )}
    </Box>
  );
}

export default Pagination;
