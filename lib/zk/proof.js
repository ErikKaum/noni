
import vkey from "../zk/main.vkey.json"
import builder from "../zk/witnessCalculator"
import { groth16 } from "snarkjs"

export const convertProof = ({proof, publicSignals}) => {

  const pi_a_1 = BigInt(proof.pi_a[0])
  const pi_a_2 = BigInt(proof.pi_a[1])

  const pi_b_1 = BigInt(proof.pi_b[0][1])
  const pi_b_2 = BigInt(proof.pi_b[0][0])
  const pi_b_3 = BigInt(proof.pi_b[1][1])
  const pi_b_4 = BigInt(proof.pi_b[1][0])

  const pi_c_1 = BigInt(proof.pi_c[0])
  const pi_c_2 = BigInt(proof.pi_c[1])

  const _proof = [pi_a_1, pi_a_2, pi_b_1, pi_b_2, pi_b_3, pi_b_4, pi_c_1, pi_c_2]

  let _input = []
  publicSignals.forEach(element => {
    let temp = BigInt(element)
    _input.push(temp)
  });

  return { _proof, _input }
}

export const generateAndVerifyProof = async (A, x) => {
  
  const wasm = await fetch("main.wasm")
  const wasmBuffer = await wasm.arrayBuffer();
  const zkey = await fetch("main.zkey")
  const zkeyBuffer = await zkey.arrayBuffer();

  const circuitInputs = {
    A: A,
    x:x 
  }

  const witnessCalculator = await builder(wasmBuffer)
  let wtnsBuff;
  
  try {
    wtnsBuff = await witnessCalculator.calculateWTNSBin(circuitInputs, 0)
  } catch(e) {
    console.log(e)   
  }


  const { proof, publicSignals } = await groth16.prove(
    new Uint8Array(zkeyBuffer),
    wtnsBuff,
    null
  );

  const res = await groth16.verify(vkey, publicSignals, proof);

  if (res === true) {
    return { proof, publicSignals } 
  } else {
    console.log('result not true, invalid proof')
  }
}









