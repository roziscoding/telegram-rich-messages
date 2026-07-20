import {
  Bold,
  Details,
  Heading,
  List,
  ListItem,
  Paragraph,
  RichMessage,
  render,
} from "telegram-rich-messages";

export const proofOfConcept = render(
  <RichMessage skipEntityDetection>
    <Heading size={1}>Build report</Heading>
    <Paragraph>Status: <Bold>green</Bold>.</Paragraph>
    <List>
      <ListItem checkbox checked><Paragraph>Type-check</Paragraph></ListItem>
      <ListItem checkbox checked><Paragraph>Run tests</Paragraph></ListItem>
    </List>
    <Details summary={<Bold>Artifacts</Bold>}>
      <Paragraph>dist/index.js</Paragraph>
      <Paragraph>dist/index.d.ts</Paragraph>
    </Details>
  </RichMessage>,
);

export const botApiJson = JSON.stringify(proofOfConcept);
