// Подключаемся к контракту
const contractAddress = "0xf6046beAC626977C66349f3Bfc9A616B4AE8320E"; //Address of contract

// Указываем ABI (Application Binary Interface) контракта
const abi = [
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
				"internalType": "bool",
				"name": "",
				"type": "bool"
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
		"name": "Register",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
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
		"name": "UnRegister",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
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
acc[0] = "user";
const pass = [];
pass[0]= "password";
let length = 0;

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
	for (let i=0; i<=length; i++) {
		if (acc[i]==usr) return true;
	}
	return false;
}

function check_AA(usr, pswd) {
	for (let i=0; i<=length; i++) {
		if ((acc[i]==usr) && (pass[i]==pswd)) return true;
	}
	return false;
}

//Вызываем Login() в смарт-контракте и показываем результаты
async function Login() {
  	const user = document.getElementById("user").value;
  	const password = document.getElementById("password").value;
  	if (check_A(user)==true) {
  		if (check_AA(user,password)==true) {
			const getTBNB = await contract.Login(user); 
			//wait for contract execution
			//getTBNB.wait(1);
			if (getTBNB == true) {
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
  	if (check_A(user)==true) {
		document.getElementById("result").innerText = user;
		//document.getElementById("info").innerText = "This account is already existing!";
		const setTBNB = await contract.Register(user);
		if (setTBNB == true){
			document.getElementById("result").innerText = user;
			document.getElementById("info").innerText = "TBNB Account is added!";
		}
		else {
			document.getElementById("result").innerText = user;
			document.getElementById("info").innerText = "Account is not added: TBNB address is existing!";
		}
  	}
  	else{
		const setTBNB = await contract.Register(user); 
		//wait for contract execution
		//setTBNB.wait(1);
		if (setTBNB == true){
			acc[length]=user;
			pass[length]=password;
			length=length+1;
  			document.getElementById("result").innerText = user;
			document.getElementById("info").innerText = "Account is added: the total number is "+length;
		}
		else {
			document.getElementById("result").innerText = user;
			document.getElementById("info").innerText = "Account is not added: TBNB address is existing!";
		}
  	}
}


async function UnRegister() {
	const user = document.getElementById("user").value;
	//const password = document.getElementById("password").value;
	if (check_A(user)!=true) {
		document.getElementById("result").innerText = user;
		document.getElementById("info").innerText = "This account is not existing!";
	}
	else{
		const delTBNB = await contract.UnRegister(user); 
		//wait for contract execution
		//delTBNB.wait(1);
		if (delTBNB == true){
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



