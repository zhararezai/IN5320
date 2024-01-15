import React, { useEffect, useState } from "react";
import { endBalanceQuery, updateReplenishTransactions } from "../data/Api";
import { useDataMutation } from "@dhis2/app-runtime";
import { Form } from "./Form";
import { useSnackbarContext } from "./SnackContextProvider";
import { Button, IconFullscreen24 } from "@dhis2/ui";
import Popup from "./Popup";
import { useDataContext } from "./DataContextProvider";
import { updateData, getPeriod } from "../utils/helpFunctions";
import { TransactionsDataTable } from "./TransactionsDataTable";
import "../App.module.css";

export function Replenish() {
  const { launchSnackbar } = useSnackbarContext();
  const [mutate, { loading, error }] = useDataMutation(endBalanceQuery);
  const [mutateReplenish, { loadingReplenish, error: errorTransaction }] =
    useDataMutation(updateReplenishTransactions);
  const { setData, mergedData, setTransactionData, transactionData } =
    useDataContext();
  const popupHeading = "Transaction history for replenish";
  const [buttonPopup, setButtonPopup] = useState(false);

  function onSubmit(formInput) {
    const selectedDataElement = mergedData.find(
      (item) => item.commodityId === formInput.dataElement
    );

    if (selectedDataElement) {
      const endBalance = (
        parseInt(selectedDataElement.endBalance) + parseInt(formInput.amount)
      ).toString(); // new end balance: remaining stock + replenished stock

      // 1. mutate end balance
      mutate({
        dataElement: formInput.dataElement,
        orgUnit: "r5WWF9WDzoa",
        period: getPeriod(),
        endBalanceId: "rQLFnNXXIL0",
        endBalanceValue: endBalance,
      }).then(() => {
        // set data locally
        setData(
          updateData(
            mergedData,
            formInput.dataElement,
            undefined,
            endBalance,
            undefined
          )
        );

        // 2. Register new replenish transaction
        const newTransaction = {
          dateTime: formInput.date + " " + formInput.time,
          submittedBy: formInput.submittedBy,
          commodity: selectedDataElement.displayName,
          amount: formInput.amount,
        };
        const updatedTransactionArray = [
          newTransaction,
          ...transactionData.replenishData,
        ];

        mutateReplenish({
          newdata: updatedTransactionArray,
        }).then(() => {
          //transaction registered and replenish successfull 
          //if we get data from both mutate
          launchSnackbar({
            severity: "success",
            message: `Replenish successful and Transaction registered`,
          });

          // set transaction data locally
          setTransactionData({
            dispenseData: transactionData.dispenseData,
            replenishData: updatedTransactionArray,
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
        message: `Replenish not successful: type: ${error.type}, message: ${error.message}`,
      });
    }
  }, [error, launchSnackbar]);

  // if mutate transactions returns error
  useEffect(() => {
    if (errorTransaction !== undefined) {
      launchSnackbar({
        severity: "critical",
        message: `Replenish transaction not registered: type: ${errorTransaction.type}, message: ${errorTransaction.message}`,
      });
    }
  }, [errorTransaction, launchSnackbar]);

  return (
    <div>
      <h1>Replenish</h1>

      <p className="p">
        This page can be used for replenishing stock when recieving new stock
        deliveries
      </p>
      <Button onClick={() => setButtonPopup(true)} primary value="default">
        {" "}
        <IconFullscreen24 />
        &nbsp; Transaction history
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
        data={transactionData.replenishData}
        transactionType="replenish"
      />
      </Popup>
    </div>
  );
}
