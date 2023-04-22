-- Adminer 4.8.1 MySQL 8.0.32 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS `SeniorSuite`;
CREATE DATABASE `SeniorSuite` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `SeniorSuite`;

DROP TABLE IF EXISTS `Familiar`;
CREATE TABLE `Familiar` (
  `Familiar` int NOT NULL AUTO_INCREMENT,
  `Nombre_Familiar` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Parentezco` int DEFAULT NULL,
  `Telefono_Familiar` bigint NOT NULL,
  PRIMARY KEY (`Familiar`),
  KEY `Parentezco` (`Parentezco`),
  CONSTRAINT `Familiar_ibfk_1` FOREIGN KEY (`Parentezco`) REFERENCES `Parentezco` (`Parentezco`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Familiar` (`Familiar`, `Nombre_Familiar`, `Parentezco`, `Telefono_Familiar`) VALUES
(7,	'Pepe',	1,	5544778899);

DROP TABLE IF EXISTS `Notas_medicas`;
CREATE TABLE `Notas_medicas` (
  `id_nota` int NOT NULL AUTO_INCREMENT,
  `No_Expediente` int NOT NULL,
  `Nota` varchar(50) NOT NULL,
  PRIMARY KEY (`id_nota`),
  KEY `Paciente` (`No_Expediente`),
  CONSTRAINT `Notas_medicas_ibfk_1` FOREIGN KEY (`No_Expediente`) REFERENCES `Paciente` (`No_Expediente`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Notas_medicas` (`id_nota`, `No_Expediente`, `Nota`) VALUES
(20,	5557600,	'No hay notas aún');

DROP TABLE IF EXISTS `Paciente`;
CREATE TABLE `Paciente` (
  `No_Expediente` int NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `FechaNacimiento` date NOT NULL,
  `Edad` int NOT NULL,
  `Sexo` int NOT NULL,
  `Padecimiento` int NOT NULL,
  `Telefono` bigint NOT NULL,
  `Foto` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Familiar` int DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  PRIMARY KEY (`No_Expediente`),
  KEY `Padecimiento` (`Padecimiento`),
  KEY `Sexo` (`Sexo`),
  KEY `Familiar` (`Familiar`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `Paciente_ibfk_1` FOREIGN KEY (`Sexo`) REFERENCES `Sexo` (`Sexo`) ON DELETE CASCADE,
  CONSTRAINT `Paciente_ibfk_2` FOREIGN KEY (`Padecimiento`) REFERENCES `Padecimiento` (`Padecimiento`) ON DELETE CASCADE,
  CONSTRAINT `Paciente_ibfk_3` FOREIGN KEY (`Sexo`) REFERENCES `Sexo` (`Sexo`) ON DELETE CASCADE,
  CONSTRAINT `Paciente_ibfk_4` FOREIGN KEY (`Padecimiento`) REFERENCES `Padecimiento` (`Padecimiento`) ON DELETE CASCADE,
  CONSTRAINT `Paciente_ibfk_5` FOREIGN KEY (`Sexo`) REFERENCES `Sexo` (`Sexo`) ON DELETE CASCADE,
  CONSTRAINT `Paciente_ibfk_6` FOREIGN KEY (`Sexo`) REFERENCES `Sexo` (`Sexo`) ON DELETE CASCADE,
  CONSTRAINT `Paciente_ibfk_7` FOREIGN KEY (`Sexo`) REFERENCES `Sexo` (`Sexo`) ON DELETE CASCADE,
  CONSTRAINT `Paciente_ibfk_8` FOREIGN KEY (`Familiar`) REFERENCES `Familiar` (`Familiar`) ON DELETE SET NULL,
  CONSTRAINT `Paciente_ibfk_9` FOREIGN KEY (`id_usuario`) REFERENCES `Usuario` (`id_usuario`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Paciente` (`No_Expediente`, `Nombre`, `FechaNacimiento`, `Edad`, `Sexo`, `Padecimiento`, `Telefono`, `Foto`, `Familiar`, `id_usuario`) VALUES
(5557600,	'Gerardo Cristobal De La Huerta Avalos',	'2002-03-29',	21,	1,	1,	5511223366,	'/FotosPacientes/wolf.jpg',	7,	2);

DELIMITER ;;

CREATE TRIGGER `Notas_iniciales` AFTER INSERT ON `Paciente` FOR EACH ROW
begin
insert into Notas_medicas(No_Expediente, Nota) values(new.No_Expediente, "No hay notas aún");

insert into Sesiones_diarias(No_Expediente, Resumen) values(new.No_Expediente, "No hay resumen de sesion aún");

end;;

DELIMITER ;

DROP TABLE IF EXISTS `Padecimiento`;
CREATE TABLE `Padecimiento` (
  `Padecimiento` int NOT NULL AUTO_INCREMENT,
  `Valor_Padecimiento` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`Padecimiento`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Padecimiento` (`Padecimiento`, `Valor_Padecimiento`) VALUES
(1,	'Estrés'),
(2,	'Depresion'),
(3,	'Ansiedad'),
(4,	'Estrés postraumático');

DROP TABLE IF EXISTS `Parentezco`;
CREATE TABLE `Parentezco` (
  `Parentezco` int NOT NULL AUTO_INCREMENT,
  `Valor_Parentezco` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`Parentezco`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Parentezco` (`Parentezco`, `Valor_Parentezco`) VALUES
(1,	'Hijo(a)'),
(2,	'Cónyugue'),
(3,	'Tutor');

DROP TABLE IF EXISTS `Rol`;
CREATE TABLE `Rol` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `rol` varchar(10) NOT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Sesiones_diarias` (`id_sesion`, `No_Expediente`, `Resumen`) VALUES
(15,	5557600,	'No hay resumen de sesion aún');

DROP TABLE IF EXISTS `Sexo`;
CREATE TABLE `Sexo` (
  `Sexo` int NOT NULL AUTO_INCREMENT,
  `Genero` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`Sexo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Sexo` (`Sexo`, `Genero`) VALUES
(1,	'Masculino'),
(2,	'Femenino');

DROP TABLE IF EXISTS `Usuario`;
CREATE TABLE `Usuario` (
  `id_usuario` int NOT NULL,
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

-- 2023-04-22 06:06:48