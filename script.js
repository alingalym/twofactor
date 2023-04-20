// Подключаемся к контракту
const contractAddress = "0xF95be8E22e10EEeB2dcA3485A3A64D2d460B5dE0"; //Замените вашим контрактом

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
			},
			{
				"internalType": "uint256",
				"name": "length",
				"type": "uint256"
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
//Вызываем setNote() в смарт-контракте
async function Login() {
  	const user = document.getElementById("user").value;
  	const password = document.getElementById("password").value;
  	if (check_A(user)==true) {
  		if (check_AA(user,password)==true) {
			const getTBNB = await contract.Login(user);
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

//Вызываем getNote() в смарт-контракте и показываем пользователю
async function Register() {
	const user = document.getElementById("user").value;
	const password = document.getElementById("password").value;
  if (check_A(user)==true) {
	document.getElementById("result").innerText = user;
	document.getElementById("info").innerText = "This account is already existing!";
  }
  else{
	const setTBNB = await contract.Register(user);
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


