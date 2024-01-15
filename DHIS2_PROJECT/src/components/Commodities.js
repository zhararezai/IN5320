import React, { useEffect } from "react";
import { useDataMutation } from "@dhis2/app-runtime";
import { quantityToOrderQuery } from "../data/Api";
import { updateData, getPeriod } from "../utils/helpFunctions";
import {
  InputFieldFF,
  ReactFinalForm,
  Button,
  SingleSelectFieldFF,
  hasValue,
  createMinNumber,
  composeValidators,
} from "@dhis2/ui";
import "./Commodities.css";
import { useSnackbarContext } from "./SnackContextProvider";
import { useDataContext } from "./DataContextProvider";
import { CommoditiesDataTable } from "./CommoditiesDataTable.js";

export function Commodities() {
  const { setData, mergedData } = useDataContext();
  const { launchSnackbar } = useSnackbarContext();

  const [mutate, { loadingUpdate, errorUpdate }] =
    useDataMutation(quantityToOrderQuery);

  function onSubmit(formInput) {
    console.log(formInput);
    const selectedDataElement = mergedData.find(
      (item) => item.commodityId === formInput.dataElement
    );

    if (selectedDataElement) {
      const quantityToOrder = parseInt(formInput.value).toString();

      const test = mutate({
        dataElement: formInput.dataElement,
        orgUnit: "r5WWF9WDzoa",
        period: getPeriod(),
        quantityToOrderId: "KPP63zJPkOu",
        quantityToOrderValue: quantityToOrder,
      })
        .then(
          launchSnackbar({
            severity: "success",
            message: `Quantity to order was successfully updated`,
          })
        )
        .then(
          setData(
            updateData(
              mergedData,
              formInput.dataElement,
              undefined,
              undefined,
              quantityToOrder
            )
          )
        );
      console.log(test);
    } else {
      console.error("Cannot find dataelement");
    }
  }

  useEffect(() => {
    if (errorUpdate !== undefined) {
      launchSnackbar({
        severity: "critical",
        message: `Update quantity to order not successful: type: ${errorUpdate.type}, code: ${errorUpdate.details.httpStatusCode}`,
      });
    }
  }, [errorUpdate, launchSnackbar]);

  return (
    <div>
      <h1>Update quantity to order</h1>
      <CommoditiesDataTable data={mergedData} setData={setData} visibleColumns={['displayName', 'consumption', 'quantityToOrder', 'endBalance']} />
    </div>
  );
}
