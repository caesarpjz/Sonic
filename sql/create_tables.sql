-- CREATE DATABASE Sonic;

CREATE TABLE Users (
    id integer,
    username varchar(50) NOT NULL,
    password varchar(50) NOT NULL,
    created_at timestamp NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Restaurant_Categories (
    category varchar(50),
    PRIMARY KEY (category)
);

CREATE TABLE FDS_Managers (
    mid integer,
    id integer NOT NULL,
    PRIMARY KEY (mid),
    FOREIGN KEY (id) REFERENCES Users (id)
);

CREATE TABLE Promotions (
    pid integer,
    start_datetime timestamp NOT NULL,
    end_datetime timestamp NOT NULL,
    discount_description varchar(50) NOT NULL,
    PRIMARY KEY (pid)
);

CREATE TABLE Customers (
    cid integer,
    id integer NOT NULL,
    cc_name varchar(50) NOT NULL,
    cc_expiry varchar(50) NOT NULL,
    cc_num varchar(50) NOT NULL,
    points integer NOT NULL,
    PRIMARY KEY (cid),
    FOREIGN KEY (id) REFERENCES Users (id)
);

CREATE TABLE Riders (
    rid integer,
    id integer NOT NULL,
    is_full_time boolean NOT NULL,
    PRIMARY KEY (rid),
    FOREIGN KEY (id) REFERENCES Users (id)
);

CREATE TABLE Deliveries (
    did integer,
    rid integer,
    fee float NOT NULL,
    time_order_placed timestamp,
    time_arrive_at_rest timestamp,
    time_depart_to_rest timestamp,
    time_depart_from_rest timestamp,
    time_order_delivered timestamp,
    PRIMARY KEY (did),
    FOREIGN KEY (rid) REFERENCES Riders (rid)
);

CREATE TABLE Restaurants (
    rest_id integer,
    min_spending integer default 0,
    category varchar(50),
    PRIMARY KEY (rest_id),
    FOREIGN KEY (category) REFERENCES Restaurant_Categories (category)
);

CREATE TABLE Menus (
    menu_id integer,
    rest_id integer,
    PRIMARY KEY (menu_id),
    FOREIGN KEY (rest_id) REFERENCES Restaurants (rest_id)
);

CREATE TABLE Restaurant_Staff (
    rsid integer,
    rest_id integer,
    id integer NOT NULL,
    PRIMARY KEY (rsid),
    FOREIGN KEY (rest_id) REFERENCES Restaurants (rest_id),
    FOREIGN KEY (id) REFERENCES Users (id)
);

CREATE TABLE Food_Items (
    fid integer,
    quantity integer NOT NULL,
    daily_limit integer NOT NULL,
    name varchar(50) NOT NULL,
    price float NOT NULL,
    menu_id integer NOT NULL,
    availability boolean NOT NULL,
    PRIMARY KEY (fid),
    FOREIGN KEY (menu_id) REFERENCES Menus (menu_id)
);

CREATE TABLE Reports (
    mid integer,
    report_text text,
    date date,
    FOREIGN KEY (mid) REFERENCES FDS_Managers (mid)
);

CREATE TABLE Managers_Has_Promotions (
    mid integer NOT NULL,
    pid integer NOT NULL,
    PRIMARY KEY (mid, pid),
    FOREIGN KEY (mid) REFERENCES FDS_Managers (mid),
    FOREIGN KEY (pid) REFERENCES Promotions (pid)
);

CREATE TABLE Restaurants_Has_Promotions (
    rest_id integer NOT NULL,
    pid integer NOT NULL,
    PRIMARY KEY (rest_id, pid),
    FOREIGN KEY (rest_id) REFERENCES Restaurants (rest_id),
    FOREIGN KEY (pid) REFERENCES Promotions (pid)
);

CREATE TABLE Reviews (
    cid integer,
    fid integer,
    review_desc text NOT NULL,
    PRIMARY KEY (cid, fid),
    FOREIGN KEY (cid) REFERENCES Customers (cid),
    FOREIGN KEY (fid) REFERENCES Food_Items (fid)
);

CREATE TABLE Orders (
    oid integer,
    did integer NOT NULL,
    cid integer NOT NULL,
    cost float NOT NULL,
    status varchar(50) NOT NULL,
    location varchar(100) NOT NULL,
    PRIMARY KEY (oid),
    FOREIGN KEY (cid) REFERENCES Customers (cid),
    FOREIGN KEY (did) REFERENCES Deliveries (did)
);

CREATE TABLE Order_Contains_Food (
    oid integer NOT NULL,
    fid integer NOT NULL,
    quantity integer NOT NULL,
    PRIMARY KEY (oid, fid),
    FOREIGN KEY (oid) REFERENCES Orders (oid),
    FOREIGN KEY (fid) REFERENCES Food_Items (fid)
);

CREATE TABLE Customer_Rates_Delivery (
    cid integer NOT NULL,
    did integer NOT NULL,
    rating integer NOT NULL,
    PRIMARY KEY (cid, did),
    FOREIGN KEY (cid) REFERENCES Customers (cid),
    FOREIGN KEY (did) REFERENCES Deliveries (did)
);

CREATE TABLE Shifts (
    shift_id integer,
    rid integer,
    start_time timestamp NOT NULL,
    end_time timestamp NOT NULL,
    PRIMARY KEY (shift_id),
    FOREIGN KEY (rid) REFERENCES Riders (rid)
);
