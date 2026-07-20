import {
  Bold,
  Details,
  Heading,
  List,
  ListItem,
  Paragraph,
  RichMessage,
  expectRichMessage,
} from "telegram-rich-messages/jsx";

export const proofOfConcept = expectRichMessage(
  <RichMessage skipEntityDetection>
    <Heading size={1}>Build report</Heading>
    <Paragraph>Status: <Bold>green</Bold>.</Paragraph>
    <List>
      <ListItem checkbox checked><Paragraph>Type-check</Paragraph></ListItem>
      <ListItem checkbox checked><Paragraph>Run tests</Paragraph></ListItem>
    </List>
    <Details summary={<Bold>Artifacts</Bold>}>
      <Paragraph>dist/core.js</Paragraph>
      <Paragraph>dist/jsx.js</Paragraph>
      <Paragraph>dist/builder.js</Paragraph>
    </Details>
  </RichMessage>,
);

export const botApiJson = JSON.stringify(proofOfConcept);
