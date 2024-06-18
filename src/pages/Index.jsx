import React, { useState } from "react";
import { Container, VStack, Button, Input, Table, Thead, Tbody, Tr, Th, Td, IconButton } from "@chakra-ui/react";
import { FaPlus, FaTrash, FaDownload } from "react-icons/fa";
import Papa from "papaparse";

const Index = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setHeaders(result.meta.fields);
        setData(result.data);
      },
    });
  };

  const handleAddRow = () => {
    setData([...data, {}]);
  };

  const handleRemoveRow = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const handleCellChange = (rowIndex, columnName, value) => {
    const newData = [...data];
    newData[rowIndex][columnName] = value;
    setData(newData);
  };

  const handleDownload = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "edited_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container centerContent maxW="container.xl" py={10}>
      <VStack spacing={4} width="100%">
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
        <Button leftIcon={<FaPlus />} onClick={handleAddRow}>
          Add Row
        </Button>
        <Table variant="simple">
          <Thead>
            <Tr>
              {headers.map((header) => (
                <Th key={header}>{header}</Th>
              ))}
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {headers.map((header) => (
                  <Td key={header}>
                    <Input
                      value={row[header] || ""}
                      onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                    />
                  </Td>
                ))}
                <Td>
                  <IconButton
                    aria-label="Remove Row"
                    icon={<FaTrash />}
                    onClick={() => handleRemoveRow(rowIndex)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Button leftIcon={<FaDownload />} onClick={handleDownload}>
          Download CSV
        </Button>
      </VStack>
    </Container>
  );
};

export default Index;