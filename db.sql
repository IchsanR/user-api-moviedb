CREATE DATABASE moviedb;

CREATE TABLE users(
  id_user UUID primary key,
  name text,
  email varchar(100),
  password text,
  phone varchar(50),
  profile_pic text
);
