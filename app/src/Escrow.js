import { ethers } from "ethers";
import { useEffect, useState } from "react";
import abi from "../src/artifacts/contracts/Escrow.sol/Escrow.json";
export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  handleApprove,
  isApproved,
  txnHash,
}) {
  return (
    <div className="">
      <ul className="fields">
        <li>
          <div> Contract Address </div>
          <p> {address} </p>
        </li>
        <li>
          <div> Arbiter </div>
          <p> {arbiter} </p>
        </li>
        <li>
          <div> Beneficiary </div>
          <p> {beneficiary} </p>
        </li>
        <li>
          <div> Value </div>
          <p> {value/(10**18)} </p>
          <div className="transaction">
            View <a href={`https://sepolia.etherscan.io/tx/${txnHash}`}>here</a>
          </div>
        </li>
        {isApproved ? (
          <div className="approved-button">Already Approved</div>
        ) : (
          <div
            className="button"
            id={address}
            onClick={(e) => {
              e.preventDefault();

              handleApprove(address);
            }}
          >
            Approve
          </div>
        )}
      </ul>
    </div>
  );
}
