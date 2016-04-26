CREATE TABLE users (
    pantherId bigint NOT NULL UNIQUE,
    email varchar(20) NOT NULL,
    password varchar(256) NOT NULL,
    address varchar(100),
    phone bigint,
    PRIMARY KEY (pantherId)
);

CREATE TABLE courses (
    pantherId int NOT NULL REFERENCES users (pantherId),
    id varchar(20) NOT NULL,
    name varchar(50) NOT NULL,
    semesterMonth varchar(10) NOT NULL,
    semesterYear varchar(4) NOT NULL,
    grade varchar(5),
    units decimal(3,2) NOT NULL,
    PRIMARY KEY (pantherId, id, semesterMonth, semesterYear),
    UNIQUE (pantherId, id, semesterMonth, semesterYear)
);

CREATE TABLE permissions (
    pantherId int NOT NULL REFERENCES users (pantherId),
    permissions text NOT NULL,
    PRIMARY KEY (pantherId, permissions),
    UNIQUE (pantherId, permissions)
);