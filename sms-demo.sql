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

-- ĐÃ SỬA LỖI Ở BẢNG NÀY (Thêm description, bỏ UNIQUE ở name, thêm UNIQUE ghép)
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL, 
    description TEXT DEFAULT NULL, 
    type VARCHAR(50) DEFAULT 'expense',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT unique_name_type UNIQUE (name, type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

drop table categories;
select * from categories;
INSERT INTO categories (name, type) VALUES
('Ăn uống', 'expense'),
('Di chuyển', 'expense'),
('Mua sắm', 'expense'),
('Giải trí', 'expense'),
('Y tế', 'expense'),
('Giáo dục', 'expense'),
('Hóa đơn', 'expense'),
('Khác chi tiêu', 'expense'),
('Lương', 'income'),
('Thưởng', 'income'),
('Đầu tư', 'income'),
('Freelance', 'income'),
('Quà tặng', 'income'),
('Khác thu nhập', 'income');



INSERT INTO categories (name, type, description) 
VALUES ('Khác', 'expense', 'Mô tả mới') 
ON DUPLICATE KEY UPDATE description = 'Mô tả mới';

SELECT type, COUNT(*), SUM(amount) FROM transactions GROUP BY type;
SELECT balance FROM wallets WHERE user_id = 27;
DELETE FROM transactions WHERE user_id = 27;
DELETE FROM wallets WHERE user_id = 27;
INSERT INTO wallets (user_id, name, balance, categories, type) VALUES (27, 'Ví chính', 0, '', 'cash');
DESCRIBE wallets;
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(12, 2) NOT NULL,
    category_id INT DEFAULT NULL,
    wallet_id INT NOT NULL,
    user_id INT NOT NULL,
    transaction_date DATETIME NOT NULL,
    note TEXT DEFAULT NULL,
    type VARCHAR(20) DEFAULT 'expense',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Cập nhật lại tên cột trong khóa ngoại
    CONSTRAINT fk_transaction_wallet
    FOREIGN KEY (wallet_id) REFERENCES wallets(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

drop table transactions;
select * from transactions;


CREATE TABLE goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    cycle VARCHAR(50) NOT NULL, -- Lưu chu kỳ
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

drop table goals;
select * from goals;
UPDATE users SET name = 'Nguyễn Huy' WHERE email = 'huynq2@gmail.com';