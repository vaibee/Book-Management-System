CREATE DATABASE IF NOT EXISTS bookdb
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE bookdb;

CREATE TABLE IF NOT EXISTS book (
    id BIGINT NOT NULL AUTO_INCREMENT,
    author VARCHAR(255),
    title VARCHAR(255),
    year_published INT,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(255),
    PRIMARY KEY (id)
);
