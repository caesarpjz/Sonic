-- CREATE DATABASE Sonic;

create type RIGHTS as ENUM('FDS_Manager', 'Restaurant_Staff', 'Customer', 'Rider');
create type STATUSES as ENUM('ORDERED', 'ORDER ACCEPTED', 'DELIVERED');
create type METHODS as ENUM('CASH', 'CREDIT CARD');

CREATE TABLE Users (
    id SERIAL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    access_right RIGHTS NOT NULL,
    PRIMARY KEY (id),
    unique (username)
);

CREATE TABLE Restaurant_Categories (
    category VARCHAR(50),
    PRIMARY KEY (category)
);

CREATE TABLE FDS_Managers (
    mid SERIAL,
    id SERIAL NOT NULL,
    PRIMARY KEY (mid),
    FOREIGN KEY (id) REFERENCES Users (id)
);

CREATE TABLE Promotions (
    pid SERIAL,
    start_DATETIME TIMESTAMP NOT NULL,
    end_DATETIME TIMESTAMP NOT NULL,
    discount_description VARCHAR(50) NOT NULL,
    PRIMARY KEY (pid)
);

CREATE TABLE Customers (
    cid SERIAL,
    id SERIAL NOT NULL,
    cc_name VARCHAR(50),
    cc_expiry VARCHAR(50),
    cc_num VARCHAR(50),
    points INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (cid),
    FOREIGN KEY (id) REFERENCES Users (id)
);

CREATE TABLE Riders (
    rid SERIAL,
    id SERIAL NOT NULL,
    is_full_time BOOLEAN NOT NULL,
    PRIMARY KEY (rid),
    FOREIGN KEY (id) REFERENCES Users (id)
);

CREATE TABLE Deliveries (
    did SERIAL,
    rid SERIAL,
    fee FLOAT NOT NULL,
    time_order_placed TIMESTAMP,
    time_arrive_at_rest TIMESTAMP,
    time_depart_to_rest TIMESTAMP,
    time_depart_from_rest TIMESTAMP,
    time_order_delivered TIMESTAMP,
    PRIMARY KEY (did),
    FOREIGN KEY (rid) REFERENCES Riders (rid)
);

CREATE TABLE Restaurants (
    rest_id SERIAL,
    name VARCHAR(50) NOT NULL,
    info TEXT NOT NULL,
    min_spending INTEGER default 0,
    category VARCHAR(50),
    PRIMARY KEY (rest_id),
    FOREIGN KEY (category) REFERENCES Restaurant_Categories (category)
);

CREATE TABLE Menus (
    menu_id SERIAL,
    rest_id SERIAL,
    name VARCHAR(50),
    PRIMARY KEY (menu_id),
    FOREIGN KEY (rest_id) REFERENCES Restaurants (rest_id)
);

CREATE TABLE Restaurant_Staff (
    rsid SERIAL,
    rest_id SERIAL,
    id SERIAL NOT NULL,
    PRIMARY KEY (rsid),
    FOREIGN KEY (rest_id) REFERENCES Restaurants (rest_id),
    FOREIGN KEY (id) REFERENCES Users (id)
);

CREATE TABLE Food_Items (
    fid SERIAL,
    quantity INTEGER NOT NULL,
    daily_limit INTEGER NOT NULL,
    name VARCHAR(50) NOT NULL,
    price FLOAT NOT NULL,
    menu_id SERIAL NOT NULL,
    availability BOOLEAN NOT NULL,
    PRIMARY KEY (fid),
    FOREIGN KEY (menu_id) REFERENCES Menus (menu_id)
);

CREATE TABLE Reports (
    mid SERIAL,
    report_TEXT TEXT,
    date DATE,
    FOREIGN KEY (mid) REFERENCES FDS_Managers (mid)
);

CREATE TABLE Managers_Has_Promotions (
    mid SERIAL NOT NULL,
    pid SERIAL NOT NULL,
    PRIMARY KEY (mid, pid),
    FOREIGN KEY (mid) REFERENCES FDS_Managers (mid),
    FOREIGN KEY (pid) REFERENCES Promotions (pid)
);

CREATE TABLE Restaurants_Has_Promotions (
    rest_id SERIAL NOT NULL,
    pid SERIAL NOT NULL,
    PRIMARY KEY (rest_id, pid),
    FOREIGN KEY (rest_id) REFERENCES Restaurants (rest_id),
    FOREIGN KEY (pid) REFERENCES Promotions (pid)
);

CREATE TABLE Reviews (
    cid SERIAL,
    fid SERIAL,
    review_desc TEXT NOT NULL,
    PRIMARY KEY (cid, fid),
    FOREIGN KEY (cid) REFERENCES Customers (cid),
    FOREIGN KEY (fid) REFERENCES Food_Items (fid)
);

CREATE TABLE Orders (
    oid SERIAL,
    did SERIAL NOT NULL,
    cid SERIAL NOT NULL,
    cost FLOAT NOT NULL,
    status STATUSES NOT NULL,
    payment_method METHODS NOT NULL,
    location VARCHAR(100) NOT NULL,
    PRIMARY KEY (oid),
    FOREIGN KEY (cid) REFERENCES Customers (cid),
    FOREIGN KEY (did) REFERENCES Deliveries (did)
);

CREATE TABLE Order_Contains_Food (
    oid SERIAL NOT NULL,
    fid SERIAL NOT NULL,
    quantity INTEGER NOT NULL,
    PRIMARY KEY (oid, fid),
    FOREIGN KEY (oid) REFERENCES Orders (oid),
    FOREIGN KEY (fid) REFERENCES Food_Items (fid)
);

CREATE TABLE Customer_Rates_Delivery (
    cid SERIAL NOT NULL,
    did SERIAL NOT NULL,
    rating INTEGER NOT NULL,
    PRIMARY KEY (cid, did),
    FOREIGN KEY (cid) REFERENCES Customers (cid),
    FOREIGN KEY (did) REFERENCES Deliveries (did)
);

CREATE TABLE Shifts (
    shift_id SERIAL,
    rid SERIAL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    PRIMARY KEY (shift_id),
    FOREIGN KEY (rid) REFERENCES Riders (rid)
);



-- Dummy values

INSERT INTO Restaurant_Categories values ('Western');
