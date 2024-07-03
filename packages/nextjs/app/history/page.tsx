"use client";

import React, { useEffect } from "react";
import { CiFilter } from "react-icons/ci";
import { CiReceipt } from "react-icons/ci";
import { formatEther, formatUnits } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

interface IHistory {
  id: bigint;
  amount: bigint;
  value: bigint;
  timestamp: bigint;
}
const History = () => {
  const { address } = useAccount();
  const [history, setHistory] = React.useState<IHistory[]>([]);
  const { data } = useScaffoldReadContract({
    contractName: "GnosisEnergy",
    functionName: "getUserPaymentHistory",
    args: [address],
  });

  useEffect(() => {
    if (data) {
      setHistory(data as IHistory[]);
    }
  }, [data]);

  function HistoryCart({ amount, value, date }: { amount: string; value: string; date: string }) {
    return (
      <div className="p-4 border rounded-lg flex gap-4 shadow-md bg-[#2185f7] text-white mb-4 last:mb-0  justify-between ">
        <div className="flex items-center gap-2">
          <CiReceipt color="#fff" size={24} />
          <span>
            {value} of Units bought at {amount} eth.
          </span>
        </div>
        <p>
          {new Date(Number(date) * 1000).toLocaleDateString()} {new Date(Number(date) * 1000).toLocaleTimeString()}
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="lg:text-4xl lg:bold">Transaction History</h1>

      <div className="flex my-6 gap-6 items-center justify-between">
        <div className="flex items-center w-[30%] justify-between">
          {/* Search Input */}
          <label className="rounded-lg bg-white border border-[#D941A9] flex items-center gap-2 input">
            <input type="text" className="bg-transparent grow" placeholder="Search" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>

          {/* Filter */}
          <div className="dropdown dropdown-right">
            <div tabIndex={0} role="button" className="btn m-1">
              <CiFilter />
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              <li
                onClick={() => {
                  // Filter by date
                  setHistory(
                    history.sort((a, b) => Number(a.timestamp.toString() as any) - Number(b.timestamp.toString())),
                  );
                }}
              >
                <span>Time</span>
              </li>
              <li
                onClick={() =>
                  setHistory(history.sort((a, b) => Number(a.value.toString()) - Number(b.value.toString())))
                }
              >
                <span>Amount</span>
              </li>
            </ul>
          </div>
        </div>

        <div className=" bg-[#00247B] rounded-lg flex flex-col items-center p-2 shadow-lg">
          <h3 className="text-base text-white">Total Amount:</h3>
          <span className="text-base text-white">
            {history?.reduce((acc: any, item: any) => acc + Number(formatEther(item.amount.toString())), 0)} ETH
          </span>
        </div>
      </div>
      {history?.map((item: any) => (
        <HistoryCart
          key={item.id}
          amount={formatUnits(item.amount, 19)}
          value={formatUnits(item.value, 30)}
          date={item.timestamp.toString()}
        />
      ))}
    </div>
  );
};

export default History;
