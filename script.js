// Подключаемся к контракту
const contractAddress = "0x9936a7635af7d00c4Cf955Caa725eA155fA82b19"; //Address of contract

// Указываем ABI (Application Binary Interface) контракта
const abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "acc",
				"type": "string"
			}
		],
		"name": "Register",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "acc",
				"type": "string"
			}
		],
		"name": "UnRegister",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "accounts",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "addr",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "acc",
				"type": "string"
			}
		],
		"name": "Check_Account",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "Check_Address",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "Length",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "acc",
				"type": "string"
			}
		],
		"name": "Login",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// Подключаемся к web3 провайдеру (метамаск)
const provider = new ethers.providers.Web3Provider(window.ethereum, 97);

let signer;
let contract;
const acc = [];
acc.push("user");
const pass = [];
pass.push("password");
let length = 1;

//Запрашиваем аккаунты пользователя и подключаемся к первому аккаунту
provider.send("eth_requestAccounts", []).then(() => {
  provider.listAccounts().then((accounts) => {
    signer = provider.getSigner(accounts[0]);
    //Создаем объект контракта
    contract = new ethers.Contract(contractAddress, abi, signer);
    console.log(contract);
  });
});

function check_A(usr) {
	for (let i=0; i<length; i++) {
		if (acc[i]==usr) return i;
	}
	return 99999;
}

function check_AA(usr, pswd) {
	for (let i=0; i<length; i++) {
		if ((acc[i]==usr) && (pass[i]==pswd)) return i;
	}
	return 99999;
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

//Вызываем Login() в смарт-контракте и показываем результаты
async function Login() {
  	const user = document.getElementById("user").value;
  	const password = document.getElementById("password").value;
  	if (check_A(user)!=99999) {
  		if (check_AA(user,password)!=99999) {
			let getTBNB = await contract.Login(user); 
			//wait for contract execution
			//getTBNB.wait(); Do we need to create an event inside of contract?
			if (getTBNB == 1) {
				document.getElementById("result").innerText = user;
				document.getElementById("info").innerText = "Login is succesful!";
			}
			else {
				document.getElementById("result").innerText = user;
				document.getElementById("info").innerText = "Login is not succesful due to the lack of BNB account!";
			}
  		}
  		else{
  			document.getElementById("result").innerText = user;
			document.getElementById("info").innerText = "Account is found but the password is not correct!";
		}
	}
	else {
		document.getElementById("result").innerText = user;
		document.getElementById("info").innerText = "Account is not found: you have to register!";
	}
}

//Вызываем Register() в смарт-контракте и показываем результаты
async function Register() {
	const user = document.getElementById("user").value;
	const password = document.getElementById("password").value;
	//let setTBNB = 0;
  	if (check_A(user)!=99999) {
		document.getElementById("result").innerText = user;
		//document.getElementById("info").innerText = "This account is already existing!";
		//sleep(6000);
		const setTBNB = await contract.Register(user);
		
		//if (setTBNB != 99999){
			document.getElementById("result").innerText = user;
			document.getElementById("info").innerText = "TBNB Account is added, please try to logon upon Metamask confirmation.";
		/*}
		else {
			document.getElementById("result").innerText = user;
			document.getElementById("info").innerText = "Account is not added:: TBNB address is existing!";
		}*/
  	}
  	else{
		const setTBNB = await contract.Register(user); 
		//wait for contract execution
		//sleep(6000);
		//if (getTBNB != 99999){
			acc.push(user);
			pass.push(password);
			length=length+1;
  			document.getElementById("result").innerText = user;
			document.getElementById("info").innerText = "Account is added: the total number is "+length+" Please try to logon upon Metamask completion.";
		/*}
		else {
			document.getElementById("result").innerText = user;
			document.getElementById("info").innerText = "Account is not added: TBNB address is existing!";
		}*/
  	}
}

async function UnRegister() {
	const user = document.getElementById("user").value;
	let i = check_A(user);
	let k = length-1;
	//const password = document.getElementById("password").value;
	if (i==99999) {
		document.getElementById("result").innerText = user;
		document.getElementById("info").innerText = "This account is not existing!";
	}
	else{
		await contract.UnRegister(user); 
		//wait for contract execution
		//delTBNB.wait(1);
		let getTBNB = await contract.Login(user);
		if (getTBNB == 1){
			if (i != k) { //swap i and last record
				let acc_temp = acc[i];
				let pass_temp = pass[i];
				acc[i] = acc[k];
				pass[i] = pass[k];
				acc[k] = acc_temp;
				pass[k] = pass_temp;
			}
			acc.pop();
			pass.pop();
			length=length-1;
			document.getElementById("result").innerText = user;
			document.getElementById("info").innerText = "Account was removed: the total number is "+length;
		}
		else {
			document.getElementById("result").innerText = user;
			document.getElementById("info").innerText = "Account was not removed: You need to be an owner!";
		}
	}
}



