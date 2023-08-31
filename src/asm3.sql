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

