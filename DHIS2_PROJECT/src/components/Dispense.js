import React, { useEffect, useState } from "react";
import { dispenseQuery, updateDispenseTransactions } from "../data/Api";
import { useDataMutation } from "@dhis2/app-runtime";
import { updateData, getPeriod } from "../utils/helpFunctions";
import { useSnackbarContext } from "./SnackContextProvider";
import { Button, IconFullscreen24 } from "@dhis2/ui";
import Popup from "./Popup";
import { Form } from "./Form";
import { useDataContext } from "./DataContextProvider";
import { TransactionsDataTable } from "./TransactionsDataTable";
import "../App.module.css";

export function Dispense() {
  const { launchSnackbar } = useSnackbarContext();
  const [mutate, { loading, error }] = useDataMutation(dispenseQuery);
  const [mutateDispense, { loadingDispense, error: errorTransaction }] =
    useDataMutation(updateDispenseTransactions);
  const { setData, mergedData, setTransactionData, transactionData } =
    useDataContext();
  const popupHeading = "Transaction history for dispense";
  const [buttonPopup, setButtonPopup] = useState(false);

  function onSubmit(formInput, data) {
    const selectedDataElement = data.find(
      (item) => item.commodityId === formInput.dataElement
    );

    if (selectedDataElement) {
      const endBalance = (
        parseInt(selectedDataElement.endBalance) - parseInt(formInput.amount)
      ).toString();
      const consumption = (
        parseInt(selectedDataElement.consumption) + parseInt(formInput.amount)
      ).toString();

      // 1. Mutate end balance
      mutate({
        dataElement: formInput.dataElement,
        orgUnit: "r5WWF9WDzoa",
        period: getPeriod(),
        consumptionId: "J2Qf1jtZuj8",
        stockBalanceId: "rQLFnNXXIL0",
        consumptionValue: consumption,
        stockBalanceValue: endBalance,
      }).then(() => {
        //Set data locally
        setData(
          updateData(
            mergedData,
            formInput.dataElement,
            consumption,
            endBalance,
            undefined
          )
        );

        // 2. Register new dispense transaction
        const newTransaction = {
          dateTime: formInput.date + " " + formInput.time,
          commodity: selectedDataElement.displayName,
          amount: formInput.amount,
          submittedBy: formInput.submittedBy,
          dispensedTo: formInput.dispensedTo,
          department: formInput.department,
        };
        const updatedTransactionArray = [
          newTransaction,
          ...transactionData.dispenseData,
        ];

        mutateDispense({
          newdata: updatedTransactionArray,
        }).then(() => {
          //transaction registered and dispense successful
          //if we get data from both mutate
          launchSnackbar({
            severity: "success",
            message: `Dispense successful and Transaction registered`,
          });

          // set transaction data locally
          setTransactionData({
            dispenseData: updatedTransactionArray,
            replenishData: transactionData.replenishData,
            recountData: transactionData.recountData,
          });
        });
      });
    } else {
      console.error("Cannot find dataelement");
    }
  }

  //if mutate returns error
  useEffect(() => {
    if (error !== undefined) {
      launchSnackbar({
        severity: "critical",
        message: `Dispense not successful: type: ${error.type}, message: ${error.message}`,
      });
    }
  }, [error, launchSnackbar]);

  // if mutate transactions returns error
  useEffect(() => {
    if (errorTransaction !== undefined) {
      launchSnackbar({
        severity: "critical",
        message: `Dispense transaction not registered: type: ${errorTransaction.type}, message: ${errorTransaction.message}`,
      });
    }
  }, [errorTransaction, launchSnackbar]);

  return (
    <div>
      <h1>Dispense</h1>
      <p className="p">This page can be used for dispensing commodities</p>

      <Button onClick={() => setButtonPopup(true)} primary value="default">
        <IconFullscreen24 /> &nbsp; Transaction history
      </Button>
      <Form
        onSubmit={(values) => onSubmit(values, mergedData)}
        mergedData={mergedData}
        isDispense={true}
      />
      <Popup
        trigger={buttonPopup}
        setTrigger={setButtonPopup}
        popupHeading={popupHeading}
      >
        <TransactionsDataTable
          data={transactionData.dispenseData}
          transactionType="dispense"
        />
      </Popup>
    </div>
  );
}
