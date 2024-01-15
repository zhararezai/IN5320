import { getPeriod } from "../utils/helpFunctions";

export const dataQueryCommodities = {
  dataValueSets: {
    resource: "/dataValueSets",
    params: {
      orgUnit: "r5WWF9WDzoa",
      period: getPeriod(),
      dataSet: "ULowA8V3ucd",
    },
  },
  dataSets: {
    resource: "dataSets/ULowA8V3ucd",
    params: {
      fields: [
        "dataSetElements[dataElement[name,id,categoryCombo[categoryOptionCombos[name,id]],dataElementGroups[name, id]]",
      ],
    },
  },
};

export const dispenseQuery = {
  resource: "dataValueSets",
  type: "create",
  dataSet: "ULowA8V3ucd",
  data: ({
    dataElement,
    period,
    orgUnit,
    consumptionId,
    consumptionValue,
    stockBalanceId,
    stockBalanceValue,
  }) => ({
    dataValues: [
      {
        dataElement,
        orgUnit,
        period,
        categoryOptionCombo: consumptionId,
        value: consumptionValue,
      },
      {
        dataElement,
        orgUnit,
        period,
        categoryOptionCombo: stockBalanceId,
        value: stockBalanceValue,
      },
    ],
  }),
};

export const endBalanceQuery = {
  resource: "dataValueSets",
  type: "create",
  dataSet: "ULowA8V3ucd",
  data: ({
    dataElement,
    period,
    orgUnit,
    endBalanceId,
    endBalanceValue,
  }) => ({
    dataValues: [
      {
        dataElement,
        orgUnit,
        period,
        categoryOptionCombo: endBalanceId,
        value: endBalanceValue,
      }
    ],
  }),
};

export const quantityToOrderQuery = {
  resource: "dataValueSets",
  type: "create",
  dataSet: "ULowA8V3ucd",
  data: ({
    dataElement,
    period,
    orgUnit,
    quantityToOrderId,
    quantityToOrderValue,
  }) => ({
    dataValues: [
      {
        dataElement,
        orgUnit,
        period,
        categoryOptionCombo: quantityToOrderId,
        value: quantityToOrderValue,
      }
    ],
  }),
};

// calls for recountTransactions in datastore
export const updateRecountTransactions = {
  resource: "/dataStore/IN5320-5/recountTransactions",
  type: "update",
  data: ({ newdata }) => ({
    transaction: newdata,
  }),
};

export async function fetchRecountTransaction() {
  const response = await fetch(
    "http://localhost:9999/api/dataStore/IN5320-5/recountTransactions"
  );
  const data = await response.json();
  return data;
}

export const getRecountTransactions = {
  request0: {
    resource: "/dataStore/IN5320-5/recountTransactions"
  }
}

// calls for dispenseTransactions in datastore
export const updateDispenseTransactions = {
  resource: "/dataStore/IN5320-5/dispenseTransactions",
  type: "update",
  data: ({ newdata }) => ({
    transaction: newdata,
  }),
};

export async function fetchDispenseTransaction() {
  const response = await fetch(
    "http://localhost:9999/api/dataStore/IN5320-5/dispenseTransactions"
  );
  const data = await response.json();
  return data;
}

export const getDispenseTransactions = {
  request0: {
    resource: "/dataStore/IN5320-5/dispenseTransactions"
  }
}

// calls for replenishTransactions in datastore

export const updateReplenishTransactions = {
  resource: "/dataStore/IN5320-5/replenishTransactions",
  type: "update",
  data: ({ newdata }) => ({
    transaction: newdata,
  }),
};

export async function fetchReplenishTransaction() {
  const response = await fetch(
    "http://localhost:9999/api/dataStore/IN5320-5/replenishTransactions"
  );
  const data = await response.json();
  return data;
}

export const getReplenishTransactions = {
  request0: {
    resource: "/dataStore/IN5320-5/replenishTransactions"
  }
}