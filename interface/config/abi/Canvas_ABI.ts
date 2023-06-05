const abi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "version",
        "type": "uint8"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "by",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "int256",
        "name": "x",
        "type": "int256"
      },
      {
        "indexed": true,
        "internalType": "int256",
        "name": "y",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "colorId",
        "type": "uint256"
      }
    ],
    "name": "PixelPlaced",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "int256",
        "name": "x",
        "type": "int256"
      },
      {
        "internalType": "int256",
        "name": "y",
        "type": "int256"
      }
    ],
    "name": "getPixel",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "colorId",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_ink",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "int256[]",
        "name": "x",
        "type": "int256[]"
      },
      {
        "internalType": "int256[]",
        "name": "y",
        "type": "int256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "colorId",
        "type": "uint256[]"
      }
    ],
    "name": "setMultiplePixels",
    "outputs": [
      {
        "internalType": "bool",
        "name": "success",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "int256",
        "name": "x",
        "type": "int256"
      },
      {
        "internalType": "int256",
        "name": "y",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "colorId",
        "type": "uint256"
      }
    ],
    "name": "setPixel",
    "outputs": [
      {
        "internalType": "bool",
        "name": "success",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export default abi;