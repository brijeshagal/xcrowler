import { ethers } from "ethers";
import { useEffect, useState } from "react";
import deploy from "./deploy";
import Escrow from "./Escrow";
import axios from "axios";
import abi from "./artifacts/contracts/Escrow.sol/Escrow.json";
const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(address, signer) {
  const escrowContract = new ethers.Contract(address, abi.abi, signer);
  await escrowContract.approve();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [arbiter, setArbiter] = useState("");
  const [contract, setContract] = useState("");
  const [value, setValue] = useState("");
  const [depositor, setDepositor] = useState("");
  const [beneficiary, setBeneficiary] = useState("");

  const handleApprove = async (address) => {
    await approve(address, signer);
    const res = await axios.post("http://localhost:4000/approve", {
      address: address,
    });
    console.log(res.data);
    const tmp = escrows.filter((details) => details.address !== address);
    const temp = [...tmp, ...res.data];
    console.log("temp: ", temp);
    setEscrows(temp.reverse());
  };

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  async function newContract() {
    const beneficiary = document.getElementById("beneficiary").value;
    const arbiter = document.getElementById("arbiter").value;
    const value = ethers.utils.parseEther(document.getElementById("eth").value);
    console.log(value);
    try {
      const escrowContract = await deploy(signer, arbiter, beneficiary, value);
      console.log(escrowContract);
      const depositor = await signer.getAddress();
      console.log({
        arbiter: arbiter,
        depositor: depositor,
        contract: escrowContract.address,
        value: value.toString(),
        beneficiary: beneficiary,
      });
      const res = await axios.post("http://localhost:4000/add", {
        arbiter: arbiter,
        depositor: depositor,
        address: escrowContract.address,
        value: value.toString(),
        beneficiary: beneficiary,
        txnHash: escrowContract.deployTransaction.hash,
      });
      console.log(res);
      const escrow = {
        address: escrowContract.address,
        arbiter,
        beneficiary,
        depositor: depositor,
        value: value.toString(),
        isApproved: false,
      };
      setEscrows([...escrows, escrow].reverse());
    } catch (e) {
      console.log(e);
    }
  }
  async function getContracts(e) {
    console.log("Searching..");
    e.preventDefault();
    let params = {};
    if (beneficiary) params.beneficiary = beneficiary;
    if (arbiter) params.arbiter = arbiter;
    if (depositor) params.depositor = depositor;
    if (contract) params.address = contract;
    if (value) params.value = value;

    try {
      const res = await axios.post("http://localhost:4000/search", params);
      console.log(res.data);
      
      setEscrows(res.data.reverse());
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    async function fetch() {
      const res = await axios.get("http://localhost:4000/get");
      console.log("First fetch: ", res.data);
      setEscrows(res.data.reverse());
    }
    fetch();
  }, []);
  return (
    <div className="main">
      <div className="nav">
        <h4>XCROWLER: THE ESCROW EXPLORER</h4>
        <h5>Currently using the Sepolia Testnet</h5>
      </div>
      <form className="contract">
        Create New Contract
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>
        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>
        <label>
          Deposit Amount (in Eth)
          <input type="text" id="eth" />
        </label>
        <div
          type="submit"
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </form>

      <form className="existing-contracts">
        <h1> Existing Contracts </h1>
        <div className="contract">
          <label>
            Depositor Address
            <input type="text" onChange={(e) => setDepositor(e.target.value)} />
          </label>
          <label>
            Arbiter Address
            <input type="text" onChange={(e) => setArbiter(e.target.value)} />
          </label>

          <label>
            Beneficiary Address
            <input
              type="text"
              onChange={(e) => setBeneficiary(e.target.value)}
            />
          </label>
          <label>
            Contract Address
            <input type="text" onChange={(e) => setContract(e.target.value)} />
          </label>
          <label>
            Deposit Amount (in Eth)
            <input type="text" onChange={(e) => setValue(e.target.value)} />
          </label>
          <div
            type="submit"
            className="button"
            onClick={(e) => getContracts(e)}
          >
            Search
          </div>
        </div>

        <div id="container">
          {escrows.map((escrow) => {
            return (
              <Escrow
                className="escrow"
                key={escrow.address}
                {...escrow}
                handleApprove={handleApprove}
              />
            );
          })}
        </div>
      </form>
    </div>
  );
}

export default App;
