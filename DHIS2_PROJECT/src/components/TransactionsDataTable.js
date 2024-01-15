import React from 'react';
import { DataTable } from './DataTable';

export function TransactionsDataTable({ data, visibleColumns = [], transactionType }) {

  let columns = [];

  switch (transactionType) {
    case 'dispense':
      columns = [
        { key: 'dateTime', label: 'Date and time' },
        { key: 'submittedBy', label: 'Submitted by' },
        { key: 'dispensedTo', label: 'Dispensed to' },
        { key: 'commodity', label: 'Commodity' },
        { key: 'amount', label: 'Amount of commodities dispensed' },
        { key: 'department', label: 'Department of the recipient' },
      ];
      break;
    case 'replenish':
      columns = [
        { key: 'dateTime', label: 'Date and time' },
        { key: 'submittedBy', label: 'Submitted by' },
        { key: 'commodity', label: 'Commodity' },
        { key: 'amount', label: 'Amount' },
      ];
      break;
    case 'recount':
      columns = [
        { key: 'dateTime', label: 'Date and time' },
        { key: 'submittedBy', label: 'Submitted by' },
        { key: 'commodity', label: 'Commodity' },
        { key: 'oldStock', label: 'Old stock' },
        { key: 'newStock', label: 'New stock' },
        { key: 'difference', label: 'Difference' },
      ];
      break;
    default:
      // Handle other transaction types
      break;
  }

  // if visibleColumns is empty, show all possible data and columns
  // if not, show only the data for the included columns (keys)
  const filteredColumns = visibleColumns.length > 0
    ? columns.filter(column => visibleColumns.includes(column.key))
    : columns;

  return (
    <DataTable data={data} columns={filteredColumns} />
  );
}
