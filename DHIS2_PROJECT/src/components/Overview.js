import React, { useEffect } from "react";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  IconInfo16,
  Tooltip,
} from "@dhis2/ui";
import "./Overview.css";
import {
  updateDaysCountdown,
  getCurrentMonth,
  getPopularCommodities,
  getLowInStockCommodities,
  getSufficientStockCommodities,
} from "../utils/helpFunctions";
import { useDataContext } from "./DataContextProvider";
import { CommoditiesDataTable } from "./CommoditiesDataTable";

export function Overview() {
  const { mergedData } = useDataContext();

  useEffect(() => {
    updateDaysCountdown();
    const intervalId = setInterval(updateDaysCountdown, 24 * 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [mergedData]);

  const currentMonth = getCurrentMonth();
  // Calculate the sum of consumption for the current month
  const currentMonthData = mergedData.filter(
    (row) => row.consumption && row.consumption !== "" && row.displayName
  );
  const totalConsumption = currentMonthData.reduce((total, row) => {
    return total + parseFloat(row.consumption);
  }, 0);

  return (
    <div className="container">
      <div className="upperContainer">
        <section>
          <h1>
            {"Commodity trends for Baama CHC  "}
            <Tooltip
              content="Low in stock is when stock is lower than 15. Popular commodities are the top 5 most consumed commodities. Sufficient commodities are commodities with more than 100 in stock"
              tag="em"
            >
              <IconInfo16 />
            </Tooltip>
          </h1>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Commodities low in stock</TableCell>
                <TableCell>{getLowInStockCommodities(mergedData)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Popular commodities</TableCell>
                <TableCell>{getPopularCommodities(mergedData)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Commodities with sufficient stock</TableCell>
                <TableCell>
                  {getSufficientStockCommodities(mergedData)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>
        <div>
          <section>
            <h1>Days until next shipment</h1>
            <span id="daysCountdown">0</span>
          </section>
          <section>
            <h1>Commodities dispensed in {currentMonth}</h1>
            <text>{totalConsumption}</text>
          </section>
        </div>
      </div>
      <section>
        <h1>Stock balance sheet</h1>
        <CommoditiesDataTable data={mergedData} visibleColumns={['displayName', 'endBalance']} />
      </section>
    </div>
  );
}
