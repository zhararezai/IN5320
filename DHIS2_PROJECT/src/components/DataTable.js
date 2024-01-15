import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead,
} from "@dhis2/ui";

export function DataTable({ data, columns }) {
    return (
        <Table>
            <TableHead>
                <TableRowHead>
                    {columns.map((column) => (
                        <TableCellHead key={column.key}>{column.label}</TableCellHead>
                    ))}
                </TableRowHead>
            </TableHead>
            <TableBody>
                {data.map((row, index) => (
                    <TableRow key={index}>
                        {columns.map((column) => (
                            <TableCell key={column.key}>{row[column.key]}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
