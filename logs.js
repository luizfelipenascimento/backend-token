require("dotenv").config();
const { ethers } = require("ethers");

const ABI = require("./token-abi.json");
const ABIHelper = new ethers.Interface(ABI);
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contractAddress = "0x89A2E711b2246B586E51f579676BE2381441A0d0";
const contractReadMode = new ethers.Contract(contractAddress, ABI, provider);

async function getNomeToken() {
  const nome = await contractReadMode.name();
  console.log("Nome do Token é: ", nome);
}

async function getTodasTransferenciasParaUmCliente(contaCliente) {
  const from = []; // para essa operacao estamos querendo saber somente o _to por isso o from está vazio
  const filter = contractReadMode.filters.Transfer(from, contaCliente); //filtra os eventos Transfer
  const events = await contractReadMode.queryFilter(filter); // 
  console.log("Um total de ", events.length," transações foram encontradas.");
  events.forEach( (evento) => parseLogTransferencia(evento)); 
}

function parseLogTransferencia(evento) {
  const parsedLog = ABIHelper.parseLog(evento);
  console.log("Evento de Transferencia Parseado:", parsedLog);
}

async function main() {
  try {
    await getNomeToken();
    await getTodasTransferenciasParaUmCliente("0x5CAE019B0d52D119B69a594675D63517cE9D9002");
  } catch (error) {
    console.log('Erro no processamento: ', error );
  }
}

main().then( () => process.exit(0) );