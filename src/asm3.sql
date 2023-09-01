use asm3;
drop table if exists WarehouseInventory;
drop table if exists warehouse;
drop table if exists TransactionDetail;
drop table if exists Transaction;

create table warehouse(
	ID int primary key,
	Name text not null,
	Address text not null, 
	City text not null,
	Province text not null,
	Volume bigint not null,
	fillVolume bigint not null
);

create table WarehouseInventory(
	ID bigint primary key,
	warehouseID int not null,
    productID varchar(24) not null,
	quantity bigint not null,
    foreign key (warehouseID) references warehouse(ID)
);

create table Transaction(
	ID bigint primary key,
	date datetime not null,
    quantity int not null,
    price bigint not null
);

create table TransactionDetail(
	ID bigint primary key,
	transID bigint not null,
    productID varchar(24) not null,
    quantity int not null,
    price bigint not null,
    foreign key (ID) references Transaction(ID)
);


insert into WarehouseInventory values
(156, 2, 'shoes', 1500),
(965532, 1, 'key', 5600),
(1653, 3, 'lotion', 8452),
(4892, 3, 'egg', 25200),
(216854, 1, 'screen', 300),
(52319, 3, 'necklace', 560),
(423156, 2, 'teddy', 259616);

insert into Warehouse values
(1, 'Peter', '17', 'Tan Binh', 'TPHCM', 10000, 12000),
(2, 'Sans', '161', 'Thu Duc', 'TPHCM', 28200, 30000),
(3, 'Michael', '82', 'Thanh Xuan', 'Ha Noi', 15600, 25000);
