-- Adminer 4.8.1 MySQL 8.0.32 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `Paciente`;
CREATE TABLE `Paciente` (
  `No_Expediente` int NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Edad` int NOT NULL,
  `Sexo` int NOT NULL,
  `Padecimiento` int NOT NULL,
  `Telefono` bigint NOT NULL,
  `Foto` varchar(100) DEFAULT NULL,
  `Otros Contactos` varchar(100) DEFAULT NULL,
  KEY `Padecimiento` (`Padecimiento`),
  KEY `Sexo` (`Sexo`),
  CONSTRAINT `Paciente_ibfk_1` FOREIGN KEY (`Sexo`) REFERENCES `Sexo` (`Sexo`) ON DELETE CASCADE,
  CONSTRAINT `Paciente_ibfk_2` FOREIGN KEY (`Padecimiento`) REFERENCES `Padecimiento` (`Padecimiento`) ON DELETE CASCADE,
  CONSTRAINT `Paciente_ibfk_3` FOREIGN KEY (`Sexo`) REFERENCES `Sexo` (`Sexo`) ON DELETE CASCADE,
  CONSTRAINT `Paciente_ibfk_4` FOREIGN KEY (`Padecimiento`) REFERENCES `Padecimiento` (`Padecimiento`) ON DELETE CASCADE,
  CONSTRAINT `Paciente_ibfk_5` FOREIGN KEY (`Sexo`) REFERENCES `Sexo` (`Sexo`) ON DELETE CASCADE,
  CONSTRAINT `Paciente_ibfk_6` FOREIGN KEY (`Sexo`) REFERENCES `Sexo` (`Sexo`) ON DELETE CASCADE,
  CONSTRAINT `Paciente_ibfk_7` FOREIGN KEY (`Sexo`) REFERENCES `Sexo` (`Sexo`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Paciente` (`No_Expediente`, `Nombre`, `Edad`, `Sexo`, `Padecimiento`, `Telefono`, `Foto`, `Otros Contactos`) VALUES
(5557600,	'Juan',	80,	2,	1,	555757575,	NULL,	NULL),
(55576001,	'Lalo',	95,	1,	2,	5511223344,	NULL,	NULL),
(55576002,	'Kelly',	19,	2,	3,	5533221144,	NULL,	NULL),
(55576004,	'Chabelo',	86,	1,	2,	5577889966,	NULL,	NULL),
(55576009,	'Donni',	100,	2,	3,	1122334455,	NULL,	NULL);

DROP TABLE IF EXISTS `Padecimiento`;
CREATE TABLE `Padecimiento` (
  `Padecimiento` int NOT NULL AUTO_INCREMENT,
  `Valor_Padecimiento` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`Padecimiento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Padecimiento` (`Padecimiento`, `Valor_Padecimiento`) VALUES
(1,	'Estrés'),
(2,	'Depresion'),
(3,	'Ansiedad');

DROP TABLE IF EXISTS `Sexo`;
CREATE TABLE `Sexo` (
  `Sexo` int NOT NULL AUTO_INCREMENT,
  `Genero` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`Sexo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Sexo` (`Sexo`, `Genero`) VALUES
(1,	'H'),
(2,	'M');

-- 2023-04-03 01:10:09