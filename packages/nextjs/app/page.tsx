"use client";

import Link from "next/link";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex justify-around h-screen">
        <div className="w-[50%] flex flex-col gap-4 justify-center">
          <div className="px-5">
            <h1 className="text-center">
              <span className="block text-[2.5rem] font-bold text-left">Decentralized Energy Payment System</span>
            </h1>
            <p>
              This system allows energy producers, such as homeowners with solar panels, to sell excess energy directly
              to consumers. By using smart contracts, transactions are automated, transparent, and secure, ensuring that
              payments are made instantly once energy is delivered. This decentralized approach enhances efficiency,
              reduces costs, and promotes the use of renewable energy sources by providing a flexible and accessible
              marketplace for energy trading
            </p>
          </div>
          <div className="px-5 ">
            <Link href="/buy-energy" className="py-3 px-6 bg-primary rounded-[10px]">
              Get Started
            </Link>
          </div>
        </div>
        <div className="w-[30%]"></div>
      </div>
    </>
  );
};

export default Home;
