-- mailing list signups
create table prospect (prospect_id int(11) auto_increment primary key,
name varchar(128),
email varchar(64)
) default charset=utf8 engine=InnoDB;

-- pro: users
create table pro (pro_id int(11) auto_increment primary key,
firstname varchar(64) not null,
lastname varchar(64),
email varchar(64) not null,
mobile varchar(32) not null,
oauth_id varchar(32),
-- google_id varchar(32),
-- fb_id varchar(32),
oauth_provider varchar(32),  -- capture whether they used Google or FB, for reference
create_date datetime not null
) default charset=utf8 engine=InnoDB;

-- appt
create table appt (appt_id int(11) auto_increment primary key,
pro_id int(11) not null,
appt_date datetime not null,
amount decimal(6,3) not null,
client varchar(64),
note text
) default charset=utf8 engine=InnoDB;

-- expense
create table expense (expense_id int(11) auto_increment primary key,
pro_id int(11) not null,
expense_date datetime not null,
amount decimal(6,3) not null,
note text,
expense_type_id int(11),
img_path varchar(128)
) default charset=utf8 engine=InnoDB;

-- expense_type
create table expense_type (expense_type_id int(11) auto_increment primary key,
name varchar(32) not null unique
) default charset=utf8 engine=InnoDB;
insert into expense_type (name) values
('Communication'),
('Advertising'),
('Assets'),
('Commissions'),
('Insurance'),
('Materials & Supplies'),
('Meals & Entertainment'),
('Professional Services'),
('Other');
