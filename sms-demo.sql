drop database sms_demo;
CREATE DATABASE `sms_demo` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
use sms_demo;

-- Users table (system authentication & authorization)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(36) UNIQUE,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    resetPasswordToken VARCHAR(255),
    resetPasswordExpires TIMESTAMP
);
drop table users;
select * from users;

CREATE TABLE wallets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL DEFAULT 'Sổ chi tiêu cá nhân',
    balance DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    type VARCHAR(100) NOT NULL,
    categories TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
drop table wallets;
select * from wallets;

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(12, 2) NOT NULL,
    category_id INT NOT NULL,
    budget_id INT NOT NULL,
    user_id INT NOT NULL,
    transaction_date DATE NOT NULL,
    note TEXT DEFAULT NULL,
    type VARCHAR(20) DEFAULT 'expense',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    --  Liên kết budget_id với id của bảng wallets
    CONSTRAINT fk_transaction_wallet
    FOREIGN KEY (budget_id) REFERENCES wallets(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

drop table transactions;
select * from transactions;