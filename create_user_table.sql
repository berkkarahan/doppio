-- auto-generated definition
create table users
(
    id                int auto_increment
        primary key,
    username          varchar(20)          not null,
    email             varchar(320)         not null,
    password          varchar(128)         null,
    firstname         varchar(30)          not null,
    lastname          varchar(30)          not null,
    phone             varchar(15)          not null,
    address           varchar(100)         not null,
    gender            varchar(10)          not null,
    birthday          date                 null,
    role              varchar(10)          not null,
    register_ip       varchar(40)          null,
    last_login_ip     varchar(40)          null,
    ts_login          datetime             null,
    ts_register       datetime             null,
    is_active         tinyint(1) default 1 not null,
    is_verified       tinyint(1) default 0 not null,
    verificationtoken text                 null,
    constraint users_email_uindex
        unique (email),
    constraint users_username_uindex
        unique (username)
);