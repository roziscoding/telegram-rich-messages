import {
    Bold,
    expectRichMessage,
    Paragraph,
    RichMessage,
    Table,
    TableCell,
    TableRow,
} from "../../src/components.ts";

// Table structure maps directly onto nested components: <Table> holds <TableRow>s,
// each holding <TableCell>s. Cell props carry header/alignment metadata.
export const withTable = expectRichMessage(
    <RichMessage>
        <Paragraph>Latest benchmark results:</Paragraph>
        <Table bordered caption={<Bold>Q3 leaderboard</Bold>}>
            <TableRow>
                <TableCell header>Model</TableCell>
                <TableCell header align="right">Score</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Aster-1</TableCell>
                <TableCell align="right">98.4</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Aster-mini</TableCell>
                <TableCell align="right">91.2</TableCell>
            </TableRow>
        </Table>
    </RichMessage>,
);

export const withTableJson = JSON.stringify(withTable);
