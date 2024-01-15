import React, { useState, useEffect } from 'react';
import { DataTable } from './DataTable';
import {
  Button, IconEdit16, IconCheckmark12, IconCross16, Input, hasValue,
  composeValidators,
  createMinNumber,
  integer,
  InputFieldFF,
} from '@dhis2/ui';
import "./CommoditiesDataTable.css";
import { quantityToOrderQuery } from '../data/Api';
import { getPeriod, updateData } from '../utils/helpFunctions';
import { useDataMutation } from "@dhis2/app-runtime";
import { useSnackbarContext } from "./SnackContextProvider";

export function CommoditiesDataTable({ data, setData, visibleColumns }) {

  const [inputFields, setInputFields] = useState(Array(data.length).fill(false)); //checks if IconEdit16-button is clicked
  const [inputValues, setInputValues] = useState(data.map(item => item.quantityToOrder)); //check for changes in input value and eventually update QuantityToOrder value when relevant
  const [mutateQuantityToOrder, { loading, error }] = useDataMutation(quantityToOrderQuery);
  const { launchSnackbar } = useSnackbarContext();

  const handleButtonClick = (index) => {
    const newInputFields = [...inputFields];
    newInputFields[index] = true;
    setInputFields(newInputFields);
  }

  const handleInputChange = (index, value) => {
    console.log("VALUE: ", value)
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };

  const handleSubmit = (index) => {
    const newInputValue = parseFloat(inputValues[index]);

    if (Number.isInteger(newInputValue) && newInputValue >= 0) {
      data[index].quantityToOrder = newInputValue;
      const newInputFields = [...inputFields];
      newInputFields[index] = false;
      setInputFields(newInputFields);
      const dataElement = data[index]
      mutateQuantityToOrder({
        dataElement: dataElement.commodityId,
        orgUnit: "r5WWF9WDzoa",
        period: getPeriod(),
        quantityToOrderId: "KPP63zJPkOu",
        quantityToOrderValue: newInputValue,
      }).then(() => {
        setData(

          updateData(
            data,
            dataElement.commodityId,
            undefined,
            undefined,
            newInputValue
          )
        );

        launchSnackbar({
          severity: "success",
          message: `Update successful`,
        });
      })
    } else {
      //if negative input value
      launchSnackbar({
        severity: "critical",
        message: `Update not successful: negative number not allowed`,
      });
    }
  }

  //if mutate returns error
  useEffect(() => {
    if (error !== undefined) {
      launchSnackbar({
        severity: "critical",
        message: `Update not successful: type: ${error.type}, message: ${error.message}`,
      });
    }
  }, [error, launchSnackbar]);

  const handleCancel = (index) => {
    const newInputFields = [...inputFields];
    newInputFields[index] = false;

    const newInputValues = [...inputValues];
    newInputValues[index] = data[index].quantityToOrder;    // Resetting the value back to QuantityToOrder

    setInputFields(newInputFields);
    setInputValues(newInputValues);
  }

  const dataWithButton = data.map((item, index) => ({
    ...item,
    quantityToOrder: inputFields[index] ?
      (
        <div className='div-update-quantity'>

          <Input
            name="value"
            className='input-commodity-data-table'
            type="number" 
            validate={composeValidators(createMinNumber(0), hasValue, integer)}
            onChange={(e) => handleInputChange(index, e.value)}
            component={InputFieldFF} />
            
          <Button className="vbutton" primary onClick={() => handleSubmit(index)}><IconCheckmark12 /></Button>
          <Button className="xbutton" onClick={() => handleCancel(index)}><IconCross16 /></Button>
        </div>
      ) : (
        <div>
          {item.quantityToOrder}
          <Button  className='writeButton' onClick={() => handleButtonClick(index)}><IconEdit16 /></Button>
        </div>
      ),
  }));

  const filteredColumns = [
    { key: 'displayName', label: 'Commodity' },
    { key: 'consumption', label: 'Consumption' },
    { key: 'endBalance', label: 'End / Stock Balance' },
    { key: 'quantityToOrder', label: 'Quantity to Order' },
  ].filter(column => visibleColumns.includes(column.key));

  return (
    <DataTable data={dataWithButton} columns={filteredColumns} />
  );
}
