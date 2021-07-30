
require('dotenv').config();
const { ethers } = require('ethers');


// abi
const contractAbi = require('./abi.json');


// contracts addresses
const contractAddress = '0x86935F11C86623deC8a25696E1C19a8659CbF95d';
// TODO: put your address here
const myAddress = '';


var myArgs = process.argv.slice(2);
const pk = myArgs[0];

//const pk = process.env.PK;

const iterate = async () => {

    const MATICprovider = new ethers.providers.JsonRpcProvider('https://rpc-mainnet.maticvigil.com'); //rpc can be replaced with an ETH or BSC RPC 
    const wallet = new ethers.Wallet(pk, MATICprovider);       //connect the matic provider along with using the private key as a signer
    const contract = new ethers.Contract(contractAddress, contractAbi, MATICprovider);
    let contractWithSigner = contract.connect(wallet);
    const gotchis = await contractWithSigner.tokenIdsOfOwner(myAddress);

    // foreach not needed as they all are petted at the same time
    const element = gotchis[0];
    //gotchis.forEach(async (element) => {

    const aavegotchi_details = await contractWithSigner.getAavegotchi(element);
    // console.log(aavegotchi_details);
    const twelve_hours = 12 * 60 * 60;

    const next_interact_time = parseFloat(aavegotchi_details[13]) + twelve_hours;


    const time_till = (next_interact_time - (Date.now() / 1000.0));

    console.log("how long to wait in minutes " + time_till / 60);

    // as in this version we call this every n second
    // so when time_till <= 0, this means pet is available
    // use less than 0 because last petted time may be a little different

    if (time_till <= (-0.05)) {
        // call Pet     
        // todo gasprice
        contractWithSigner.interact(gotchis);

        //console.log(Date.now().toLocaleTimeString('en-US'));
        console.log("********************* interacted ************************");

    }
    //   } );




};

process.stdout.write('\033c');
console.log('run petter');


var timerID = setInterval(function () {
    iterate();
}, 15 * 60 * 1000); 