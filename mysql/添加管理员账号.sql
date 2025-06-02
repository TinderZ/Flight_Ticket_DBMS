-- 添加管理员账号
-- 注意：密码已使用SHA256哈希处理

-- 管理员账号1：用户名 admin，密码 admin123
INSERT INTO Users (Username, PasswordHash, Role) VALUES 
('admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'admin');

-- 管理员账号2：用户名 administrator，密码 password123  
INSERT INTO Users (Username, PasswordHash, Role) VALUES 
('administrator', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'admin');

-- 管理员账号3：用户名 manager，密码 manager123
INSERT INTO Users (Username, PasswordHash, Role) VALUES 
('manager', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', 'admin');

-- 验证账号密码对照表：
-- 用户名: admin        密码: admin123
-- 用户名: administrator 密码: password123  
-- 用户名: manager      密码: manager123

-- 如果需要添加自定义管理员账号，请使用以下格式：
-- INSERT INTO Users (Username, PasswordHash, Role) VALUES 
-- ('你的用户名', SHA2('你的密码', 256), 'admin');

-- 或者可以使用MySQL的SHA2函数动态生成哈希：
-- INSERT INTO Users (Username, PasswordHash, Role) VALUES 
-- ('custom_admin', SHA2('custom_password', 256), 'admin'); 