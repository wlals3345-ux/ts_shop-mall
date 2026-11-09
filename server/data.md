
### mysql - jsdb
create table product(<br>
    id int auto_increment primary key,  -- 숫자형 기본키<br>
    product_name varchar(30) not null,  -- 문자열 필수 입력<br>
    price int not null,
    created_at timestamp default current_timestamp -- 날짜와시간<br>
);