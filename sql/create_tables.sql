-- CREATE DATABASE Sonic;

create type RIGHTS as ENUM('FDS_Manager', 'Restaurant_Staff', 'Customer', 'Rider');
create type ORDER_STATUSES as ENUM('ORDERED', 'ORDER ACCEPTED', 'DELIVERED');
create type METHODS as ENUM('CASH', 'CREDIT CARD');
create type RIDER_STATUSES as ENUM('AVAILABLE', 'DELIVERING', 'NOT WORKING');
create type PROMOTION_TYPES as ENUM('CUSTOMER', 'RESTAURANT');

CREATE TABLE Users (
    id SERIAL,
    username VARCHAR(50) NOT NULL, 
    password VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL, -- given name of user
    created_at TIMESTAMP NOT NULL,
    access_right RIGHTS NOT NULL, -- to keep track of each user type from Users table
    PRIMARY KEY (id, username),
    UNIQUE (id),
    UNIQUE (username)
);

CREATE TABLE Restaurant_Categories (
    category VARCHAR(50),
    PRIMARY KEY (category)
);

CREATE TABLE FDS_Managers (
    mid SERIAL,
    -- id INTEGER NOT NULL,
    username VARCHAR(50) NOT NULL,
    name VARCHAR(50),
    PRIMARY KEY (mid, id, username),
    FOREIGN KEY (id) REFERENCES Users (id),
    FOREIGN KEY (username) REFERENCES Users (username),
    UNIQUE (mid),
    UNIQUE (id),
    UNIQUE (username)
);

CREATE TABLE Promotions (
    pid SERIAL,
    start_date DATE NOT NULL, -- start of promo
    end_date DATE NOT NULL, -- end of promo
    type PROMOTION_TYPES NOT NULL, -- FDS-wide or restaurant-wide promotion
    discount_description TEXT NOT NULL, -- to show which restaurants/customers the promotion is viable for
    discount_percentage FLOAT NOT NULL, -- promotion discount
    count INTEGER NOT NULL DEFAULT 0, -- keeps track of how many times the promotion is used
    name VARCHAR(50), -- given name of promotion
    PRIMARY KEY (pid)
);

CREATE TABLE Customers (
    cid SERIAL,
    -- id INTEGER NOT NULL,
    cc_name VARCHAR(50), -- credit card name for credit card usage
    cc_expiry VARCHAR(50), -- credit card expiry for credit card usage
    points INTEGER NOT NULL DEFAULT 0, -- points for delivery fee offset
    username VARCHAR(50) NOT NULL,
    -- name VARCHAR(50),
    -- PRIMARY KEY (cid, id, username),
    PRIMARY KEY (cid, username),
    -- FOREIGN KEY (id) REFERENCES Users (id),
    FOREIGN KEY (username) REFERENCES Users (username),
    UNIQUE (cid),
    -- UNIQUE (id),
    UNIQUE (username)
);

CREATE TABLE Riders (
    rid SERIAL,
    -- id INTEGER NOT NULL,
    is_full_time BOOLEAN NOT NULL, -- whether rider is full-time or part-time
    status RIDER_STATUSES NOT NULL, -- whether rider is free to deliver or not
    username VARCHAR(50) NOT NULL,
    -- name VARCHAR(50),
    -- PRIMARY KEY (rid, id, username),
    PRIMARY KEY (rid, username),
    -- FOREIGN KEY (id) REFERENCES Users (id),
    FOREIGN KEY (username) REFERENCES Users (username),
    UNIQUE (rid),
    -- UNIQUE (id),
    UNIQUE (username)
);

CREATE TABLE Deliveries (
    did SERIAL,
    rid INTEGER, -- rider making this delivery
    fee FLOAT NOT NULL, -- delivery fee
    time_order_placed TIMESTAMP, 
    time_depart_for_rest TIMESTAMP,
    time_arrive_at_rest TIMESTAMP,
    time_depart_from_rest TIMESTAMP,
    time_order_delivered TIMESTAMP,
    PRIMARY KEY (did),
    FOREIGN KEY (rid) REFERENCES Riders (rid)
);

CREATE TABLE Restaurants (
    rest_id SERIAL,
    name VARCHAR(50) NOT NULL,
    info TEXT NOT NULL, -- description of restaurant
    min_spending INTEGER default 0, -- minimum spending of restaurant for each order
    category VARCHAR(50), -- restaurant category
    restaurant_location VARCHAR(100) NOT NULL,
    PRIMARY KEY (rest_id),
    FOREIGN KEY (category) REFERENCES Restaurant_Categories (category)
);

CREATE TABLE Menus (
    menu_id SERIAL,
    rest_id INTEGER, -- restaurant associated with this menu
    name VARCHAR(50), -- name of menu
    PRIMARY KEY (menu_id),
    FOREIGN KEY (rest_id) REFERENCES Restaurants (rest_id),
    UNIQUE (rest_id, name)
);

