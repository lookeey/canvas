import { browser } from "$app/env";
import { ethers } from "ethers";
import { writable, type Writable } from "svelte/store";
import WalletConnectProvider from "@walletconnect/web3-provider";

enum Connectors {
  Injected,
  WalletConnect
}

type Web3Data = {
  connected: boolean;
  provider: ethers.providers.JsonRpcProvider;
  account?: string;
  signer?: ethers.Signer;
}

let {subscribe, set, update}: Writable<Web3Data> = writable({
  connected: false,
  provider: new ethers.providers.JsonRpcProvider('https://rpc.ftm.tools'),
})

let web3 = {
  subscribe,
  set,
  update,
  
  connect: (signer: ethers.Signer) => {
    update(self => {
      self.signer = signer
      return self
    })
  }
}

export default web3