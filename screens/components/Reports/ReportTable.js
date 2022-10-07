import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text } from "react-native";
import { DataTable, RadioButton } from "react-native-paper";

const ReportTable = () => (
  <DataTable style={styles.container}>
    <DataTable.Header style={styles.tableHeader}>
      <DataTable.Title>Report</DataTable.Title>
      <DataTable.Title>Scale</DataTable.Title>
      <DataTable.Title> Keyword</DataTable.Title>
    </DataTable.Header>

    <DataTable.Row style={styles.tableTitle}>
      <DataTable.Cell>
        UI designing
        {"\n"}is simple
      </DataTable.Cell>
      <DataTable.Cell>👍</DataTable.Cell>
      <DataTable.Cell>👎</DataTable.Cell>
    </DataTable.Row>

    <DataTable.Row>
      <DataTable.Cell>
        UI with
        {"\n"}UX designing
        {"\n"}is simple
      </DataTable.Cell>
      <DataTable.Cell>👍</DataTable.Cell>
      <DataTable.Cell>👎</DataTable.Cell>
    </DataTable.Row>
  </DataTable>
);

export default ReportTable;

const styles = StyleSheet.create({
  container: {
    flex: 2,
    height: "100%",
    padding: 10,
    marginTop: 40,
  },
  tableHeader: {
    backgroundColor: "#C7F6B6",
  },
  tableTitle: {
    // marginHorizontal: 20,
    height: "20%",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
});
