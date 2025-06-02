CREATE TABLE Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(50) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL, -- 存储 hashed passwords
    Role VARCHAR(20) DEFAULT 'admin' NOT NULL
);