import React, { useEffect, useState } from "react";
import { endBalanceQuery, updateRecountTransactions } from "../data/Api";
import { useDataMutation } from "@dhis2/app-runtime";
import { updateData, getPeriod } from "../utils/helpFunctions";
import { Form } from "./Form";
import { useSnackbarContext } from "./SnackContextProvider";
import { useDataContext } from "./DataContextProvider";
import { Button, IconFullscreen24 } from "@dhis2/ui";
import Popup from "./Popup";
import { TransactionsDataTable } from "./TransactionsDataTable";
import "../App.module.css";

export function Recount() {
  const { launchSnackbar } = useSnackbarContext();
  const { setData, mergedData, setTransactionData, transactionData } =
    useDataContext();
  const [mutate, { loading, error }] = useDataMutation(endBalanceQuery);
  const [mutateRecount, { loadingRecount, error: errorTransaction }] =
    useDataMutation(updateRecountTransactions);
  const [buttonPopup, setButtonPopup] = useState(false);
  const popupHeading = "Transaction History for Recounts";

  async function onSubmit(formInput, data) {
    const selectedDataElement = data.find(
      (item) => item.commodityId === formInput.dataElement
    );

    if (selectedDataElement) {
      const endBalance = formInput.amount.toString();
      const oldStock = selectedDataElement.endBalance;
      const difference = (
        parseInt(formInput.amount) - parseInt(selectedDataElement.endBalance)
      ).toString();

      // 1. mutate end balance
      mutate({
        dataElement: formInput.dataElement,
        orgUnit: "r5WWF9WDzoa",
        period: getPeriod(),
        endBalanceId: "rQLFnNXXIL0",
        endBalanceValue: endBalance,
      }).then(() => {
        setData(
          updateData(
            data,
            formInput.dataElement,
            undefined,
            endBalance,
            undefined
          )
        );

        // 2. register new recount transaction
        const newTransaction = {
          dateTime: formInput.date + " " + formInput.time,
          submittedBy: formInput.submittedBy,
          commodity: selectedDataElement.displayName,
          oldStock: oldStock,
          newStock: endBalance,
          difference: difference,
        };
        const updatedTransactionArray = [
          newTransaction,
          ...transactionData.recountData,
        ];

        mutateRecount({
          newdata: updatedTransactionArray,
        }).then(() => {
          //transaction registered and recount successful
          //if we get data from both mutate
          launchSnackbar({
            severity: "success",
            message: `Recount successful and Transaction registered`,
          });

          // set transaction data locally
          setTransactionData({
            dispenseData: transactionData.dispenseData,
            replenishData: transactionData.replenishData,
            recountData: updatedTransactionArray,
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
        message: `Recount not successful: type: ${error.type}, message: ${error.message}`,
      });
    }
  }, [error, launchSnackbar]);

  // if mutate transactions returns error
  useEffect(() => {
    if (errorTransaction !== undefined) {
      launchSnackbar({
        severity: "critical",
        message: `Recount transaction not registered: type: ${errorTransaction.type}, message: ${errorTransaction.message}`,
      });
    }
  }, [errorTransaction, launchSnackbar]);

  return (
    <div>
      <h1>Recount</h1>
      <p className="p">
        This page can be used for recounting the actual stock at hand, to verify
        that the registered stock balance corresponds to the physical stock in
        the medical store
      </p>
      <Button onClick={() => setButtonPopup(true)} primary value="default">
        <IconFullscreen24 /> &nbsp; Transaction history
      </Button>
      <Form
        onSubmit={(values) => onSubmit(values, mergedData)}
        mergedData={mergedData}
        isDispense={false}
      />
      <Popup
        trigger={buttonPopup}
        setTrigger={setButtonPopup}
        popupHeading={popupHeading}
      >
        <TransactionsDataTable
          data={transactionData.recountData}
          transactionType="recount"
        />
      </Popup>
    </div>
  );
}
