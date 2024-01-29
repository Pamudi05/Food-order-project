CREATE TABLE user(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR (250),
    contactNumber VARCHAR (15),
    email VARCHAR (50),
    password VARCHAR (250),
    status VARCHAR (250),
    role VARCHAR (20),
    UNIQUE (email)
 );

INSERT INTO USER (name,contactNumber, email,password,status,role) VALUE ('admin','0742298137', 'admin@gmail.com' , '123456' , 'true', 'admin') ;

CREATE TABLE category(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE product(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    categoryId INTEGER NOT NULL,
    price INTEGER,
    status VARCHAR(29),
    PRIMARY KEY(id)
);

CREATE TABLE orders(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contactNumber VARCHAR(255)  NOT NULL,
    paymentMethod VARCHAR(255) NOT NULL,
    total INT NOT NULL,
    PRIMARY KEY(id)
);