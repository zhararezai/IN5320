const consumptionId = "J2Qf1jtZuj8";
const endBalanceId = "rQLFnNXXIL0";
const quantityToOrderId = "KPP63zJPkOu";

export function mergeData(data) {
  const mergedData = {};

  data.dataValueSets.dataValues.forEach((dv) => {
    let matchedValue = data.dataSets.dataSetElements.find(
      (dataSetE) => dv.dataElement === dataSetE.dataElement.id
    );

    if (matchedValue) {
      const displayName = matchedValue.dataElement.name;
      if (!mergedData[displayName]) {
        mergedData[displayName] = {
          displayName: displayName.replace("Commodities - ", ""),
          endBalance: "",
          consumption: "",
          quantityToOrder: "",
          commodityId: dv.dataElement,
        };
      }

      if (dv.categoryOptionCombo === endBalanceId) {
        mergedData[displayName].endBalance = dv.value;
      } else if (dv.categoryOptionCombo === consumptionId) {
        mergedData[displayName].consumption = dv.value;
      } else if (dv.categoryOptionCombo === quantityToOrderId) {
        mergedData[displayName].quantityToOrder = dv.value;
      }
    }
  });

  return Object.values(mergedData)
    .slice()
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
}

// Function to update the countdown
export function getNextMonthDay(day) {
  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  while (nextMonth.getDate() !== day) {
    nextMonth.setDate(nextMonth.getDate() - 1);
  }

  const timeDifference = nextMonth - today;
  const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  return daysRemaining;
}

export function updateDaysCountdown() {
  const daysRemaining = getNextMonthDay(14);

  const countdownElement = document.getElementById("daysCountdown");
  if (countdownElement) {
    countdownElement.textContent = daysRemaining.toString();
  }
}

export function getCurrentMonth() {
  const currentDate = new Date();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[currentDate.getMonth()];
}

export function getPopularCommodities(mergedData) {
  const data = [...mergedData];
  data.sort((a, b) => parseFloat(b.consumption) - parseFloat(a.consumption));
  const top5PopularCommodities = data.slice(0, 5).map((row) => row.displayName);
  return top5PopularCommodities.join(", ");
}

// find commodities with low stock, used in overview
export function getLowInStockCommodities(mergedData) {
  const lowInStockCommodities = mergedData
    .filter((row) => parseFloat(row.endBalance) < 15 || row.endBalance == "")
    .map((row) => row.displayName);
  return lowInStockCommodities.join(", ");
}

// find commodities with sufficient stock, used in overview
export function getSufficientStockCommodities(mergedData) {
  const sufficientStockCommodities = mergedData
    .filter((row) => parseFloat(row.endBalance) > 100)
    .map((row) => row.displayName);
  return sufficientStockCommodities.join(", ");
}

export function updateData(
  data,
  element,
  newConsumption,
  newEndBalance,
  newOrderQuantity
) {
  var newData = data.map((item) => {
    if (item.commodityId === element) {
      let newItem = { ...item };
      if (newConsumption !== undefined) {
        newItem.consumption = newConsumption;
      }
      if (newEndBalance !== undefined) {
        newItem.endBalance = newEndBalance;
      }
      if (newOrderQuantity !== undefined) {
        newItem.quantityToOrder = newOrderQuantity;
      }
      return newItem;
    } else {
      return item;
    }
  });
  console.log("her:", newData);
  return newData;
}

export function getPeriod() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;

  if (month < 10) {
    month = "0" + month;
  }

  return year.toString() + month.toString();
}
