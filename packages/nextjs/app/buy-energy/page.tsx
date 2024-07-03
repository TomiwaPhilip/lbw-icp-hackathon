"use client";

import React, { useEffect } from "react";
import { formatUnits, parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const BuyEnergy = () => {
  const [energyPrice, setEnergyPrice] = React.useState(0);
  const [conversionRate, setConversionRate] = React.useState(0);
  const [newEnergyPriceRate, setNewEnergyPriceRate] = React.useState("");
  const [energyValue, setEnergyValue] = React.useState(0);
  const [token, setToken] = React.useState("");
  const { address } = useAccount();

  const { data: admin } = useScaffoldReadContract({
    contractName: "GnosisEnergy",
    functionName: "owner",
  });

  const { data: priceRate } = useScaffoldReadContract({
    contractName: "GnosisEnergy",
    functionName: "energyPrice",
  });

  const { writeContractAsync } = useScaffoldWriteContract("GnosisEnergy");
  const generateToken = () => {
    const min = 10 ** 15;
    const max = 9 * 10 ** 15;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  useEffect(() => {
    if (priceRate) {
      setConversionRate(Number(formatUnits(priceRate, 18)));
    }
  }, [priceRate]);
  return (
    <div className="flex justify-center gap-4 sm:flex-row flex-col m-auto">
      {/* User side */}
      <div className="card ">
        <h1 className="card-title">Buy Energy</h1>

        <div>
          <label className="form-control w-full max-w-xs my-2">
            <div className="label">
              <span className="label-text">Energy Value</span>
              <span className="label-text-alt">@{conversionRate} ETH per KWh</span>
            </div>

            <input
              type="number"
              placeholder="Type here"
              className="input input-bordered rounded-lg border-[#d941a9] dark:bg-neutral dark:text-black w-full max-w-xs"
              value={energyValue}
              onChange={e => {
                setEnergyValue(Number(e.target.value));
                setEnergyPrice(Number(e.target.value) * conversionRate);
              }}
            />
          </label>
        </div>
        <div>
          <label className="form-control w-full max-w-xs my-2">
            <div className="label">
              <span className="label-text">Price</span>
              <span className="label-text-alt">ETH</span>
            </div>
            <input
              type="number"
              placeholder="Type here"
              value={energyPrice}
              className="input input-bordered rounded-lg border-[#d941a9] dark:bg-neutral dark:text-black w-full max-w-xs"
              onChange={e => {
                setEnergyPrice(Number(e.target.value));
                setEnergyValue(Number(e.target.value) / conversionRate);
              }}
            />
          </label>
        </div>
        <button
          className="btn bg-[#00247b] rounded-lg text-white btn-ghost dark:bg-white dark:text-black btn-wide mt-2"
          onClick={() => {
            writeContractAsync({
              functionName: "makePayment",
              value: parseEther(energyPrice.toString()),
            });
            const val = String(generateToken());
            setToken(val);
            // @ts-ignore
            document.getElementById("my_modal_1").showModal();
          }}
        >
          {" "}
          Buy{" "}
        </button>
        <a href="/history" className="mt-3 text-xs">
          Click here to view payment history
        </a>
      </div>
      {admin === address && <div className="divider md:divider-horizontal"></div>}
      {/* Admin side */}

      {admin === address && (
        <div className="card">
          <h3 className="card-title">Admin controls</h3>
          <div>
            <div className="my-2">
              <label className="form-control w-full  max-w-xs">
                <div className="label">
                  <span className="label-text">Change Energy Rate</span>
                  <span className="label-text-alt">ETH</span>
                </div>
                <input
                  type="number"
                  placeholder="Hom many eth per kwh"
                  className="input placeholder:text-sm input-bordered rounded-lg border-[#d941a9] dark:bg-neutral dark:text-black w-full max-w-xs"
                  value={newEnergyPriceRate}
                  onChange={e => setNewEnergyPriceRate(e.target.value)}
                />
              </label>
              <button
                className="btn bg-[#00247b] rounded-lg text-white btn-ghost dark:bg-white dark:text-black btn-wide mt-2"
                onClick={async () =>
                  await writeContractAsync({
                    functionName: "updateEnergyPrice",
                    args: [parseEther(newEnergyPriceRate)],
                  })
                }
              >
                {" "}
                Update{" "}
              </button>
            </div>
            <div>
              <div className="my-2">
                <label className="form-control w-full  max-w-xs">
                  <div className="label">
                    <span className="label-text">Withdraw fund</span>
                  </div>
                </label>
                <button
                  className="btn bg-[#00247b] rounded-lg text-white btn-ghost dark:bg-white dark:text-black btn-wide mt-2"
                  onClick={async () =>
                    await writeContractAsync({
                      functionName: "withdrawFunds",
                      args: [address],
                    })
                  }
                >
                  {" "}
                  Withdraw{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Transaction successful!</h3>
          <p className="py-4">Here is your token</p>
          <p className="py-4">{token}</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn bg-[#00247b] rounded-lg text-white btn-ghost dark:bg-white dark:text-black">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default BuyEnergy;
