import React from "react";
import "./Form.css";
import {
  ReactFinalForm,
  InputFieldFF,
  Button,
  SingleSelectFieldFF,
  hasValue,
  composeValidators,
  string,
  createMinNumber,
  integer,
} from "@dhis2/ui";

export function Form({ onSubmit, mergedData, isDispense }) {
  return (
    <div>
      <ReactFinalForm.Form onSubmit={(values) => onSubmit(values, mergedData)}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit} autoComplete="off">
            <ReactFinalForm.Field
              name="date"
              type="date"
              label="Date"
              required
              component={InputFieldFF}
              validate={hasValue}
            />
            <ReactFinalForm.Field
              name="time"
              type="time"
              label="Time"
              required
              component={InputFieldFF}
              validate={hasValue}
            />
            <ReactFinalForm.Field
              component={SingleSelectFieldFF}
              name="dataElement"
              label="Select component"
              validate={hasValue}
              options={mergedData.map((item) => ({
                label:
                  item.displayName + " (In stock: " + item.endBalance + ")",
                value: item.commodityId, // Eller bruker du kanskje et unikt ID her?
              }))}
            />
            <ReactFinalForm.Field
              name="amount"
              type="number"
              label="Amount of commodities"
              required
              component={InputFieldFF}
              validate={composeValidators(
                createMinNumber(0),
                hasValue,
                integer
              )}
            />
            <ReactFinalForm.Field
              name="submittedBy"
              label="Submitted By (First Name and Surname)"
              required
              component={InputFieldFF}
              validate={composeValidators(hasValue, string)}
            />
            {isDispense && (
              <div>
                <ReactFinalForm.Field
                  name="dispensedTo"
                  label="Dispensed To (First Name and Surname)"
                  required
                  component={InputFieldFF}
                  validate={composeValidators(hasValue, string)}
                />
                <ReactFinalForm.Field
                  name="department"
                  label="Department of the Personnel Receiving the Commodities"
                  required
                  component={InputFieldFF}
                  validate={composeValidators(hasValue, string)}
                />
              </div>
            )}
            <div className="form-button">
              <Button type="submit" primary>
                Submit
              </Button>
            </div>
          </form>
        )}
      </ReactFinalForm.Form>
    </div>
  );
}