CREATE TABLE Restaurant_Staff (
    rsid SERIAL,
    rest_id INTEGER,
    -- id INTEGER NOT NULL,
    username VARCHAR(50) NOT NULL,
    -- name VARCHAR(50),
    -- PRIMARY KEY (rsid, id, username),
    PRIMARY KEY (rsid, username),
    FOREIGN KEY (rest_id) REFERENCES Restaurants (rest_id),
    -- FOREIGN KEY (id) REFERENCES Users (id) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES Users (username),
    UNIQUE (rsid),
    -- UNIQUE (id),
    UNIQUE (username)
);

CREATE TABLE Food_Item_Categories (
    category VARCHAR(50),
    PRIMARY KEY (category)
);

CREATE TABLE Food_Items (
    fid SERIAL,
    quantity INTEGER NOT NULL, -- total stock left in the restaurant
    daily_limit INTEGER NOT NULL, -- daily limit available
    name VARCHAR(50) NOT NULL, 
    price FLOAT NOT NULL,
    menu_id INTEGER NOT NULL, -- menu associated with food item
    category VARCHAR(50), -- category of food item
    PRIMARY KEY (fid),
    FOREIGN KEY (menu_id) REFERENCES Menus (menu_id),
    FOREIGN KEY (category) REFERENCES Food_Item_Categories (category)
);

CREATE TABLE Managers_Has_Promotions (
    mid INTEGER NOT NULL, -- manager generating the promotion
    pid INTEGER NOT NULL, -- promotion generated
    PRIMARY KEY (mid, pid),
    FOREIGN KEY (mid) REFERENCES FDS_Managers (mid),
    FOREIGN KEY (pid) REFERENCES Promotions (pid) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Restaurants_Has_Promotions (
    rest_id INTEGER NOT NULL, -- restaurant generating the promotion
    pid INTEGER NOT NULL, -- promotion generated
    PRIMARY KEY (rest_id, pid),
    FOREIGN KEY (rest_id) REFERENCES Restaurants (rest_id),
    FOREIGN KEY (pid) REFERENCES Promotions (pid) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Reviews (
    cid INTEGER, -- customer who posted the review
    fid INTEGER, -- food item in which the review is posted for
    review_desc TEXT NOT NULL, -- description of review
    PRIMARY KEY (cid, fid),
    FOREIGN KEY (cid) REFERENCES Customers (cid),
    FOREIGN KEY (fid) REFERENCES Food_Items (fid)
);

CREATE TABLE Orders (
    oid SERIAL,
    did INTEGER NOT NULL, -- delivery of order
    cid INTEGER NOT NULL, -- customer who made the order
    cost FLOAT NOT NULL, -- total cost of the order, including the food items and delivery fee
    status ORDER_STATUSES NOT NULL, -- to keep track of the order status for the customer
    payment_method METHODS NOT NULL, 
    restaurant_location VARCHAR(100) NOT NULL, 
    location VARCHAR(100) NOT NULL, -- delivery location
    pid INTEGER, -- promotion for discount if there is any 
    PRIMARY KEY (oid, did),
    FOREIGN KEY (cid) REFERENCES Customers (cid),
    FOREIGN KEY (did) REFERENCES Deliveries (did),
    FOREIGN KEY (pid) REFERENCES Promotions (pid),
    UNIQUE (oid),
    UNIQUE (did)
);

CREATE TABLE Order_Contains_Food (
    oid INTEGER NOT NULL, -- order associated
    fid INTEGER NOT NULL, -- food item associated
    quantity INTEGER NOT NULL, -- number of food item ordered
    PRIMARY KEY (oid, fid),
    FOREIGN KEY (oid) REFERENCES Orders (oid),
    FOREIGN KEY (fid) REFERENCES Food_Items (fid)
);

CREATE TABLE Customer_Rates_Delivery (
    cid INTEGER NOT NULL, -- customer doing the rating
    did INTEGER NOT NULL, -- delivery in which the rating is done for
    rating INTEGER NOT NULL, -- rating for the delivery
    PRIMARY KEY (cid, did),
    FOREIGN KEY (cid) REFERENCES Customers (cid),
    FOREIGN KEY (did) REFERENCES Deliveries (did)
);

CREATE TABLE Shifts (
    shift_id SERIAL,
    rid INTEGER, -- rider associated with the posted shift
    start_time TIMESTAMP NOT NULL, -- start time of the shift
    end_time TIMESTAMP NOT NULL, -- end time of the shift
    PRIMARY KEY (shift_id),
    FOREIGN KEY (rid) REFERENCES Riders (rid)
);
