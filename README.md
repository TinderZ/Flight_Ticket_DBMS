# 民航票务管理系统 (Flight Ticket Database Management System)

一个基于 Flask + MySQL 开发的民航票务管理信息系统，支持管理员进行航班信息管理和普通用户进行航班查询。

## 📋 项目概述

本系统是一个完整的B/S架构民航票务管理系统，采用现代Web技术栈开发，满足民航票务管理的基本需求。系统遵循软件工程规范，数据库设计符合第三范式(3NF)，具有良好的用户界面和完善的功能模块。

## ✨ 功能特性

### 🔐 用户管理
- **管理员登录/注册**：安全的用户认证机制
- **权限控制**：管理员和普通用户权限分离
- **会话管理**：安全的用户会话控制

### ✈️ 航班管理（管理员功能）
- **航班信息录入**：添加新的航班信息
- **航班信息修改**：编辑现有航班数据
- **航班信息删除**：删除不需要的航班记录
- **航班信息查看**：管理员可查看所有航班信息

### 🔍 航班查询（所有用户）
- **多条件查询**：支持按起点、终点、日期查询
- **实时信息**：显示航班剩余座位等实时信息
- **无需登录**：普通用户可直接查询航班信息


## 🛠️ 技术栈

### 后端技术
- **Python 3.x**：主要编程语言
- **Flask**：轻量级Web框架
- **MySQL**：关系型数据库
- **mysql-connector-python**：数据库连接器

### 前端技术
- **HTML5**：页面结构
- **CSS3**：样式设计
- **JavaScript**：交互功能
- **Bootstrap**：响应式UI框架

### 安全特性
- **密码哈希**：SHA-256加密存储
- **会话管理**：安全的用户会话
- **SQL注入防护**：参数化查询
- **权限验证**：严格的权限控制

## 📁 项目结构

```
Flight_ticket_DBMS/
├── app.py                 # Flask应用主文件
├── README.md              # 项目说明文档
├── 指导书.txt             # 项目需求文档
├── error.txt              # 错误日志文件
├── DB_sql/                # 数据库脚本目录
│   ├── 创建DB.sql         # 数据库创建脚本
│   ├── 航空公司表.sql     # 航空公司表结构
│   ├── 航班表.sql         # 航班表结构
│   ├── 管理员用户.sql     # 用户表结构
│   ├── 航班数据插入.sql   # 示例数据插入
│   └── 添加管理员账号.sql # 管理员账号创建
├── templates/             # HTML模板目录
│   ├── base.html          # 基础模板
│   ├── login.html         # 登录页面
│   ├── register.html      # 注册页面
│   ├── home.html          # 首页
│   ├── query_flights.html # 航班查询页面
│   ├── manage_flights.html# 航班管理页面
│   ├── add_flight.html    # 添加航班页面
│   └── edit_flight.html   # 编辑航班页面
└── static/                # 静态资源目录
    ├── css/               # CSS样式文件
    └── js/                # JavaScript脚本文件
```

## 🚀 安装指南

### 环境要求
- Python 3.7+
- MySQL 5.7+ 或 8.0+
- pip 包管理器

### 1. 克隆项目
```bash
git clone <repository-url>
cd Flight_ticket_DBMS
```

### 2. 安装依赖
```bash
pip install flask mysql-connector-python
```

### 3. 数据库配置

#### 3.1 创建数据库
```sql
-- 运行 DB_sql/创建DB.sql
CREATE DATABASE civil_aviation_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE civil_aviation_db;
```

#### 3.2 创建表结构
按顺序执行以下SQL文件：
1. `DB_sql/航空公司表.sql` - 创建航空公司表
2. `DB_sql/航班表.sql` - 创建航班表
3. `DB_sql/管理员用户.sql` - 创建用户表

#### 3.3 插入示例数据
```sql
-- 可选：运行以下文件插入示例数据
-- DB_sql/航班数据插入.sql
-- DB_sql/添加管理员账号.sql
```

### 4. 修改数据库连接配置
编辑 `app.py` 文件中的数据库配置：
```python
db_config = {
    'host': 'localhost',
    'database': 'civil_aviation_db',
    'user': 'your_mysql_username',    # 修改为您的MySQL用户名
    'password': 'your_mysql_password' # 修改为您的MySQL密码
}
```

### 5. 运行应用
```bash
python app.py
```

访问 `http://localhost:5000` 即可使用系统。

## 📖 使用说明

### 管理员操作
1. **登录**：访问 `/login` 使用管理员账号登录
2. **管理航班**：登录后可进行航班的增删改查操作
3. **添加航班**：填写完整的航班信息
4. **编辑航班**：修改现有航班的信息
5. **删除航班**：删除不需要的航班记录

### 普通用户操作
1. **查询航班**：直接访问首页或 `/query_flights`
2. **条件筛选**：按起点、终点、日期筛选航班
3. **查看详情**：查看航班的详细信息和剩余座位

## 🗃️ 数据库设计

### 主要数据表

#### Airlines（航空公司表）
- `AirlineID`：航空公司ID（主键）
- `AirlineName`：航空公司名称
- `Country`：所属国家

#### Flights（航班表）
- `FlightID`：航班ID（主键）
- `FlightNumber`：航班号
- `Origin`：起点
- `Destination`：终点
- `FlightDate`：航班日期
- `DepartureTime`：起飞时间
- `ArrivalTime`：到达时间
- `Price`：票价
- `DiscountedTickets`：折扣票数
- `TotalSeats`：总座位数
- `RemainingSeats`：剩余座位数
- `AirlineID`：航空公司ID（外键）

#### Users（用户表）
- `UserID`：用户ID（主键）
- `Username`：用户名
- `PasswordHash`：密码哈希
- `Role`：用户角色（admin/user）

## 🔧 配置选项

### 环境变量
```bash
# 设置安全密钥（可选）
export SECRET_KEY="your-secret-key-here"
```

### 应用配置
在 `app.py` 中可以修改：
- 数据库连接配置
- 会话超时时间
- 安全密钥设置

## 🐛 常见问题

### 数据库连接问题
1. 确认MySQL服务已启动
2. 检查用户名和密码是否正确
3. 确认数据库名称是否存在

### 依赖安装问题
```bash
# 如果遇到安装问题，尝试更新pip
pip install --upgrade pip
pip install -r requirements.txt  # 如果有requirements.txt文件
```

### 权限问题
- 确保管理员账号已正确创建
- 检查会话是否过期，重新登录

## 📝 开发者信息

- **作者**：Zhurun Zhang
- **邮箱**：b23042510@njupt.edu.cn | 2857895300@qq.com
- **创建日期**：2025-06-02
- **版本**：1.0.0

## 📄 许可证

本项目仅用于学习和教育目的。

## 🤝 贡献指南

欢迎提交问题和功能请求！如果您想贡献代码：

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📞 支持

如果您在使用过程中遇到问题，请：
1. 查看常见问题部分
2. 检查 `error.txt` 错误日志
3. 通过邮箱联系开发者

---

*该项目是数据库管理系统课程的实践项目，旨在学习和理解B/S架构的DBS开发过程。* 