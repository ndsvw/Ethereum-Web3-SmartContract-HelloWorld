const Web3 = require("web3");
const solc = require("solc");
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

let source = `pragma solidity ^0.4.20;
contract HelloWorld {
  function displayMessage() pure public returns (string) { return "Hello from a smart contract"; }
}
`

let main = async () => {
  let accounts = await web3.eth.getAccounts();
  let acc1 = accounts[0];

  // compile the solidity code
  let compiled = solc.compile(source);

  // mehr:
  // compiled.contracts[":HelloWorld"].bytecode
  // compiled.contracts[":HelloWorld"].opcodes
  // compiled.contracts[":HelloWorld"].interface

  // save public interface of contract
  let abi = JSON.parse(compiled.contracts[":HelloWorld"].interface)

  // create var with contract
  let HelloWorld = new web3.eth.Contract(abi);

  // deploy contract
  let deployContractTx = HelloWorld.deploy({
    data: compiled.contracts[':HelloWorld'].bytecode
  });

  // calculate needed gas
  let calculatedGas = await deployContractTx.estimateGas();

  // send the contract
  let contractInstance = await deployContractTx.send({
    from: acc1,
    gas: calculatedGas
  });

  // contractInstance.methods provides the contract methods
  contractInstance.methods.displayMessage().call().then((result) => console.log(result));
}

main();