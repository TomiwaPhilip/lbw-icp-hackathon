"use client";

import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex flex-col lg:flex-row justify-center items-center h-screen gap-10 p-5 lg:p-0">
        <div className="w-full lg:w-1/2 flex flex-col gap-4 justify-center">
          <div className="px-5">
            <h1 className="text-center lg:text-left">
              <span className="block text-[2rem] lg:text-[2.5rem] font-bold">Decentralized Energy Payment System</span>
            </h1>
            <p>
              This system allows energy producers, such as homeowners with solar panels, to sell excess energy directly
              to consumers. By using smart contracts, transactions are automated, transparent, and secure, ensuring that
              payments are made instantly once energy is delivered. This decentralized approach enhances efficiency,
              reduces costs, and promotes the use of renewable energy sources by providing a flexible and accessible
              marketplace for energy trading.
            </p>
          </div>
          <div className="px-5">
            <Link
              href="/buy-energy"
              className="py-3 px-6 block text-center bg-[#00247b] rounded-lg text-white btn-ghost dark:bg-white dark:text-black"
            >
              Get Started
            </Link>
          </div>
        </div>
        <div className="w-full lg:w-1/3 mt-10 lg:mt-0 flex justify-center lg:justify-start">
          <Image src="/meter.png" alt="meter" width={400} height={400} />
        </div>
      </div>
    </>
  );
};

export default Home;
