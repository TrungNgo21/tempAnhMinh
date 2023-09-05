drop database if exists public;
create database public;
use public;
drop table if exists WarehouseInventory;
drop table if exists warehouse;
drop table if exists TransactionDetail;
drop table if exists Transaction;

create table warehouse(
	ID int primary key AUTO_INCREMENT,
	Name text not null,
	Address text not null,
	City text not null,
	Province text not null,
	Volume bigint not null,
	fillVolume bigint not null default 0
);

create table WarehouseInventory(
	ID bigint primary key AUTO_INCREMENT,
	warehouseID int not null,
    productID varchar(24) not null,
	quantity bigint not null,
    foreign key (warehouseID) references warehouse(ID)
);

create table Transaction(
	ID bigint primary key AUTO_INCREMENT,
	date datetime not null,
    quantity int not null,
    price bigint not null
);

create table TransactionDetail(
	ID bigint primary key AUTO_INCREMENT,
	transID bigint not null,
    productID varchar(24) not null,
    quantity int not null,
    price bigint not null,
    foreign key (ID) references Transaction(ID)
);

drop table if exists product;
create table product (
    id varchar(24) primary key,
    volume bigint
);

delimiter //
drop procedure if exists common_update_volume; //
create procedure common_update_volume(in warehouse_id bigint)
begin
    update warehouse
    set fillVolume =
        (
            select
                sum(w.ivolume) as wvolume
            from (
                select
                    (p.volume*wi.quantity) as ivolume
                from warehouseinventory wi
                    join product p on wi.productID = p.id
                where warehouseID = warehouse_id
                group by wi.id, warehouseID) w
        )
        where ID = warehouse_id;
end; //

drop trigger if exists update_warehouse_volume; //
create trigger update_warehouse_volume
    after update on warehouseinventory
    for each row
    call common_update_volume(new.warehouseID); //

drop trigger if exists insert_warehouse_volume //
create trigger insert_warehouse_volume
    after insert on warehouseinventory
    for each row
    call common_update_volume(new.warehouseID); //

drop procedure  if exists product_transfer //
create procedure product_transfer (in product_id varchar(24), in from_wh bigint, in to_wh bigint, in qty bigint)
begin
    declare i bigint;
    declare c bool;
    declare _rollback bool default 0;
    declare continue handler for sqlexception set _rollback = 1;

    select count(warehouseID) into i from warehouseinventory where warehouseID = to_wh and productID = product_id;
    if i != 0 then
        start transaction;
        update warehouseinventory set quantity = quantity - qty where warehouseID = from_wh and productID = product_id;
        update warehouseinventory set quantity = quantity + qty where warehouseID = to_wh and productID = product_id;

        select (Volume > fillVolume) into c from warehouse where warehouse.ID = to_wh;

        if !c then
            rollback ;
        elseif _rollback = 1 then
            rollback;
        else
            commit;
        end if;
    else
        start transaction;
        update warehouseinventory set quantity = quantity - qty where warehouseID = from_wh and productID = product_id;
        if _rollback = 1 then
            rollback;
        else
            insert into warehouseinventory (warehouseID, productID, quantity) values (to_wh, product_id, qty);
            commit;
        end if;
    end if;
end; //

drop procedure if exists product_purchase_order //
create procedure product_purchase_order(in product_id varchar(24), in qty bigint, out err bool, out message text)
begin
    declare wid bigint;
    declare iqty bigint default 0;
    declare pvolume bigint default (select volume from product where id = product_id);
    declare _rollback bool default 0;
    declare continue handler for sqlexception set _rollback = 1;
    set @enable = true;

    start transaction;

    while _rollback = 0 and iqty < qty do
            create temporary table temp select id from warehouse where Volume > (fillVolume + pvolume) group by id;
            set @debug = (select count(id) from temp);

            if (select count(id) from temp) = 0 then
                set _rollback = 1;
            else
                set iqty = iqty + 1;
                set wid = (select warehouseID from warehouseinventory where warehouseID in (select id from temp) and productID = product_id order by quantity, warehouseID
                           limit 1);

                if wid IS NOT NULL then
                    update warehouseinventory set quantity = quantity + 1 where productID = product_id and warehouseID = wid;
                else
                    insert into warehouseinventory (warehouseID, productID, quantity) value ((select id from temp limit 1), product_id, 1);
                end if;
            end if;
        end while;
    if _rollback = 1 then
        rollback;
        set err = true;
        set message = 'inventory exceed all warehouse capacity';
    else
        commit;
        set err = false;
        set message = 'PO success';
    end if;
    drop temporary table if exists temp;
end; //
delimiter ;

insert into product values
                        ('shoes', 2),
                        ('lotion', 3),
                        ('egg', 1),
                        ('necklace', 3),
                        ('screen', 5),
                        ('teddy', 1),
                        ('key', 1),
                        ('test', 4);

insert into Warehouse values
(1, 'Peter', '17', 'Tan Binh', 'TPHCM', 10000, 0),
(2, 'Sans', '161', 'Thu Duc', 'TPHCM', 28200, 0),
(3, 'Michael', '82', 'Thanh Xuan', 'Ha Noi', 15600, 0);

insert into WarehouseInventory values
(156, 2, 'shoes', 1500),
(965532, 1, 'key', 5600),
(1653, 3, 'lotion', 2452),
(4892, 3, 'egg', 2200),
(216854, 1, 'screen', 300),
(52319, 3, 'necklace', 560),
(423156, 2, 'teddy', 15961);


