import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import "./SnackbarStyles.css";
import { useDataQuery } from "@dhis2/app-runtime";
import { dataQueryCommodities, fetchDispenseTransaction, fetchRecountTransaction, fetchReplenishTransaction } from "../data/Api";
import { CircularLoader } from "@dhis2/ui";
import { mergeData } from "../utils/helpFunctions";

const DataContext = createContext(undefined);

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within DataContextProvider");
  }
  return context;
};

export const DataContextProvider = ({ children }) => {
  const { loading, error, data } = useDataQuery(dataQueryCommodities);
  const [mergedData, setMergedData] = useState(null);
  const [transactionData, setTranData] = useState(null)
  
  //function to set transaction data locally
  const setTransactionData = useCallback((newData) => {
    setTranData(newData);
  }, []);

  //function to set commodity data locally
  const setData = useCallback((newData) => {
    setMergedData(newData);
  }, []);

  //fetch transaction data
  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const [dispenseData, replenishData, recountData] = await Promise.all([
          fetchDispenseTransaction(),
          fetchReplenishTransaction(),
          fetchRecountTransaction(),
        ]);

        setTranData({
          dispenseData: dispenseData.transaction,
          replenishData: replenishData.transaction,
          recountData: recountData.transaction
        })
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      }
    };
    fetchTransactionData();
  }, []);

  //merge and set commodity data when fetched
  useEffect(() => {
    if (data) {
      setMergedData(mergeData(data));
      //console.log(data);
    }
  }, [data]);

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading || !mergedData || !transactionData) {
    return <CircularLoader large />;
  }
  if (mergedData && transactionData) {

    return (
      <DataContext.Provider value={{ setData, mergedData, setTransactionData, transactionData }}>
        {children}
      </DataContext.Provider>
    );
  }
};
