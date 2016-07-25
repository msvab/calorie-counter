CREATE TABLE users (
  login VARCHAR(100),
  password VARCHAR(128) NOT NULL,
  role VARCHAR(100) NOT NULL,
  max_daily_calories INTEGER,
  PRIMARY KEY (login)
);

CREATE TABLE meals (
  id BIGSERIAL,
  login VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  calories INTEGER NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (login) REFERENCES users(login) ON DELETE CASCADE 
);
