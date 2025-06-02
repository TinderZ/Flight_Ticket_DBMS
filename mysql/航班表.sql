CREATE TABLE Flights (
    FlightID INT PRIMARY KEY AUTO_INCREMENT,           -- 航班ID，主键，自动递增
    FlightNumber VARCHAR(50) NOT NULL,                 -- 航班号（如CA123）
    Origin VARCHAR(100) NOT NULL,                      -- 出发地（机场或城市）
    Destination VARCHAR(100) NOT NULL,                 -- 目的地（机场或城市）
    FlightDate DATE NOT NULL,                          -- 航班日期
    DepartureTime TIME NOT NULL,                       -- 起飞时间
    ArrivalTime TIME NOT NULL,                         -- 到达时间
    Price DECIMAL(10, 2) NOT NULL,                     -- 价格（10位数，2位小数）
    DiscountedTickets INT DEFAULT 0,                   -- 折扣票数量（默认0）
    TotalSeats INT NOT NULL,                           -- 总座位数
    RemainingSeats INT NOT NULL,                       -- 剩余座位数
    AirlineID INT,                                     -- 关联的航空公司ID
    FOREIGN KEY (AirlineID) REFERENCES Airlines(AirlineID) 
        ON DELETE SET NULL                             -- 当航空公司被删除时设为NULL
        ON UPDATE CASCADE,                             -- 当航空公司ID更新时同步更新
    UNIQUE (FlightNumber, FlightDate)                  -- 航班号+日期组合唯一
);                                                     -- （同一天同一航班号只能有一条记录）

