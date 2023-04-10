-- Adminer 4.8.1 MySQL 8.0.32 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `Notas_medicas`;
CREATE TABLE `Notas_medicas` (
  `id_nota` int NOT NULL AUTO_INCREMENT,
  `No_Expediente` int NOT NULL,
  `Nota` varchar(50) NOT NULL,
  PRIMARY KEY (`id_nota`),
  KEY `Paciente` (`No_Expediente`),
  CONSTRAINT `Notas_medicas_ibfk_1` FOREIGN KEY (`No_Expediente`) REFERENCES `Paciente` (`No_Expediente`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Notas_medicas` (`id_nota`, `No_Expediente`, `Nota`) VALUES
(5,	55576003,	'El paciente se ha sesion pepe');

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
  PRIMARY KEY (`No_Expediente`),
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
(55576003,	'pepe',	105,	1,	2,	5566554433,	NULL,	NULL);

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

DROP TABLE IF EXISTS `Rol`;
CREATE TABLE `Rol` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `rol` varchar(10) NOT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Rol` (`id_rol`, `rol`) VALUES
(1,	'Admin'),
(2,	'Doctor');

DROP TABLE IF EXISTS `Sesiones_diarias`;
CREATE TABLE `Sesiones_diarias` (
  `id_sesion` int NOT NULL AUTO_INCREMENT,
  `No_Expediente` int NOT NULL,
  `Resumen` varchar(500) NOT NULL,
  PRIMARY KEY (`id_sesion`),
  KEY `No_Expediente` (`No_Expediente`),
  CONSTRAINT `Sesiones_diarias_ibfk_1` FOREIGN KEY (`No_Expediente`) REFERENCES `Paciente` (`No_Expediente`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Sesiones_diarias` (`id_sesion`, `No_Expediente`, `Resumen`) VALUES
(2,	55576003,	'Hola como has estado Alexa, este dia a sido interesante para mí, mi nieto vino a visitarme y me sentí muy contenta, el dia fué realmente agradable para mi., este es el resmuen de pepe');

DROP TABLE IF EXISTS `Sexo`;
CREATE TABLE `Sexo` (
  `Sexo` int NOT NULL AUTO_INCREMENT,
  `Genero` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`Sexo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Sexo` (`Sexo`, `Genero`) VALUES
(1,	'H'),
(2,	'M');

DROP TABLE IF EXISTS `Usuario`;
CREATE TABLE `Usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(20) NOT NULL,
  `contraseña` varchar(30) NOT NULL,
  `rol` int NOT NULL,
  PRIMARY KEY (`id_usuario`),
  KEY `rol` (`rol`),
  CONSTRAINT `Usuario_ibfk_1` FOREIGN KEY (`rol`) REFERENCES `Rol` (`id_rol`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Usuario` (`id_usuario`, `usuario`, `contraseña`, `rol`) VALUES
(1,	'jacob',	'jacob',	1),
(2,	'Bety',	'Bety',	2);

-- 2023-04-07 06:10:27