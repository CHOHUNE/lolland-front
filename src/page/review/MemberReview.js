import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

function PageButton({ variant, pageNumber, children }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  function handleClick() {
    params.set("p", pageNumber);
    console.log(params.get("p"));
    navigate("?" + params);
  }
  return (
    <Button variant={variant} onClick={handleClick}>
      {children}
    </Button>
  );
}

function Pagination({ pageInfo }) {
  if (!pageInfo) {
    return null;
  }

  const pageNumbers = [];

  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Center>
      <Box>
        <ButtonGroup justifyContent="center">
          {pageInfo.prevPageNumber && (
            <PageButton variant="ghost" pageNumber={pageInfo.prevPageNumber}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </PageButton>
          )}

          {pageNumbers.map((pageNumber) => (
            <PageButton
              key={pageNumber}
              variant={
                pageNumber === pageInfo.currentPageNumber ? "solid" : "ghost"
              }
              pageNumber={pageNumber}
            >
              {pageNumber}
            </PageButton>
          ))}

          {pageInfo.nextPageNumber && (
            <PageButton variant="ghost" pageNumber={pageInfo.nextPageNumber}>
              <FontAwesomeIcon icon={faAngleRight} />
            </PageButton>
          )}
        </ButtonGroup>
      </Box>
    </Center>
  );
}

export function MemberReview() {
  return (
    <VStack w="full" mr={5} spacing={5}>
      <Card w="full">
        <CardHeader>
          <Heading>리뷰 목록</Heading>
        </CardHeader>
        <CardBody>
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th testAlign="center">상품명</Th>
                  <Th testAlign="center">리뷰 내용</Th>
                  <Th testAlign="center">별점</Th>
                  <Th textAlign="center">등록일자</Th>
                </Tr>
              </Thead>
              <Tbody></Tbody>
            </Table>
          </TableContainer>
        </CardBody>
        <CardFooter display="flex" justifyContent="center">
          <Pagination pageInfo={pageInfo} />
        </CardFooter>
      </Card>
      <Outlet />
    </VStack>
  );
}
