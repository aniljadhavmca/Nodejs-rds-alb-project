# Node.js CRUD Application with AWS RDS, ALB & Route 53

This project demonstrates a complete end-to-end AWS deployment of a Node.js CRUD application connected to AWS RDS (MySQL), deployed on EC2, exposed using an Application Load Balancer, and mapped to a custom domain via Route 53.

The application supports:
- Create user
- View users
- Edit user
- Delete user

(Full CRUD functionality)

---

## What We Built

- Frontend UI using HTML and CSS
- Backend using Node.js and Express
- Database using AWS RDS (MySQL)
- Compute using EC2 (private subnet)
- Load balancing using Application Load Balancer
- DNS using Route 53
- Version control using Git and GitHub

---

## Architecture Overview

User (Browser)  
→ Route 53 (Domain)  
→ Application Load Balancer (Public Subnet)  
→ Target Group  
→ EC2 (Node.js App – Private Subnet)  
→ AWS RDS MySQL (Private Subnet)

---

## Technology Stack

- Node.js
- Express.js
- MySQL
- AWS EC2
- AWS RDS
- AWS Application Load Balancer
- AWS Route 53
- Git and GitHub
- HTML and CSS

---

## Project Structure

nodejs-rds-alb-project  
├── app.js  
├── package.json  
├── README.md  
└── public  
    └── index.html  

---

## AWS Setup Steps

### 1. Create VPC
- CIDR: 10.0.0.0/16
- Enable DNS hostnames

### 2. Create Subnets
- Public Subnet for ALB
- Private Subnet for EC2 and RDS

### 3. Create Internet Gateway
- Attach to VPC
- Used by public subnet

### 4. Route Tables
- Public route table → 0.0.0.0/0 → IGW
- Private route table → No internet access

---

## EC2 Setup (Node.js App Server)

### Launch EC2
- Amazon Linux 2023
- Private subnet
- No public IP

### Install Node.js
bash
sudo yum update -y
sudo yum install nodejs -y
node -v
npm -v

### How Express.js Was Installed
After initializing the Node.js project, Express was installed using npm:

bash
npm init -y
npm install express mysql2 body-parser

### Why Express.js is Used

- Simplifies server creation compared to core Node.js HTTP module
- Clean and readable routing (`app.get`, `app.post`)
- Middleware support (body parsing, static files)
- Widely used in production and industry-standard

## Run
sudo node app.js

## Steps to Create RDS MySQL Instance
AWS Console → RDS → Create database
Engine: MySQL
Template: Free Tier / Dev
DB Identifier: devdb
Username: admin
Connectivity:
VPC: Project VPC
Public access: ❌ No
Subnet group: Private subnets
Security Group:
Allow MySQL (3306) from EC2 SG
Create database
After creation:
Go to RDS → Databases
Copy the Endpoint

### Connecting to RDS from EC2
Install MySQL client if not present:

sudo yum install mysql -y
mysql -h <RDS-ENDPOINT> -u admin -p

CREATE DATABASE testdb;
USE testdb;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);

