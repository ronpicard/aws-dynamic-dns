# aws-dynamic-dns

## What: 
1. Node.js Script to update my DNS IP with Route53.

## When:
1. Last Updated: 2018-07-13
2. First Started: 2018-07-13

## Why:
1. If my home IP changes, this script will update the AWS DNS and my home VPN will still be accessible by the clients.

## Who: 
1. Developed for anyone who wants to have dynamic dns solution.

## How:

1. Update 
    - a. sudo apt-get update
2. Install Node.js
    - a. sudo apt-get install -y nodejs
3. Install node package manager (npm)
    - a. sudo apt-get install -y npm
4. Create a pacakge package.json file
    - a. in git repo open terminal and type "npm init"
    - b. name: dynamicdns
    - c. version: 1.0.0
    - d. description: Nodejs Script to update my DNS IP with Route53
    - e. entry point: index.js
    - f. test command: (leave blank)
    - g. git repository: (this repo)
    - h. keywords: (leave blank)
    - i: author: (you)
    - j: license: (ISC)
    - Is this ok? Yes
5. Install aws-sdk
    - a. npm install aws-sdk
6. Install net tools for ifconfig
    - a. sudo apt install net-tools
7. Install dnsutils
    - a. sudo apt-get install dnsutils
8. Install python pip
    - a. sudo apt-get install awscli
9. Instal AWS client & add to path
    - a. cd ~/.local/bin
    - b. export PATH=~/.local/bin:$PATH
    - c. . ~/.profile
    - d. aws --version (to verify)
10. Make a user with credential access of rout53 access
11. Put aws credentials in index.js
12. Run with ZONE=foo.com. DOMAIN=foo.com node index.js


