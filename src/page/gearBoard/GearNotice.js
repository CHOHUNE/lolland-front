import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";

export function GearNotice() {
  return (
    <Accordion>
      <AccordionItem>
        <h2>
          <AccordionButton backgroundColor="orange" color="white">
            <Box as="span" flex="1" textAlign="left">
              장비 게시판 공통 규정
            </Box>

            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={6}>
          <AccordionPanel pb={6}>
            1. 규정은 글, 댓글, 쪽지, 프로필 사진, 자기소개, 닉네임 등 모든
            표현수단에 적용됩니다. <br /> 2. 규정 외 사안, 회원 간 일반 소통
            부문에서 최소 개입을 원칙으로 합니다. <br />
            3. 언쟁/분쟁 발생 시 회원 간 비하, 비난, 조롱, 욕설 등의 표현이
            포함되었을 경우 매니저가 개입할 수 있습니다. <br />
            4. 정치/정치인 관련 글, 친목질 요소가 심한 글 금지하며, 규정 위반 시
            제재 처리합니다.
            <br />
            5. 댓글에서 정치 논쟁, 비하, 비난 등 게시글 주제와 벗어나 과열
            양상을 보이는 경우 매니저 판단 하에 게시글은 잠금 조치될 수
            있습니다.
            <br />
            6. 사이트 이용 관련 문의는 문의하기 게시판(링크)을 이용해 주시기
            바랍니다. 쪽지로는 대응하지 않습니다.
          </AccordionPanel>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton backgroundColor="white" color="orange">
            <Box as="span" flex="1" textAlign="left">
              [하드웨어 제품비교] 안내 공지
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          컴포넌트 종류는 CPU, GPU, 마더보드, 그래픽카드, 모니터, 저장장치,
          CPU쿨러, 쿨링팬, 파워, 케이스, 키보드, 마우스, 음향기기, 노트북이
          포함된 총 14종입니다. 이 중 CPU와 GPU는 퀘이사존 공식 벤치마크를
          기준으로, 나머지 제품군은 퀘이사존 칼럼 기준 데이터를 제공합니다.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
