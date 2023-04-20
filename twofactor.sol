//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract TwoFactor {
    struct Account {
        string name; // user name of account
        address addr; // user address in solidity
        uint256 length; // length of the user name
    }

    Account[] public accounts;

    constructor() {
        accounts.push(Account({name: "user", addr: msg.sender, length: 5})); //create first account
    }

    function Check_Account(string memory acc) public view returns (uint) {
        // для ссылочных перемнных memory required!
        for (uint i = 0; i < accounts.length; i++) {
            if (
                keccak256(abi.encodePacked((accounts[i].name))) ==
                keccak256(abi.encodePacked((acc)))
            ) return i;
        }
        return 99999;
    }

    function Check_Address() public view returns (bool) {
        // для ссылочных перемнных memory required!
        //if (i == 99999) return false;
        for (uint i = 0; i < accounts.length; i++) {
            if (msg.sender == accounts[i].addr) return true;
        }
        return false;
    }

    function Login(string memory acc) public view returns (bool) {
        // для ссылочных перемнных memory required!
        uint j = Check_Account(acc);
        if (j != 99999) {
            if (msg.sender == accounts[j].addr) return true;
        }
        return false;
    }

    function Register(string memory acc) public returns (bool) {
        // для ссылочных перемнных memory required!
        uint j = Check_Account(acc);
        if (j == 99999) {
            if (Check_Address() == false) {
                accounts.push(
                    Account({
                        name: acc,
                        addr: msg.sender,
                        length: bytes(acc).length
                    })
                ); // add new account
                return true;
            }
        }
        return false;
    }
}
