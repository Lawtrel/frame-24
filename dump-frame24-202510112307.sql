/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-12.0.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: frame24
-- ------------------------------------------------------
-- Server version	12.0.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `access_levels`
--

DROP TABLE IF EXISTS `access_levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `access_levels` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access_levels`
--

LOCK TABLES `access_levels` WRITE;
/*!40000 ALTER TABLE `access_levels` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `access_levels` VALUES
(1,'Operacional','Nível operacional básico',1,'2025-10-11 21:05:23'),
(2,'Supervisão','Nível de supervisão',2,'2025-10-11 21:05:23'),
(3,'Gerencial','Nível gerencial',3,'2025-10-11 21:05:23'),
(4,'Diretoria','Nível de diretoria',4,'2025-10-11 21:05:23');
/*!40000 ALTER TABLE `access_levels` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `access_profiles`
--

DROP TABLE IF EXISTS `access_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `access_profiles` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `hierarchy_level` int(11) DEFAULT 0 COMMENT 'Para herança de permissões',
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Perfis/grupos de permissões';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access_profiles`
--

LOCK TABLES `access_profiles` WRITE;
/*!40000 ALTER TABLE `access_profiles` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `access_profiles` VALUES
(1,'ADMIN','Administrador','Acesso total ao sistema',100,1,'2025-10-11 21:28:54','2025-10-11 21:28:54'),
(2,'GERENTE','Gerente','Gerenciamento operacional completo',80,1,'2025-10-11 21:28:54','2025-10-11 21:28:54'),
(3,'SUPERVISOR','Supervisor','Supervisão de operações',60,1,'2025-10-11 21:28:54','2025-10-11 21:28:54'),
(4,'CAIXA','Operador de Caixa','Operação de PDV e vendas',40,1,'2025-10-11 21:28:54','2025-10-11 21:28:54'),
(5,'ESTOQUISTA','Estoquista','Controle de estoque',30,1,'2025-10-11 21:28:54','2025-10-11 21:28:54'),
(6,'BILHETEIRO','Bilheteiro','Venda de ingressos',20,1,'2025-10-11 21:28:54','2025-10-11 21:28:54'),
(7,'CONSULTA','Consulta','Apenas visualização',10,1,'2025-10-11 21:28:54','2025-10-11 21:28:54');
/*!40000 ALTER TABLE `access_profiles` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `account_natures`
--

DROP TABLE IF EXISTS `account_natures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_natures` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_natures`
--

LOCK TABLES `account_natures` WRITE;
/*!40000 ALTER TABLE `account_natures` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `account_natures` VALUES
(1,'Devedora','Natureza devedora',1,'2025-10-11 20:42:10'),
(2,'Credora','Natureza credora',2,'2025-10-11 20:42:10');
/*!40000 ALTER TABLE `account_natures` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `account_types`
--

DROP TABLE IF EXISTS `account_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_types`
--

LOCK TABLES `account_types` WRITE;
/*!40000 ALTER TABLE `account_types` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `account_types` VALUES
(1,'Ativo','Contas do ativo',1,'2025-10-11 20:42:10'),
(2,'Passivo','Contas do passivo',2,'2025-10-11 20:42:10'),
(3,'Receita','Contas de receita',3,'2025-10-11 20:42:10'),
(4,'Despesa','Contas de despesa',4,'2025-10-11 20:42:10'),
(5,'Resultado','Contas de resultado',5,'2025-10-11 20:42:10');
/*!40000 ALTER TABLE `account_types` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `accounting_movement_types`
--

DROP TABLE IF EXISTS `accounting_movement_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounting_movement_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounting_movement_types`
--

LOCK TABLES `accounting_movement_types` WRITE;
/*!40000 ALTER TABLE `accounting_movement_types` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `accounting_movement_types` VALUES
(1,'Débito','Movimento a débito',1,'2025-10-11 20:42:10'),
(2,'Crédito','Movimento a crédito',2,'2025-10-11 20:42:10');
/*!40000 ALTER TABLE `accounting_movement_types` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `age_ratings`
--

DROP TABLE IF EXISTS `age_ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `age_ratings` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(5) NOT NULL,
  `name` varchar(50) NOT NULL,
  `minimum_age` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `age_ratings`
--

LOCK TABLES `age_ratings` WRITE;
/*!40000 ALTER TABLE `age_ratings` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `age_ratings` VALUES
(1,'L','Livre',0,'Conteúdo livre para todos os públicos',1,'2025-10-11 20:38:32'),
(2,'10','10 anos',10,'Não recomendado para menores de 10 anos',2,'2025-10-11 20:38:32'),
(3,'12','12 anos',12,'Não recomendado para menores de 12 anos',3,'2025-10-11 20:38:32'),
(4,'14','14 anos',14,'Não recomendado para menores de 14 anos',4,'2025-10-11 20:38:32'),
(5,'16','16 anos',16,'Não recomendado para menores de 16 anos',5,'2025-10-11 20:38:32'),
(6,'18','18 anos',18,'Não recomendado para menores de 18 anos',6,'2025-10-11 20:38:32');
/*!40000 ALTER TABLE `age_ratings` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `ancillary_obligations`
--

DROP TABLE IF EXISTS `ancillary_obligations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ancillary_obligations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `obligation_code` varchar(20) NOT NULL,
  `description` varchar(200) NOT NULL,
  `periodicity` bigint(20) DEFAULT NULL,
  `due_day` int(11) DEFAULT NULL,
  `complex_id` bigint(20) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_complex` (`complex_id`),
  KEY `idx_code` (`obligation_code`),
  KEY `fk_obligation_periodicity` (`periodicity`),
  CONSTRAINT `ancillary_obligations_ibfk_1` FOREIGN KEY (`complex_id`) REFERENCES `cinema_complexes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_obligation_periodicity` FOREIGN KEY (`periodicity`) REFERENCES `periodicities` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ancillary_obligations`
--

LOCK TABLES `ancillary_obligations` WRITE;
/*!40000 ALTER TABLE `ancillary_obligations` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `ancillary_obligations` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `audio_types`
--

DROP TABLE IF EXISTS `audio_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `audio_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `additional_value` decimal(10,2) DEFAULT 0.00,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audio_types`
--

LOCK TABLES `audio_types` WRITE;
/*!40000 ALTER TABLE `audio_types` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `audio_types` VALUES
(1,'Estéreo','Áudio estéreo tradicional',0.00,1,'2025-10-11 20:42:10'),
(2,'Dolby Digital','Sistema Dolby Digital 5.1',2.00,2,'2025-10-11 20:42:10'),
(3,'Dolby Atmos','Sistema Dolby Atmos',5.00,3,'2025-10-11 20:42:10'),
(4,'DTS','Sistema DTS',3.00,4,'2025-10-11 20:42:10');
/*!40000 ALTER TABLE `audio_types` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `campaign_categories`
--

DROP TABLE IF EXISTS `campaign_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaign_categories` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `campaign_id` bigint(20) NOT NULL,
  `category_id` bigint(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_campaign_category` (`campaign_id`,`category_id`),
  KEY `idx_campaign_category_campaign` (`campaign_id`),
  KEY `idx_campaign_category_category` (`category_id`),
  CONSTRAINT `fk_campaign_category_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `promotional_campaigns` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_campaign_category_category` FOREIGN KEY (`category_id`) REFERENCES `movie_categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Valid movie categories for campaigns';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign_categories`
--

LOCK TABLES `campaign_categories` WRITE;
/*!40000 ALTER TABLE `campaign_categories` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `campaign_categories` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `campaign_complexes`
--

DROP TABLE IF EXISTS `campaign_complexes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaign_complexes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `campaign_id` bigint(20) NOT NULL,
  `complex_id` bigint(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_campaign_complex` (`campaign_id`,`complex_id`),
  KEY `idx_campaign_complex_campaign` (`campaign_id`),
  KEY `idx_campaign_complex_complex` (`complex_id`),
  CONSTRAINT `fk_campaign_complex_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `promotional_campaigns` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_campaign_complex_complex` FOREIGN KEY (`complex_id`) REFERENCES `cinema_complexes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Valid complexes for campaigns';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign_complexes`
--

LOCK TABLES `campaign_complexes` WRITE;
/*!40000 ALTER TABLE `campaign_complexes` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `campaign_complexes` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `campaign_movies`
--

DROP TABLE IF EXISTS `campaign_movies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaign_movies` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `campaign_id` bigint(20) NOT NULL,
  `movie_id` bigint(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_campaign_movie` (`campaign_id`,`movie_id`),
  KEY `idx_campaign_movie_campaign` (`campaign_id`),
  KEY `idx_campaign_movie_movie` (`movie_id`),
  CONSTRAINT `fk_campaign_movie_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `promotional_campaigns` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_campaign_movie_movie` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Valid movies for campaigns';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign_movies`
--

LOCK TABLES `campaign_movies` WRITE;
/*!40000 ALTER TABLE `campaign_movies` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `campaign_movies` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `campaign_rooms`
--

DROP TABLE IF EXISTS `campaign_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaign_rooms` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `campaign_id` bigint(20) NOT NULL,
  `room_id` bigint(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_campaign_room` (`campaign_id`,`room_id`),
  KEY `idx_campaign_room_campaign` (`campaign_id`),
  KEY `idx_campaign_room_room` (`room_id`),
  CONSTRAINT `fk_campaign_room_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `promotional_campaigns` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_campaign_room_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Valid rooms for campaigns';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign_rooms`
--

LOCK TABLES `campaign_rooms` WRITE;
/*!40000 ALTER TABLE `campaign_rooms` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `campaign_rooms` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `campaign_session_types`
--

DROP TABLE IF EXISTS `campaign_session_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaign_session_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `campaign_id` bigint(20) NOT NULL,
  `projection_type` varchar(30) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_campaign_session_type` (`campaign_id`,`projection_type`),
  KEY `idx_campaign_session_type_campaign` (`campaign_id`),
  KEY `idx_campaign_session_type_type` (`projection_type`),
  CONSTRAINT `fk_campaign_session_type_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `promotional_campaigns` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_campaign_session_type_type` FOREIGN KEY (`projection_type`) REFERENCES `projection_types` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Valid session types for campaigns';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign_session_types`
--

LOCK TABLES `campaign_session_types` WRITE;
/*!40000 ALTER TABLE `campaign_session_types` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `campaign_session_types` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `campaign_weekdays`
--

DROP TABLE IF EXISTS `campaign_weekdays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaign_weekdays` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `campaign_id` bigint(20) NOT NULL,
  `weekday` tinyint(4) NOT NULL COMMENT '1=Mon, 2=Tue, ... 7=Sun',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_campaign_weekday` (`campaign_id`,`weekday`),
  KEY `idx_campaign_weekday_campaign` (`campaign_id`),
  KEY `idx_campaign_weekday_weekday` (`weekday`),
  CONSTRAINT `fk_campaign_weekday_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `promotional_campaigns` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_weekday` CHECK (`weekday` between 1 and 7)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Valid weekdays for campaigns';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign_weekdays`
--

LOCK TABLES `campaign_weekdays` WRITE;
/*!40000 ALTER TABLE `campaign_weekdays` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `campaign_weekdays` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `cast_types`
--

DROP TABLE IF EXISTS `cast_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cast_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cast_types`
--

LOCK TABLES `cast_types` WRITE;
/*!40000 ALTER TABLE `cast_types` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `cast_types` VALUES
(1,'Ator/Atriz','Pessoa que atua no filme',1,'2025-10-11 21:02:26'),
(2,'Diretor','Diretor do filme',2,'2025-10-11 21:02:26'),
(3,'Produtor','Produtor executivo',3,'2025-10-11 21:02:26'),
(4,'Roteirista','Escritor do roteiro',4,'2025-10-11 21:02:26'),
(5,'Compositor','Compositor da trilha sonora',5,'2025-10-11 21:02:26'),
(6,'Diretor de Fotografia','Responsável pela fotografia',6,'2025-10-11 21:02:26');
/*!40000 ALTER TABLE `cast_types` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `chart_of_accounts`
--

DROP TABLE IF EXISTS `chart_of_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `chart_of_accounts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `account_code` varchar(20) NOT NULL,
  `account_name` varchar(200) NOT NULL,
  `account_type` bigint(20) DEFAULT NULL,
  `account_nature` bigint(20) DEFAULT NULL,
  `level` int(11) NOT NULL,
  `parent_account_id` bigint(20) DEFAULT NULL,
  `allows_entry` tinyint(1) DEFAULT 1,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_code` (`account_code`),
  KEY `idx_account_code` (`account_code`),
  KEY `idx_account_type` (`account_type`),
  KEY `idx_parent_account` (`parent_account_id`),
  KEY `fk_account_nature` (`account_nature`),
  CONSTRAINT `chart_of_accounts_ibfk_1` FOREIGN KEY (`parent_account_id`) REFERENCES `chart_of_accounts` (`id`),
  CONSTRAINT `fk_account_nature` FOREIGN KEY (`account_nature`) REFERENCES `account_natures` (`id`),
  CONSTRAINT `fk_account_type` FOREIGN KEY (`account_type`) REFERENCES `account_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chart_of_accounts`
--

LOCK TABLES `chart_of_accounts` WRITE;
/*!40000 ALTER TABLE `chart_of_accounts` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `chart_of_accounts` VALUES
(1,'1','ATIVO',1,1,1,NULL,0,1,'2025-10-11 20:18:45'),
(2,'1.01','ATIVO CIRCULANTE',1,1,2,NULL,0,1,'2025-10-11 20:18:45'),
(3,'1.01.01','Caixa e Equivalentes',1,1,3,NULL,0,1,'2025-10-11 20:18:45'),
(4,'1.01.01.01','Caixa',1,1,4,NULL,1,1,'2025-10-11 20:18:45'),
(5,'1.01.01.02','Bancos',1,1,4,NULL,1,1,'2025-10-11 20:18:45'),
(6,'2','PASSIVO',2,2,1,NULL,0,1,'2025-10-11 20:18:45'),
(7,'2.01','PASSIVO CIRCULANTE',2,2,2,NULL,0,1,'2025-10-11 20:18:45'),
(8,'2.01.03','Tributos a Recolher',2,2,3,NULL,0,1,'2025-10-11 20:18:45'),
(9,'2.01.03.01','ISS a Recolher',2,2,4,NULL,1,1,'2025-10-11 20:18:45'),
(10,'2.01.03.02','PIS a Recolher',2,2,4,NULL,1,1,'2025-10-11 20:18:45'),
(11,'2.01.03.03','COFINS a Recolher',2,2,4,NULL,1,1,'2025-10-11 20:18:45'),
(12,'2.01.03.04','IRPJ a Recolher',2,2,4,NULL,1,1,'2025-10-11 20:18:45'),
(13,'2.01.03.05','CSLL a Recolher',2,2,4,NULL,1,1,'2025-10-11 20:18:45'),
(14,'2.01.04','Fornecedores a Pagar',2,2,3,NULL,0,1,'2025-10-11 20:18:45'),
(15,'2.01.04.01','Repasse Distribuidores',2,2,4,NULL,1,1,'2025-10-11 20:18:45'),
(16,'3','RECEITAS',3,2,1,NULL,0,1,'2025-10-11 20:18:45'),
(17,'3.01','Receitas Operacionais',3,2,2,NULL,0,1,'2025-10-11 20:18:45'),
(18,'3.01.01','Receita de Bilheteria',3,2,3,NULL,1,1,'2025-10-11 20:18:45'),
(19,'3.01.02','Receita de Concessão',3,2,3,NULL,1,1,'2025-10-11 20:18:45'),
(20,'3.01.03','Receita de Publicidade',3,2,3,NULL,1,1,'2025-10-11 20:18:45'),
(21,'3.02','Deduções e Impostos',4,1,2,NULL,0,1,'2025-10-11 20:18:45'),
(22,'3.02.01','Tributos sobre Receita',4,1,3,NULL,0,1,'2025-10-11 20:18:45'),
(23,'3.02.01.01','ISS',4,1,4,NULL,1,1,'2025-10-11 20:18:45'),
(24,'3.02.01.02','PIS',4,1,4,NULL,1,1,'2025-10-11 20:18:45'),
(25,'3.02.01.03','COFINS',4,1,4,NULL,1,1,'2025-10-11 20:18:45'),
(26,'4','CUSTOS E DESPESAS',4,1,1,NULL,0,1,'2025-10-11 20:18:45'),
(27,'4.01','Custos Operacionais',4,1,2,NULL,0,1,'2025-10-11 20:18:45'),
(28,'4.01.01','Custo Mercadorias Vendidas',4,1,3,NULL,1,1,'2025-10-11 20:18:45'),
(29,'4.01.02','Repasse Distribuidores',4,1,3,NULL,1,1,'2025-10-11 20:18:45'),
(30,'4.02','Despesas Operacionais',4,1,2,NULL,0,1,'2025-10-11 20:18:45'),
(31,'4.02.01','Despesas Administrativas',4,1,3,NULL,1,1,'2025-10-11 20:18:45'),
(32,'4.02.02','Despesas com Pessoal',4,1,3,NULL,1,1,'2025-10-11 20:18:45'),
(33,'5','RESULTADO',5,1,1,NULL,0,1,'2025-10-11 20:18:45'),
(34,'5.01','IRPJ',5,1,2,NULL,1,1,'2025-10-11 20:18:45'),
(35,'5.02','CSLL',5,1,2,NULL,1,1,'2025-10-11 20:18:45');
/*!40000 ALTER TABLE `chart_of_accounts` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `cinema_complexes`
--

DROP TABLE IF EXISTS `cinema_complexes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cinema_complexes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) NOT NULL,
  `name` varchar(200) NOT NULL,
  `code` varchar(50) NOT NULL,
  `cnpj` varchar(18) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` char(2) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `ibge_municipality_code` varchar(7) NOT NULL,
  `ancine_registry` varchar(50) DEFAULT NULL,
  `opening_date` date DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_company` (`company_id`),
  KEY `idx_municipality` (`ibge_municipality_code`),
  KEY `idx_code` (`code`),
  CONSTRAINT `cinema_complexes_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cinema_complexes`
--

LOCK TABLES `cinema_complexes` WRITE;
/*!40000 ALTER TABLE `cinema_complexes` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `cinema_complexes` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `combo_products`
--

DROP TABLE IF EXISTS `combo_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `combo_products` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `combo_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_combo_product` (`combo_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `combo_products_ibfk_1` FOREIGN KEY (`combo_id`) REFERENCES `combos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `combo_products_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `combo_products`
--

LOCK TABLES `combo_products` WRITE;
/*!40000 ALTER TABLE `combo_products` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `combo_products` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `combos`
--

DROP TABLE IF EXISTS `combos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `combos` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `combo_code` varchar(50) NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `sale_price` decimal(10,2) NOT NULL,
  `promotional_price` decimal(10,2) DEFAULT NULL,
  `promotion_start_date` date DEFAULT NULL,
  `promotion_end_date` date DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `combo_code` (`combo_code`),
  KEY `idx_combo_code` (`combo_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `combos`
--

LOCK TABLES `combos` WRITE;
/*!40000 ALTER TABLE `combos` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `combos` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `corporate_name` varchar(200) NOT NULL,
  `trade_name` varchar(200) DEFAULT NULL,
  `cnpj` varchar(18) NOT NULL,
  `state_registration` varchar(20) DEFAULT NULL,
  `municipal_registration` varchar(20) DEFAULT NULL,
  `tax_regime` bigint(20) DEFAULT NULL,
  `pis_cofins_regime` bigint(20) DEFAULT NULL,
  `recine_opt_in` tinyint(1) DEFAULT 0,
  `recine_join_date` date DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `cnpj` (`cnpj`),
  KEY `idx_cnpj` (`cnpj`),
  KEY `idx_regime` (`tax_regime`,`pis_cofins_regime`),
  KEY `fk_company_pis_cofins_regime` (`pis_cofins_regime`),
  CONSTRAINT `fk_company_pis_cofins_regime` FOREIGN KEY (`pis_cofins_regime`) REFERENCES `pis_cofins_regimes` (`id`),
  CONSTRAINT `fk_company_tax_regime` FOREIGN KEY (`tax_regime`) REFERENCES `tax_regimes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `concession_sale_items`
--

DROP TABLE IF EXISTS `concession_sale_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `concession_sale_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `concession_sale_id` bigint(20) NOT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `combo_id` bigint(20) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `combo_id` (`combo_id`),
  KEY `idx_concession_sale` (`concession_sale_id`),
  CONSTRAINT `concession_sale_items_ibfk_1` FOREIGN KEY (`concession_sale_id`) REFERENCES `concession_sales` (`id`) ON DELETE CASCADE,
  CONSTRAINT `concession_sale_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL,
  CONSTRAINT `concession_sale_items_ibfk_3` FOREIGN KEY (`combo_id`) REFERENCES `combos` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Itens de vendas de concessão';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `concession_sale_items`
--

LOCK TABLES `concession_sale_items` WRITE;
/*!40000 ALTER TABLE `concession_sale_items` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `concession_sale_items` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER trg_concession_item_validation_insert
BEFORE INSERT ON concession_sale_items
FOR EACH ROW
BEGIN
    IF NEW.product_id IS NULL AND NEW.combo_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Deve informar product_id OU combo_id';
    END IF;

    IF NEW.product_id IS NOT NULL AND NEW.combo_id IS NOT NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Não pode informar product_id E combo_id simultaneamente';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER trg_concession_item_validation_update
BEFORE UPDATE ON concession_sale_items
FOR EACH ROW
BEGIN
    IF NEW.product_id IS NULL AND NEW.combo_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Deve informar product_id OU combo_id';
    END IF;

    IF NEW.product_id IS NOT NULL AND NEW.combo_id IS NOT NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Não pode informar product_id E combo_id simultaneamente';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `concession_sales`
--

DROP TABLE IF EXISTS `concession_sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `concession_sales` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `sale_id` bigint(20) NOT NULL,
  `sale_date` timestamp NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `net_amount` decimal(10,2) NOT NULL,
  `status` bigint(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `sale_id` (`sale_id`),
  KEY `idx_sale_date` (`sale_date`),
  KEY `idx_status` (`status`),
  CONSTRAINT `concession_sales_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE,
  CONSTRAINT `concession_sales_ibfk_2` FOREIGN KEY (`status`) REFERENCES `concession_status` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Vendas de concessão';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `concession_sales`
--

LOCK TABLES `concession_sales` WRITE;
/*!40000 ALTER TABLE `concession_sales` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `concession_sales` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `concession_status`
--

DROP TABLE IF EXISTS `concession_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `concession_status` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `allows_modification` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `concession_status`
--

LOCK TABLES `concession_status` WRITE;
/*!40000 ALTER TABLE `concession_status` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `concession_status` VALUES
(1,'Pendente','Aguardando pagamento',1,1,'2025-10-11 20:42:10'),
(2,'Pago','Pagamento confirmado',0,2,'2025-10-11 20:42:10'),
(3,'Cancelado','Venda cancelada',0,3,'2025-10-11 20:42:10');
/*!40000 ALTER TABLE `concession_status` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `contingency_reserves`
--

DROP TABLE IF EXISTS `contingency_reserves`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `contingency_reserves` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `complexo_id` bigint(20) NOT NULL,
  `contingency_type` bigint(20) DEFAULT NULL,
  `reserve_amount` decimal(15,2) NOT NULL,
  `reason` text NOT NULL,
  `inclusion_date` date NOT NULL,
  `clearance_date` date DEFAULT NULL,
  `status` bigint(20) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_complex` (`complexo_id`),
  KEY `idx_status` (`status`),
  KEY `fk_contingency_type` (`contingency_type`),
  CONSTRAINT `contingency_reserves_ibfk_1` FOREIGN KEY (`complexo_id`) REFERENCES `cinema_complexes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_contingency_status` FOREIGN KEY (`status`) REFERENCES `contingency_status` (`id`),
  CONSTRAINT `fk_contingency_type` FOREIGN KEY (`contingency_type`) REFERENCES `contingency_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contingency_reserves`
--

LOCK TABLES `contingency_reserves` WRITE;
/*!40000 ALTER TABLE `contingency_reserves` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `contingency_reserves` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `contingency_status`
--

DROP TABLE IF EXISTS `contingency_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `contingency_status` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contingency_status`
--

LOCK TABLES `contingency_status` WRITE;
/*!40000 ALTER TABLE `contingency_status` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `contingency_status` VALUES
(1,'Ativa','Contingência ativa',1,'2025-10-11 20:42:10'),
(2,'Finalizada','Contingência finalizada',2,'2025-10-11 20:42:10'),
(3,'Cancelada','Contingência cancelada',3,'2025-10-11 20:42:10');
/*!40000 ALTER TABLE `contingency_status` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `contingency_types`
--

DROP TABLE IF EXISTS `contingency_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `contingency_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contingency_types`
--

LOCK TABLES `contingency_types` WRITE;
/*!40000 ALTER TABLE `contingency_types` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `contingency_types` VALUES
(1,'Administrativa','Contingência administrativa',1,'2025-10-11 20:42:10'),
(2,'Judicial','Contingência judicial',2,'2025-10-11 20:42:10');
/*!40000 ALTER TABLE `contingency_types` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `contract_types`
--

DROP TABLE IF EXISTS `contract_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `contract_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contract_types`
--

LOCK TABLES `contract_types` WRITE;
/*!40000 ALTER TABLE `contract_types` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `contract_types` VALUES
(1,'Percentual','Repasse baseado em percentual da bilheteria','2025-10-11 20:42:10'),
(2,'Flat','Valor fixo de repasse','2025-10-11 20:42:10'),
(3,'Misto','Combinação de percentual e valor fixo','2025-10-11 20:42:10');
/*!40000 ALTER TABLE `contract_types` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `courtesy_parameters`
--

DROP TABLE IF EXISTS `courtesy_parameters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `courtesy_parameters` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cinema_complex_id` bigint(20) DEFAULT NULL,
  `courtesy_taxation_percentage` decimal(5,2) DEFAULT 0.00,
  `monthly_courtesy_limit` int(11) DEFAULT 1000,
  `validity_start` date NOT NULL,
  `validity_end` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cinema_complex_id` (`cinema_complex_id`),
  CONSTRAINT `courtesy_parameters_ibfk_1` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courtesy_parameters`
--

LOCK TABLES `courtesy_parameters` WRITE;
/*!40000 ALTER TABLE `courtesy_parameters` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `courtesy_parameters` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `credit_types`
--

DROP TABLE IF EXISTS `credit_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `credit_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `credit_percentage` decimal(5,2) DEFAULT 100.00,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `credit_types`
--

LOCK TABLES `credit_types` WRITE;
/*!40000 ALTER TABLE `credit_types` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `credit_types` VALUES
(1,'Insumos','Créditos sobre insumos',100.00,1,'2025-10-11 20:42:10'),
(2,'Energia Elétrica','Créditos sobre energia',100.00,2,'2025-10-11 20:42:10'),
(3,'Aluguéis','Créditos sobre aluguéis',100.00,3,'2025-10-11 20:42:10'),
(4,'Serviços','Créditos sobre serviços tomados',100.00,4,'2025-10-11 20:42:10'),
(5,'Depreciações','Créditos sobre depreciações',100.00,5,'2025-10-11 20:42:10'),
(6,'Outros','Outros créditos permitidos',100.00,6,'2025-10-11 20:42:10');
/*!40000 ALTER TABLE `credit_types` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `customer_favorite_combos`
--

DROP TABLE IF EXISTS `customer_favorite_combos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_favorite_combos` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `customer_id` bigint(20) NOT NULL,
  `combo_id` bigint(20) NOT NULL,
  `purchase_count` int(11) DEFAULT 0,
  `last_purchase` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_customer_combo` (`customer_id`,`combo_id`),
  KEY `idx_customer_combo_customer` (`customer_id`),
  KEY `idx_customer_combo_combo` (`combo_id`),
  CONSTRAINT `fk_customer_combo_combo` FOREIGN KEY (`combo_id`) REFERENCES `combos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_customer_combo_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Customer favorite combos';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_favorite_combos`
--

LOCK TABLES `customer_favorite_combos` WRITE;
/*!40000 ALTER TABLE `customer_favorite_combos` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `customer_favorite_combos` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `customer_favorite_genres`
--

DROP TABLE IF EXISTS `customer_favorite_genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_favorite_genres` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `customer_id` bigint(20) NOT NULL,
  `genre` varchar(100) NOT NULL,
  `preference_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_customer_genre` (`customer_id`,`genre`),
  KEY `idx_customer_genre_customer` (`customer_id`),
  KEY `idx_customer_genre_genre` (`genre`),
  CONSTRAINT `fk_customer_genre_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Customer favorite genres';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_favorite_genres`
--

LOCK TABLES `customer_favorite_genres` WRITE;
/*!40000 ALTER TABLE `customer_favorite_genres` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `customer_favorite_genres` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `customer_favorite_products`
--

DROP TABLE IF EXISTS `customer_favorite_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_favorite_products` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `customer_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `purchase_count` int(11) DEFAULT 0,
  `last_purchase` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_customer_product` (`customer_id`,`product_id`),
  KEY `idx_customer_product_customer` (`customer_id`),
  KEY `idx_customer_product_product` (`product_id`),
  CONSTRAINT `fk_customer_product_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_customer_product_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Customer favorite products';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_favorite_products`
--

LOCK TABLES `customer_favorite_products` WRITE;
/*!40000 ALTER TABLE `customer_favorite_products` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `customer_favorite_products` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `customer_interactions`
--

DROP TABLE IF EXISTS `customer_interactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_interactions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `customer_id` bigint(20) NOT NULL,
  `interaction_type` varchar(50) NOT NULL,
  `channel` varchar(30) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Additional interaction data' CHECK (json_valid(`metadata`)),
  `origin_id` bigint(20) DEFAULT NULL COMMENT 'Sale ID, session ID, etc',
  `origin_type` varchar(50) DEFAULT NULL COMMENT 'SALE, SESSION, CAMPAIGN, etc',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_customer_type` (`customer_id`,`interaction_type`),
  KEY `idx_origin` (`origin_type`,`origin_id`),
  CONSTRAINT `customer_interactions_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Customer interactions history';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_interactions`
--

LOCK TABLES `customer_interactions` WRITE;
/*!40000 ALTER TABLE `customer_interactions` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `customer_interactions` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `customer_points`
--

DROP TABLE IF EXISTS `customer_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_points` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `customer_id` bigint(20) NOT NULL,
  `movement_type` enum('CREDIT','DEBIT','EXPIRATION','ADJUSTMENT') NOT NULL,
  `points` int(11) NOT NULL,
  `previous_balance` int(11) NOT NULL,
  `current_balance` int(11) NOT NULL,
  `origin_type` varchar(50) DEFAULT NULL COMMENT 'PURCHASE, REDEMPTION, PROMOTION',
  `origin_id` bigint(20) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `expiration_date` date DEFAULT NULL COMMENT 'Points can expire',
  `valid` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_cp_customer_date` (`customer_id`,`created_at`),
  KEY `idx_cp_expiration` (`expiration_date`,`valid`),
  KEY `idx_customer_valid` (`customer_id`,`valid`),
  CONSTRAINT `customer_points_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Loyalty points movement';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_points`
--

LOCK TABLES `customer_points` WRITE;
/*!40000 ALTER TABLE `customer_points` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `customer_points` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `customer_preferences`
--

DROP TABLE IF EXISTS `customer_preferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_preferences` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `customer_id` bigint(20) NOT NULL,
  `preferred_session_type` varchar(30) DEFAULT NULL COMMENT '3D, IMAX, etc',
  `preferred_language` varchar(30) DEFAULT NULL COMMENT 'DUBBED, SUBTITLED',
  `preferred_position` enum('CENTER','LEFT_SIDE','RIGHT_SIDE','BACK','FRONT') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_customer` (`customer_id`),
  CONSTRAINT `customer_preferences_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Detailed customer preferences';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_preferences`
--

LOCK TABLES `customer_preferences` WRITE;
/*!40000 ALTER TABLE `customer_preferences` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `customer_preferences` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `customer_preferred_rows`
--

DROP TABLE IF EXISTS `customer_preferred_rows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_preferred_rows` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `customer_id` bigint(20) NOT NULL,
  `row_code` varchar(5) NOT NULL,
  `usage_count` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_customer_row` (`customer_id`,`row_code`),
  KEY `idx_customer_row_customer` (`customer_id`),
  KEY `idx_customer_row_row` (`row_code`),
  CONSTRAINT `fk_customer_row_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Customer preferred seat rows';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_preferred_rows`
--

LOCK TABLES `customer_preferred_rows` WRITE;
/*!40000 ALTER TABLE `customer_preferred_rows` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `customer_preferred_rows` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `customer_preferred_times`
--

DROP TABLE IF EXISTS `customer_preferred_times`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_preferred_times` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `customer_id` bigint(20) NOT NULL,
  `time_slot` varchar(20) NOT NULL COMMENT 'MORNING, AFTERNOON, EVENING, NIGHT',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_customer_time` (`customer_id`,`time_slot`),
  KEY `idx_customer_time_customer` (`customer_id`),
  KEY `idx_customer_time_time` (`time_slot`),
  CONSTRAINT `fk_customer_time_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Customer preferred time slots';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_preferred_times`
--

LOCK TABLES `customer_preferred_times` WRITE;
/*!40000 ALTER TABLE `customer_preferred_times` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `customer_preferred_times` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `customer_preferred_weekdays`
--

DROP TABLE IF EXISTS `customer_preferred_weekdays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_preferred_weekdays` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `customer_id` bigint(20) NOT NULL,
  `weekday` tinyint(4) NOT NULL COMMENT '1=Mon, 2=Tue, ... 7=Sun',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_customer_weekday` (`customer_id`,`weekday`),
  KEY `idx_customer_weekday_pref_customer` (`customer_id`),
  KEY `idx_customer_weekday_pref_weekday` (`weekday`),
  CONSTRAINT `fk_customer_weekday_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_customer_weekday` CHECK (`weekday` between 1 and 7)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Customer preferred weekdays';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_preferred_weekdays`
--

LOCK TABLES `customer_preferred_weekdays` WRITE;
/*!40000 ALTER TABLE `customer_preferred_weekdays` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `customer_preferred_weekdays` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cpf` varchar(14) NOT NULL,
  `name` varchar(200) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `gender` enum('M','F','OTHER','NOT_INFORMED') DEFAULT 'NOT_INFORMED',
  `zip_code` varchar(10) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` char(2) DEFAULT NULL,
  `accumulated_points` int(11) DEFAULT 0,
  `loyalty_level` varchar(20) DEFAULT 'BRONZE',
  `loyalty_join_date` timestamp NULL DEFAULT NULL,
  `accepts_marketing` tinyint(1) DEFAULT 0,
  `accepts_sms` tinyint(1) DEFAULT 0,
  `accepts_email` tinyint(1) DEFAULT 1,
  `terms_accepted` tinyint(1) DEFAULT 0,
  `terms_acceptance_date` timestamp NULL DEFAULT NULL,
  `acceptance_ip` varchar(45) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `blocked` tinyint(1) DEFAULT 0,
  `block_reason` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `collection_purposes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'JSON with array of purposes: ["SALES", "MARKETING"]' CHECK (json_valid(`collection_purposes`)),
  `subject_aware_rights` tinyint(1) DEFAULT 0 COMMENT 'Ciente dos direitos Art. 18º',
  `rights_awareness_date` timestamp NULL DEFAULT NULL,
  `anonymization_requested` tinyint(1) DEFAULT 0 COMMENT 'Cliente solicitou anonimização',
  `anonymization_date` timestamp NULL DEFAULT NULL,
  `data_anonymized` tinyint(1) DEFAULT 0,
  `registration_source` varchar(50) DEFAULT NULL COMMENT 'APP, SITE, PRESENCIAL, IMPORTACAO',
  `registration_responsible` bigint(20) DEFAULT NULL COMMENT 'Funcionário que cadastrou',
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`),
  KEY `idx_cpf` (`cpf`),
  KEY `idx_email` (`email`),
  KEY `idx_phone` (`phone`),
  KEY `idx_loyalty_level` (`loyalty_level`),
  KEY `idx_birth_date` (`birth_date`),
  KEY `idx_anonymization` (`data_anonymized`),
  KEY `fk_customer_registration_responsible` (`registration_responsible`),
  CONSTRAINT `fk_customer_registration_responsible` FOREIGN KEY (`registration_responsible`) REFERENCES `employees` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Cinema customers registration';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER trg_customer_birth_date_validation
BEFORE INSERT ON customers
FOR EACH ROW
BEGIN
    IF NEW.birth_date IS NOT NULL AND
       NEW.birth_date > DATE_SUB(CURDATE(), INTERVAL 10 YEAR) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cliente deve ter no mínimo 10 anos';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER trg_customer_birth_date_validation_update
BEFORE UPDATE ON customers
FOR EACH ROW
BEGIN
    IF NEW.birth_date IS NOT NULL AND
       NEW.birth_date > DATE_SUB(CURDATE(), INTERVAL 10 YEAR) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cliente deve ter no mínimo 10 anos';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `delivery_history`
--

DROP TABLE IF EXISTS `delivery_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `obligation_id` bigint(20) NOT NULL,
  `delivery_date` date DEFAULT NULL,
  `status` bigint(20) DEFAULT NULL,
  `receipt_number` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_obligation` (`obligation_id`),
  KEY `idx_status` (`status`),
  KEY `idx_delivery_date` (`delivery_date`),
  CONSTRAINT `delivery_history_ibfk_1` FOREIGN KEY (`obligation_id`) REFERENCES `ancillary_obligations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_delivery_status` FOREIGN KEY (`status`) REFERENCES `obligation_status` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_history`
--

LOCK TABLES `delivery_history` WRITE;
/*!40000 ALTER TABLE `delivery_history` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `delivery_history` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `complex_id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `cost_center` varchar(50) DEFAULT NULL,
  `manager_id` bigint(20) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_complex` (`complex_id`),
  KEY `fk_department_manager` (`manager_id`),
  CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`complex_id`) REFERENCES `cinema_complexes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_department_manager` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `distributor_settlement_status`
--

DROP TABLE IF EXISTS `distributor_settlement_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `distributor_settlement_status` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `allows_modification` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `distributor_settlement_status`
--

LOCK TABLES `distributor_settlement_status` WRITE;
/*!40000 ALTER TABLE `distributor_settlement_status` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `distributor_settlement_status` VALUES
(1,'Em Cálculo','Repasse sendo calculado',1,1,'2025-10-11 20:42:10'),
(2,'Calculado','Cálculo concluído',1,2,'2025-10-11 20:42:10'),
(3,'Aprovado','Repasse aprovado',1,3,'2025-10-11 20:42:10'),
(4,'Pago','Repasse efetuado',0,4,'2025-10-11 20:42:10'),
(5,'Contestado','Repasse contestado',1,5,'2025-10-11 20:42:10');
/*!40000 ALTER TABLE `distributor_settlement_status` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `distributor_settlements`
--

DROP TABLE IF EXISTS `distributor_settlements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `distributor_settlements` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `contract_id` bigint(20) NOT NULL,
  `distributor_id` bigint(20) NOT NULL,
  `cinema_complex_id` bigint(20) NOT NULL,
  `competence_start_date` date NOT NULL,
  `competence_end_date` date NOT NULL,
  `total_tickets_sold` int(11) DEFAULT 0,
  `gross_box_office_revenue` decimal(15,2) NOT NULL,
  `calculation_base` bigint(20) DEFAULT NULL COMMENT 'GROSS, NET_OF_TAXES',
  `taxes_deducted_amount` decimal(15,2) DEFAULT 0.00,
  `settlement_base_amount` decimal(15,2) NOT NULL,
  `distributor_percentage` decimal(5,2) NOT NULL,
  `calculated_settlement_amount` decimal(15,2) NOT NULL,
  `minimum_guarantee` decimal(15,2) DEFAULT 0.00,
  `final_settlement_amount` decimal(15,2) NOT NULL,
  `deductions_amount` decimal(15,2) DEFAULT 0.00,
  `net_settlement_amount` decimal(15,2) NOT NULL,
  `irrf_rate` decimal(5,2) DEFAULT 0.00,
  `irrf_calculation_base` decimal(15,2) DEFAULT 0.00,
  `irrf_amount` decimal(15,2) DEFAULT 0.00,
  `irrf_exempt` tinyint(1) DEFAULT 0,
  `retained_iss_amount` decimal(15,2) DEFAULT 0.00,
  `net_payment_amount` decimal(15,2) NOT NULL,
  `status` bigint(20) DEFAULT NULL,
  `calculation_date` date DEFAULT NULL,
  `approval_date` date DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `contract_id` (`contract_id`),
  KEY `calculation_base` (`calculation_base`),
  KEY `idx_distributor` (`distributor_id`),
  KEY `idx_complex` (`cinema_complex_id`),
  KEY `idx_competence` (`competence_start_date`,`competence_end_date`),
  KEY `idx_status` (`status`),
  CONSTRAINT `distributor_settlements_ibfk_1` FOREIGN KEY (`contract_id`) REFERENCES `exhibition_contracts` (`id`),
  CONSTRAINT `distributor_settlements_ibfk_2` FOREIGN KEY (`distributor_id`) REFERENCES `suppliers` (`id`),
  CONSTRAINT `distributor_settlements_ibfk_3` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes` (`id`),
  CONSTRAINT `distributor_settlements_ibfk_4` FOREIGN KEY (`calculation_base`) REFERENCES `settlement_bases` (`id`),
  CONSTRAINT `distributor_settlements_ibfk_5` FOREIGN KEY (`status`) REFERENCES `distributor_settlement_status` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Acertos com distribuidores';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `distributor_settlements`
--

LOCK TABLES `distributor_settlements` WRITE;
/*!40000 ALTER TABLE `distributor_settlements` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `distributor_settlements` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `employee_time_records`
--

DROP TABLE IF EXISTS `employee_time_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_time_records` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `employee_id` bigint(20) NOT NULL,
  `record_date` date NOT NULL,
  `entry_time` time DEFAULT NULL,
  `exit_time` time DEFAULT NULL,
  `break_start_time` time DEFAULT NULL,
  `break_end_time` time DEFAULT NULL,
  `total_hours_worked` decimal(5,2) DEFAULT NULL,
  `observations` text DEFAULT NULL,
  `registration_ip` varchar(45) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_employee_date` (`employee_id`,`record_date`),
  KEY `idx_employee_date` (`employee_id`,`record_date`),
  KEY `idx_time_records_period` (`employee_id`,`record_date`),
  CONSTRAINT `employee_time_records_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_time_records`
--

LOCK TABLES `employee_time_records` WRITE;
/*!40000 ALTER TABLE `employee_time_records` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `employee_time_records` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER trg_calcular_horas_ponto
AFTER UPDATE ON employee_time_records
FOR EACH ROW
BEGIN
    IF NEW.exit_time IS NOT NULL AND OLD.exit_time IS NULL THEN
        CALL sp_calcular_horas_trabalhadas(NEW.id);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `complex_id` bigint(20) NOT NULL,
  `position_id` bigint(20) NOT NULL,
  `employee_number` varchar(50) NOT NULL,
  `name` varchar(200) NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `rg` varchar(20) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `hire_date` date NOT NULL,
  `termination_date` date DEFAULT NULL,
  `current_salary` decimal(10,2) NOT NULL,
  `contract_type` bigint(20) NOT NULL,
  `photo_url` varchar(500) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_number` (`employee_number`),
  UNIQUE KEY `cpf` (`cpf`),
  KEY `contract_type` (`contract_type`),
  KEY `idx_complex` (`complex_id`),
  KEY `idx_position` (`position_id`),
  KEY `idx_employee_number` (`employee_number`),
  KEY `idx_cpf` (`cpf`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`complex_id`) REFERENCES `cinema_complexes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`position_id`) REFERENCES `positions` (`id`),
  CONSTRAINT `employees_ibfk_3` FOREIGN KEY (`contract_type`) REFERENCES `employment_contract_types` (`id`),
  CONSTRAINT `chk_employee_salary` CHECK (`current_salary` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `employment_contract_types`
--

DROP TABLE IF EXISTS `employment_contract_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `employment_contract_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employment_contract_types`
--

LOCK TABLES `employment_contract_types` WRITE;
/*!40000 ALTER TABLE `employment_contract_types` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `employment_contract_types` VALUES
(1,'CLT','Consolidação das Leis do Trabalho',1,'2025-10-11 21:05:23'),
(2,'Pessoa Jurídica','Prestador de serviços PJ',2,'2025-10-11 21:05:23'),
(3,'Estágio','Contrato de estágio',3,'2025-10-11 21:05:23'),
(4,'Temporário','Contrato temporário',4,'2025-10-11 21:05:23'),
(5,'Intermitente','Contrato intermitente',5,'2025-10-11 21:05:23');
/*!40000 ALTER TABLE `employment_contract_types` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `exhibition_contracts`
--

DROP TABLE IF EXISTS `exhibition_contracts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `exhibition_contracts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `movie_id` bigint(20) NOT NULL,
  `cinema_complex_id` bigint(20) NOT NULL,
  `contract_number` varchar(50) DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `distributor_percentage` decimal(5,2) NOT NULL,
  `exhibitor_percentage` decimal(5,2) NOT NULL,
  `guaranteed_minimum` decimal(15,2) DEFAULT 0.00,
  `contract_type` bigint(20) DEFAULT NULL,
  `revenue_base` bigint(20) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `distributor_id` bigint(20) NOT NULL COMMENT 'ID do distribuidor',
  `minimum_guarantee` decimal(15,2) DEFAULT 0.00,
  `contract_terms` text DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `contract_number` (`contract_number`),
  KEY `fk_contract_type` (`contract_type`),
  KEY `fk_contract_revenue_base` (`revenue_base`),
  KEY `idx_cinema_complex` (`cinema_complex_id`),
  KEY `idx_contract_supplier` (`distributor_id`),
  KEY `idx_movie` (`movie_id`),
  CONSTRAINT `fk_contract_complex` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes` (`id`),
  CONSTRAINT `fk_contract_movie` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`),
  CONSTRAINT `fk_contract_revenue_base` FOREIGN KEY (`revenue_base`) REFERENCES `settlement_bases` (`id`),
  CONSTRAINT `fk_contract_supplier` FOREIGN KEY (`distributor_id`) REFERENCES `suppliers` (`id`),
  CONSTRAINT `fk_contract_type` FOREIGN KEY (`contract_type`) REFERENCES `contract_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exhibition_contracts`
--

LOCK TABLES `exhibition_contracts` WRITE;
/*!40000 ALTER TABLE `exhibition_contracts` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `exhibition_contracts` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `federal_tax_rates`
--

DROP TABLE IF EXISTS `federal_tax_rates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `federal_tax_rates` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `tax_regime` bigint(20) DEFAULT NULL,
  `pis_cofins_regime` bigint(20) DEFAULT NULL,
  `revenue_type` bigint(20) DEFAULT NULL,
  `pis_rate` decimal(5,2) NOT NULL,
  `cofins_rate` decimal(5,2) NOT NULL,
  `credit_allowed` tinyint(1) DEFAULT 0,
  `irpj_base_rate` decimal(5,2) DEFAULT NULL,
  `irpj_additional_rate` decimal(5,2) DEFAULT NULL,
  `irpj_additional_limit` decimal(15,2) DEFAULT NULL,
  `csll_rate` decimal(5,2) DEFAULT NULL,
  `presumed_profit_percentage` decimal(5,2) DEFAULT NULL,
  `validity_start` date NOT NULL,
  `validity_end` date DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_regime_revenue_validity` (`tax_regime`,`pis_cofins_regime`,`revenue_type`,`validity_start`),
  KEY `fk_tax_rate_pis_cofins_regime` (`pis_cofins_regime`),
  KEY `fk_tax_rate_revenue_type` (`revenue_type`),
  CONSTRAINT `fk_tax_rate_pis_cofins_regime` FOREIGN KEY (`pis_cofins_regime`) REFERENCES `pis_cofins_regimes` (`id`),
  CONSTRAINT `fk_tax_rate_revenue_type` FOREIGN KEY (`revenue_type`) REFERENCES `revenue_types` (`id`),
  CONSTRAINT `fk_tax_rate_tax_regime` FOREIGN KEY (`tax_regime`) REFERENCES `tax_regimes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `federal_tax_rates`
--

LOCK TABLES `federal_tax_rates` WRITE;
/*!40000 ALTER TABLE `federal_tax_rates` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `federal_tax_rates` VALUES
(1,1,1,1,0.65,3.00,0,15.00,10.00,20000.00,9.00,NULL,'2020-01-01',NULL,1,'2025-10-11 20:19:17'),
(2,1,1,2,0.65,3.00,0,15.00,10.00,20000.00,9.00,NULL,'2020-01-01',NULL,1,'2025-10-11 20:19:17'),
(3,1,1,3,0.65,3.00,0,15.00,10.00,20000.00,9.00,NULL,'2020-01-01',NULL,1,'2025-10-11 20:19:17'),
(4,1,2,1,1.65,7.60,1,15.00,10.00,20000.00,9.00,NULL,'2020-01-01',NULL,1,'2025-10-11 20:21:55'),
(5,1,2,2,1.65,7.60,1,15.00,10.00,20000.00,9.00,NULL,'2020-01-01',NULL,1,'2025-10-11 20:21:55'),
(6,1,2,3,1.65,7.60,1,15.00,10.00,20000.00,9.00,NULL,'2020-01-01',NULL,1,'2025-10-11 20:21:55'),
(7,1,1,1,0.65,3.00,0,15.00,10.00,20000.00,9.00,NULL,'2020-01-01',NULL,1,'2025-10-11 20:21:58'),
(8,1,1,2,0.65,3.00,0,15.00,10.00,20000.00,9.00,NULL,'2020-01-01',NULL,1,'2025-10-11 20:21:58'),
(9,1,1,3,0.65,3.00,0,15.00,10.00,20000.00,9.00,NULL,'2020-01-01',NULL,1,'2025-10-11 20:21:58'),
(10,2,1,1,0.65,3.00,0,15.00,10.00,20000.00,9.00,32.00,'2020-01-01',NULL,1,'2025-10-11 20:22:02'),
(11,2,1,2,0.65,3.00,0,15.00,10.00,20000.00,9.00,8.00,'2020-01-01',NULL,1,'2025-10-11 20:22:02'),
(12,2,1,3,0.65,3.00,0,15.00,10.00,20000.00,9.00,32.00,'2020-01-01',NULL,1,'2025-10-11 20:22:02');
/*!40000 ALTER TABLE `federal_tax_rates` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `gdpr_consents`
--

DROP TABLE IF EXISTS `gdpr_consents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `gdpr_consents` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `subject_type` varchar(20) NOT NULL COMMENT 'CUSTOMER, EMPLOYEE',
  `subject_id` bigint(20) NOT NULL,
  `purpose` varchar(100) NOT NULL COMMENT 'Ex: MARKETING_EMAIL, ANALYTICAL_COOKIES',
  `purpose_description` text NOT NULL COMMENT 'Text presented to the user',
  `data_categories` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '["name", "email", "cpf", "purchase_history"]' CHECK (json_valid(`data_categories`)),
  `sensitive_data` tinyint(1) DEFAULT 0 COMMENT 'If includes sensitive data (GDPR Art. 5 II)',
  `consent_given` tinyint(1) NOT NULL,
  `consent_date` timestamp NULL DEFAULT NULL,
  `revocation_date` timestamp NULL DEFAULT NULL,
  `terms_version` varchar(20) NOT NULL COMMENT 'v1.0, v2.0...',
  `consent_ip` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `channel` varchar(30) DEFAULT NULL COMMENT 'APP, WEBSITE, IN_PERSON, EMAIL',
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_subject` (`subject_type`,`subject_id`),
  KEY `idx_purpose` (`purpose`),
  KEY `idx_active` (`active`),
  KEY `idx_sensitive_data` (`sensitive_data`),
  KEY `idx_gdpr_subject` (`subject_type`,`subject_id`,`active`),
  KEY `idx_gdpr_sensitive_data` (`sensitive_data`,`active`),
  KEY `idx_consent_date` (`consent_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='GDPR consent records (Art. 8)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gdpr_consents`
--

LOCK TABLES `gdpr_consents` WRITE;
/*!40000 ALTER TABLE `gdpr_consents` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `gdpr_consents` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `gdpr_data_subject_requests`
--

DROP TABLE IF EXISTS `gdpr_data_subject_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `gdpr_data_subject_requests` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `subject_type` varchar(20) NOT NULL,
  `subject_id` bigint(20) NOT NULL,
  `subject_name` varchar(200) NOT NULL,
  `subject_email` varchar(100) NOT NULL,
  `subject_cpf` varchar(14) DEFAULT NULL,
  `request_type` varchar(50) NOT NULL COMMENT 'ACESSO, CORRECAO, EXCLUSAO, PORTABILIDADE, REVOGACAO',
  `description` text NOT NULL,
  `identity_documents` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'URLs dos documentos' CHECK (json_valid(`identity_documents`)),
  `status` varchar(30) DEFAULT 'PENDENTE' COMMENT 'PENDENTE, EM_ANALISE, APROVADA, REJEITADA, CONCLUIDA',
  `rejection_reason` text DEFAULT NULL,
  `request_date` timestamp NULL DEFAULT current_timestamp(),
  `response_deadline` timestamp NOT NULL COMMENT 'Calculado: data_solicitacao + 15 dias',
  `response_date` timestamp NULL DEFAULT NULL,
  `completion_date` timestamp NULL DEFAULT NULL,
  `handled_by` bigint(20) DEFAULT NULL,
  `handling_notes` text DEFAULT NULL,
  `export_file_url` varchar(500) DEFAULT NULL COMMENT 'URL do arquivo ZIP/JSON',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `handled_by` (`handled_by`),
  KEY `idx_subject` (`subject_type`,`subject_id`),
  KEY `idx_status` (`status`),
  KEY `idx_deadline` (`response_deadline`,`status`),
  KEY `idx_requests_deadline` (`response_deadline`,`status`),
  CONSTRAINT `gdpr_data_subject_requests_ibfk_1` FOREIGN KEY (`handled_by`) REFERENCES `system_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Solicitações dos titulares (Art. 18º LGPD)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gdpr_data_subject_requests`
--

LOCK TABLES `gdpr_data_subject_requests` WRITE;
/*!40000 ALTER TABLE `gdpr_data_subject_requests` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `gdpr_data_subject_requests` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `gdpr_security_incidents`
--

DROP TABLE IF EXISTS `gdpr_security_incidents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `gdpr_security_incidents` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `incident_number` varchar(50) NOT NULL,
  `incident_type` varchar(50) NOT NULL COMMENT 'VAZAMENTO, ACESSO_NAO_AUTORIZADO, RANSOMWARE, PERDA',
  `severity` varchar(20) NOT NULL COMMENT 'BAIXA, MEDIA, ALTA, CRITICA',
  `description` text NOT NULL,
  `discovery_date` timestamp NOT NULL,
  `estimated_occurrence_date` timestamp NULL DEFAULT NULL,
  `affected_subjects` int(11) DEFAULT NULL COMMENT 'Número de pessoas impactadas',
  `exposed_data_categories` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '["cpf", "email", "senha"]' CHECK (json_valid(`exposed_data_categories`)),
  `sensitive_data_exposed` tinyint(1) DEFAULT 0,
  `immediate_actions` text DEFAULT NULL,
  `corrective_actions` text DEFAULT NULL,
  `requires_anpd_notification` tinyint(1) DEFAULT 0,
  `anpd_notification_date` timestamp NULL DEFAULT NULL,
  `anpd_protocol` varchar(100) DEFAULT NULL,
  `subjects_notified` tinyint(1) DEFAULT 0,
  `subjects_notification_date` timestamp NULL DEFAULT NULL,
  `notification_channel` varchar(30) DEFAULT NULL COMMENT 'EMAIL, SMS, SITE',
  `status` varchar(30) DEFAULT 'ABERTO' COMMENT 'ABERTO, EM_INVESTIGACAO, RESOLVIDO, FECHADO',
  `resolution_date` timestamp NULL DEFAULT NULL,
  `detected_by` bigint(20) DEFAULT NULL,
  `investigation_responsible` bigint(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `incident_number` (`incident_number`),
  KEY `detected_by` (`detected_by`),
  KEY `investigation_responsible` (`investigation_responsible`),
  KEY `idx_number` (`incident_number`),
  KEY `idx_severity_status` (`severity`,`status`),
  KEY `idx_anpd_notification` (`requires_anpd_notification`,`anpd_notification_date`),
  CONSTRAINT `gdpr_security_incidents_ibfk_1` FOREIGN KEY (`detected_by`) REFERENCES `system_users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `gdpr_security_incidents_ibfk_2` FOREIGN KEY (`investigation_responsible`) REFERENCES `system_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Registro de incidentes de segurança (Art. 48º LGPD)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gdpr_security_incidents`
--

LOCK TABLES `gdpr_security_incidents` WRITE;
/*!40000 ALTER TABLE `gdpr_security_incidents` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `gdpr_security_incidents` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `iss_withholdings`
--

DROP TABLE IF EXISTS `iss_withholdings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `iss_withholdings` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cinema_complex_id` bigint(20) NOT NULL,
  `service_received_id` bigint(20) DEFAULT NULL,
  `service_description` varchar(200) DEFAULT NULL,
  `withholding_rate` decimal(5,2) NOT NULL,
  `withholding_amount` decimal(15,2) NOT NULL,
  `service_code` varchar(10) DEFAULT NULL,
  `withholding_date` date NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `cinema_complex_id` (`cinema_complex_id`),
  KEY `idx_date` (`withholding_date`),
  CONSTRAINT `iss_withholdings_ibfk_1` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `iss_withholdings`
--

LOCK TABLES `iss_withholdings` WRITE;
/*!40000 ALTER TABLE `iss_withholdings` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `iss_withholdings` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `journal_entries`
--

DROP TABLE IF EXISTS `journal_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `journal_entries` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cinema_complex_id` bigint(20) NOT NULL,
  `entry_number` varchar(50) NOT NULL,
  `entry_date` date NOT NULL,
  `entry_type` bigint(20) DEFAULT NULL,
  `origin_type` varchar(50) DEFAULT NULL,
  `origin_id` bigint(20) DEFAULT NULL,
  `description` text NOT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `status` bigint(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `entry_number` (`entry_number`),
  KEY `idx_date` (`entry_date`),
  KEY `idx_origin` (`origin_type`,`origin_id`),
  KEY `idx_complex_date` (`cinema_complex_id`,`entry_date`),
  KEY `idx_status` (`status`),
  KEY `fk_journal_entry_type` (`entry_type`),
  CONSTRAINT `fk_journal_entry_status` FOREIGN KEY (`status`) REFERENCES `journal_entry_status` (`id`),
  CONSTRAINT `fk_journal_entry_type` FOREIGN KEY (`entry_type`) REFERENCES `journal_entry_types` (`id`),
  CONSTRAINT `journal_entries_ibfk_1` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journal_entries`
--

LOCK TABLES `journal_entries` WRITE;
/*!40000 ALTER TABLE `journal_entries` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `journal_entries` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `journal_entry_items`
--

DROP TABLE IF EXISTS `journal_entry_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `journal_entry_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `journal_entry_id` bigint(20) NOT NULL,
  `account_id` bigint(20) NOT NULL,
  `movement_type` bigint(20) DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `item_description` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_journal_entry` (`journal_entry_id`),
  KEY `idx_account` (`account_id`),
  KEY `fk_journal_item_movement_type` (`movement_type`),
  CONSTRAINT `fk_journal_item_movement_type` FOREIGN KEY (`movement_type`) REFERENCES `accounting_movement_types` (`id`),
  CONSTRAINT `journal_entry_items_ibfk_1` FOREIGN KEY (`journal_entry_id`) REFERENCES `journal_entries` (`id`) ON DELETE CASCADE,
  CONSTRAINT `journal_entry_items_ibfk_2` FOREIGN KEY (`account_id`) REFERENCES `chart_of_accounts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journal_entry_items`
--

LOCK TABLES `journal_entry_items` WRITE;
/*!40000 ALTER TABLE `journal_entry_items` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `journal_entry_items` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `journal_entry_status`
--

DROP TABLE IF EXISTS `journal_entry_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `journal_entry_status` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `allows_modification` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journal_entry_status`
--

LOCK TABLES `journal_entry_status` WRITE;
/*!40000 ALTER TABLE `journal_entry_status` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `journal_entry_status` VALUES
(1,'Provisório','Lançamento provisório',1,1,'2025-10-11 20:42:10'),
(2,'Definitivo','Lançamento definitivo',0,2,'2025-10-11 20:42:10'),
(3,'Estornado','Lançamento estornado',0,3,'2025-10-11 20:42:10');
/*!40000 ALTER TABLE `journal_entry_status` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `journal_entry_types`
--

DROP TABLE IF EXISTS `journal_entry_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `journal_entry_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `nature` varchar(20) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journal_entry_types`
--

LOCK TABLES `journal_entry_types` WRITE;
/*!40000 ALTER TABLE `journal_entry_types` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `journal_entry_types` VALUES
(1,'Receita de Bilheteria','Lançamento de receita de bilheteria','RECEITA',1,'2025-10-11 20:42:10'),
(2,'Receita de Concessão','Lançamento de receita de concessão','RECEITA',2,'2025-10-11 20:42:10'),
(3,'Tributo ISS','Lançamento de ISS','DESPESA',3,'2025-10-11 20:42:10'),
(4,'Tributo PIS','Lançamento de PIS','DESPESA',4,'2025-10-11 20:42:10'),
(5,'Tributo COFINS','Lançamento de COFINS','DESPESA',5,'2025-10-11 20:42:10'),
(6,'Tributo IRPJ','Lançamento de IRPJ','DESPESA',6,'2025-10-11 20:42:10'),
(7,'Tributo CSLL','Lançamento de CSLL','DESPESA',7,'2025-10-11 20:42:10'),
(8,'Repasse Distribuidor','Lançamento de repasse','DESPESA',8,'2025-10-11 20:42:10'),
(9,'Custo de Concessão','Custo de mercadorias vendidas','CUSTO',9,'2025-10-11 20:42:10'),
(10,'Despesa Operacional','Despesas operacionais','DESPESA',10,'2025-10-11 20:42:10'),
(11,'Outros','Outros lançamentos','OUTROS',11,'2025-10-11 20:42:10');
/*!40000 ALTER TABLE `journal_entry_types` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `media_types`
--

DROP TABLE IF EXISTS `media_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_types`
--

LOCK TABLES `media_types` WRITE;
/*!40000 ALTER TABLE `media_types` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `media_types` VALUES
(1,'Trailer','Trailer oficial do filme',1,'2025-10-11 21:02:26'),
(2,'Pôster','Pôster oficial',2,'2025-10-11 21:02:26'),
(3,'Backdrop','Imagem de fundo',3,'2025-10-11 21:02:26'),
(4,'Foto de Cena','Foto das cenas do filme',4,'2025-10-11 21:02:26'),
(5,'Banner','Banner promocional',5,'2025-10-11 21:02:26'),
(6,'Logo','Logo oficial do filme',6,'2025-10-11 21:02:26');
/*!40000 ALTER TABLE `media_types` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `monthly_income_statement`
--

DROP TABLE IF EXISTS `monthly_income_statement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `monthly_income_statement` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cinema_complex_id` bigint(20) NOT NULL,
  `year` int(11) NOT NULL,
  `month` int(11) NOT NULL,
  `total_gross_revenue` decimal(15,2) DEFAULT 0.00,
  `sales_deductions` decimal(15,2) DEFAULT 0.00,
  `net_revenue` decimal(15,2) DEFAULT 0.00,
  `cost_of_goods_sold` decimal(15,2) DEFAULT 0.00,
  `distributor_payouts` decimal(15,2) DEFAULT 0.00,
  `gross_profit` decimal(15,2) DEFAULT 0.00,
  `administrative_expenses` decimal(15,2) DEFAULT 0.00,
  `selling_expenses` decimal(15,2) DEFAULT 0.00,
  `financial_expenses` decimal(15,2) DEFAULT 0.00,
  `financial_income` decimal(15,2) DEFAULT 0.00,
  `operational_result` decimal(15,2) DEFAULT 0.00,
  `irpj_provision` decimal(15,2) DEFAULT 0.00,
  `csll_provision` decimal(15,2) DEFAULT 0.00,
  `net_result` decimal(15,2) DEFAULT 0.00,
  `gross_margin_percent` decimal(5,2) DEFAULT NULL,
  `net_margin_percent` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_complex_period` (`cinema_complex_id`,`year`,`month`),
  KEY `idx_period` (`year`,`month`),
  CONSTRAINT `monthly_income_statement_ibfk_1` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monthly_income_statement`
--

LOCK TABLES `monthly_income_statement` WRITE;
/*!40000 ALTER TABLE `monthly_income_statement` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `monthly_income_statement` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `monthly_tax_settlement`
--

DROP TABLE IF EXISTS `monthly_tax_settlement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `monthly_tax_settlement` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cinema_complex_id` bigint(20) NOT NULL,
  `year` int(11) NOT NULL,
  `month` int(11) NOT NULL,
  `settlement_date` date NOT NULL,
  `tax_regime` varchar(50) DEFAULT NULL,
  `pis_cofins_regime` varchar(50) DEFAULT NULL,
  `gross_box_office_revenue` decimal(15,2) DEFAULT 0.00,
  `gross_concession_revenue` decimal(15,2) DEFAULT 0.00,
  `gross_advertising_revenue` decimal(15,2) DEFAULT 0.00,
  `gross_other_revenue` decimal(15,2) DEFAULT 0.00,
  `total_gross_revenue` decimal(15,2) DEFAULT 0.00,
  `total_deductions` decimal(15,2) DEFAULT 0.00,
  `calculation_base_revenue` decimal(15,2) DEFAULT 0.00,
  `total_iss_box_office` decimal(15,2) DEFAULT 0.00,
  `total_iss_concession` decimal(15,2) DEFAULT 0.00,
  `total_iss` decimal(15,2) DEFAULT 0.00,
  `total_pis_debit` decimal(15,2) DEFAULT 0.00,
  `total_pis_credit` decimal(15,2) DEFAULT 0.00,
  `total_pis_payable` decimal(15,2) DEFAULT 0.00,
  `total_cofins_debit` decimal(15,2) DEFAULT 0.00,
  `total_cofins_credit` decimal(15,2) DEFAULT 0.00,
  `total_cofins_payable` decimal(15,2) DEFAULT 0.00,
  `irpj_base` decimal(15,2) DEFAULT 0.00,
  `irpj_base_15` decimal(15,2) DEFAULT 0.00,
  `irpj_additional_10` decimal(15,2) DEFAULT 0.00,
  `total_irpj` decimal(15,2) DEFAULT 0.00,
  `csll_base` decimal(15,2) DEFAULT 0.00,
  `total_csll` decimal(15,2) DEFAULT 0.00,
  `gross_revenue_12m` decimal(15,2) DEFAULT NULL,
  `effective_simples_rate` decimal(5,2) DEFAULT NULL,
  `total_simples_amount` decimal(15,2) DEFAULT NULL,
  `total_distributor_payment` decimal(15,2) DEFAULT 0.00,
  `net_revenue_taxed` decimal(15,2) DEFAULT 0.00,
  `net_total_revenue` decimal(15,2) DEFAULT 0.00,
  `status` bigint(20) DEFAULT NULL,
  `declaration_date` date DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_complex_period` (`cinema_complex_id`,`year`,`month`),
  KEY `idx_period` (`year`,`month`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_settlement_status` FOREIGN KEY (`status`) REFERENCES `settlement_status` (`id`),
  CONSTRAINT `monthly_tax_settlement_ibfk_1` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monthly_tax_settlement`
--

LOCK TABLES `monthly_tax_settlement` WRITE;
/*!40000 ALTER TABLE `monthly_tax_settlement` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `monthly_tax_settlement` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `movie_cast`
--

DROP TABLE IF EXISTS `movie_cast`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `movie_cast` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `movie_id` bigint(20) NOT NULL,
  `artist_name` varchar(200) NOT NULL,
  `character_name` varchar(200) DEFAULT NULL,
  `cast_type` bigint(20) NOT NULL,
  `credit_order` int(11) DEFAULT 0,
  `photo_url` varchar(500) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `display_order` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_artist` (`artist_name`),
  KEY `idx_cast_type` (`cast_type`),
  KEY `idx_movie` (`movie_id`),
  CONSTRAINT `movie_cast_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `movie_cast_ibfk_2` FOREIGN KEY (`cast_type`) REFERENCES `cast_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movie_cast`
--

LOCK TABLES `movie_cast` WRITE;
/*!40000 ALTER TABLE `movie_cast` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `movie_cast` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `movie_categories`
--

DROP TABLE IF EXISTS `movie_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `movie_categories` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `minimum_age` int(11) DEFAULT 0,
  `slug` varchar(100) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_name` (`name`),
  KEY `idx_slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movie_categories`
--

LOCK TABLES `movie_categories` WRITE;
/*!40000 ALTER TABLE `movie_categories` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `movie_categories` VALUES
(1,'Ação','Filmes de ação e aventura',0,'acao',1,1,'2025-10-11 21:02:26'),
(2,'Comédia','Filmes de comédia',0,'comedia',2,1,'2025-10-11 21:02:26'),
(3,'Drama','Filmes dramáticos',0,'drama',3,1,'2025-10-11 21:02:26'),
(4,'Terror','Filmes de terror e suspense',0,'terror',4,1,'2025-10-11 21:02:26'),
(5,'Ficção Científica','Filmes de ficção científica',0,'ficcao-cientifica',5,1,'2025-10-11 21:02:26'),
(6,'Romance','Filmes românticos',0,'romance',6,1,'2025-10-11 21:02:26'),
(7,'Animação','Filmes de animação',0,'animacao',7,1,'2025-10-11 21:02:26'),
(8,'Documentário','Documentários',0,'documentario',8,1,'2025-10-11 21:02:26'),
(9,'Musical','Filmes musicais',0,'musical',9,1,'2025-10-11 21:02:26'),
(10,'Thriller','Filmes de suspense psicológico',0,'thriller',10,1,'2025-10-11 21:02:26');
/*!40000 ALTER TABLE `movie_categories` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `movie_media`
--

DROP TABLE IF EXISTS `movie_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `movie_media` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `movie_id` bigint(20) NOT NULL,
  `media_type` bigint(20) NOT NULL,
  `media_url` varchar(500) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `title` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `movie_media_ibfk_2` (`media_type`),
  KEY `idx_movie_media` (`movie_id`,`media_type`,`active`),
  CONSTRAINT `movie_media_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `movie_media_ibfk_2` FOREIGN KEY (`media_type`) REFERENCES `media_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movie_media`
--

LOCK TABLES `movie_media` WRITE;
/*!40000 ALTER TABLE `movie_media` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `movie_media` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `movies`
--

DROP TABLE IF EXISTS `movies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `movies` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `original_title` varchar(300) NOT NULL,
  `brazil_title` varchar(300) DEFAULT NULL,
  `ancine_number` varchar(50) DEFAULT NULL,
  `duration_minutes` int(11) NOT NULL,
  `age_rating` bigint(20) DEFAULT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `country_of_origin` varchar(50) DEFAULT NULL,
  `production_year` int(11) DEFAULT NULL,
  `national` tinyint(1) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `category_id` bigint(20) DEFAULT NULL,
  `synopsis` text DEFAULT NULL,
  `short_synopsis` varchar(500) DEFAULT NULL,
  `budget` decimal(15,2) DEFAULT NULL,
  `worldwide_box_office` decimal(15,2) DEFAULT NULL,
  `website` varchar(200) DEFAULT NULL,
  `tmdb_id` varchar(50) DEFAULT NULL COMMENT 'The Movie Database ID',
  `imdb_id` varchar(20) DEFAULT NULL COMMENT 'IMDB ID',
  `tags_json` longtext DEFAULT NULL COMMENT 'Tags e palavras-chave' CHECK (json_valid(`tags_json`)),
  `worldwide_release_date` date DEFAULT NULL,
  `original_language` varchar(50) DEFAULT NULL,
  `slug` varchar(200) DEFAULT NULL,
  `distributor_id` bigint(20) NOT NULL COMMENT 'ID do fornecedor distribuidor',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `fk_movie_age_rating` (`age_rating`),
  KEY `fk_movie_category` (`category_id`),
  KEY `idx_movies_distributor` (`distributor_id`,`active`),
  KEY `idx_national` (`national`),
  KEY `idx_supplier_distributor` (`distributor_id`),
  CONSTRAINT `fk_movie_age_rating` FOREIGN KEY (`age_rating`) REFERENCES `age_ratings` (`id`),
  CONSTRAINT `fk_movie_category` FOREIGN KEY (`category_id`) REFERENCES `movie_categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_movie_supplier` FOREIGN KEY (`distributor_id`) REFERENCES `suppliers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movies`
--

LOCK TABLES `movies` WRITE;
/*!40000 ALTER TABLE `movies` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `movies` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `municipal_tax_parameters`
--

DROP TABLE IF EXISTS `municipal_tax_parameters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `municipal_tax_parameters` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ibge_municipality_code` varchar(7) NOT NULL,
  `municipality_name` varchar(100) NOT NULL,
  `state` char(2) NOT NULL,
  `iss_rate` decimal(5,2) NOT NULL,
  `iss_service_code` varchar(10) DEFAULT NULL,
  `iss_concession_applicable` tinyint(1) DEFAULT 0,
  `iss_concession_service_code` varchar(10) DEFAULT NULL,
  `iss_withholding` tinyint(1) DEFAULT 0,
  `validity_start` date NOT NULL,
  `validity_end` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_municipality_validity` (`ibge_municipality_code`,`validity_start`,`validity_end`),
  KEY `idx_ibge_code` (`ibge_municipality_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `municipal_tax_parameters`
--

LOCK TABLES `municipal_tax_parameters` WRITE;
/*!40000 ALTER TABLE `municipal_tax_parameters` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `municipal_tax_parameters` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `obligation_status`
--

DROP TABLE IF EXISTS `obligation_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `obligation_status` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `obligation_status`
--

LOCK TABLES `obligation_status` WRITE;
/*!40000 ALTER TABLE `obligation_status` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `obligation_status` VALUES
(1,'Pendente','Obrigação pendente',1,'2025-10-11 20:42:10'),
(2,'Entregue','Obrigação entregue',2,'2025-10-11 20:42:10'),
(3,'Atrasada','Obrigação atrasada',3,'2025-10-11 20:42:10');
/*!40000 ALTER TABLE `obligation_status` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `order_status`
--

DROP TABLE IF EXISTS `order_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_status` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `allows_modification` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_status`
--

LOCK TABLES `order_status` WRITE;
/*!40000 ALTER TABLE `order_status` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `order_status` VALUES
(1,'Rascunho','Pedido em elaboração',1,1,'2025-10-11 21:07:49'),
(2,'Pendente','Aguardando aprovação',1,2,'2025-10-11 21:07:49'),
(3,'Aprovado','Pedido aprovado',1,3,'2025-10-11 21:07:49'),
(4,'Enviado','Pedido enviado ao fornecedor',0,4,'2025-10-11 21:07:49'),
(5,'Recebido','Mercadoria recebida',0,5,'2025-10-11 21:07:49'),
(6,'Recebimento Parcial','Recebido parcialmente',1,6,'2025-10-11 21:07:49'),
(7,'Cancelado','Pedido cancelado',0,7,'2025-10-11 21:07:49');
/*!40000 ALTER TABLE `order_status` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `password_policies`
--

DROP TABLE IF EXISTS `password_policies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_policies` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `min_length` int(11) DEFAULT 8,
  `require_uppercase` tinyint(1) DEFAULT 1,
  `require_lowercase` tinyint(1) DEFAULT 1,
  `require_number` tinyint(1) DEFAULT 1,
  `require_special` tinyint(1) DEFAULT 1,
  `allowed_special_chars` varchar(50) DEFAULT '!@#$%^&*()_+-=[]{}|;:,.<>?',
  `prohibit_sequences` tinyint(1) DEFAULT 1 COMMENT 'Ex: 123456, abcdef',
  `prohibit_repetitions` tinyint(1) DEFAULT 1 COMMENT 'Ex: 111111, aaaaaa',
  `prohibit_personal_data` tinyint(1) DEFAULT 1 COMMENT 'Nome, CPF, data nasc.',
  `password_history_count` int(11) DEFAULT 5 COMMENT 'Número de senhas antigas que não podem ser reusadas',
  `password_validity_days` int(11) DEFAULT 90 COMMENT 'Senha expira e força troca',
  `expiration_warning_days` int(11) DEFAULT 7,
  `max_login_attempts` int(11) DEFAULT 5,
  `block_time_minutes` int(11) DEFAULT 30,
  `application_level` varchar(30) DEFAULT 'TODOS' COMMENT 'TODOS, ADMINISTRATIVO, OPERACIONAL',
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Políticas de senha configuráveis';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_policies`
--

LOCK TABLES `password_policies` WRITE;
/*!40000 ALTER TABLE `password_policies` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `password_policies` VALUES
(1,'Política Padrão','Política de senha padrão para todos os usuários',8,1,1,1,1,'!@#$%^&*()_+-=[]{}|;:,.<>?',1,1,1,5,90,7,5,30,'TODOS',1,'2025-10-11 22:22:25');
/*!40000 ALTER TABLE `password_policies` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_methods` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `operator_fee` decimal(5,2) DEFAULT 0.00,
  `settlement_days` int(11) DEFAULT 0,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `payment_methods` VALUES
(1,'Dinheiro','Pagamento em espécie',0.00,0,1,'2025-10-11 20:42:10'),
(2,'Cartão de Débito','Cartão de débito',1.00,2,2,'2025-10-11 20:42:10'),
(3,'Cartão de Crédito','Cartão de crédito',2.50,30,3,'2025-10-11 20:42:10'),
(4,'PIX','Transferência PIX',0.00,0,4,'2025-10-11 20:42:10'),
(5,'Voucher','Voucher/Cupom',0.00,0,5,'2025-10-11 20:42:10');
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `periodicities`
--

DROP TABLE IF EXISTS `periodicities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `periodicities` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `months` int(11) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `periodicities`
--

LOCK TABLES `periodicities` WRITE;
/*!40000 ALTER TABLE `periodicities` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `periodicities` VALUES
(1,'Mensal','Periodicidade mensal',1,1,'2025-10-11 20:42:10'),
(2,'Trimestral','Periodicidade trimestral',3,2,'2025-10-11 20:42:10'),
(3,'Anual','Periodicidade anual',12,3,'2025-10-11 20:42:10');
/*!40000 ALTER TABLE `periodicities` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `module_id` bigint(20) NOT NULL,
  `code` varchar(50) NOT NULL COMMENT 'VENDA_CREATE, RELATORIO_READ',
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `action` varchar(20) DEFAULT NULL COMMENT 'CREATE, READ, UPDATE, DELETE',
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_module` (`module_id`),
  KEY `idx_code` (`code`),
  CONSTRAINT `permissions_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `system_modules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `pis_cofins_credits`
--

DROP TABLE IF EXISTS `pis_cofins_credits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `pis_cofins_credits` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cinema_complex_id` bigint(20) NOT NULL,
  `credit_type` bigint(20) DEFAULT NULL,
  `description` text NOT NULL,
  `fiscal_document` varchar(50) DEFAULT NULL,
  `document_date` date NOT NULL,
  `competence_date` date NOT NULL,
  `base_amount` decimal(15,2) NOT NULL,
  `pis_credit_rate` decimal(5,2) NOT NULL,
  `pis_credit_amount` decimal(15,2) NOT NULL,
  `cofins_credit_rate` decimal(5,2) NOT NULL,
  `cofins_credit_amount` decimal(15,2) NOT NULL,
  `processed` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_competence_date` (`competence_date`),
  KEY `idx_processed` (`processed`),
  KEY `idx_complex_competence` (`cinema_complex_id`,`competence_date`),
  KEY `idx_credits_competence` (`competence_date`,`processed`),
  KEY `fk_credit_type` (`credit_type`),
  CONSTRAINT `fk_credit_type` FOREIGN KEY (`credit_type`) REFERENCES `credit_types` (`id`),
  CONSTRAINT `pis_cofins_credits_ibfk_1` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pis_cofins_credits`
--

LOCK TABLES `pis_cofins_credits` WRITE;
/*!40000 ALTER TABLE `pis_cofins_credits` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `pis_cofins_credits` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `pis_cofins_regimes`
--

DROP TABLE IF EXISTS `pis_cofins_regimes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `pis_cofins_regimes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `allows_credit` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pis_cofins_regimes`
--

LOCK TABLES `pis_cofins_regimes` WRITE;
/*!40000 ALTER TABLE `pis_cofins_regimes` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `pis_cofins_regimes` VALUES
(1,'Cumulativo','Regime cumulativo - sem direito a crédito',0,'2025-10-11 20:38:32'),
(2,'Não Cumulativo','Regime não-cumulativo - com direito a crédito',1,'2025-10-11 20:38:32');
/*!40000 ALTER TABLE `pis_cofins_regimes` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `positions`
--

DROP TABLE IF EXISTS `positions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `positions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `department_id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `base_salary` decimal(10,2) DEFAULT NULL,
  `weekly_hours` int(11) DEFAULT 44,
  `access_level` bigint(20) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `access_level` (`access_level`),
  KEY `idx_department` (`department_id`),
  CONSTRAINT `positions_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `positions_ibfk_2` FOREIGN KEY (`access_level`) REFERENCES `access_levels` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `positions`
--

LOCK TABLES `positions` WRITE;
/*!40000 ALTER TABLE `positions` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `positions` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `product_categories`
--

DROP TABLE IF EXISTS `product_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_categories` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(20) NOT NULL,
  `description` text DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_categories`
--

LOCK TABLES `product_categories` WRITE;
/*!40000 ALTER TABLE `product_categories` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `product_categories` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `product_stock`
--

DROP TABLE IF EXISTS `product_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_stock` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) NOT NULL,
  `complex_id` bigint(20) NOT NULL,
  `current_quantity` int(11) DEFAULT 0,
  `minimum_quantity` int(11) DEFAULT 10,
  `maximum_quantity` int(11) DEFAULT 100,
  `location` varchar(100) DEFAULT NULL COMMENT 'Prateleira A, Corredor 2',
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_product_complex` (`product_id`,`complex_id`),
  KEY `idx_complex` (`complex_id`),
  KEY `idx_quantity` (`current_quantity`),
  KEY `idx_minimum_alert` (`current_quantity`,`minimum_quantity`),
  CONSTRAINT `product_stock_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_stock_ibfk_2` FOREIGN KEY (`complex_id`) REFERENCES `cinema_complexes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_stock`
--

LOCK TABLES `product_stock` WRITE;
/*!40000 ALTER TABLE `product_stock` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `product_stock` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `category_id` bigint(20) NOT NULL,
  `product_code` varchar(50) NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `ncm_code` varchar(10) DEFAULT NULL,
  `unit` varchar(10) DEFAULT 'UN',
  `sale_price` decimal(10,2) NOT NULL,
  `cost_price` decimal(10,2) NOT NULL,
  `minimum_stock` int(11) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_code` (`product_code`),
  KEY `idx_category` (`category_id`),
  KEY `idx_product_code` (`product_code`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `profile_permissions`
--

DROP TABLE IF EXISTS `profile_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `profile_permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `profile_id` bigint(20) NOT NULL,
  `routine_code` int(11) NOT NULL,
  `operation` enum('CREATE','READ','UPDATE','DELETE','EXECUTE') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_profile_routine_operation` (`profile_id`,`routine_code`,`operation`),
  KEY `routine_code` (`routine_code`),
  KEY `idx_profile_routine` (`profile_id`,`routine_code`),
  CONSTRAINT `profile_permissions_ibfk_1` FOREIGN KEY (`profile_id`) REFERENCES `access_profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `profile_permissions_ibfk_2` FOREIGN KEY (`routine_code`) REFERENCES `system_routines` (`code`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=309 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Permissões associadas a cada perfil';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile_permissions`
--

LOCK TABLES `profile_permissions` WRITE;
/*!40000 ALTER TABLE `profile_permissions` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `profile_permissions` VALUES
(1,1,100,'CREATE'),
(2,1,100,'READ'),
(3,1,100,'UPDATE'),
(4,1,100,'DELETE'),
(5,1,101,'EXECUTE'),
(6,1,102,'EXECUTE'),
(7,1,103,'CREATE'),
(8,1,103,'READ'),
(9,1,104,'READ'),
(10,1,105,'DELETE'),
(11,1,200,'READ'),
(12,1,201,'DELETE'),
(13,1,202,'CREATE'),
(14,1,202,'READ'),
(15,1,202,'UPDATE'),
(16,1,202,'DELETE'),
(17,1,203,'READ'),
(18,1,204,'EXECUTE'),
(19,1,205,'CREATE'),
(20,1,205,'READ'),
(21,1,205,'UPDATE'),
(22,1,205,'DELETE'),
(23,1,206,'CREATE'),
(24,1,206,'READ'),
(25,1,206,'UPDATE'),
(26,1,206,'DELETE'),
(27,1,207,'CREATE'),
(28,1,207,'READ'),
(29,1,207,'UPDATE'),
(30,1,207,'DELETE'),
(31,1,300,'READ'),
(32,1,301,'CREATE'),
(33,1,301,'READ'),
(34,1,302,'CREATE'),
(35,1,302,'READ'),
(36,1,303,'CREATE'),
(37,1,303,'READ'),
(38,1,304,'EXECUTE'),
(39,1,305,'CREATE'),
(40,1,305,'READ'),
(41,1,305,'UPDATE'),
(42,1,305,'DELETE'),
(43,1,306,'CREATE'),
(44,1,306,'READ'),
(45,1,306,'UPDATE'),
(46,1,306,'DELETE'),
(47,1,307,'READ'),
(48,1,400,'CREATE'),
(49,1,400,'READ'),
(50,1,400,'UPDATE'),
(51,1,400,'DELETE'),
(52,1,401,'EXECUTE'),
(53,1,402,'CREATE'),
(54,1,402,'READ'),
(55,1,402,'UPDATE'),
(56,1,402,'DELETE'),
(57,1,403,'CREATE'),
(58,1,403,'READ'),
(59,1,404,'EXECUTE'),
(60,1,500,'READ'),
(61,1,501,'CREATE'),
(62,1,501,'READ'),
(63,1,501,'UPDATE'),
(64,1,501,'DELETE'),
(65,1,502,'CREATE'),
(66,1,502,'READ'),
(67,1,502,'UPDATE'),
(68,1,502,'DELETE'),
(69,1,503,'READ'),
(70,1,504,'READ'),
(71,1,505,'CREATE'),
(72,1,505,'READ'),
(73,1,505,'UPDATE'),
(74,1,505,'DELETE'),
(75,1,506,'CREATE'),
(76,1,506,'READ'),
(77,1,506,'UPDATE'),
(78,1,506,'DELETE'),
(79,1,600,'CREATE'),
(80,1,600,'READ'),
(81,1,600,'UPDATE'),
(82,1,600,'DELETE'),
(83,1,601,'EXECUTE'),
(84,1,602,'READ'),
(85,1,603,'CREATE'),
(86,1,603,'READ'),
(87,1,603,'UPDATE'),
(88,1,604,'CREATE'),
(89,1,604,'READ'),
(90,1,604,'UPDATE'),
(91,1,604,'DELETE'),
(92,1,605,'CREATE'),
(93,1,605,'READ'),
(94,1,605,'UPDATE'),
(95,1,605,'DELETE'),
(96,1,700,'READ'),
(97,1,700,'EXECUTE'),
(98,1,701,'CREATE'),
(99,1,701,'READ'),
(100,1,701,'UPDATE'),
(101,1,701,'DELETE'),
(102,1,702,'READ'),
(103,1,703,'READ'),
(104,1,703,'UPDATE'),
(105,1,704,'CREATE'),
(106,1,704,'READ'),
(107,1,704,'UPDATE'),
(108,1,800,'CREATE'),
(109,1,800,'READ'),
(110,1,800,'UPDATE'),
(111,1,800,'DELETE'),
(112,1,801,'CREATE'),
(113,1,801,'READ'),
(114,1,801,'UPDATE'),
(115,1,801,'DELETE'),
(116,1,802,'CREATE'),
(117,1,802,'READ'),
(118,1,802,'UPDATE'),
(119,1,802,'DELETE'),
(120,1,803,'CREATE'),
(121,1,803,'READ'),
(122,1,803,'UPDATE'),
(123,1,804,'CREATE'),
(124,1,804,'READ'),
(125,1,804,'UPDATE'),
(126,1,804,'DELETE'),
(127,1,805,'CREATE'),
(128,1,805,'READ'),
(129,1,805,'UPDATE'),
(130,1,805,'DELETE'),
(131,1,806,'READ'),
(132,1,806,'EXECUTE'),
(133,1,900,'READ'),
(134,1,900,'UPDATE'),
(135,1,901,'CREATE'),
(136,1,901,'READ'),
(137,1,901,'UPDATE'),
(138,1,901,'DELETE'),
(139,1,902,'CREATE'),
(140,1,902,'READ'),
(141,1,902,'UPDATE'),
(142,1,902,'DELETE'),
(143,1,903,'CREATE'),
(144,1,903,'READ'),
(145,1,903,'UPDATE'),
(146,1,903,'DELETE'),
(147,1,904,'CREATE'),
(148,1,904,'READ'),
(149,1,904,'UPDATE'),
(150,1,905,'CREATE'),
(151,1,905,'READ'),
(152,1,905,'UPDATE'),
(153,1,905,'DELETE'),
(154,1,906,'READ'),
(155,1,907,'EXECUTE'),
(256,4,100,'CREATE'),
(257,4,100,'READ'),
(258,4,104,'READ'),
(259,4,200,'READ'),
(260,4,205,'CREATE'),
(261,4,205,'READ'),
(262,4,206,'CREATE'),
(263,4,206,'READ'),
(264,4,300,'READ'),
(271,5,300,'READ'),
(272,5,301,'CREATE'),
(273,5,301,'READ'),
(274,5,302,'CREATE'),
(275,5,302,'READ'),
(276,5,303,'CREATE'),
(277,5,303,'READ'),
(278,5,304,'EXECUTE'),
(279,5,305,'CREATE'),
(280,5,305,'READ'),
(281,5,305,'UPDATE'),
(282,5,305,'DELETE'),
(283,5,306,'CREATE'),
(284,5,306,'READ'),
(285,5,306,'UPDATE'),
(286,5,306,'DELETE'),
(287,5,307,'READ'),
(302,6,100,'CREATE'),
(303,6,100,'READ'),
(304,6,200,'READ'),
(305,6,206,'CREATE'),
(306,6,206,'READ'),
(307,6,801,'CREATE'),
(308,6,801,'READ');
/*!40000 ALTER TABLE `profile_permissions` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `projection_types`
--

DROP TABLE IF EXISTS `projection_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `projection_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `additional_value` decimal(10,2) DEFAULT 0.00,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projection_types`
--

LOCK TABLES `projection_types` WRITE;
/*!40000 ALTER TABLE `projection_types` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `projection_types` VALUES
(1,'2D Digital','Projeção digital 2D',0.00,1,'2025-10-11 20:42:10'),
(2,'3D Digital','Projeção digital 3D',8.00,2,'2025-10-11 20:42:10'),
(3,'IMAX','Sistema IMAX',15.00,3,'2025-10-11 20:42:10'),
(4,'4DX','Experiência 4DX',25.00,4,'2025-10-11 20:42:10'),
(5,'D-BOX','Cadeiras D-BOX',12.00,5,'2025-10-11 20:42:10'),
(6,'VIP','Sessão VIP',20.00,6,'2025-10-11 20:42:10'),
(7,'Tradicional','Sala tradicional padrão',0.00,7,'2025-10-11 20:53:25');
/*!40000 ALTER TABLE `projection_types` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `promotion_types`
--

DROP TABLE IF EXISTS `promotion_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(30) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `order_index` int(11) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Available promotion types';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion_types`
--

LOCK TABLES `promotion_types` WRITE;
/*!40000 ALTER TABLE `promotion_types` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `promotion_types` VALUES
(1,'PERCENTAGE_DISCOUNT','Percentage Discount','Ex: 20% discount',1,1,'2025-10-11 21:54:24'),
(2,'VALUE_DISCOUNT','Value Discount','Ex: $10.00 discount',2,1,'2025-10-11 21:54:24'),
(3,'COMBO_PRICE','Special Price Combo','Ex: 2 tickets + popcorn for $50',3,1,'2025-10-11 21:54:24'),
(4,'BUY_X_GET_Y','Buy X Get Y','Ex: Buy 2 get 1 free',4,1,'2025-10-11 21:54:24'),
(5,'FREE_GIFT','Free Gift','Ex: Get 1 free popcorn',5,1,'2025-10-11 21:54:24'),
(6,'NO_FEES','No Convenience Fee','Waived fee for online purchase',6,1,'2025-10-11 21:54:24'),
(7,'DOUBLE_POINTS','Double Points','Double loyalty points',7,1,'2025-10-11 21:54:24'),
(8,'FIXED_PRICE_TICKET','Fixed Price Ticket','Ex: Ticket for $10',8,1,'2025-10-11 21:54:24');
/*!40000 ALTER TABLE `promotion_types` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `promotion_types_domain`
--

DROP TABLE IF EXISTS `promotion_types_domain`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion_types_domain` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(30) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `order_index` int(11) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Domain table for promotion types';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion_types_domain`
--

LOCK TABLES `promotion_types_domain` WRITE;
/*!40000 ALTER TABLE `promotion_types_domain` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `promotion_types_domain` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `promotional_campaigns`
--

DROP TABLE IF EXISTS `promotional_campaigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotional_campaigns` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `campaign_code` varchar(50) NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `promotion_type_id` bigint(20) NOT NULL,
  `start_date` timestamp NOT NULL,
  `end_date` timestamp NOT NULL,
  `start_time` time DEFAULT NULL COMMENT 'Ex: promotion valid after 6 PM',
  `end_time` time DEFAULT NULL,
  `min_age` int(11) DEFAULT NULL,
  `max_age` int(11) DEFAULT NULL,
  `min_loyalty_level` varchar(20) DEFAULT NULL,
  `new_customers_only` tinyint(1) DEFAULT 0,
  `discount_value` decimal(10,2) DEFAULT NULL COMMENT 'Fixed value or percentage',
  `discount_percentage` decimal(5,2) DEFAULT NULL,
  `buy_quantity` int(11) DEFAULT NULL COMMENT 'For BUY_X_GET_Y type',
  `get_quantity` int(11) DEFAULT NULL,
  `fixed_price` decimal(10,2) DEFAULT NULL COMMENT 'For FIXED_PRICE_TICKET',
  `points_multiplier` decimal(5,2) DEFAULT 1.00,
  `max_total_uses` int(11) DEFAULT NULL COMMENT 'Total campaign uses',
  `used_count` int(11) DEFAULT 0,
  `max_uses_per_customer` int(11) DEFAULT NULL COMMENT 'Uses per customer',
  `min_purchase_value` decimal(10,2) DEFAULT NULL,
  `combinable` tinyint(1) DEFAULT 0,
  `priority` int(11) DEFAULT 0 COMMENT 'Higher priority = applied first',
  `active` tinyint(1) DEFAULT 1,
  `requires_coupon` tinyint(1) DEFAULT 0 COMMENT 'If TRUE, needs coupon',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `campaign_code` (`campaign_code`),
  KEY `idx_validity` (`start_date`,`end_date`,`active`),
  KEY `idx_code` (`campaign_code`),
  KEY `idx_type` (`promotion_type_id`),
  KEY `idx_campaigns_validity_active` (`start_date`,`end_date`,`active`),
  CONSTRAINT `promotional_campaigns_ibfk_1` FOREIGN KEY (`promotion_type_id`) REFERENCES `promotion_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Cinema promotional campaigns';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotional_campaigns`
--

LOCK TABLES `promotional_campaigns` WRITE;
/*!40000 ALTER TABLE `promotional_campaigns` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `promotional_campaigns` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `promotional_coupons`
--

DROP TABLE IF EXISTS `promotional_coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotional_coupons` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `campaign_id` bigint(20) NOT NULL,
  `coupon_code` varchar(50) NOT NULL,
  `customer_id` bigint(20) DEFAULT NULL COMMENT 'NULL = generic coupon',
  `start_date` timestamp NOT NULL,
  `end_date` timestamp NOT NULL,
  `max_uses` int(11) DEFAULT 1,
  `used_count` int(11) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1,
  `used` tinyint(1) DEFAULT 0,
  `first_use_date` timestamp NULL DEFAULT NULL,
  `last_use_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `coupon_code` (`coupon_code`),
  KEY `idx_code` (`coupon_code`),
  KEY `idx_campaign` (`campaign_id`),
  KEY `idx_customer` (`customer_id`),
  KEY `idx_validity` (`start_date`,`end_date`,`active`),
  CONSTRAINT `promotional_coupons_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `promotional_campaigns` (`id`) ON DELETE CASCADE,
  CONSTRAINT `promotional_coupons_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Individual coupons linked to campaigns';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotional_coupons`
--

LOCK TABLES `promotional_coupons` WRITE;
/*!40000 ALTER TABLE `promotional_coupons` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `promotional_coupons` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `promotions_used`
--

DROP TABLE IF EXISTS `promotions_used`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotions_used` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `sale_id` bigint(20) NOT NULL,
  `campaign_id` bigint(20) NOT NULL,
  `coupon_id` bigint(20) DEFAULT NULL,
  `customer_id` bigint(20) DEFAULT NULL,
  `promotion_type_id` bigint(20) NOT NULL,
  `discount_applied` decimal(10,2) NOT NULL,
  `original_value` decimal(10,2) NOT NULL,
  `final_value` decimal(10,2) NOT NULL,
  `points_earned` int(11) DEFAULT 0,
  `usage_date` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `coupon_id` (`coupon_id`),
  KEY `promotion_type_id` (`promotion_type_id`),
  KEY `idx_sale` (`sale_id`),
  KEY `idx_campaign` (`campaign_id`),
  KEY `idx_customer` (`customer_id`),
  KEY `idx_usage_date` (`usage_date`),
  CONSTRAINT `promotions_used_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE,
  CONSTRAINT `promotions_used_ibfk_2` FOREIGN KEY (`campaign_id`) REFERENCES `promotional_campaigns` (`id`),
  CONSTRAINT `promotions_used_ibfk_3` FOREIGN KEY (`coupon_id`) REFERENCES `promotional_coupons` (`id`) ON DELETE SET NULL,
  CONSTRAINT `promotions_used_ibfk_4` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `promotions_used_ibfk_5` FOREIGN KEY (`promotion_type_id`) REFERENCES `promotion_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Registro de uso de promoções';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotions_used`
--

LOCK TABLES `promotions_used` WRITE;
/*!40000 ALTER TABLE `promotions_used` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `promotions_used` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `recine_acquisition_types`
--

DROP TABLE IF EXISTS `recine_acquisition_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `recine_acquisition_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recine_acquisition_types`
--

LOCK TABLES `recine_acquisition_types` WRITE;
/*!40000 ALTER TABLE `recine_acquisition_types` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `recine_acquisition_types` VALUES
(1,'Importação','Equipamento importado',1,'2025-10-11 20:42:10'),
(2,'Mercado Interno','Compra no mercado interno',2,'2025-10-11 20:42:10');
/*!40000 ALTER TABLE `recine_acquisition_types` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `recine_acquisitions`
--

DROP TABLE IF EXISTS `recine_acquisitions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `recine_acquisitions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `recine_project_id` bigint(20) NOT NULL,
  `acquisition_type` bigint(20) DEFAULT NULL,
  `item_type` bigint(20) DEFAULT NULL,
  `item_description` text NOT NULL,
  `supplier` varchar(200) DEFAULT NULL,
  `invoice_number` varchar(50) DEFAULT NULL,
  `acquisition_date` date NOT NULL,
  `item_value` decimal(15,2) NOT NULL,
  `pis_cofins_saved` decimal(15,2) DEFAULT 0.00,
  `ipi_saved` decimal(15,2) DEFAULT 0.00,
  `ii_saved` decimal(15,2) DEFAULT 0.00,
  `total_benefit_value` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_project` (`recine_project_id`),
  KEY `idx_date` (`acquisition_date`),
  KEY `fk_recine_acquisition_type` (`acquisition_type`),
  KEY `fk_recine_acquisition_item_type` (`item_type`),
  CONSTRAINT `fk_recine_acquisition_item_type` FOREIGN KEY (`item_type`) REFERENCES `recine_item_types` (`id`),
  CONSTRAINT `fk_recine_acquisition_type` FOREIGN KEY (`acquisition_type`) REFERENCES `recine_acquisition_types` (`id`),
  CONSTRAINT `recine_acquisitions_ibfk_1` FOREIGN KEY (`recine_project_id`) REFERENCES `recine_projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recine_acquisitions`
--

LOCK TABLES `recine_acquisitions` WRITE;
/*!40000 ALTER TABLE `recine_acquisitions` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `recine_acquisitions` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `recine_deadline_types`
--

DROP TABLE IF EXISTS `recine_deadline_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `recine_deadline_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recine_deadline_types`
--

LOCK TABLES `recine_deadline_types` WRITE;
/*!40000 ALTER TABLE `recine_deadline_types` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `recine_deadline_types` VALUES
(1,'Importação','Prazo de importação',1,'2025-10-11 20:42:10'),
(2,'Instalação','Prazo de instalação',2,'2025-10-11 20:42:10'),
(3,'Documentação','Prazo de documentação',3,'2025-10-11 20:42:10');
/*!40000 ALTER TABLE `recine_deadline_types` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `recine_deadlines`
--

DROP TABLE IF EXISTS `recine_deadlines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `recine_deadlines` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) NOT NULL,
  `deadline_type` bigint(20) DEFAULT NULL,
  `due_date` date NOT NULL,
  `completion_date` date DEFAULT NULL,
  `estimated_penalty` decimal(15,2) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_project` (`project_id`),
  KEY `idx_due_date` (`due_date`),
  KEY `fk_recine_deadline_type` (`deadline_type`),
  CONSTRAINT `fk_recine_deadline_type` FOREIGN KEY (`deadline_type`) REFERENCES `recine_deadline_types` (`id`),
  CONSTRAINT `recine_deadlines_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `recine_projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recine_deadlines`
--

LOCK TABLES `recine_deadlines` WRITE;
/*!40000 ALTER TABLE `recine_deadlines` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `recine_deadlines` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `recine_item_types`
--

DROP TABLE IF EXISTS `recine_item_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `recine_item_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recine_item_types`
--

LOCK TABLES `recine_item_types` WRITE;
/*!40000 ALTER TABLE `recine_item_types` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `recine_item_types` VALUES
(1,'Projeção','Equipamentos de projeção',1,'2025-10-11 20:42:10'),
(2,'Áudio','Equipamentos de áudio',2,'2025-10-11 20:42:10'),
(3,'Poltronas','Poltronas e assentos',3,'2025-10-11 20:42:10'),
(4,'Climatização','Sistema de climatização',4,'2025-10-11 20:42:10'),
(5,'Outros','Outros equipamentos',5,'2025-10-11 20:42:10');
/*!40000 ALTER TABLE `recine_item_types` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `recine_project_status`
--

DROP TABLE IF EXISTS `recine_project_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `recine_project_status` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `allows_modification` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recine_project_status`
--

LOCK TABLES `recine_project_status` WRITE;
/*!40000 ALTER TABLE `recine_project_status` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `recine_project_status` VALUES
(1,'Planejamento','Projeto em fase de planejamento',1,1,'2025-10-11 20:42:10'),
(2,'Aprovado ANCINE','Aprovado pela ANCINE',1,2,'2025-10-11 20:42:10'),
(3,'Em Execução','Projeto em execução',1,3,'2025-10-11 20:42:10'),
(4,'Concluído','Projeto concluído',0,4,'2025-10-11 20:42:10'),
(5,'Cancelado','Projeto cancelado',0,5,'2025-10-11 20:42:10');
/*!40000 ALTER TABLE `recine_project_status` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `recine_project_types`
--

DROP TABLE IF EXISTS `recine_project_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `recine_project_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recine_project_types`
--

LOCK TABLES `recine_project_types` WRITE;
/*!40000 ALTER TABLE `recine_project_types` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `recine_project_types` VALUES
(1,'Implantação','Implantação de novo complexo',1,'2025-10-11 20:42:10'),
(2,'Modernização','Modernização de complexo existente',2,'2025-10-11 20:42:10'),
(3,'Reforma','Reforma e adequação',3,'2025-10-11 20:42:10');
/*!40000 ALTER TABLE `recine_project_types` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `recine_projects`
--

DROP TABLE IF EXISTS `recine_projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `recine_projects` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cinema_complex_id` bigint(20) NOT NULL,
  `project_number` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `project_type` bigint(20) DEFAULT NULL,
  `total_project_value` decimal(15,2) NOT NULL,
  `estimated_benefit_value` decimal(15,2) NOT NULL,
  `pis_cofins_suspended` decimal(15,2) DEFAULT 0.00,
  `ipi_exempt` decimal(15,2) DEFAULT 0.00,
  `ii_exempt` decimal(15,2) DEFAULT 0.00,
  `start_date` date NOT NULL,
  `expected_completion_date` date NOT NULL,
  `actual_completion_date` date DEFAULT NULL,
  `status` bigint(20) DEFAULT NULL,
  `ancine_process_number` varchar(50) DEFAULT NULL,
  `ancine_approval_date` date DEFAULT NULL,
  `observations` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_number` (`project_number`),
  KEY `idx_complex` (`cinema_complex_id`),
  KEY `idx_status` (`status`),
  KEY `fk_recine_project_type` (`project_type`),
  CONSTRAINT `fk_recine_project_status` FOREIGN KEY (`status`) REFERENCES `recine_project_status` (`id`),
  CONSTRAINT `fk_recine_project_type` FOREIGN KEY (`project_type`) REFERENCES `recine_project_types` (`id`),
  CONSTRAINT `recine_projects_ibfk_1` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recine_projects`
--

LOCK TABLES `recine_projects` WRITE;
/*!40000 ALTER TABLE `recine_projects` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `recine_projects` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `revenue_types`
--

DROP TABLE IF EXISTS `revenue_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `revenue_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `applies_iss` tinyint(1) DEFAULT 1,
  `applies_pis_cofins` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `revenue_types`
--

LOCK TABLES `revenue_types` WRITE;
/*!40000 ALTER TABLE `revenue_types` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `revenue_types` VALUES
(1,'Bilheteria','Venda de ingressos para sessões',1,1,'2025-10-11 20:38:32'),
(2,'Concessão','Venda de produtos na bomboniere',1,1,'2025-10-11 20:38:32'),
(3,'Publicidade','Receita com publicidade e patrocínios',1,1,'2025-10-11 20:38:32'),
(4,'Outras Receitas','Demais receitas operacionais',1,1,'2025-10-11 20:38:32');
/*!40000 ALTER TABLE `revenue_types` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cinema_complex_id` bigint(20) NOT NULL,
  `room_number` varchar(10) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `capacity` int(11) NOT NULL,
  `projection_type` bigint(20) DEFAULT NULL,
  `audio_type` bigint(20) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `seat_layout` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Visual seat map {rows: 10, columns: 15}' CHECK (json_valid(`seat_layout`)),
  `total_rows` int(11) DEFAULT NULL,
  `total_columns` int(11) DEFAULT NULL,
  `room_design` varchar(30) DEFAULT NULL,
  `layout_image` varchar(255) DEFAULT NULL COMMENT 'URL of the layout image',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_complex_room` (`cinema_complex_id`,`room_number`),
  KEY `idx_cinema_complex` (`cinema_complex_id`),
  KEY `fk_room_projection_type` (`projection_type`),
  KEY `fk_room_audio_type` (`audio_type`),
  CONSTRAINT `fk_room_audio_type` FOREIGN KEY (`audio_type`) REFERENCES `audio_types` (`id`),
  CONSTRAINT `fk_room_projection_type` FOREIGN KEY (`projection_type`) REFERENCES `projection_types` (`id`),
  CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `routine_operations`
--

DROP TABLE IF EXISTS `routine_operations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `routine_operations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `routine_code` int(11) NOT NULL,
  `operation` enum('CREATE','READ','UPDATE','DELETE','EXECUTE') NOT NULL,
  `name` varchar(100) NOT NULL COMMENT 'Nome amigável da operação',
  `description` text DEFAULT NULL,
  `api_endpoint` varchar(200) DEFAULT NULL COMMENT 'Endpoint da API relacionado',
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_routine_operation` (`routine_code`,`operation`),
  KEY `idx_routine` (`routine_code`),
  KEY `idx_operation` (`operation`),
  CONSTRAINT `routine_operations_ibfk_1` FOREIGN KEY (`routine_code`) REFERENCES `system_routines` (`code`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=156 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Operações CRUD disponíveis por rotina';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routine_operations`
--

LOCK TABLES `routine_operations` WRITE;
/*!40000 ALTER TABLE `routine_operations` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `routine_operations` VALUES
(1,100,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:07'),
(2,100,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:07'),
(3,100,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:07'),
(4,100,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:07'),
(5,101,'EXECUTE','Executar','Permissão para executar ação específica',NULL,1,'2025-10-11 21:27:07'),
(6,102,'EXECUTE','Executar','Permissão para executar ação específica',NULL,1,'2025-10-11 21:27:07'),
(7,103,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:07'),
(8,103,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:07'),
(9,104,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:07'),
(10,105,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:07'),
(11,200,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:07'),
(12,201,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:07'),
(13,202,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:07'),
(14,202,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:07'),
(15,202,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:07'),
(16,202,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:07'),
(17,203,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(18,204,'EXECUTE','Executar','Permissão para executar ação específica',NULL,1,'2025-10-11 21:27:08'),
(19,205,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(20,205,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(21,205,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(22,205,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:08'),
(23,206,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(24,206,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(25,206,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(26,206,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:08'),
(27,207,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(28,207,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(29,207,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(30,207,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:08'),
(31,300,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(32,301,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(33,301,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(34,302,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(35,302,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(36,303,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(37,303,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(38,304,'EXECUTE','Executar','Permissão para executar ação específica',NULL,1,'2025-10-11 21:27:08'),
(39,305,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(40,305,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(41,305,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(42,305,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:08'),
(43,306,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(44,306,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(45,306,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(46,306,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:08'),
(47,307,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(48,400,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(49,400,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(50,400,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(51,400,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:08'),
(52,401,'EXECUTE','Executar','Permissão para executar ação específica',NULL,1,'2025-10-11 21:27:08'),
(53,402,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(54,402,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(55,402,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(56,402,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:08'),
(57,403,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(58,403,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(59,404,'EXECUTE','Executar','Permissão para executar ação específica',NULL,1,'2025-10-11 21:27:08'),
(60,500,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(61,501,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(62,501,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(63,501,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(64,501,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:08'),
(65,502,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(66,502,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(67,502,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(68,502,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:08'),
(69,503,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(70,504,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(71,505,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(72,505,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(73,505,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(74,505,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:08'),
(75,506,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(76,506,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(77,506,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(78,506,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:08'),
(79,600,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(80,600,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(81,600,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(82,600,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:08'),
(83,601,'EXECUTE','Executar','Permissão para executar ação específica',NULL,1,'2025-10-11 21:27:08'),
(84,602,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(85,603,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(86,603,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(87,603,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(88,604,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(89,604,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(90,604,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(91,604,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:08'),
(92,605,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(93,605,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(94,605,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(95,605,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:08'),
(96,700,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(97,700,'EXECUTE','Executar','Permissão para executar ação específica',NULL,1,'2025-10-11 21:27:08'),
(98,701,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(99,701,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(100,701,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(101,701,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:08'),
(102,702,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(103,703,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(104,703,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(105,704,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(106,704,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(107,704,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(108,800,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(109,800,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(110,800,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(111,800,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:08'),
(112,801,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(113,801,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(114,801,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(115,801,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:08'),
(116,802,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(117,802,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(118,802,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(119,802,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:08'),
(120,803,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(121,803,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(122,803,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(123,804,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(124,804,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(125,804,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(126,804,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:08'),
(127,805,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(128,805,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(129,805,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(130,805,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:08'),
(131,806,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(132,806,'EXECUTE','Executar','Permissão para executar ação específica',NULL,1,'2025-10-11 21:27:08'),
(133,900,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(134,900,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(135,901,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(136,901,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(137,901,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(138,901,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:08'),
(139,902,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(140,902,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(141,902,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(142,902,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:08'),
(143,903,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(144,903,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(145,903,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(146,903,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:08'),
(147,904,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(148,904,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(149,904,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(150,905,'CREATE','Criar/Adicionar','Permissão para criar novos registros',NULL,1,'2025-10-11 21:27:08'),
(151,905,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(152,905,'UPDATE','Editar/Alterar','Permissão para editar registros',NULL,1,'2025-10-11 21:27:08'),
(153,905,'DELETE','Excluir/Cancelar','Permissão para excluir/cancelar registros',NULL,1,'2025-10-11 21:27:08'),
(154,906,'READ','Visualizar/Consultar','Permissão para consultar registros',NULL,1,'2025-10-11 21:27:08'),
(155,907,'EXECUTE','Executar','Permissão para executar ação específica',NULL,1,'2025-10-11 21:27:08');
/*!40000 ALTER TABLE `routine_operations` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `sale_status`
--

DROP TABLE IF EXISTS `sale_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sale_status` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `allows_modification` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sale_status`
--

LOCK TABLES `sale_status` WRITE;
/*!40000 ALTER TABLE `sale_status` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `sale_status` VALUES
(1,'Confirmada','Venda confirmada e processada',0,1,'2025-10-11 20:42:10'),
(2,'Cancelada','Venda cancelada',0,2,'2025-10-11 20:42:10'),
(3,'Reembolsada','Venda reembolsada',0,3,'2025-10-11 20:42:10');
/*!40000 ALTER TABLE `sale_status` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `sale_types`
--

DROP TABLE IF EXISTS `sale_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sale_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `convenience_fee` decimal(5,2) DEFAULT 0.00,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sale_types`
--

LOCK TABLES `sale_types` WRITE;
/*!40000 ALTER TABLE `sale_types` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `sale_types` VALUES
(1,'Bilheteria','Venda na bilheteria física',0.00,1,'2025-10-11 20:42:10'),
(2,'Online','Venda pelo site',3.00,2,'2025-10-11 20:42:10'),
(3,'Aplicativo','Venda pelo aplicativo mobile',2.50,3,'2025-10-11 20:42:10'),
(4,'Totem','Venda no totem de autoatendimento',1.00,4,'2025-10-11 20:42:10');
/*!40000 ALTER TABLE `sale_types` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cinema_complex_id` bigint(20) NOT NULL,
  `sale_number` varchar(50) NOT NULL,
  `sale_date` timestamp NOT NULL,
  `sale_type` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `customer_cpf` varchar(14) DEFAULT NULL COMMENT 'CPF provided in sale (even without registration)',
  `customer_id` bigint(20) DEFAULT NULL COMMENT 'FK to registered customer (NULL = anonymous sale)',
  `total_amount` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `net_amount` decimal(10,2) NOT NULL,
  `payment_method` bigint(20) DEFAULT NULL,
  `status` bigint(20) DEFAULT NULL,
  `cancellation_date` timestamp NULL DEFAULT NULL,
  `cancellation_reason` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `sale_number` (`sale_number`),
  KEY `idx_complex_sale_date` (`cinema_complex_id`,`sale_date`),
  KEY `idx_status` (`status`),
  KEY `idx_sale_number` (`sale_number`),
  KEY `idx_sales_status_date` (`status`,`sale_date`),
  KEY `fk_sale_type` (`sale_type`),
  KEY `fk_sale_payment_method` (`payment_method`),
  KEY `idx_customer` (`customer_id`),
  KEY `idx_sales_cpf` (`customer_cpf`),
  KEY `idx_sales_date_status` (`sale_date`,`status`),
  KEY `idx_sales_customer_status` (`customer_id`,`status`),
  KEY `idx_customer_cpf` (`customer_cpf`),
  KEY `idx_sale_date_complex` (`sale_date`,`cinema_complex_id`),
  KEY `idx_sale_complex_date_status` (`cinema_complex_id`,`sale_date`,`status`),
  CONSTRAINT `fk_sale_payment_method` FOREIGN KEY (`payment_method`) REFERENCES `payment_methods` (`id`),
  CONSTRAINT `fk_sale_status` FOREIGN KEY (`status`) REFERENCES `sale_status` (`id`),
  CONSTRAINT `fk_sale_type` FOREIGN KEY (`sale_type`) REFERENCES `sale_types` (`id`),
  CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes` (`id`),
  CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `chk_sale_amounts` CHECK (`net_amount` = `total_amount` - `discount_amount`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER trg_sales_net_amount
BEFORE INSERT ON sales
FOR EACH ROW
BEGIN
    SET NEW.net_amount = NEW.total_amount - NEW.discount_amount;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER trg_sales_tax_entry
AFTER INSERT ON sales
FOR EACH ROW
BEGIN
    DECLARE v_confirmed_status_id BIGINT;

    SELECT id INTO v_confirmed_status_id FROM sale_status WHERE name = 'CONFIRMADA';

    IF NEW.status = v_confirmed_status_id THEN
        CALL sp_criar_lancamento_bilheteria(NEW.id);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER trg_liberar_assentos_cancelamento
AFTER UPDATE ON sales
FOR EACH ROW
BEGIN
    DECLARE v_available_status_id BIGINT;
    DECLARE v_cancelled_status_id BIGINT;

    -- Buscar IDs dos status
    SELECT id INTO v_available_status_id FROM seat_status WHERE name = 'Disponível';
    SELECT id INTO v_cancelled_status_id FROM sale_status WHERE name = 'CANCELADA';

    IF NEW.status = v_cancelled_status_id AND OLD.status != v_cancelled_status_id THEN
        UPDATE session_seat_status
        SET status = v_available_status_id,
            sale_id = NULL,
            reservation_uuid = NULL,
            reservation_date = NULL,
            expiration_date = NULL
        WHERE sale_id = NEW.id;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER trg_sales_cancellation
AFTER UPDATE ON sales
FOR EACH ROW
BEGIN
    DECLARE v_confirmed_status_id BIGINT;
    DECLARE v_cancelled_status_id BIGINT;
    DECLARE v_bilheteria_type_id BIGINT;

    SELECT id INTO v_confirmed_status_id FROM sale_status WHERE name = 'CONFIRMADA';
    SELECT id INTO v_cancelled_status_id FROM sale_status WHERE name = 'CANCELADA';
    SELECT id INTO v_bilheteria_type_id FROM revenue_types WHERE name = 'BILHETERIA';

    IF NEW.status = v_cancelled_status_id AND OLD.status = v_confirmed_status_id THEN
        UPDATE tax_entries
        SET deductions_amount = calculation_base,
            calculation_base = 0
        WHERE source_type = v_bilheteria_type_id
          AND source_id = NEW.id;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `seat_status`
--

DROP TABLE IF EXISTS `seat_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `seat_status` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `allows_modification` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seat_status`
--

LOCK TABLES `seat_status` WRITE;
/*!40000 ALTER TABLE `seat_status` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `seat_status` VALUES
(1,'Disponível','Assento disponível para reserva',1,1,'2025-10-11 21:00:00'),
(2,'Reservado','Assento temporariamente reservado',1,2,'2025-10-11 21:00:00'),
(3,'Vendido','Assento vendido e confirmado',0,3,'2025-10-11 21:00:00'),
(4,'Bloqueado','Assento bloqueado para esta sessão',0,4,'2025-10-11 21:00:00');
/*!40000 ALTER TABLE `seat_status` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `seat_types`
--

DROP TABLE IF EXISTS `seat_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `seat_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `additional_value` decimal(10,2) DEFAULT 0.00,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seat_types`
--

LOCK TABLES `seat_types` WRITE;
/*!40000 ALTER TABLE `seat_types` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `seat_types` VALUES
(1,'Padrão','Assento padrão da sala',0.00,1,'2025-10-11 20:55:28'),
(2,'VIP','Assento VIP com maior conforto',15.00,2,'2025-10-11 20:55:28'),
(3,'Acessibilidade','Assento para pessoa com deficiência',0.00,3,'2025-10-11 20:55:28'),
(4,'Love Seat','Assento duplo para casais',10.00,4,'2025-10-11 20:55:28'),
(5,'Bloqueado','Assento bloqueado permanentemente',0.00,5,'2025-10-11 20:55:28');
/*!40000 ALTER TABLE `seat_types` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `seats`
--

DROP TABLE IF EXISTS `seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `seats` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `room_id` bigint(20) NOT NULL,
  `seat_code` varchar(10) NOT NULL,
  `row_code` varchar(5) NOT NULL,
  `column_number` int(11) NOT NULL,
  `seat_type` bigint(20) DEFAULT NULL,
  `position_x` int(11) DEFAULT NULL,
  `position_y` int(11) DEFAULT NULL,
  `accessible` tinyint(1) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_room_seat` (`room_id`,`seat_code`),
  KEY `seat_type` (`seat_type`),
  KEY `idx_room` (`room_id`),
  CONSTRAINT `seats_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `seats_ibfk_2` FOREIGN KEY (`seat_type`) REFERENCES `seat_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Assentos das salas';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seats`
--

LOCK TABLES `seats` WRITE;
/*!40000 ALTER TABLE `seats` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `seats` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `sensitive_actions_log`
--

DROP TABLE IF EXISTS `sensitive_actions_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sensitive_actions_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `routine_code` int(11) NOT NULL,
  `operation` varchar(20) DEFAULT NULL,
  `entity_type` varchar(50) DEFAULT NULL COMMENT 'sales, products, users...',
  `entity_id` bigint(20) DEFAULT NULL COMMENT 'ID do registro afetado',
  `origin_ip` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `data_before` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Estado anterior' CHECK (json_valid(`data_before`)),
  `data_after` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Estado posterior' CHECK (json_valid(`data_after`)),
  `approved_by` bigint(20) DEFAULT NULL,
  `approval_date` timestamp NULL DEFAULT NULL,
  `status` enum('PENDENTE','APROVADO','NEGADO') DEFAULT 'APROVADO',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_date` (`user_id`,`created_at`),
  KEY `idx_routine` (`routine_code`),
  KEY `idx_entity` (`entity_type`,`entity_id`),
  KEY `idx_status` (`status`),
  KEY `idx_log_user_date` (`user_id`,`created_at`),
  KEY `idx_log_entity` (`entity_type`,`entity_id`),
  KEY `idx_created_routine` (`created_at`,`routine_code`),
  CONSTRAINT `sensitive_actions_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `system_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Auditoria de ações críticas do sistema';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensitive_actions_log`
--

LOCK TABLES `sensitive_actions_log` WRITE;
/*!40000 ALTER TABLE `sensitive_actions_log` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `sensitive_actions_log` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `session_languages`
--

DROP TABLE IF EXISTS `session_languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `session_languages` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `abbreviation` varchar(10) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session_languages`
--

LOCK TABLES `session_languages` WRITE;
/*!40000 ALTER TABLE `session_languages` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `session_languages` VALUES
(1,'Dublado','Áudio dublado em português','DUB',1,'2025-10-11 20:42:10'),
(2,'Legendado','Áudio original com legendas','LEG',2,'2025-10-11 20:42:10'),
(3,'Original','Áudio e legendas originais','ORIG',3,'2025-10-11 20:42:10');
/*!40000 ALTER TABLE `session_languages` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `session_seat_status`
--

DROP TABLE IF EXISTS `session_seat_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `session_seat_status` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `showtime_id` bigint(20) NOT NULL,
  `seat_id` bigint(20) NOT NULL,
  `status` bigint(20) NOT NULL,
  `sale_id` bigint(20) DEFAULT NULL,
  `reservation_uuid` varchar(100) DEFAULT NULL,
  `reservation_date` timestamp NULL DEFAULT NULL,
  `expiration_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_session_seat` (`showtime_id`,`seat_id`),
  KEY `seat_id` (`seat_id`),
  KEY `status` (`status`),
  KEY `sale_id` (`sale_id`),
  KEY `idx_reservation` (`reservation_uuid`),
  KEY `idx_expiration` (`expiration_date`),
  CONSTRAINT `session_seat_status_ibfk_1` FOREIGN KEY (`showtime_id`) REFERENCES `showtime_schedule` (`id`) ON DELETE CASCADE,
  CONSTRAINT `session_seat_status_ibfk_2` FOREIGN KEY (`seat_id`) REFERENCES `seats` (`id`) ON DELETE CASCADE,
  CONSTRAINT `session_seat_status_ibfk_3` FOREIGN KEY (`status`) REFERENCES `seat_status` (`id`),
  CONSTRAINT `session_seat_status_ibfk_4` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Status dos assentos por sessão';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session_seat_status`
--

LOCK TABLES `session_seat_status` WRITE;
/*!40000 ALTER TABLE `session_seat_status` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `session_seat_status` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `session_status`
--

DROP TABLE IF EXISTS `session_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `session_status` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `allows_modification` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session_status`
--

LOCK TABLES `session_status` WRITE;
/*!40000 ALTER TABLE `session_status` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `session_status` VALUES
(1,'Agendada','Sessão programada',1,1,'2025-10-11 20:42:10'),
(2,'Em Andamento','Sessão em exibição',0,2,'2025-10-11 20:42:10'),
(3,'Finalizada','Sessão concluída',0,3,'2025-10-11 20:42:10'),
(4,'Cancelada','Sessão cancelada',0,4,'2025-10-11 20:42:10');
/*!40000 ALTER TABLE `session_status` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `settlement_bases`
--

DROP TABLE IF EXISTS `settlement_bases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `settlement_bases` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settlement_bases`
--

LOCK TABLES `settlement_bases` WRITE;
/*!40000 ALTER TABLE `settlement_bases` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `settlement_bases` VALUES
(1,'Receita Bruta','Cálculo sobre receita bruta','2025-10-11 20:42:10'),
(2,'Receita Líquida','Cálculo sobre receita líquida de impostos','2025-10-11 20:42:10');
/*!40000 ALTER TABLE `settlement_bases` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `settlement_status`
--

DROP TABLE IF EXISTS `settlement_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `settlement_status` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `allows_modification` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settlement_status`
--

LOCK TABLES `settlement_status` WRITE;
/*!40000 ALTER TABLE `settlement_status` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `settlement_status` VALUES
(1,'Em Apuração','Apuração em andamento',1,1,'2025-10-11 20:42:10'),
(2,'Apurada','Apuração concluída',1,2,'2025-10-11 20:42:10'),
(3,'Declarada','Declaração enviada',0,3,'2025-10-11 20:42:10'),
(4,'Paga','Tributos pagos',0,4,'2025-10-11 20:42:10');
/*!40000 ALTER TABLE `settlement_status` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `showtime_schedule`
--

DROP TABLE IF EXISTS `showtime_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `showtime_schedule` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cinema_complex_id` bigint(20) NOT NULL,
  `room_id` bigint(20) NOT NULL,
  `movie_id` bigint(20) NOT NULL,
  `session_date` date NOT NULL,
  `session_time` time NOT NULL,
  `projection_type` bigint(20) DEFAULT NULL,
  `audio_type` bigint(20) DEFAULT NULL,
  `session_language` bigint(20) DEFAULT NULL,
  `status` bigint(20) DEFAULT NULL,
  `available_seats` int(11) DEFAULT 0,
  `sold_seats` int(11) DEFAULT 0,
  `blocked_seats` int(11) DEFAULT 0,
  `base_ticket_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `cinema_complex_id` (`cinema_complex_id`),
  KEY `projection_type` (`projection_type`),
  KEY `audio_type` (`audio_type`),
  KEY `session_language` (`session_language`),
  KEY `status` (`status`),
  KEY `idx_session_date_time` (`session_date`,`session_time`),
  KEY `idx_movie` (`movie_id`),
  KEY `idx_room` (`room_id`),
  CONSTRAINT `showtime_schedule_ibfk_1` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes` (`id`),
  CONSTRAINT `showtime_schedule_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
  CONSTRAINT `showtime_schedule_ibfk_3` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`),
  CONSTRAINT `showtime_schedule_ibfk_4` FOREIGN KEY (`projection_type`) REFERENCES `projection_types` (`id`),
  CONSTRAINT `showtime_schedule_ibfk_5` FOREIGN KEY (`audio_type`) REFERENCES `audio_types` (`id`),
  CONSTRAINT `showtime_schedule_ibfk_6` FOREIGN KEY (`session_language`) REFERENCES `session_languages` (`id`),
  CONSTRAINT `showtime_schedule_ibfk_7` FOREIGN KEY (`status`) REFERENCES `session_status` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Programação de sessões';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `showtime_schedule`
--

LOCK TABLES `showtime_schedule` WRITE;
/*!40000 ALTER TABLE `showtime_schedule` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `showtime_schedule` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `simple_national_brackets`
--

DROP TABLE IF EXISTS `simple_national_brackets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `simple_national_brackets` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `annex` varchar(10) NOT NULL,
  `bracket` int(11) NOT NULL,
  `gross_revenue_12m_from` decimal(15,2) NOT NULL,
  `gross_revenue_12m_to` decimal(15,2) NOT NULL,
  `nominal_rate` decimal(5,2) NOT NULL,
  `irpj_percentage` decimal(5,2) DEFAULT NULL,
  `csll_percentage` decimal(5,2) DEFAULT NULL,
  `cofins_percentage` decimal(5,2) DEFAULT NULL,
  `pis_percentage` decimal(5,2) DEFAULT NULL,
  `cpp_percentage` decimal(5,2) DEFAULT NULL,
  `iss_percentage` decimal(5,2) DEFAULT NULL,
  `validity_start` date NOT NULL,
  `validity_end` date DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_annex_revenue` (`annex`,`gross_revenue_12m_from`,`gross_revenue_12m_to`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `simple_national_brackets`
--

LOCK TABLES `simple_national_brackets` WRITE;
/*!40000 ALTER TABLE `simple_national_brackets` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `simple_national_brackets` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `state_icms_parameters`
--

DROP TABLE IF EXISTS `state_icms_parameters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `state_icms_parameters` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `state` char(2) NOT NULL,
  `icms_rate` decimal(5,2) DEFAULT NULL,
  `mva_percentage` decimal(5,2) DEFAULT NULL,
  `tax_substitution_applicable` tinyint(1) DEFAULT 0,
  `validity_start` date NOT NULL,
  `validity_end` date DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_state_validity` (`state`,`validity_start`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `state_icms_parameters`
--

LOCK TABLES `state_icms_parameters` WRITE;
/*!40000 ALTER TABLE `state_icms_parameters` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `state_icms_parameters` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `stock_movement_types`
--

DROP TABLE IF EXISTS `stock_movement_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_movement_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `affects_stock` tinyint(1) DEFAULT 1,
  `operation_type` varchar(10) DEFAULT NULL COMMENT 'ENTRADA, SAIDA',
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_movement_types`
--

LOCK TABLES `stock_movement_types` WRITE;
/*!40000 ALTER TABLE `stock_movement_types` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `stock_movement_types` VALUES
(1,'Entrada','Entrada de mercadoria',1,'ENTRADA',1,'2025-10-11 21:07:49'),
(2,'Saída','Saída de mercadoria',1,'SAIDA',2,'2025-10-11 21:07:49'),
(3,'Ajuste','Ajuste de inventário',1,'AJUSTE',3,'2025-10-11 21:07:49'),
(4,'Inventário','Contagem de inventário',0,'AJUSTE',4,'2025-10-11 21:07:49'),
(5,'Devolução','Devolução de mercadoria',1,'ENTRADA',5,'2025-10-11 21:07:49'),
(6,'Perda','Perda ou avaria',1,'SAIDA',6,'2025-10-11 21:07:49');
/*!40000 ALTER TABLE `stock_movement_types` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `stock_movements`
--

DROP TABLE IF EXISTS `stock_movements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_movements` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) NOT NULL,
  `complex_id` bigint(20) NOT NULL,
  `movement_type` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `previous_quantity` int(11) NOT NULL,
  `current_quantity` int(11) NOT NULL,
  `origin_type` varchar(50) DEFAULT NULL COMMENT 'SALE, PURCHASE, ADJUSTMENT, TRANSFER',
  `origin_id` bigint(20) DEFAULT NULL,
  `unit_value` decimal(10,2) DEFAULT NULL,
  `total_value` decimal(15,2) DEFAULT NULL,
  `observations` text DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `movement_date` timestamp NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `movement_type` (`movement_type`),
  KEY `user_id` (`user_id`),
  KEY `idx_product` (`product_id`),
  KEY `idx_complex` (`complex_id`),
  KEY `idx_movement_date` (`movement_date`),
  KEY `idx_origin` (`origin_type`,`origin_id`),
  CONSTRAINT `stock_movements_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `stock_movements_ibfk_2` FOREIGN KEY (`complex_id`) REFERENCES `cinema_complexes` (`id`),
  CONSTRAINT `stock_movements_ibfk_3` FOREIGN KEY (`movement_type`) REFERENCES `stock_movement_types` (`id`),
  CONSTRAINT `stock_movements_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `system_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Movimentações de estoque';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_movements`
--

LOCK TABLES `stock_movements` WRITE;
/*!40000 ALTER TABLE `stock_movements` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `stock_movements` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `supplier_types`
--

DROP TABLE IF EXISTS `supplier_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_types`
--

LOCK TABLES `supplier_types` WRITE;
/*!40000 ALTER TABLE `supplier_types` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `supplier_types` VALUES
(1,'Alimentos','Fornecedor de alimentos',1,'2025-10-11 21:07:49'),
(2,'Bebidas','Fornecedor de bebidas',2,'2025-10-11 21:07:49'),
(3,'Embalagens','Fornecedor de embalagens',3,'2025-10-11 21:07:49'),
(4,'Equipamentos','Fornecedor de equipamentos',4,'2025-10-11 21:07:49'),
(5,'Manutenção','Serviços de manutenção',5,'2025-10-11 21:07:49'),
(6,'Limpeza','Produtos de limpeza',6,'2025-10-11 21:07:49'),
(7,'Distribuidor Nacional','Distribuidora de filmes nacionais',10,'2025-10-11 22:57:49'),
(8,'Distribuidor Internacional','Distribuidora de filmes internacionais',11,'2025-10-11 22:57:49'),
(9,'Distribuidor Independente','Distribuidora independente',12,'2025-10-11 22:57:49');
/*!40000 ALTER TABLE `supplier_types` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `corporate_name` varchar(200) NOT NULL,
  `trade_name` varchar(200) DEFAULT NULL,
  `cnpj` varchar(18) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `supplier_type` bigint(20) DEFAULT NULL,
  `contact_name` varchar(200) DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `delivery_days` int(11) DEFAULT 7,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_film_distributor` tinyint(1) DEFAULT 0 COMMENT 'Indica se é distribuidor de filmes',
  PRIMARY KEY (`id`),
  UNIQUE KEY `cnpj` (`cnpj`),
  KEY `idx_type` (`supplier_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `system_modules`
--

DROP TABLE IF EXISTS `system_modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_modules` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_modules`
--

LOCK TABLES `system_modules` WRITE;
/*!40000 ALTER TABLE `system_modules` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `system_modules` VALUES
(1,'BILHETERIA','Bilheteria','Módulo de vendas de ingressos',NULL,1,1,'2025-10-11 21:05:23'),
(2,'CONCESSAO','Concessão','Módulo de vendas de concessão',NULL,2,1,'2025-10-11 21:05:23'),
(3,'RH','Recursos Humanos','Gestão de funcionários e ponto',NULL,3,1,'2025-10-11 21:05:23'),
(4,'FINANCEIRO','Financeiro','Gestão financeira e tributária',NULL,4,1,'2025-10-11 21:05:23'),
(5,'ESTOQUE','Estoque','Controle de estoque e compras',NULL,5,1,'2025-10-11 21:05:23'),
(6,'RELATORIOS','Relatórios','Relatórios gerenciais',NULL,6,1,'2025-10-11 21:05:23'),
(7,'CONFIGURACOES','Configurações','Configurações do sistema',NULL,7,1,'2025-10-11 21:05:23');
/*!40000 ALTER TABLE `system_modules` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `system_routines`
--

DROP TABLE IF EXISTS `system_routines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_routines` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` int(11) NOT NULL COMMENT 'Código numérico: 100, 101, 200...',
  `name` varchar(200) NOT NULL COMMENT 'Nome da rotina',
  `module` varchar(50) NOT NULL COMMENT 'PDV, ESTOQUE, FINANCEIRO...',
  `description` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL COMMENT 'OPERACIONAL, CADASTRO, RELATORIO, CONFIGURACAO',
  `risk_level` enum('BAIXO','MEDIO','ALTO','CRITICO') DEFAULT 'BAIXO',
  `requires_approval` tinyint(1) DEFAULT 0,
  `requires_supervisor_password` tinyint(1) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_code` (`code`),
  KEY `idx_module` (`module`),
  KEY `idx_category` (`category`),
  KEY `idx_routine_module_active` (`module`,`active`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Rotinas numeradas do sistema';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_routines`
--

LOCK TABLES `system_routines` WRITE;
/*!40000 ALTER TABLE `system_routines` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `system_routines` VALUES
(1,100,'Venda PDV','PDV','Realizar vendas no ponto de venda','OPERACIONAL','MEDIO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(2,101,'Abertura Caixa','PDV','Abrir caixa do PDV','OPERACIONAL','ALTO',1,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(3,102,'Fechamento Caixa','PDV','Fechar caixa do PDV','OPERACIONAL','ALTO',1,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(4,103,'Sangria/Reforço Caixa','PDV','Realizar sangria ou reforço de caixa','OPERACIONAL','ALTO',1,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(5,104,'Consulta Caixa','PDV','Consultar movimento de caixa','CONSULTA','BAIXO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(6,105,'Cancelar Item Venda','PDV','Cancelar item da venda','OPERACIONAL','MEDIO',1,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(7,200,'Consulta Vendas','VENDAS','Consultar vendas realizadas','CONSULTA','BAIXO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(8,201,'Cancelar Venda','VENDAS','Cancelar venda existente','OPERACIONAL','CRITICO',1,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(9,202,'Orçamentos','VENDAS','Criar e gerenciar orçamentos','CADASTRO','BAIXO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(10,203,'Relatório Vendas','VENDAS','Relatório analítico de vendas','RELATORIO','BAIXO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(11,204,'Aplicar Desconto','VENDAS','Aplicar desconto em vendas','OPERACIONAL','MEDIO',1,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(12,205,'Venda Concessão','VENDAS','Venda de produtos de concessão','OPERACIONAL','MEDIO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(13,206,'Ingressos','VENDAS','Gerenciar ingressos','OPERACIONAL','MEDIO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(14,207,'Combos','VENDAS','Gerenciar combos de produtos','CADASTRO','BAIXO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(15,300,'Consulta Estoque','ESTOQUE','Consultar saldo em estoque','CONSULTA','BAIXO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(16,301,'Ajuste Estoque','ESTOQUE','Realizar ajustes de inventário','OPERACIONAL','ALTO',1,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(17,302,'Entrada Estoque','ESTOQUE','Registrar entrada de mercadoria','OPERACIONAL','MEDIO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(18,303,'Saída Estoque','ESTOQUE','Registrar saída de mercadoria','OPERACIONAL','MEDIO',1,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(19,304,'Inventário','ESTOQUE','Realizar contagem de inventário','OPERACIONAL','ALTO',1,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(20,305,'Produtos','ESTOQUE','Gerenciar cadastro de produtos','CADASTRO','BAIXO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(21,306,'Categorias Produtos','ESTOQUE','Gerenciar categorias','CADASTRO','BAIXO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(22,307,'Movimentações','ESTOQUE','Consultar movimentações de estoque','CONSULTA','BAIXO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(23,400,'Pedidos Compra','COMPRAS','Criar pedidos de compra','OPERACIONAL','MEDIO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(24,401,'Aprovar Pedido','COMPRAS','Aprovar pedidos de compra','OPERACIONAL','ALTO',1,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(25,402,'Fornecedores','COMPRAS','Cadastrar e gerenciar fornecedores','CADASTRO','BAIXO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(26,403,'Cotação Preços','COMPRAS','Realizar cotação de preços','OPERACIONAL','BAIXO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(27,404,'Receber Mercadoria','COMPRAS','Confirmar recebimento','OPERACIONAL','MEDIO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(28,500,'Fluxo Caixa','FINANCEIRO','Consultar fluxo de caixa','CONSULTA','BAIXO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(29,501,'Contas a Pagar','FINANCEIRO','Lançar e pagar contas','OPERACIONAL','ALTO',1,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(30,502,'Contas a Receber','FINANCEIRO','Lançar e receber contas','OPERACIONAL','MEDIO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(31,503,'DRE','FINANCEIRO','Demonstração do Resultado','RELATORIO','MEDIO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(32,504,'Balanço','FINANCEIRO','Balanço patrimonial','RELATORIO','MEDIO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(33,505,'Plano de Contas','FINANCEIRO','Gerenciar plano de contas','CADASTRO','MEDIO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(34,506,'Lançamentos Contábeis','FINANCEIRO','Lançamentos contábeis','OPERACIONAL','ALTO',1,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(35,600,'Funcionários','RH','Cadastrar e gerenciar funcionários','CADASTRO','MEDIO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(36,601,'Folha Pagamento','RH','Calcular folha de pagamento','OPERACIONAL','CRITICO',1,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(37,602,'Pontos','RH','Consultar registros de ponto','CONSULTA','BAIXO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(38,603,'Férias','RH','Gerenciar férias de funcionários','OPERACIONAL','MEDIO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(39,604,'Cargos','RH','Gerenciar cargos','CADASTRO','BAIXO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(40,605,'Departamentos','RH','Gerenciar departamentos','CADASTRO','BAIXO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(41,700,'Apuração Tributos','TRIBUTOS','Apurar tributos federais','OPERACIONAL','CRITICO',1,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(42,701,'Recine','TRIBUTOS','Gerenciar projetos Recine','OPERACIONAL','ALTO',1,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(43,702,'Relatório Fiscal','TRIBUTOS','Relatórios fiscais','RELATORIO','ALTO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(44,703,'Parâmetros Tributários','TRIBUTOS','Configurar parâmetros fiscais','CONFIGURACAO','CRITICO',1,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(45,704,'Obrigações Acessórias','TRIBUTOS','Gerenciar obrigações fiscais','OPERACIONAL','ALTO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(46,800,'Filmes','CINEMA','Gerenciar catálogo de filmes','CADASTRO','BAIXO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(47,801,'Programação Sessões','CINEMA','Programar sessões','OPERACIONAL','MEDIO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(48,802,'Salas','CINEMA','Gerenciar salas de cinema','CADASTRO','MEDIO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(49,803,'Assentos','CINEMA','Configurar layout de assentos','CONFIGURACAO','MEDIO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(50,804,'Distribuidores','CINEMA','Gerenciar distribuidores','CADASTRO','BAIXO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(51,805,'Contratos Exibição','CINEMA','Gerenciar contratos','OPERACIONAL','ALTO',1,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(52,806,'Repasses','CINEMA','Calcular repasses','OPERACIONAL','CRITICO',1,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(53,900,'Parâmetros Sistema','CONFIGURACOES','Configurar parâmetros do sistema','CONFIGURACAO','CRITICO',1,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(54,901,'Usuários','CONFIGURACOES','Gerenciar usuários do sistema','CONFIGURACAO','CRITICO',1,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(55,902,'Permissões','CONFIGURACOES','Gerenciar permissões de acesso','CONFIGURACAO','CRITICO',1,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(56,903,'Perfis Acesso','CONFIGURACOES','Gerenciar perfis de acesso','CONFIGURACAO','CRITICO',1,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(57,904,'Empresas','CONFIGURACOES','Gerenciar empresas','CADASTRO','ALTO',1,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(58,905,'Complexos','CONFIGURACOES','Gerenciar complexos de cinema','CADASTRO','ALTO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(59,906,'Auditoria','CONFIGURACOES','Consultar logs de auditoria','CONSULTA','MEDIO',0,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59'),
(60,907,'Backup/Restore','CONFIGURACOES','Backup e restauração','OPERACIONAL','CRITICO',1,0,1,'2025-10-11 21:25:59','2025-10-11 21:25:59');
/*!40000 ALTER TABLE `system_routines` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `system_users`
--

DROP TABLE IF EXISTS `system_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `employee_id` bigint(20) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `active` tinyint(1) DEFAULT 1,
  `last_login_date` timestamp NULL DEFAULT NULL,
  `reset_token` varchar(100) DEFAULT NULL,
  `token_expiration_date` timestamp NULL DEFAULT NULL,
  `failed_login_attempts` int(11) DEFAULT 0,
  `blocked_until` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `requires_2fa` tinyint(1) DEFAULT 0 COMMENT 'Requires two-factor authentication',
  `secret_2fa` varchar(100) DEFAULT NULL COMMENT 'Google Authenticator secret (encrypted)',
  `backup_codes_2fa` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Backup codes for 2FA' CHECK (json_valid(`backup_codes_2fa`)),
  `last_ip` varchar(45) DEFAULT NULL COMMENT 'Last access IP',
  `last_location` varchar(200) DEFAULT NULL COMMENT 'City/State of last access',
  `active_sessions` int(11) DEFAULT 0 COMMENT 'Number of simultaneous sessions',
  `max_simultaneous_sessions` int(11) DEFAULT 3 COMMENT 'Session limit',
  `password_policy` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Specific password rules for this user' CHECK (json_valid(`password_policy`)),
  `password_expiration_date` date DEFAULT NULL COMMENT 'Password expires and forces change',
  `password_history` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Hash of last 5 passwords (prevents reuse)' CHECK (json_valid(`password_history`)),
  `security_questions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Secret questions for recovery' CHECK (json_valid(`security_questions`)),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `employee_id` (`employee_id`),
  KEY `idx_username` (`username`),
  KEY `idx_email` (`email`),
  KEY `idx_token` (`reset_token`),
  KEY `idx_2fa` (`requires_2fa`),
  KEY `idx_last_ip` (`last_ip`),
  CONSTRAINT `system_users_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_users`
--

LOCK TABLES `system_users` WRITE;
/*!40000 ALTER TABLE `system_users` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `system_users` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER trg_users_login_attempt
AFTER UPDATE ON system_users
FOR EACH ROW
BEGIN
    IF NEW.last_login_date IS NOT NULL AND
       (OLD.last_login_date IS NULL OR NEW.last_login_date != OLD.last_login_date) THEN

        INSERT INTO sensitive_actions_log (
            user_id, routine_code, operation, entity_type, entity_id,
            origin_ip, status
        ) VALUES (
            NEW.id, 100, 'LOGIN', 'USUARIO', NEW.id,
            NEW.last_ip, 'APROVADO'
        );
    END IF;

    -- Bloquear se atingiu limite de tentativas
    IF NEW.failed_login_attempts >= 5 AND NEW.blocked_until IS NULL THEN
        UPDATE system_users
        SET blocked_until = DATE_ADD(NOW(), INTERVAL 30 MINUTE)
        WHERE id = NEW.id;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `tax_compensations`
--

DROP TABLE IF EXISTS `tax_compensations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tax_compensations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cinema_complex_id` bigint(20) NOT NULL,
  `tax_type` bigint(20) DEFAULT NULL,
  `credit_amount` decimal(15,2) NOT NULL,
  `compensated_amount` decimal(15,2) DEFAULT 0.00,
  `credit_balance` decimal(15,2) NOT NULL,
  `credit_competence_date` date NOT NULL,
  `usage_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_complex_tax` (`cinema_complex_id`,`tax_type`),
  KEY `idx_credit_balance` (`credit_balance`),
  KEY `fk_compensation_tax_type` (`tax_type`),
  CONSTRAINT `fk_compensation_tax_type` FOREIGN KEY (`tax_type`) REFERENCES `tax_types` (`id`),
  CONSTRAINT `tax_compensations_ibfk_1` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tax_compensations`
--

LOCK TABLES `tax_compensations` WRITE;
/*!40000 ALTER TABLE `tax_compensations` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `tax_compensations` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `tax_entries`
--

DROP TABLE IF EXISTS `tax_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tax_entries` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cinema_complex_id` bigint(20) NOT NULL,
  `source_type` bigint(20) DEFAULT NULL,
  `source_id` bigint(20) NOT NULL,
  `competence_date` date NOT NULL,
  `entry_date` timestamp NULL DEFAULT current_timestamp(),
  `gross_amount` decimal(15,2) NOT NULL,
  `deductions_amount` decimal(15,2) DEFAULT 0.00,
  `calculation_base` decimal(15,2) NOT NULL,
  `apply_iss` tinyint(1) DEFAULT 1,
  `iss_rate` decimal(5,2) DEFAULT 0.00,
  `iss_amount` decimal(15,2) DEFAULT 0.00,
  `ibge_municipality_code` varchar(7) DEFAULT NULL,
  `iss_service_code` varchar(10) DEFAULT NULL,
  `withheld_at_source` tinyint(1) DEFAULT 0,
  `pis_cofins_regime` bigint(20) DEFAULT NULL,
  `pis_rate` decimal(5,2) NOT NULL,
  `pis_debit_amount` decimal(15,2) NOT NULL,
  `pis_credit_amount` decimal(15,2) DEFAULT 0.00,
  `pis_amount_payable` decimal(15,2) NOT NULL,
  `cofins_rate` decimal(5,2) NOT NULL,
  `cofins_debit_amount` decimal(15,2) NOT NULL,
  `cofins_credit_amount` decimal(15,2) DEFAULT 0.00,
  `cofins_amount_payable` decimal(15,2) NOT NULL,
  `irpj_csll_base` decimal(15,2) DEFAULT NULL,
  `presumed_percentage` decimal(5,2) DEFAULT NULL,
  `snapshot_rates` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`snapshot_rates`)),
  `processed` tinyint(1) DEFAULT 0,
  `processing_date` timestamp NULL DEFAULT NULL,
  `processing_user_id` bigint(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_competence_date` (`competence_date`),
  KEY `idx_source` (`source_type`,`source_id`),
  KEY `idx_processed` (`processed`),
  KEY `idx_complex_competence` (`cinema_complex_id`,`competence_date`),
  KEY `idx_tax_entries_competence_type` (`competence_date`,`source_type`),
  KEY `fk_tax_entry_pis_cofins_regime` (`pis_cofins_regime`),
  KEY `idx_source_competence` (`source_type`,`source_id`,`competence_date`),
  CONSTRAINT `fk_tax_entry_pis_cofins_regime` FOREIGN KEY (`pis_cofins_regime`) REFERENCES `pis_cofins_regimes` (`id`),
  CONSTRAINT `fk_tax_entry_source_type` FOREIGN KEY (`source_type`) REFERENCES `revenue_types` (`id`),
  CONSTRAINT `tax_entries_ibfk_1` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tax_entries`
--

LOCK TABLES `tax_entries` WRITE;
/*!40000 ALTER TABLE `tax_entries` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `tax_entries` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `tax_regimes`
--

DROP TABLE IF EXISTS `tax_regimes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tax_regimes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tax_regimes`
--

LOCK TABLES `tax_regimes` WRITE;
/*!40000 ALTER TABLE `tax_regimes` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `tax_regimes` VALUES
(1,'Lucro Real','Tributação com base no lucro efetivo da empresa','2025-10-11 20:38:32'),
(2,'Lucro Presumido','Tributação com base em presunção de lucro','2025-10-11 20:38:32'),
(3,'Simples Nacional','Regime unificado para pequenas empresas','2025-10-11 20:38:32');
/*!40000 ALTER TABLE `tax_regimes` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `tax_types`
--

DROP TABLE IF EXISTS `tax_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tax_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `jurisdiction` varchar(20) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tax_types`
--

LOCK TABLES `tax_types` WRITE;
/*!40000 ALTER TABLE `tax_types` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `tax_types` VALUES
(1,'PIS','Programa de Integração Social','FEDERAL',1,'2025-10-11 20:42:10'),
(2,'COFINS','Contribuição para Financiamento da Seguridade Social','FEDERAL',2,'2025-10-11 20:42:10'),
(3,'IRPJ','Imposto de Renda Pessoa Jurídica','FEDERAL',3,'2025-10-11 20:42:10'),
(4,'CSLL','Contribuição Social sobre o Lucro Líquido','FEDERAL',4,'2025-10-11 20:42:10');
/*!40000 ALTER TABLE `tax_types` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `ticket_types`
--

DROP TABLE IF EXISTS `ticket_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `discount_percentage` decimal(5,2) DEFAULT 0.00,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_types`
--

LOCK TABLES `ticket_types` WRITE;
/*!40000 ALTER TABLE `ticket_types` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `ticket_types` VALUES
(1,'Inteira','Ingresso sem desconto',0.00,1,'2025-10-11 20:42:10'),
(2,'Meia-Entrada','Desconto de 50%',50.00,2,'2025-10-11 20:42:10'),
(3,'Promocional','Ingresso promocional',30.00,3,'2025-10-11 20:42:10'),
(4,'Cortesia','Ingresso gratuito',100.00,4,'2025-10-11 20:42:10');
/*!40000 ALTER TABLE `ticket_types` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `sale_id` bigint(20) NOT NULL,
  `showtime_id` bigint(20) NOT NULL,
  `seat_id` bigint(20) DEFAULT NULL,
  `ticket_number` varchar(50) NOT NULL,
  `ticket_type` bigint(20) DEFAULT NULL,
  `seat` varchar(10) DEFAULT NULL COMMENT 'Seat code (ex: G15) - Denormalized for performance',
  `face_value` decimal(10,2) NOT NULL,
  `service_fee` decimal(10,2) DEFAULT 0.00,
  `total_amount` decimal(10,2) NOT NULL,
  `used` tinyint(1) DEFAULT 0,
  `usage_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ticket_number` (`ticket_number`),
  KEY `seat_id` (`seat_id`),
  KEY `ticket_type` (`ticket_type`),
  KEY `idx_sale` (`sale_id`),
  KEY `idx_showtime` (`showtime_id`),
  KEY `idx_ticket_number` (`ticket_number`),
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`showtime_id`) REFERENCES `showtime_schedule` (`id`),
  CONSTRAINT `tickets_ibfk_3` FOREIGN KEY (`seat_id`) REFERENCES `seats` (`id`) ON DELETE SET NULL,
  CONSTRAINT `tickets_ibfk_4` FOREIGN KEY (`ticket_type`) REFERENCES `ticket_types` (`id`),
  CONSTRAINT `chk_ticket_amount` CHECK (`total_amount` = `face_value` + `service_fee`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Ingressos vendidos';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `user_permissions`
--

DROP TABLE IF EXISTS `user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `routine_code` int(11) NOT NULL,
  `operation` enum('CREATE','READ','UPDATE','DELETE','EXECUTE') NOT NULL,
  `granted_by` bigint(20) DEFAULT NULL COMMENT 'ID do usuário que concedeu',
  `grant_date` timestamp NULL DEFAULT current_timestamp(),
  `expiration_date` timestamp NULL DEFAULT NULL COMMENT 'Para permissões temporárias',
  `reason` text DEFAULT NULL COMMENT 'Justificativa da concessão',
  `active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_routine_operation` (`user_id`,`routine_code`,`operation`),
  KEY `granted_by` (`granted_by`),
  KEY `idx_user` (`user_id`),
  KEY `idx_routine` (`routine_code`),
  KEY `idx_active` (`active`),
  KEY `idx_expiration` (`expiration_date`),
  KEY `idx_user_routine_active` (`user_id`,`routine_code`,`active`),
  CONSTRAINT `user_permissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `system_users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_permissions_ibfk_2` FOREIGN KEY (`routine_code`) REFERENCES `system_routines` (`code`) ON DELETE CASCADE,
  CONSTRAINT `user_permissions_ibfk_3` FOREIGN KEY (`granted_by`) REFERENCES `system_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Permissões individuais dos usuários';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_permissions`
--

LOCK TABLES `user_permissions` WRITE;
/*!40000 ALTER TABLE `user_permissions` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `user_permissions` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `user_profiles`
--

DROP TABLE IF EXISTS `user_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_profiles` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `profile_id` bigint(20) NOT NULL,
  `assigned_by` bigint(20) DEFAULT NULL,
  `assignment_date` timestamp NULL DEFAULT current_timestamp(),
  `active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_profile` (`user_id`,`profile_id`),
  KEY `profile_id` (`profile_id`),
  KEY `assigned_by` (`assigned_by`),
  CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `system_users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_profiles_ibfk_2` FOREIGN KEY (`profile_id`) REFERENCES `access_profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_profiles_ibfk_3` FOREIGN KEY (`assigned_by`) REFERENCES `system_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Perfis atribuídos aos usuários';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_profiles`
--

LOCK TABLES `user_profiles` WRITE;
/*!40000 ALTER TABLE `user_profiles` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `user_profiles` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Temporary table structure for view `vw_active_campaigns`
--

DROP TABLE IF EXISTS `vw_active_campaigns`;
/*!50001 DROP VIEW IF EXISTS `vw_active_campaigns`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_active_campaigns` AS SELECT
 1 AS `id`,
  1 AS `campaign_code`,
  1 AS `name`,
  1 AS `description`,
  1 AS `promotion_type_id`,
  1 AS `promotion_type_name`,
  1 AS `start_date`,
  1 AS `end_date`,
  1 AS `discount_value`,
  1 AS `discount_percentage`,
  1 AS `fixed_price`,
  1 AS `max_total_uses`,
  1 AS `used_count`,
  1 AS `available_uses`,
  1 AS `max_uses_per_customer`,
  1 AS `requires_coupon`,
  1 AS `combinable`,
  1 AS `priority`,
  1 AS `total_coupons`,
  1 AS `available_coupons`,
  1 AS `total_uses`,
  1 AS `total_discounts_value` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_alertas_estoque_baixo`
--

DROP TABLE IF EXISTS `vw_alertas_estoque_baixo`;
/*!50001 DROP VIEW IF EXISTS `vw_alertas_estoque_baixo`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_alertas_estoque_baixo` AS SELECT
 1 AS `complexo_id`,
  1 AS `complexo_nome`,
  1 AS `produto_id`,
  1 AS `produto_nome`,
  1 AS `codigo_produto`,
  1 AS `quantidade_atual`,
  1 AS `quantidade_minima`,
  1 AS `deficit`,
  1 AS `localizacao`,
  1 AS `nivel_alerta` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_all_domains`
--

DROP TABLE IF EXISTS `vw_all_domains`;
/*!50001 DROP VIEW IF EXISTS `vw_all_domains`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_all_domains` AS SELECT
 1 AS `table_name`,
  1 AS `id`,
  1 AS `name`,
  1 AS `active` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_anonymized_customers`
--

DROP TABLE IF EXISTS `vw_anonymized_customers`;
/*!50001 DROP VIEW IF EXISTS `vw_anonymized_customers`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_anonymized_customers` AS SELECT
 1 AS `customer_code`,
  1 AS `masked_cpf`,
  1 AS `masked_name`,
  1 AS `masked_email`,
  1 AS `city`,
  1 AS `state`,
  1 AS `age`,
  1 AS `gender`,
  1 AS `loyalty_level`,
  1 AS `accumulated_points`,
  1 AS `active` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_auditoria_permissoes`
--

DROP TABLE IF EXISTS `vw_auditoria_permissoes`;
/*!50001 DROP VIEW IF EXISTS `vw_auditoria_permissoes`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_auditoria_permissoes` AS SELECT
 1 AS `usuario`,
  1 AS `nome_completo`,
  1 AS `rotina_codigo`,
  1 AS `rotina_nome`,
  1 AS `operacao`,
  1 AS `concedida_por`,
  1 AS `data_concessao`,
  1 AS `data_expiracao`,
  1 AS `motivo`,
  1 AS `status` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_companies_complete`
--

DROP TABLE IF EXISTS `vw_companies_complete`;
/*!50001 DROP VIEW IF EXISTS `vw_companies_complete`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_companies_complete` AS SELECT
 1 AS `id`,
  1 AS `corporate_name`,
  1 AS `trade_name`,
  1 AS `cnpj`,
  1 AS `state_registration`,
  1 AS `municipal_registration`,
  1 AS `tax_regime`,
  1 AS `pis_cofins_regime`,
  1 AS `recine_opt_in`,
  1 AS `recine_join_date`,
  1 AS `active`,
  1 AS `created_at`,
  1 AS `updated_at`,
  1 AS `tax_regime_name`,
  1 AS `tax_regime_description`,
  1 AS `pis_cofins_regime_name`,
  1 AS `regime_allows_credit` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_complete_sales`
--

DROP TABLE IF EXISTS `vw_complete_sales`;
/*!50001 DROP VIEW IF EXISTS `vw_complete_sales`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_complete_sales` AS SELECT
 1 AS `id`,
  1 AS `cinema_complex_id`,
  1 AS `sale_number`,
  1 AS `sale_date`,
  1 AS `sale_type`,
  1 AS `user_id`,
  1 AS `customer_id`,
  1 AS `customer_cpf`,
  1 AS `customer_name`,
  1 AS `customer_email`,
  1 AS `total_amount`,
  1 AS `discount_amount`,
  1 AS `net_amount`,
  1 AS `payment_method`,
  1 AS `status`,
  1 AS `cancellation_date`,
  1 AS `cancellation_reason`,
  1 AS `created_at`,
  1 AS `sale_type_name`,
  1 AS `convenience_fee`,
  1 AS `payment_method_name`,
  1 AS `operator_fee`,
  1 AS `settlement_days`,
  1 AS `status_name`,
  1 AS `status_allows_modification` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_critical_stock`
--

DROP TABLE IF EXISTS `vw_critical_stock`;
/*!50001 DROP VIEW IF EXISTS `vw_critical_stock`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_critical_stock` AS SELECT
 1 AS `product_id`,
  1 AS `product_code`,
  1 AS `product_name`,
  1 AS `category_name`,
  1 AS `complex_id`,
  1 AS `complex_name`,
  1 AS `current_quantity`,
  1 AS `minimum_quantity`,
  1 AS `maximum_quantity`,
  1 AS `stock_percentage`,
  1 AS `stock_status`,
  1 AS `location` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_customers_churn`
--

DROP TABLE IF EXISTS `vw_customers_churn`;
/*!50001 DROP VIEW IF EXISTS `vw_customers_churn`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_customers_churn` AS SELECT
 1 AS `id`,
  1 AS `name`,
  1 AS `email`,
  1 AS `phone`,
  1 AS `loyalty_level`,
  1 AS `accumulated_points`,
  1 AS `last_purchase`,
  1 AS `inactive_days`,
  1 AS `total_historical_purchases`,
  1 AS `total_amount_spent`,
  1 AS `churn_level` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_customers_complete_profile`
--

DROP TABLE IF EXISTS `vw_customers_complete_profile`;
/*!50001 DROP VIEW IF EXISTS `vw_customers_complete_profile`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_customers_complete_profile` AS SELECT
 1 AS `id`,
  1 AS `cpf`,
  1 AS `name`,
  1 AS `email`,
  1 AS `phone`,
  1 AS `birth_date`,
  1 AS `age`,
  1 AS `gender`,
  1 AS `city`,
  1 AS `state`,
  1 AS `accumulated_points`,
  1 AS `loyalty_level`,
  1 AS `loyalty_join_date`,
  1 AS `loyalty_days`,
  1 AS `accepts_marketing`,
  1 AS `active`,
  1 AS `preferred_session_type`,
  1 AS `preferred_language`,
  1 AS `preferred_position`,
  1 AS `total_purchases`,
  1 AS `total_amount_spent`,
  1 AS `average_ticket`,
  1 AS `last_purchase`,
  1 AS `days_since_last_purchase`,
  1 AS `total_tickets`,
  1 AS `total_sessions_attended`,
  1 AS `recency`,
  1 AS `frequency`,
  1 AS `monetary_value` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_daily_concession`
--

DROP TABLE IF EXISTS `vw_daily_concession`;
/*!50001 DROP VIEW IF EXISTS `vw_daily_concession`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_daily_concession` AS SELECT
 1 AS `complex_id`,
  1 AS `complex_name`,
  1 AS `date`,
  1 AS `total_sales`,
  1 AS `concession_revenue`,
  1 AS `total_items_sold` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_daily_sales`
--

DROP TABLE IF EXISTS `vw_daily_sales`;
/*!50001 DROP VIEW IF EXISTS `vw_daily_sales`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_daily_sales` AS SELECT
 1 AS `sale_date`,
  1 AS `cinema_complex_id`,
  1 AS `complex_name`,
  1 AS `total_sales`,
  1 AS `gross_total_amount`,
  1 AS `total_discount`,
  1 AS `net_total_amount`,
  1 AS `average_ticket`,
  1 AS `normal_sales`,
  1 AS `online_sales`,
  1 AS `courtesy_sales`,
  1 AS `confirmed_sales`,
  1 AS `cancelled_sales`,
  1 AS `pending_sales` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_dashboard_permissoes`
--

DROP TABLE IF EXISTS `vw_dashboard_permissoes`;
/*!50001 DROP VIEW IF EXISTS `vw_dashboard_permissoes`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_dashboard_permissoes` AS SELECT
 1 AS `metrica`,
  1 AS `valor` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_financial_performance`
--

DROP TABLE IF EXISTS `vw_financial_performance`;
/*!50001 DROP VIEW IF EXISTS `vw_financial_performance`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_financial_performance` AS SELECT
 1 AS `year`,
  1 AS `month`,
  1 AS `cinema_complex_id`,
  1 AS `complex_name`,
  1 AS `gross_total_revenue`,
  1 AS `total_deductions`,
  1 AS `calculation_base_revenue`,
  1 AS `total_iss`,
  1 AS `total_pis_to_collect`,
  1 AS `total_cofins_to_collect`,
  1 AS `total_irpj`,
  1 AS `total_csll`,
  1 AS `total_distributor_payout`,
  1 AS `net_total_revenue`,
  1 AS `tax_burden_percentage`,
  1 AS `net_margin_percentage` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_funcionarios_ativos`
--

DROP TABLE IF EXISTS `vw_funcionarios_ativos`;
/*!50001 DROP VIEW IF EXISTS `vw_funcionarios_ativos`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_funcionarios_ativos` AS SELECT
 1 AS `id`,
  1 AS `matricula`,
  1 AS `nome`,
  1 AS `cpf`,
  1 AS `email`,
  1 AS `telefone`,
  1 AS `cargo_nome`,
  1 AS `departamento_nome`,
  1 AS `salario_atual`,
  1 AS `data_admissao`,
  1 AS `anos_empresa`,
  1 AS `tipo_contrato_nome`,
  1 AS `complexo_nome` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_loyalty_customers`
--

DROP TABLE IF EXISTS `vw_loyalty_customers`;
/*!50001 DROP VIEW IF EXISTS `vw_loyalty_customers`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_loyalty_customers` AS SELECT
 1 AS `id`,
  1 AS `name`,
  1 AS `email`,
  1 AS `phone`,
  1 AS `accumulated_points`,
  1 AS `loyalty_level`,
  1 AS `loyalty_join_date`,
  1 AS `total_purchases`,
  1 AS `total_amount_spent`,
  1 AS `last_purchase`,
  1 AS `favorite_genres`,
  1 AS `favorite_products_count` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_monthly_tax_summary`
--

DROP TABLE IF EXISTS `vw_monthly_tax_summary`;
/*!50001 DROP VIEW IF EXISTS `vw_monthly_tax_summary`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_monthly_tax_summary` AS SELECT
 1 AS `id`,
  1 AS `cinema_complex_id`,
  1 AS `complex_name`,
  1 AS `city`,
  1 AS `state`,
  1 AS `tax_regime`,
  1 AS `pis_cofins_regime`,
  1 AS `year`,
  1 AS `month`,
  1 AS `competence`,
  1 AS `gross_box_office_revenue`,
  1 AS `gross_concession_revenue`,
  1 AS `gross_advertising_revenue`,
  1 AS `gross_other_revenue`,
  1 AS `total_gross_revenue`,
  1 AS `total_deductions`,
  1 AS `calculation_base_revenue`,
  1 AS `total_iss_box_office`,
  1 AS `total_iss_concession`,
  1 AS `total_iss`,
  1 AS `iss_percentage`,
  1 AS `total_pis_debit`,
  1 AS `total_pis_credit`,
  1 AS `total_pis_payable`,
  1 AS `pis_percentage`,
  1 AS `total_cofins_debit`,
  1 AS `total_cofins_credit`,
  1 AS `total_cofins_payable`,
  1 AS `cofins_percentage`,
  1 AS `irpj_base`,
  1 AS `irpj_base_15`,
  1 AS `irpj_additional_10`,
  1 AS `total_irpj`,
  1 AS `irpj_percentage`,
  1 AS `csll_base`,
  1 AS `total_csll`,
  1 AS `csll_percentage`,
  1 AS `total_tax_burden`,
  1 AS `tax_burden_percentage`,
  1 AS `total_distributor_payment`,
  1 AS `distributor_payout_percentage`,
  1 AS `net_revenue_taxed`,
  1 AS `net_total_revenue`,
  1 AS `net_margin`,
  1 AS `status`,
  1 AS `settlement_date` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_movies_complete`
--

DROP TABLE IF EXISTS `vw_movies_complete`;
/*!50001 DROP VIEW IF EXISTS `vw_movies_complete`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_movies_complete` AS SELECT
 1 AS `id`,
  1 AS `distributor_id`,
  1 AS `original_title`,
  1 AS `brazil_title`,
  1 AS `ancine_number`,
  1 AS `duration_minutes`,
  1 AS `age_rating`,
  1 AS `genre`,
  1 AS `country_of_origin`,
  1 AS `production_year`,
  1 AS `national`,
  1 AS `active`,
  1 AS `created_at`,
  1 AS `age_rating_name`,
  1 AS `minimum_age`,
  1 AS `age_rating_description`,
  1 AS `distributor_name`,
  1 AS `is_film_distributor` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_recine_benefits`
--

DROP TABLE IF EXISTS `vw_recine_benefits`;
/*!50001 DROP VIEW IF EXISTS `vw_recine_benefits`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_recine_benefits` AS SELECT
 1 AS `project_id`,
  1 AS `project_number`,
  1 AS `complex_name`,
  1 AS `description`,
  1 AS `project_type`,
  1 AS `status`,
  1 AS `total_project_value`,
  1 AS `total_acquisitions`,
  1 AS `total_acquisition_value`,
  1 AS `pis_cofins_savings`,
  1 AS `ipi_savings`,
  1 AS `ii_savings`,
  1 AS `total_benefit_realized`,
  1 AS `savings_percentage`,
  1 AS `start_date`,
  1 AS `expected_completion_date`,
  1 AS `actual_completion_date` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_recine_projects_complete`
--

DROP TABLE IF EXISTS `vw_recine_projects_complete`;
/*!50001 DROP VIEW IF EXISTS `vw_recine_projects_complete`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_recine_projects_complete` AS SELECT
 1 AS `id`,
  1 AS `cinema_complex_id`,
  1 AS `project_number`,
  1 AS `description`,
  1 AS `project_type`,
  1 AS `total_project_value`,
  1 AS `estimated_benefit_value`,
  1 AS `pis_cofins_suspended`,
  1 AS `ipi_exempt`,
  1 AS `ii_exempt`,
  1 AS `start_date`,
  1 AS `expected_completion_date`,
  1 AS `actual_completion_date`,
  1 AS `status`,
  1 AS `ancine_process_number`,
  1 AS `ancine_approval_date`,
  1 AS `observations`,
  1 AS `created_at`,
  1 AS `updated_at`,
  1 AS `project_type_name`,
  1 AS `project_type_description`,
  1 AS `status_name`,
  1 AS `status_allows_modification` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_sales_complete`
--

DROP TABLE IF EXISTS `vw_sales_complete`;
/*!50001 DROP VIEW IF EXISTS `vw_sales_complete`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_sales_complete` AS SELECT
 1 AS `id`,
  1 AS `cinema_complex_id`,
  1 AS `sale_number`,
  1 AS `sale_date`,
  1 AS `sale_type`,
  1 AS `user_id`,
  1 AS `customer_cpf`,
  1 AS `total_amount`,
  1 AS `discount_amount`,
  1 AS `net_amount`,
  1 AS `payment_method`,
  1 AS `status`,
  1 AS `cancellation_date`,
  1 AS `cancellation_reason`,
  1 AS `created_at`,
  1 AS `sale_type_name`,
  1 AS `convenience_fee`,
  1 AS `payment_method_name`,
  1 AS `operator_fee`,
  1 AS `settlement_days`,
  1 AS `status_name`,
  1 AS `status_allows_modification` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_settlement_complete`
--

DROP TABLE IF EXISTS `vw_settlement_complete`;
/*!50001 DROP VIEW IF EXISTS `vw_settlement_complete`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_settlement_complete` AS SELECT
 1 AS `id`,
  1 AS `cinema_complex_id`,
  1 AS `year`,
  1 AS `month`,
  1 AS `settlement_date`,
  1 AS `tax_regime`,
  1 AS `pis_cofins_regime`,
  1 AS `gross_box_office_revenue`,
  1 AS `gross_concession_revenue`,
  1 AS `gross_advertising_revenue`,
  1 AS `gross_other_revenue`,
  1 AS `total_gross_revenue`,
  1 AS `total_deductions`,
  1 AS `calculation_base_revenue`,
  1 AS `total_iss_box_office`,
  1 AS `total_iss_concession`,
  1 AS `total_iss`,
  1 AS `total_pis_debit`,
  1 AS `total_pis_credit`,
  1 AS `total_pis_payable`,
  1 AS `total_cofins_debit`,
  1 AS `total_cofins_credit`,
  1 AS `total_cofins_payable`,
  1 AS `irpj_base`,
  1 AS `irpj_base_15`,
  1 AS `irpj_additional_10`,
  1 AS `total_irpj`,
  1 AS `csll_base`,
  1 AS `total_csll`,
  1 AS `gross_revenue_12m`,
  1 AS `effective_simples_rate`,
  1 AS `total_simples_amount`,
  1 AS `total_distributor_payment`,
  1 AS `net_revenue_taxed`,
  1 AS `net_total_revenue`,
  1 AS `status`,
  1 AS `declaration_date`,
  1 AS `payment_date`,
  1 AS `notes`,
  1 AS `created_at`,
  1 AS `updated_at`,
  1 AS `status_name`,
  1 AS `status_allows_modification`,
  1 AS `status_description` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_settlements_complete`
--

DROP TABLE IF EXISTS `vw_settlements_complete`;
/*!50001 DROP VIEW IF EXISTS `vw_settlements_complete`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_settlements_complete` AS SELECT
 1 AS `id`,
  1 AS `contract_id`,
  1 AS `distributor_id`,
  1 AS `cinema_complex_id`,
  1 AS `competence_start_date`,
  1 AS `competence_end_date`,
  1 AS `total_tickets_sold`,
  1 AS `gross_box_office_revenue`,
  1 AS `calculation_base`,
  1 AS `taxes_deducted_amount`,
  1 AS `settlement_base_amount`,
  1 AS `distributor_percentage`,
  1 AS `calculated_settlement_amount`,
  1 AS `minimum_guarantee`,
  1 AS `final_settlement_amount`,
  1 AS `deductions_amount`,
  1 AS `net_settlement_amount`,
  1 AS `irrf_rate`,
  1 AS `irrf_calculation_base`,
  1 AS `irrf_amount`,
  1 AS `irrf_exempt`,
  1 AS `retained_iss_amount`,
  1 AS `net_payment_amount`,
  1 AS `status`,
  1 AS `calculation_date`,
  1 AS `approval_date`,
  1 AS `payment_date`,
  1 AS `notes`,
  1 AS `created_at`,
  1 AS `updated_at`,
  1 AS `calculation_base_name`,
  1 AS `calculation_base_description`,
  1 AS `status_name`,
  1 AS `status_allows_modification` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_tax_compensations_summary`
--

DROP TABLE IF EXISTS `vw_tax_compensations_summary`;
/*!50001 DROP VIEW IF EXISTS `vw_tax_compensations_summary`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_tax_compensations_summary` AS SELECT
 1 AS `cinema_complex_id`,
  1 AS `complex_name`,
  1 AS `tax_type`,
  1 AS `total_credit`,
  1 AS `total_compensated`,
  1 AS `available_balance`,
  1 AS `total_compensations` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_tax_kpi`
--

DROP TABLE IF EXISTS `vw_tax_kpi`;
/*!50001 DROP VIEW IF EXISTS `vw_tax_kpi`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_tax_kpi` AS SELECT
 1 AS `cinema_complex_id`,
  1 AS `year`,
  1 AS `month`,
  1 AS `iss_efficiency`,
  1 AS `pis_cofins_efficiency`,
  1 AS `effective_tax_burden`,
  1 AS `simple_national_theoretical`,
  1 AS `pis_utilization`,
  1 AS `cofins_utilization` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_tickets_complete`
--

DROP TABLE IF EXISTS `vw_tickets_complete`;
/*!50001 DROP VIEW IF EXISTS `vw_tickets_complete`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_tickets_complete` AS SELECT
 1 AS `id`,
  1 AS `sale_id`,
  1 AS `showtime_id`,
  1 AS `ticket_number`,
  1 AS `ticket_type`,
  1 AS `seat`,
  1 AS `face_value`,
  1 AS `service_fee`,
  1 AS `total_amount`,
  1 AS `used`,
  1 AS `usage_date`,
  1 AS `created_at`,
  1 AS `ticket_type_name`,
  1 AS `discount_percentage`,
  1 AS `ticket_type_description` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_usuario_permissoes_base`
--

DROP TABLE IF EXISTS `vw_usuario_permissoes_base`;
/*!50001 DROP VIEW IF EXISTS `vw_usuario_permissoes_base`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_usuario_permissoes_base` AS SELECT
 1 AS `usuario_id`,
  1 AS `username`,
  1 AS `email`,
  1 AS `rotina_codigo`,
  1 AS `rotina_nome`,
  1 AS `modulo`,
  1 AS `nivel_risco`,
  1 AS `operacoes` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_usuario_permissoes_completas`
--

DROP TABLE IF EXISTS `vw_usuario_permissoes_completas`;
/*!50001 DROP VIEW IF EXISTS `vw_usuario_permissoes_completas`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `vw_usuario_permissoes_completas` AS SELECT
 1 AS `usuario_id`,
  1 AS `username`,
  1 AS `email`,
  1 AS `nome_completo`,
  1 AS `rotina_codigo`,
  1 AS `rotina_nome`,
  1 AS `modulo`,
  1 AS `categoria`,
  1 AS `nivel_risco`,
  1 AS `operacao`,
  1 AS `operacao_nome`,
  1 AS `origem_permissao`,
  1 AS `perfil_nome`,
  1 AS `requer_aprovacao`,
  1 AS `requer_senha_supervisor` */;
SET character_set_client = @saved_cs_client;

--
-- Dumping routines for database 'frame24'
--
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_adicionar_pontos` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_adicionar_pontos`(
    IN p_customer_id BIGINT,
    IN p_points INT,
    IN p_origin_type VARCHAR(50),
    IN p_origin_id BIGINT
)
BEGIN
    DECLARE v_previous_balance INT;
    DECLARE v_current_balance INT;
    DECLARE v_current_level VARCHAR(20);
    DECLARE v_new_level VARCHAR(20);
    DECLARE v_expiration_date DATE;

    -- Get current balance
    SELECT accumulated_points, loyalty_level
    INTO v_previous_balance, v_current_level
    FROM customers
    WHERE id = p_customer_id;

    SET v_current_balance = v_previous_balance + p_points;
    SET v_expiration_date = DATE_ADD(CURDATE(), INTERVAL 12 MONTH);

    -- Calculate new level
    SET v_new_level = CASE
        WHEN v_current_balance >= 10000 THEN 'PLATINA'
        WHEN v_current_balance >= 5000 THEN 'OURO'
        WHEN v_current_balance >= 2000 THEN 'PRATA'
        ELSE 'BRONZE'
    END;

    START TRANSACTION;

    -- Register movement
    INSERT INTO customer_points (
        customer_id, movement_type, points,
        previous_balance, current_balance, origin_type, origin_id,
        expiration_date, description
    ) VALUES (
        p_customer_id, 'CREDITO', p_points,
        v_previous_balance, v_current_balance, p_origin_type, p_origin_id,
        v_expiration_date,
        CONCAT('Crédito de ', p_points, ' pontos por ', p_origin_type)
    );

    -- Update customer
    UPDATE customers
    SET accumulated_points = v_current_balance,
        loyalty_level = v_new_level
    WHERE id = p_customer_id;

    -- If level increased, register interaction
    IF v_new_level != v_current_level THEN
        INSERT INTO customer_interactions (
            customer_id, interaction_type, channel, description
        ) VALUES (
            p_customer_id, 'UPGRADE_NIVEL', 'SISTEMA',
            CONCAT('Cliente promovido de ', v_current_level, ' para ', v_new_level)
        );
    END IF;

    COMMIT;

    SELECT
        v_current_balance as saldo_atual,
        p_points as pontos_adicionados,
        v_new_level as nivel,
        (v_new_level != v_current_level) as subiu_nivel;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_atribuir_perfil` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_atribuir_perfil`(
    IN p_usuario_id BIGINT,
    IN p_perfil_codigo VARCHAR(50),
    IN p_atribuido_por BIGINT
)
BEGIN
    DECLARE v_perfil_id BIGINT;

    SELECT id INTO v_perfil_id
    FROM access_profiles
    WHERE code = p_perfil_codigo
    AND active = TRUE;

    IF v_perfil_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Perfil não encontrado ou inativo';
    END IF;

    INSERT INTO user_profiles (
        user_id, profile_id, assigned_by
    ) VALUES (
        p_usuario_id, v_perfil_id, p_atribuido_por
    )
    ON DUPLICATE KEY UPDATE
        active = TRUE,
        assigned_by = p_atribuido_por,
        assignment_date = NOW();

    SELECT
        'Perfil atribuído com sucesso' as mensagem,
        p_perfil_codigo as perfil_codigo,
        (SELECT name FROM access_profiles WHERE id = v_perfil_id) as perfil_nome;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_atualizar_estoque` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_atualizar_estoque`(
    IN p_product_id BIGINT,
    IN p_complex_id BIGINT,
    IN p_quantity INT,
    IN p_movement_type_id BIGINT,
    IN p_origin_type VARCHAR(50),
    IN p_origin_id BIGINT,
    IN p_unit_value DECIMAL(10,2),
    IN p_user_id BIGINT,
    IN p_observations TEXT
)
BEGIN
    DECLARE v_previous_quantity INT;
    DECLARE v_current_quantity INT;
    DECLARE v_operation_type VARCHAR(10);
    DECLARE v_total_value DECIMAL(15,2);

    START TRANSACTION;

    -- Buscar quantidade atual
    SELECT current_quantity INTO v_previous_quantity
    FROM product_stock
    WHERE product_id = p_product_id AND complex_id = p_complex_id
    FOR UPDATE;

    -- Se não existe estoque, criar
    IF v_previous_quantity IS NULL THEN
        INSERT INTO product_stock (product_id, complex_id, current_quantity)
        VALUES (p_product_id, p_complex_id, 0);
        SET v_previous_quantity = 0;
    END IF;

    -- Buscar tipo de operação
    SELECT operation_type INTO v_operation_type
    FROM stock_movement_types
    WHERE id = p_movement_type_id;

    -- Calcular nova quantidade
    IF v_operation_type = 'ENTRADA' THEN
        SET v_current_quantity = v_previous_quantity + p_quantity;
    ELSEIF v_operation_type = 'SAIDA' THEN
        SET v_current_quantity = v_previous_quantity - p_quantity;

        IF v_current_quantity < 0 THEN
            ROLLBACK;
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Estoque insuficiente para esta operação';
        END IF;
    ELSE -- AJUSTE
        SET v_current_quantity = p_quantity;
    END IF;

    -- Calcular valor total
    SET v_total_value = p_quantity * COALESCE(p_unit_value, 0);

    -- Atualizar estoque
    UPDATE product_stock
    SET current_quantity = v_current_quantity,
        updated_at = NOW()
    WHERE product_id = p_product_id AND complex_id = p_complex_id;

    -- Registrar movimentação
    INSERT INTO stock_movements (
        product_id, complex_id, movement_type, quantity,
        previous_quantity, current_quantity, origin_type, origin_id,
        unit_value, total_value, observations, user_id
    ) VALUES (
        p_product_id, p_complex_id, p_movement_type_id, p_quantity,
        v_previous_quantity, v_current_quantity, p_origin_type, p_origin_id,
        p_unit_value, v_total_value, p_observations, p_user_id
    );

    COMMIT;

    -- Retornar resultado
    SELECT
        v_previous_quantity as quantidade_anterior,
        v_current_quantity as quantidade_atual,
        p_quantity as quantidade_movimentada,
        'Estoque atualizado com sucesso' as mensagem;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_buscar_aliquotas_vigentes` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_buscar_aliquotas_vigentes`(
    IN p_complex_id BIGINT,
    IN p_revenue_type VARCHAR(20),
    IN p_competence_date DATE,
    OUT p_iss_rate DECIMAL(5,2),
    OUT p_pis_rate DECIMAL(5,2),
    OUT p_cofins_rate DECIMAL(5,2),
    OUT p_pis_cofins_regime VARCHAR(20),
    OUT p_ibge_code VARCHAR(7),
    OUT p_iss_concession_applicable BOOLEAN
)
BEGIN
    DECLARE v_tax_regime VARCHAR(50);
    DECLARE v_company_pis_cofins_regime VARCHAR(20);

    SELECT
        c.ibge_municipality_code,
        e.tax_regime,
        e.pis_cofins_regime
    INTO
        p_ibge_code,
        v_tax_regime,
        v_company_pis_cofins_regime
    FROM cinema_complexes c
    INNER JOIN companies e ON c.company_id = e.id
    WHERE c.id = p_complex_id;

    SELECT
        iss_rate,
        iss_concession_applicable
    INTO
        p_iss_rate,
        p_iss_concession_applicable
    FROM municipal_tax_parameters
    WHERE ibge_municipality_code = p_ibge_code
      AND validity_start <= p_competence_date
      AND (validity_end IS NULL OR validity_end >= p_competence_date)
      AND active = TRUE
    ORDER BY validity_start DESC
    LIMIT 1;

    SELECT
        pis_rate,
        cofins_rate,
        pis_cofins_regime
    INTO
        p_pis_rate,
        p_cofins_rate,
        p_pis_cofins_regime
    FROM federal_tax_rates
    WHERE tax_regime = v_tax_regime
      AND pis_cofins_regime = v_company_pis_cofins_regime
      AND revenue_type = p_revenue_type
      AND validity_start <= p_competence_date
      AND (validity_end IS NULL OR validity_end >= p_competence_date)
      AND active = TRUE
    ORDER BY validity_start DESC
    LIMIT 1;

    SET p_iss_rate = IFNULL(p_iss_rate, 0);
    SET p_pis_rate = IFNULL(p_pis_rate, 0);
    SET p_cofins_rate = IFNULL(p_cofins_rate, 0);
    SET p_iss_concession_applicable = IFNULL(p_iss_concession_applicable, FALSE);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_calcular_horas_trabalhadas` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_calcular_horas_trabalhadas`(
    IN p_time_record_id BIGINT
)
BEGIN
    DECLARE v_horas_trabalhadas DECIMAL(5,2);
    DECLARE v_hora_entrada TIME;
    DECLARE v_hora_saida TIME;
    DECLARE v_entrada_intervalo TIME;
    DECLARE v_saida_intervalo TIME;
    DECLARE v_minutos_totais INT;
    DECLARE v_minutos_intervalo INT;

    SELECT
        entry_time, exit_time,
        break_start_time, break_end_time
    INTO
        v_hora_entrada, v_hora_saida,
        v_entrada_intervalo, v_saida_intervalo
    FROM employee_time_records
    WHERE id = p_time_record_id;

    IF v_hora_entrada IS NOT NULL AND v_hora_saida IS NOT NULL THEN
        -- Calcular minutos totais
        SET v_minutos_totais = TIMESTAMPDIFF(MINUTE, v_hora_entrada, v_hora_saida);

        -- Calcular minutos de intervalo
        IF v_entrada_intervalo IS NOT NULL AND v_saida_intervalo IS NOT NULL THEN
            SET v_minutos_intervalo = TIMESTAMPDIFF(MINUTE, v_entrada_intervalo, v_saida_intervalo);
        ELSE
            SET v_minutos_intervalo = 0;
        END IF;

        -- Calcular horas (em decimal)
        SET v_horas_trabalhadas = (v_minutos_totais - v_minutos_intervalo) / 60.0;

        -- Atualizar registro
        UPDATE employee_time_records
        SET total_hours_worked = v_horas_trabalhadas
        WHERE id = p_time_record_id;

        SELECT
            v_horas_trabalhadas as horas_trabalhadas,
            'Horas calculadas com sucesso' as mensagem;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Horários incompletos para cálculo';
    END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_conceder_permissao` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_conceder_permissao`(
    IN p_usuario_id BIGINT,
    IN p_rotina_codigo INT,
    IN p_operacao VARCHAR(20),
    IN p_concedida_por BIGINT,
    IN p_motivo TEXT,
    IN p_data_expiracao TIMESTAMP
)
BEGIN
    DECLARE v_existe INT;

    -- Verificar se permissão já existe
    SELECT COUNT(*) INTO v_existe
    FROM user_permissions
    WHERE user_id = p_usuario_id
    AND routine_code = p_rotina_codigo
    AND operation = p_operacao;

    IF v_existe > 0 THEN
        -- Atualizar permissão existente
        UPDATE user_permissions
        SET active = TRUE,
            expiration_date = p_data_expiracao,
            reason = p_motivo,
            granted_by = p_concedida_por,
            grant_date = NOW()
        WHERE user_id = p_usuario_id
        AND routine_code = p_rotina_codigo
        AND operation = p_operacao;

        SELECT 'Permissão atualizada com sucesso' as mensagem;
    ELSE
        -- Inserir nova permissão
        INSERT INTO user_permissions (
            user_id, routine_code, operation,
            granted_by, reason, expiration_date
        ) VALUES (
            p_usuario_id, p_rotina_codigo, p_operacao,
            p_concedida_por, p_motivo, p_data_expiracao
        );

        SELECT 'Permissão concedida com sucesso' as mensagem;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_confirmar_venda_assentos` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_confirmar_venda_assentos`(
    IN p_sale_id BIGINT,
    IN p_showtime_id BIGINT,
    IN p_reservation_uuid VARCHAR(100)
)
BEGIN
    DECLARE v_seats_reserved INT;
    DECLARE v_seats_confirmed INT;
    DECLARE v_reserved_status_id BIGINT;
    DECLARE v_sold_status_id BIGINT;

    -- Obter IDs dos status
    SELECT id INTO v_reserved_status_id FROM seat_status WHERE name = 'Reservado';
    SELECT id INTO v_sold_status_id FROM seat_status WHERE name = 'Vendido';

    START TRANSACTION;

    -- Verificar se os assentos estão reservados para este UUID
    SELECT COUNT(*) INTO v_seats_reserved
    FROM session_seat_status
    WHERE showtime_id = p_showtime_id
    AND reservation_uuid = p_reservation_uuid
    AND status = v_reserved_status_id
    AND expiration_date > NOW()
    FOR UPDATE;

    IF v_seats_reserved = 0 THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Nenhum assento reservado válido encontrado';
    END IF;

    -- Confirmar venda dos assentos
    UPDATE session_seat_status
    SET status = v_sold_status_id,
        sale_id = p_sale_id,
        expiration_date = NULL
    WHERE showtime_id = p_showtime_id
    AND reservation_uuid = p_reservation_uuid
    AND status = v_reserved_status_id;

    SET v_seats_confirmed = ROW_COUNT();

    COMMIT;

    -- Retornar resultado
    SELECT
        v_seats_confirmed as assentos_confirmados,
        'Assentos confirmados com sucesso' as mensagem;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_consolidar_apuracao_mensal` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_consolidar_apuracao_mensal`(
    IN p_complex_id BIGINT,
    IN p_year INT,
    IN p_month INT
)
BEGIN
    DECLARE v_tax_regime VARCHAR(50);
    DECLARE v_gross_revenue DECIMAL(15,2);
    DECLARE v_irpj_base DECIMAL(15,2);
    DECLARE v_irpj_15 DECIMAL(15,2);
    DECLARE v_irpj_additional DECIMAL(15,2);
    DECLARE v_csll DECIMAL(15,2);
    DECLARE v_presumed_percentage DECIMAL(5,2);
    DECLARE v_bilheteria_type_id BIGINT;
    DECLARE v_concessao_type_id BIGINT;
    DECLARE v_publicidade_type_id BIGINT;
    DECLARE v_outros_type_id BIGINT;
    DECLARE v_apurada_status_id BIGINT;

    -- Buscar IDs dos tipos de receita
    SELECT id INTO v_bilheteria_type_id FROM revenue_types WHERE name = 'BILHETERIA';
    SELECT id INTO v_concessao_type_id FROM revenue_types WHERE name = 'CONCESSAO';
    SELECT id INTO v_publicidade_type_id FROM revenue_types WHERE name = 'PUBLICIDADE';
    SELECT id INTO v_outros_type_id FROM revenue_types WHERE name = 'OUTROS';
    SELECT id INTO v_apurada_status_id FROM settlement_status WHERE name = 'APURADA';

    SELECT tr.name INTO v_tax_regime
    FROM companies e
    INNER JOIN cinema_complexes c ON e.id = c.company_id
    INNER JOIN tax_regimes tr ON e.tax_regime = tr.id
    WHERE c.id = p_complex_id;

    -- Consolidar receitas de bilheteria
    UPDATE monthly_tax_settlement mts
    SET gross_box_office_revenue = (
        SELECT COALESCE(SUM(calculation_base), 0)
        FROM tax_entries
        WHERE cinema_complex_id = p_complex_id
          AND YEAR(competence_date) = p_year
          AND MONTH(competence_date) = p_month
          AND source_type = v_bilheteria_type_id
          AND processed = TRUE
    )
    WHERE cinema_complex_id = p_complex_id
      AND year = p_year
      AND month = p_month;

    -- Consolidar receitas de concessão
    UPDATE monthly_tax_settlement mts
    SET gross_concession_revenue = (
        SELECT COALESCE(SUM(calculation_base), 0)
        FROM tax_entries
        WHERE cinema_complex_id = p_complex_id
          AND YEAR(competence_date) = p_year
          AND MONTH(competence_date) = p_month
          AND source_type = v_concessao_type_id
          AND processed = TRUE
    )
    WHERE cinema_complex_id = p_complex_id
      AND year = p_year
      AND month = p_month;

    -- Consolidar outras receitas
    UPDATE monthly_tax_settlement mts
    SET gross_advertising_revenue = (
        SELECT COALESCE(SUM(calculation_base), 0)
        FROM tax_entries
        WHERE cinema_complex_id = p_complex_id
          AND YEAR(competence_date) = p_year
          AND MONTH(competence_date) = p_month
          AND source_type = v_publicidade_type_id
          AND processed = TRUE
    ),
    gross_other_revenue = (
        SELECT COALESCE(SUM(calculation_base), 0)
        FROM tax_entries
        WHERE cinema_complex_id = p_complex_id
          AND YEAR(competence_date) = p_year
          AND MONTH(competence_date) = p_month
          AND source_type = v_outros_type_id
          AND processed = TRUE
    )
    WHERE cinema_complex_id = p_complex_id
      AND year = p_year
      AND month = p_month;

    -- Calcular totais
    UPDATE monthly_tax_settlement
    SET total_gross_revenue = gross_box_office_revenue + gross_concession_revenue +
                               gross_advertising_revenue + gross_other_revenue,
        calculation_base_revenue = total_gross_revenue - total_deductions
    WHERE cinema_complex_id = p_complex_id
      AND year = p_year
      AND month = p_month;

    -- Consolidar ISS
    UPDATE monthly_tax_settlement
    SET total_iss = (
        SELECT COALESCE(SUM(iss_amount), 0)
        FROM tax_entries
        WHERE cinema_complex_id = p_complex_id
          AND YEAR(competence_date) = p_year
          AND MONTH(competence_date) = p_month
          AND apply_iss = TRUE
    )
    WHERE cinema_complex_id = p_complex_id
      AND year = p_year
      AND month = p_month;

    -- Consolidar PIS/COFINS
    UPDATE monthly_tax_settlement
    SET total_pis_payable = (
        SELECT COALESCE(SUM(pis_amount_payable), 0)
        FROM tax_entries
        WHERE cinema_complex_id = p_complex_id
          AND YEAR(competence_date) = p_year
          AND MONTH(competence_date) = p_month
    ),
    total_cofins_payable = (
        SELECT COALESCE(SUM(cofins_amount_payable), 0)
        FROM tax_entries
        WHERE cinema_complex_id = p_complex_id
          AND YEAR(competence_date) = p_year
          AND MONTH(competence_date) = p_month
    )
    WHERE cinema_complex_id = p_complex_id
      AND year = p_year
      AND month = p_month;

    -- Calcular IRPJ/CSLL
    SELECT calculation_base_revenue INTO v_gross_revenue
    FROM monthly_tax_settlement
    WHERE cinema_complex_id = p_complex_id
      AND year = p_year
      AND month = p_month;

    IF v_tax_regime = 'LUCRO_PRESUMIDO' THEN
        SELECT presumed_profit_percentage INTO v_presumed_percentage
        FROM federal_tax_rates ftr
        INNER JOIN tax_regimes tr ON ftr.tax_regime = tr.id
        INNER JOIN revenue_types rt ON ftr.revenue_type = rt.id
        WHERE tr.name = 'LUCRO_PRESUMIDO'
          AND rt.name = 'BILHETERIA'
          AND ftr.active = TRUE
        LIMIT 1;

        SET v_irpj_base = v_gross_revenue * (v_presumed_percentage / 100);
        SET v_irpj_15 = v_irpj_base * 0.15;
        SET v_irpj_additional = IF(v_irpj_base > 20000, (v_irpj_base - 20000) * 0.10, 0);
        SET v_csll = v_irpj_base * 0.09;

        UPDATE monthly_tax_settlement
        SET irpj_base = v_irpj_base,
            irpj_base_15 = v_irpj_15,
            irpj_additional_10 = v_irpj_additional,
            total_irpj = v_irpj_15 + v_irpj_additional,
            csll_base = v_irpj_base,
            total_csll = v_csll
        WHERE cinema_complex_id = p_complex_id
          AND year = p_year
          AND month = p_month;
    END IF;

    -- Calcular receitas líquidas
    UPDATE monthly_tax_settlement
    SET net_revenue_taxed = calculation_base_revenue - total_iss -
                           total_pis_payable - total_cofins_payable -
                           total_irpj - total_csll,
        net_total_revenue = calculation_base_revenue - total_iss -
                           total_pis_payable - total_cofins_payable -
                           total_irpj - total_csll - total_distributor_payment,
        status = v_apurada_status_id
    WHERE cinema_complex_id = p_complex_id
      AND year = p_year
      AND month = p_month;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_consultar_disponibilidade_sessao` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_consultar_disponibilidade_sessao`(
    IN p_showtime_id BIGINT
)
BEGIN
    SELECT
        a.id as assento_id,
        a.seat_code as codigo_assento,
        a.row_code as fileira,
        a.column_number as coluna,
        st.name as tipo_assento_nome,
        st.additional_value as valor_adicional,
        a.position_x as pos_x,
        a.position_y as pos_y,
        COALESCE(ss.name, 'Disponível') as status_nome,
        sas.expiration_date as data_expiracao,
        CASE
            WHEN sas.status = (SELECT id FROM seat_status WHERE name = 'Reservado')
                 AND sas.expiration_date > NOW()
            THEN TIMESTAMPDIFF(SECOND, NOW(), sas.expiration_date)
            ELSE NULL
        END as segundos_restantes
    FROM seats a
    INNER JOIN rooms s ON a.room_id = s.id
    INNER JOIN showtime_schedule ps ON ps.room_id = s.id
    LEFT JOIN seat_types st ON a.seat_type = st.id
    LEFT JOIN session_seat_status sas ON sas.showtime_id = ps.id AND sas.seat_id = a.id
    LEFT JOIN seat_status ss ON sas.status = ss.id
    WHERE ps.id = p_showtime_id
    AND a.active = TRUE
    ORDER BY a.row_code, a.column_number;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_criar_lancamento_bilheteria` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_criar_lancamento_bilheteria`(IN p_sale_id BIGINT)
BEGIN
    DECLARE v_complex_id BIGINT;
    DECLARE v_sale_date TIMESTAMP;
    DECLARE v_net_amount DECIMAL(10,2);
    DECLARE v_iss_rate DECIMAL(5,2);
    DECLARE v_pis_rate DECIMAL(5,2);
    DECLARE v_cofins_rate DECIMAL(5,2);
    DECLARE v_pis_cofins_regime VARCHAR(20);
    DECLARE v_ibge_code VARCHAR(7);
    DECLARE v_iss_concession_applicable BOOLEAN;
    DECLARE v_tax_entry_id BIGINT;
    DECLARE v_confirmed_status_id BIGINT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Buscar ID do status CONFIRMADA
    SELECT id INTO v_confirmed_status_id
    FROM sale_status WHERE name = 'CONFIRMADA';

    -- Validar venda
    IF NOT EXISTS (
        SELECT 1 FROM sales
        WHERE id = p_sale_id AND status = v_confirmed_status_id
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Venda não encontrada ou não confirmada';
    END IF;

    SELECT cinema_complex_id, sale_date, net_amount
    INTO v_complex_id, v_sale_date, v_net_amount
    FROM sales WHERE id = p_sale_id;

    IF v_complex_id IS NULL OR v_net_amount IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Dados incompletos da venda';
    END IF;

    CALL sp_buscar_aliquotas_vigentes(
        v_complex_id, 'BILHETERIA', DATE(v_sale_date),
        v_iss_rate, v_pis_rate, v_cofins_rate,
        v_pis_cofins_regime, v_ibge_code, v_iss_concession_applicable
    );

    SET v_iss_rate = IFNULL(v_iss_rate, 0);
    SET v_pis_rate = IFNULL(v_pis_rate, 0);
    SET v_cofins_rate = IFNULL(v_cofins_rate, 0);

    -- Buscar ID do tipo de receita BILHETERIA
    INSERT INTO tax_entries (
        cinema_complex_id, source_type, source_id, competence_date,
        gross_amount, deductions_amount, calculation_base,
        apply_iss, iss_rate, iss_amount, ibge_municipality_code,
        pis_cofins_regime, pis_rate, pis_debit_amount, pis_amount_payable,
        cofins_rate, cofins_debit_amount, cofins_amount_payable,
        snapshot_rates
    ) VALUES (
        v_complex_id,
        (SELECT id FROM revenue_types WHERE name = 'BILHETERIA'),
        p_sale_id, DATE(v_sale_date),
        v_net_amount, 0, v_net_amount,
        TRUE, v_iss_rate, v_net_amount * (v_iss_rate / 100), v_ibge_code,
        v_pis_cofins_regime, v_pis_rate, v_net_amount * (v_pis_rate / 100),
        v_net_amount * (v_pis_rate / 100),
        v_cofins_rate, v_net_amount * (v_cofins_rate / 100),
        v_net_amount * (v_cofins_rate / 100),
        JSON_OBJECT(
            'iss', v_iss_rate, 'pis', v_pis_rate, 'cofins', v_cofins_rate,
            'regime', v_pis_cofins_regime, 'calculation_date', NOW()
        )
    );

    SET v_tax_entry_id = LAST_INSERT_ID();

    IF v_pis_cofins_regime = 'NAO_CUMULATIVO' THEN
        CALL sp_processar_lancamento_tributario(v_tax_entry_id);
    END IF;

    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_criar_lancamento_concessao` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_criar_lancamento_concessao`(
    IN p_concession_sale_id BIGINT
)
BEGIN
    DECLARE v_complex_id BIGINT;
    DECLARE v_sale_date TIMESTAMP;
    DECLARE v_net_amount DECIMAL(10,2);
    DECLARE v_iss_rate DECIMAL(5,2);
    DECLARE v_pis_rate DECIMAL(5,2);
    DECLARE v_cofins_rate DECIMAL(5,2);
    DECLARE v_pis_cofins_regime VARCHAR(20);
    DECLARE v_ibge_code VARCHAR(7);
    DECLARE v_iss_concession_applicable BOOLEAN;
    DECLARE v_apply_iss BOOLEAN;

    SELECT s.cinema_complex_id, cs.sale_date, cs.net_amount
    INTO v_complex_id, v_sale_date, v_net_amount
    FROM concession_sales cs
    INNER JOIN sales s ON cs.sale_id = s.id
    WHERE cs.id = p_concession_sale_id;

    CALL sp_buscar_aliquotas_vigentes(
        v_complex_id,
        'CONCESSAO',
        DATE(v_sale_date),
        v_iss_rate,
        v_pis_rate,
        v_cofins_rate,
        v_pis_cofins_regime,
        v_ibge_code,
        v_iss_concession_applicable
    );

    SET v_apply_iss = v_iss_concession_applicable;

    INSERT INTO tax_entries (
        cinema_complex_id,
        source_type,
        source_id,
        competence_date,
        gross_amount,
        deductions_amount,
        calculation_base,
        apply_iss,
        iss_rate,
        iss_amount,
        ibge_municipality_code,
        pis_cofins_regime,
        pis_rate,
        pis_debit_amount,
        pis_amount_payable,
        cofins_rate,
        cofins_debit_amount,
        cofins_amount_payable,
        snapshot_rates
    ) VALUES (
        v_complex_id,
        'CONCESSAO',
        p_concession_sale_id,
        DATE(v_sale_date),
        v_net_amount,
        0,
        v_net_amount,
        v_apply_iss,
        IF(v_apply_iss, v_iss_rate, 0),
        IF(v_apply_iss, v_net_amount * (v_iss_rate / 100), 0),
        v_ibge_code,
        v_pis_cofins_regime,
        v_pis_rate,
        v_net_amount * (v_pis_rate / 100),
        v_net_amount * (v_pis_rate / 100),
        v_cofins_rate,
        v_net_amount * (v_cofins_rate / 100),
        v_net_amount * (v_cofins_rate / 100),
        JSON_OBJECT(
            'iss', v_iss_rate,
            'pis', v_pis_rate,
            'cofins', v_cofins_rate,
            'regime', v_pis_cofins_regime,
            'apply_iss', v_apply_iss
        )
    );

    IF v_pis_cofins_regime = 'NAO_CUMULATIVO' THEN
        CALL sp_processar_lancamento_tributario(LAST_INSERT_ID());
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_criar_usuario_funcionario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_criar_usuario_funcionario`(
    IN p_employee_id BIGINT,
    IN p_temporary_password VARCHAR(255)
)
BEGIN
    DECLARE v_username VARCHAR(50);
    DECLARE v_email VARCHAR(100);
    DECLARE v_name VARCHAR(200);
    DECLARE v_user_exists INT;

    -- Buscar dados do funcionário
    SELECT name, email
    INTO v_name, v_email
    FROM employees
    WHERE id = p_employee_id;

    IF v_email IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Funcionário deve ter email cadastrado';
    END IF;

    -- Gerar username
    SET v_username = LOWER(CONCAT(
        SUBSTRING_INDEX(v_name, ' ', 1), '.',
        SUBSTRING_INDEX(v_name, ' ', -1)
    ));

    -- Verificar se username já existe
    SELECT COUNT(*) INTO v_user_exists
    FROM system_users
    WHERE username = v_username OR email = v_email;

    IF v_user_exists > 0 THEN
        SET v_username = CONCAT(v_username, '.', p_employee_id);
    END IF;

    -- Criar usuário
    INSERT INTO system_users (
        employee_id, username, email, password_hash
    ) VALUES (
        p_employee_id, v_username, v_email, p_temporary_password
    );

    SELECT
        LAST_INSERT_ID() as usuario_id,
        v_username as username,
        v_email as email,
        'Usuário criado com sucesso' as mensagem;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_expirar_pontos` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_expirar_pontos`()
BEGIN
    DECLARE v_total_expired INT DEFAULT 0;
    DECLARE v_customers_affected INT DEFAULT 0;
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_customer_id BIGINT;
    DECLARE v_points_expired INT;

    DECLARE cur_customers CURSOR FOR
        SELECT customer_id, SUM(points) as points_expired
        FROM customer_points
        WHERE movement_type = 'CREDITO'
          AND valid = TRUE
          AND expiration_date < CURDATE()
        GROUP BY customer_id;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    START TRANSACTION;

    OPEN cur_customers;

    read_loop: LOOP
        FETCH cur_customers INTO v_customer_id, v_points_expired;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Marcar pontos como expirados (por cliente)
        UPDATE customer_points
        SET valid = FALSE
        WHERE customer_id = v_customer_id
          AND movement_type = 'CREDITO'
          AND valid = TRUE
          AND expiration_date < CURDATE();

        -- Registrar expiração
        INSERT INTO customer_points (
            customer_id, movement_type, points,
            previous_balance, current_balance, origin_type, description
        )
        SELECT
            v_customer_id,
            'EXPIRACAO',
            -v_points_expired,
            accumulated_points,
            accumulated_points - v_points_expired,
            'SISTEMA',
            CONCAT('Expiração de ', v_points_expired, ' pontos')
        FROM customers
        WHERE id = v_customer_id;

        -- Atualizar saldo do cliente
        UPDATE customers
        SET accumulated_points = accumulated_points - v_points_expired
        WHERE id = v_customer_id;

        SET v_total_expired = v_total_expired + v_points_expired;
        SET v_customers_affected = v_customers_affected + 1;
    END LOOP;

    CLOSE cur_customers;

    COMMIT;

    SELECT
        v_total_expired as total_pontos_expirados,
        v_customers_affected as clientes_afetados,
        NOW() as executado_em;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_gerar_alertas_estoque_baixo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_gerar_alertas_estoque_baixo`(
    IN p_complex_id BIGINT
)
BEGIN
    SELECT
        p.id as produto_id,
        p.name as produto_nome,
        ps.current_quantity as quantidade_atual,
        ps.minimum_quantity as quantidade_minima,
        (ps.minimum_quantity - ps.current_quantity) as quantidade_faltante,
        cc.name as complexo_nome,
        ps.location as localizacao
    FROM product_stock ps
    INNER JOIN products p ON ps.product_id = p.id
    INNER JOIN cinema_complexes cc ON ps.complex_id = cc.id
    WHERE ps.current_quantity <= ps.minimum_quantity
    AND ps.active = TRUE
    AND (p_complex_id IS NULL OR ps.complex_id = p_complex_id)
    ORDER BY (ps.minimum_quantity - ps.current_quantity) DESC;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_gerar_cupom_personalizado` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_gerar_cupom_personalizado`(
    IN p_campaign_id BIGINT,
    IN p_customer_id BIGINT,
    IN p_prefix VARCHAR(10),
    IN p_quantity INT,
    IN p_validity_days INT
)
BEGIN
    DECLARE v_counter INT DEFAULT 0;
    DECLARE v_coupon_code VARCHAR(50);
    DECLARE v_random_code VARCHAR(10);

    WHILE v_counter < p_quantity DO
        -- Gerar código aleatório
        SET v_random_code = UPPER(SUBSTRING(MD5(RAND()), 1, 8));
        SET v_coupon_code = CONCAT(p_prefix, v_random_code);

        -- Inserir cupom
        INSERT INTO promotional_coupons (
            campaign_id, coupon_code, customer_id,
            start_date, end_date, max_uses
        ) VALUES (
            p_campaign_id, v_coupon_code, p_customer_id,
            NOW(), DATE_ADD(CURDATE(), INTERVAL p_validity_days DAY), 1
        );

        SET v_counter = v_counter + 1;
    END WHILE;

    SELECT
        p_quantity as cupons_gerados,
        p_campaign_id as campanha_id,
        p_customer_id as cliente_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_limpar_permissoes_expiradas` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_limpar_permissoes_expiradas`()
BEGIN
    UPDATE user_permissions
    SET active = FALSE
    WHERE expiration_date IS NOT NULL
    AND expiration_date < NOW()
    AND active = TRUE;

    SELECT
        ROW_COUNT() as permissoes_expiradas,
        NOW() as executado_em;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_limpar_reservas_expiradas` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_limpar_reservas_expiradas`()
BEGIN
    DECLARE v_reservas_liberadas INT;
    DECLARE v_reserved_status_id BIGINT;
    DECLARE v_available_status_id BIGINT;

    -- Obter IDs dos status
    SELECT id INTO v_reserved_status_id FROM seat_status WHERE name = 'Reservado';
    SELECT id INTO v_available_status_id FROM seat_status WHERE name = 'Disponível';

    UPDATE session_seat_status
    SET status = v_available_status_id,
        reservation_uuid = NULL,
        reservation_date = NULL,
        expiration_date = NULL,
        sale_id = NULL
    WHERE status = v_reserved_status_id
    AND expiration_date < NOW();

    SET v_reservas_liberadas = ROW_COUNT();

    SELECT
        v_reservas_liberadas as reservas_liberadas,
        NOW() as executado_em;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_listar_permissoes_usuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_listar_permissoes_usuario`(
    IN p_usuario_id BIGINT
)
BEGIN
    SELECT
        r.code as codigo,
        r.name as rotina_nome,
        r.module as modulo,
        r.category as categoria,
        r.risk_level as nivel_risco,
        GROUP_CONCAT(DISTINCT vpc.operacao ORDER BY vpc.operacao) as operacoes,
        GROUP_CONCAT(DISTINCT vpc.origem_permissao) as origem,
        r.requires_approval as requer_aprovacao,
        r.requires_supervisor_password as requer_senha_supervisor
    FROM vw_usuario_permissoes_completas vpc
    INNER JOIN system_routines r ON vpc.rotina_codigo = r.code
    WHERE vpc.usuario_id = p_usuario_id
    GROUP BY r.code, r.name, r.module, r.category, r.risk_level,
             r.requires_approval, r.requires_supervisor_password
    ORDER BY r.module, r.code;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_processar_lancamento_tributario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_processar_lancamento_tributario`(
    IN p_tax_entry_id BIGINT
)
BEGIN
    DECLARE v_complex_id BIGINT;
    DECLARE v_competence_date DATE;
    DECLARE v_pis_cofins_regime VARCHAR(20);
    DECLARE v_pis_credit DECIMAL(15,2);
    DECLARE v_cofins_credit DECIMAL(15,2);

    SELECT
        cinema_complex_id,
        competence_date,
        pis_cofins_regime
    INTO
        v_complex_id,
        v_competence_date,
        v_pis_cofins_regime
    FROM tax_entries
    WHERE id = p_tax_entry_id;

    IF v_pis_cofins_regime = 'NAO_CUMULATIVO' THEN
        SELECT COALESCE(SUM(pis_credit_amount), 0)
        INTO v_pis_credit
        FROM pis_cofins_credits
        WHERE cinema_complex_id = v_complex_id
          AND competence_date = v_competence_date
          AND processed = FALSE;

        SELECT COALESCE(SUM(cofins_credit_amount), 0)
        INTO v_cofins_credit
        FROM pis_cofins_credits
        WHERE cinema_complex_id = v_complex_id
          AND competence_date = v_competence_date
          AND processed = FALSE;

        UPDATE tax_entries
        SET
            pis_credit_amount = v_pis_credit,
            pis_amount_payable = GREATEST(pis_debit_amount - v_pis_credit, 0),
            cofins_credit_amount = v_cofins_credit,
            cofins_amount_payable = GREATEST(cofins_debit_amount - v_cofins_credit, 0),
            processed = TRUE,
            processing_date = NOW()
        WHERE id = p_tax_entry_id;

        UPDATE pis_cofins_credits
        SET processed = TRUE
        WHERE cinema_complex_id = v_complex_id
          AND competence_date = v_competence_date
          AND processed = FALSE;
    ELSE
        UPDATE tax_entries
        SET
            pis_amount_payable = pis_debit_amount,
            cofins_amount_payable = cofins_debit_amount,
            processed = TRUE,
            processing_date = NOW()
        WHERE id = p_tax_entry_id;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_register_coupon_usage` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_register_coupon_usage`(
    IN p_sale_id BIGINT,
    IN p_coupon_id BIGINT,
    IN p_campaign_id BIGINT,
    IN p_customer_id BIGINT,
    IN p_original_value DECIMAL(10,2),
    IN p_discount_applied DECIMAL(10,2)
)
BEGIN
    DECLARE v_final_value DECIMAL(10,2);
    DECLARE v_promotion_type_id BIGINT;
    DECLARE v_points_earned INT DEFAULT 0;
    DECLARE v_points_multiplier DECIMAL(5,2);

    SET v_final_value = p_original_value - p_discount_applied;

    -- Get promotion type and points multiplier
    SELECT promotion_type_id, points_multiplier
    INTO v_promotion_type_id, v_points_multiplier
    FROM promotional_campaigns
    WHERE id = p_campaign_id;

    -- Calculate points (1 point for every $10)
    SET v_points_earned = FLOOR((v_final_value / 10) * v_points_multiplier);

    START TRANSACTION;

    -- Register usage
    INSERT INTO promotions_used (
        sale_id, campaign_id, coupon_id, customer_id,
        promotion_type_id, discount_applied, original_value,
        final_value, points_earned
    ) VALUES (
        p_sale_id, p_campaign_id, p_coupon_id, p_customer_id,
        v_promotion_type_id, p_discount_applied, p_original_value,
        v_final_value, v_points_earned
    );

    -- Update coupon
    UPDATE promotional_coupons
    SET used_count = used_count + 1,
        used = (used_count + 1 >= max_uses),
        last_use_date = NOW(),
        first_use_date = COALESCE(first_use_date, NOW())
    WHERE id = p_coupon_id;

    -- Update campaign
    UPDATE promotional_campaigns
    SET used_count = used_count + 1
    WHERE id = p_campaign_id;

    -- Add points to customer
    IF v_points_earned > 0 THEN
        CALL sp_adicionar_pontos(p_customer_id, v_points_earned, 'PURCHASE', p_sale_id);
    END IF;

    COMMIT;

    SELECT
        'Cupom aplicado com sucesso' as mensagem,
        v_final_value as valor_final,
        p_discount_applied as desconto,
        v_points_earned as pontos_ganhos;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_registrar_acao_sensivel` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_registrar_acao_sensivel`(
    IN p_usuario_id BIGINT,
    IN p_rotina_codigo INT,
    IN p_operacao VARCHAR(20),
    IN p_entidade_tipo VARCHAR(50),
    IN p_entidade_id BIGINT,
    IN p_ip_origem VARCHAR(45),
    IN p_user_agent VARCHAR(255),
    IN p_dados_antes JSON,
    IN p_dados_depois JSON,
    IN p_aprovado_por BIGINT
)
BEGIN
    DECLARE v_requer_aprovacao BOOLEAN;
    DECLARE v_status VARCHAR(20);

    -- Verificar se requer aprovação
    SELECT requires_approval INTO v_requer_aprovacao
    FROM system_routines
    WHERE code = p_rotina_codigo;

    SET v_status = IF(v_requer_aprovacao AND p_aprovado_por IS NULL, 'PENDENTE', 'APROVADO');

    INSERT INTO sensitive_actions_log (
        user_id, routine_code, operation,
        entity_type, entity_id,
        origin_ip, user_agent,
        data_before, data_after,
        approved_by, status
    ) VALUES (
        p_usuario_id, p_rotina_codigo, p_operacao,
        p_entidade_tipo, p_entidade_id,
        p_ip_origem, p_user_agent,
        p_dados_antes, p_dados_depois,
        p_aprovado_por, v_status
    );

    SELECT
        LAST_INSERT_ID() as log_id,
        v_status as status,
        'Ação registrada com sucesso' as mensagem;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_registrar_consentimento` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_registrar_consentimento`(
    IN p_subject_type VARCHAR(20),
    IN p_subject_id BIGINT,
    IN p_purpose VARCHAR(100),
    IN p_purpose_description TEXT,
    IN p_data_categories JSON,
    IN p_sensitive_data BOOLEAN,
    IN p_consent_given BOOLEAN,
    IN p_terms_version VARCHAR(20),
    IN p_ip VARCHAR(45),
    IN p_user_agent TEXT,
    IN p_channel VARCHAR(30)
)
BEGIN
    INSERT INTO gdpr_consents (
        subject_type, subject_id, purpose, purpose_description,
        data_categories, sensitive_data, consent_given,
        consent_date, terms_version, consent_ip,
        user_agent, channel
    ) VALUES (
        p_subject_type, p_subject_id, p_purpose, p_purpose_description,
        p_data_categories, p_sensitive_data, p_consent_given,
        IF(p_consent_given, NOW(), NULL), p_terms_version, p_ip,
        p_user_agent, p_channel
    );

    SELECT LAST_INSERT_ID() as consentimento_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_registrar_interacao` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_registrar_interacao`(
    IN p_customer_id BIGINT,
    IN p_interaction_type VARCHAR(50),
    IN p_channel VARCHAR(30),
    IN p_description TEXT,
    IN p_metadata JSON,
    IN p_origin_type VARCHAR(50),
    IN p_origin_id BIGINT
)
BEGIN
    INSERT INTO customer_interactions (
        customer_id, interaction_type, channel, description,
        metadata, origin_type, origin_id
    ) VALUES (
        p_customer_id, p_interaction_type, p_channel, p_description,
        p_metadata, p_origin_type, p_origin_id
    );

    SELECT LAST_INSERT_ID() as interacao_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_revogar_permissao` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_revogar_permissao`(
    IN p_usuario_id BIGINT,
    IN p_rotina_codigo INT,
    IN p_operacao VARCHAR(20)
)
BEGIN
    UPDATE user_permissions
    SET active = FALSE
    WHERE user_id = p_usuario_id
    AND routine_code = p_rotina_codigo
    AND operation = p_operacao;

    SELECT
        ROW_COUNT() as permissoes_revogadas,
        'Permissão revogada com sucesso' as mensagem;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_validate_coupon` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_validate_coupon`(
    IN p_coupon_code VARCHAR(50),
    IN p_customer_id BIGINT,
    IN p_purchase_value DECIMAL(10,2),
    IN p_purchase_date TIMESTAMP,
    OUT p_valid BOOLEAN,
    OUT p_campaign_id BIGINT,
    OUT p_coupon_id BIGINT,
    OUT p_discount DECIMAL(10,2),
    OUT p_message TEXT
)
sp_validate: BEGIN
    DECLARE v_coupon_exists INT DEFAULT 0;
    DECLARE v_coupon_active BOOLEAN;
    DECLARE v_start_date TIMESTAMP;
    DECLARE v_end_date TIMESTAMP;
    DECLARE v_used_count INT;
    DECLARE v_max_uses INT;
    DECLARE v_linked_customer BIGINT;
    DECLARE v_max_uses_per_customer INT;
    DECLARE v_customer_uses INT;
    DECLARE v_min_purchase_value DECIMAL(10,2);
    DECLARE v_promotion_type_id BIGINT;
    DECLARE v_discount_percentage DECIMAL(5,2);
    DECLARE v_discount_value DECIMAL(10,2);
    DECLARE v_fixed_price DECIMAL(10,2);
    DECLARE v_promotion_type_code VARCHAR(30);

    SET p_valid = FALSE;
    SET p_discount = 0;

    SELECT COUNT(*) INTO v_coupon_exists
    FROM promotional_coupons
    WHERE coupon_code = p_coupon_code;

    IF v_coupon_exists = 0 THEN
        SET p_message = 'Cupom não encontrado';
        LEAVE sp_validate;
    END IF;

    SELECT
        c.id, c.campaign_id, c.active, c.start_date, c.end_date,
        c.used_count, c.max_uses, c.customer_id,
        cp.promotion_type_id, cp.discount_percentage, cp.discount_value,
        cp.fixed_price, cp.max_uses_per_customer, cp.min_purchase_value,
        ptd.code
    INTO
        p_coupon_id, p_campaign_id, v_coupon_active,
        v_start_date, v_end_date, v_used_count, v_max_uses,
        v_linked_customer, v_promotion_type_id, v_discount_percentage,
        v_discount_value, v_fixed_price, v_max_uses_per_customer, v_min_purchase_value,
        v_promotion_type_code
    FROM promotional_coupons c
    INNER JOIN promotional_campaigns cp ON c.campaign_id = cp.id
    INNER JOIN promotion_types_domain ptd ON cp.promotion_type_id = ptd.id
    WHERE c.coupon_code = p_coupon_code;

    IF NOT v_coupon_active THEN
        SET p_message = 'Cupom inativo';
        LEAVE sp_validate;
    END IF;

    IF p_purchase_date < v_start_date OR p_purchase_date > v_end_date THEN
        SET p_message = 'Cupom fora do período de validade';
        LEAVE sp_validate;
    END IF;

    IF v_used_count >= v_max_uses THEN
        SET p_message = 'Cupom atingiu limite de usos';
        LEAVE sp_validate;
    END IF;

    IF v_linked_customer IS NOT NULL AND v_linked_customer != p_customer_id THEN
        SET p_message = 'Cupom não pertence a este cliente';
        LEAVE sp_validate;
    END IF;

    IF v_min_purchase_value IS NOT NULL AND p_purchase_value < v_min_purchase_value THEN
        SET p_message = CONCAT('Valor mínimo da compra: R$ ', v_min_purchase_value);
        LEAVE sp_validate;
    END IF;

    IF v_max_uses_per_customer IS NOT NULL THEN
        SELECT COUNT(*) INTO v_customer_uses
        FROM promotions_used
        WHERE campaign_id = p_campaign_id
          AND customer_id = p_customer_id;

        IF v_customer_uses >= v_max_uses_per_customer THEN
            SET p_message = 'Limite de usos por cliente atingido';
            LEAVE sp_validate;
        END IF;
    END IF;

    CASE v_promotion_type_code
        WHEN 'PERCENTAGE_DISCOUNT' THEN
            SET p_discount = p_purchase_value * (v_discount_percentage / 100);
        WHEN 'VALUE_DISCOUNT' THEN
            SET p_discount = LEAST(v_discount_value, p_purchase_value);
        WHEN 'FIXED_PRICE_TICKET' THEN
            SET p_discount = GREATEST(0, p_purchase_value - v_fixed_price);
        ELSE
            SET p_discount = 0;
    END CASE;

    SET p_valid = TRUE;
    SET p_message = 'Cupom válido';

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_verificar_permissao` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_verificar_permissao`(
    IN p_usuario_id BIGINT,
    IN p_rotina_codigo INT,
    IN p_operacao VARCHAR(20),
    OUT p_tem_permissao BOOLEAN,
    OUT p_requer_aprovacao BOOLEAN,
    OUT p_origem VARCHAR(50)
)
BEGIN
    DECLARE v_count INT DEFAULT 0;
    DECLARE v_requer_aprovacao BOOLEAN DEFAULT FALSE;

    -- Buscar se rotina requer aprovação
    SELECT requires_approval INTO v_requer_aprovacao
    FROM system_routines
    WHERE code = p_rotina_codigo
    LIMIT 1;

    -- Verificar permissão individual
    SELECT COUNT(*) INTO v_count
    FROM user_permissions
    WHERE user_id = p_usuario_id
    AND routine_code = p_rotina_codigo
    AND operation = p_operacao
    AND active = TRUE
    AND (expiration_date IS NULL OR expiration_date > NOW());

    IF v_count > 0 THEN
        SET p_tem_permissao = TRUE;
        SET p_origem = 'INDIVIDUAL';
        SET p_requer_aprovacao = v_requer_aprovacao;
    ELSE
        -- Verificar permissão por perfil
        SELECT COUNT(*) INTO v_count
        FROM user_profiles up
        INNER JOIN profile_permissions pp ON up.profile_id = pp.profile_id
        WHERE up.user_id = p_usuario_id
        AND pp.routine_code = p_rotina_codigo
        AND pp.operation = p_operacao
        AND up.active = TRUE;

        IF v_count > 0 THEN
            SET p_tem_permissao = TRUE;
            SET p_origem = 'PERFIL';
            SET p_requer_aprovacao = v_requer_aprovacao;
        ELSE
            SET p_tem_permissao = FALSE;
            SET p_origem = 'NENHUMA';
            SET p_requer_aprovacao = FALSE;
        END IF;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `vw_active_campaigns`
--

/*!50001 DROP VIEW IF EXISTS `vw_active_campaigns`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_active_campaigns` AS select `cp`.`id` AS `id`,`cp`.`campaign_code` AS `campaign_code`,`cp`.`name` AS `name`,`cp`.`description` AS `description`,`cp`.`promotion_type_id` AS `promotion_type_id`,`pt`.`name` AS `promotion_type_name`,`cp`.`start_date` AS `start_date`,`cp`.`end_date` AS `end_date`,`cp`.`discount_value` AS `discount_value`,`cp`.`discount_percentage` AS `discount_percentage`,`cp`.`fixed_price` AS `fixed_price`,`cp`.`max_total_uses` AS `max_total_uses`,`cp`.`used_count` AS `used_count`,`cp`.`max_total_uses` - `cp`.`used_count` AS `available_uses`,`cp`.`max_uses_per_customer` AS `max_uses_per_customer`,`cp`.`requires_coupon` AS `requires_coupon`,`cp`.`combinable` AS `combinable`,`cp`.`priority` AS `priority`,count(distinct `cup`.`id`) AS `total_coupons`,sum(case when `cup`.`used` = 0 then 1 else 0 end) AS `available_coupons`,count(distinct `pu`.`id`) AS `total_uses`,coalesce(sum(`pu`.`discount_applied`),0) AS `total_discounts_value` from (((`promotional_campaigns` `cp` left join `promotion_types` `pt` on(`cp`.`promotion_type_id` = `pt`.`id`)) left join `promotional_coupons` `cup` on(`cp`.`id` = `cup`.`campaign_id`)) left join `promotions_used` `pu` on(`cp`.`id` = `pu`.`campaign_id`)) where `cp`.`active` = 1 and `cp`.`start_date` <= current_timestamp() and `cp`.`end_date` >= current_timestamp() group by `cp`.`id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_alertas_estoque_baixo`
--

/*!50001 DROP VIEW IF EXISTS `vw_alertas_estoque_baixo`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_alertas_estoque_baixo` AS select `c`.`id` AS `complexo_id`,`c`.`name` AS `complexo_nome`,`p`.`id` AS `produto_id`,`p`.`name` AS `produto_nome`,`p`.`product_code` AS `codigo_produto`,`ps`.`current_quantity` AS `quantidade_atual`,`ps`.`minimum_quantity` AS `quantidade_minima`,`ps`.`minimum_quantity` - `ps`.`current_quantity` AS `deficit`,`ps`.`location` AS `localizacao`,case when `ps`.`current_quantity` = 0 then 'CRITICO' when `ps`.`current_quantity` <= `ps`.`minimum_quantity` * 0.5 then 'URGENTE' else 'ATENCAO' end AS `nivel_alerta` from ((`product_stock` `ps` join `products` `p` on(`ps`.`product_id` = `p`.`id`)) join `cinema_complexes` `c` on(`ps`.`complex_id` = `c`.`id`)) where `ps`.`current_quantity` <= `ps`.`minimum_quantity` and `ps`.`active` = 1 order by case when `ps`.`current_quantity` = 0 then 1 when `ps`.`current_quantity` <= `ps`.`minimum_quantity` * 0.5 then 2 else 3 end,`ps`.`minimum_quantity` - `ps`.`current_quantity` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_all_domains`
--

/*!50001 DROP VIEW IF EXISTS `vw_all_domains`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_all_domains` AS select 'tax_regime' AS `table_name`,`tax_regimes`.`id` AS `id`,`tax_regimes`.`name` AS `name`,1 AS `active` from `tax_regimes` union all select 'pis_cofins_regime' AS `pis_cofins_regime`,`pis_cofins_regimes`.`id` AS `id`,`pis_cofins_regimes`.`name` AS `name`,1 AS `1` from `pis_cofins_regimes` union all select 'revenue_type' AS `revenue_type`,`revenue_types`.`id` AS `id`,`revenue_types`.`name` AS `name`,1 AS `1` from `revenue_types` union all select 'age_rating' AS `age_rating`,`age_ratings`.`id` AS `id`,`age_ratings`.`name` AS `name`,1 AS `1` from `age_ratings` union all select 'supplier_type' AS `supplier_type`,`supplier_types`.`id` AS `id`,`supplier_types`.`name` AS `name`,1 AS `1` from `supplier_types` union all select 'contract_type' AS `contract_type`,`contract_types`.`id` AS `id`,`contract_types`.`name` AS `name`,1 AS `1` from `contract_types` union all select 'projection_type' AS `projection_type`,`projection_types`.`id` AS `id`,`projection_types`.`name` AS `name`,1 AS `1` from `projection_types` union all select 'audio_type' AS `audio_type`,`audio_types`.`id` AS `id`,`audio_types`.`name` AS `name`,1 AS `1` from `audio_types` union all select 'session_language' AS `session_language`,`session_languages`.`id` AS `id`,`session_languages`.`name` AS `name`,1 AS `1` from `session_languages` union all select 'session_status' AS `session_status`,`session_status`.`id` AS `id`,`session_status`.`name` AS `name`,1 AS `1` from `session_status` union all select 'sale_type' AS `sale_type`,`sale_types`.`id` AS `id`,`sale_types`.`name` AS `name`,1 AS `1` from `sale_types` union all select 'payment_method' AS `payment_method`,`payment_methods`.`id` AS `id`,`payment_methods`.`name` AS `name`,1 AS `1` from `payment_methods` union all select 'sale_status' AS `sale_status`,`sale_status`.`id` AS `id`,`sale_status`.`name` AS `name`,1 AS `1` from `sale_status` union all select 'ticket_type' AS `ticket_type`,`ticket_types`.`id` AS `id`,`ticket_types`.`name` AS `name`,1 AS `1` from `ticket_types` union all select 'concession_status' AS `concession_status`,`concession_status`.`id` AS `id`,`concession_status`.`name` AS `name`,1 AS `1` from `concession_status` union all select 'credit_type' AS `credit_type`,`credit_types`.`id` AS `id`,`credit_types`.`name` AS `name`,1 AS `1` from `credit_types` union all select 'tax_type' AS `tax_type`,`tax_types`.`id` AS `id`,`tax_types`.`name` AS `name`,1 AS `1` from `tax_types` union all select 'settlement_status' AS `settlement_status`,`settlement_status`.`id` AS `id`,`settlement_status`.`name` AS `name`,1 AS `1` from `settlement_status` union all select 'distributor_settlement_status' AS `distributor_settlement_status`,`distributor_settlement_status`.`id` AS `id`,`distributor_settlement_status`.`name` AS `name`,1 AS `1` from `distributor_settlement_status` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_anonymized_customers`
--

/*!50001 DROP VIEW IF EXISTS `vw_anonymized_customers`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_anonymized_customers` AS select concat('CLIENTE_',lpad(`customers`.`id`,8,'0')) AS `customer_code`,case when `customers`.`data_anonymized` then '***.***.***-**' else concat(substr(`customers`.`cpf`,1,3),'.***.***.',substr(`customers`.`cpf`,-2)) end AS `masked_cpf`,case when `customers`.`data_anonymized` then 'ANONIMIZADO' else concat(substr(`customers`.`name`,1,1),repeat('*',octet_length(`customers`.`name`) - 1)) end AS `masked_name`,case when `customers`.`data_anonymized` then '***@***.***' else concat(substring_index(`customers`.`email`,'@',1),'@***.**') end AS `masked_email`,`customers`.`city` AS `city`,`customers`.`state` AS `state`,timestampdiff(YEAR,`customers`.`birth_date`,curdate()) AS `age`,`customers`.`gender` AS `gender`,`customers`.`loyalty_level` AS `loyalty_level`,`customers`.`accumulated_points` AS `accumulated_points`,`customers`.`active` AS `active` from `customers` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_auditoria_permissoes`
--

/*!50001 DROP VIEW IF EXISTS `vw_auditoria_permissoes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_auditoria_permissoes` AS select `u`.`username` AS `usuario`,`e`.`name` AS `nome_completo`,`r`.`code` AS `rotina_codigo`,`r`.`name` AS `rotina_nome`,`up`.`operation` AS `operacao`,`uc`.`username` AS `concedida_por`,`up`.`grant_date` AS `data_concessao`,`up`.`expiration_date` AS `data_expiracao`,`up`.`reason` AS `motivo`,case when `up`.`expiration_date` is null then 'PERMANENTE' when `up`.`expiration_date` > current_timestamp() then 'ATIVA' else 'EXPIRADA' end AS `status` from ((((`user_permissions` `up` join `system_users` `u` on(`up`.`user_id` = `u`.`id`)) join `employees` `e` on(`u`.`employee_id` = `e`.`id`)) join `system_routines` `r` on(`up`.`routine_code` = `r`.`code`)) left join `system_users` `uc` on(`up`.`granted_by` = `uc`.`id`)) order by `up`.`grant_date` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_companies_complete`
--

/*!50001 DROP VIEW IF EXISTS `vw_companies_complete`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_companies_complete` AS select `e`.`id` AS `id`,`e`.`corporate_name` AS `corporate_name`,`e`.`trade_name` AS `trade_name`,`e`.`cnpj` AS `cnpj`,`e`.`state_registration` AS `state_registration`,`e`.`municipal_registration` AS `municipal_registration`,`e`.`tax_regime` AS `tax_regime`,`e`.`pis_cofins_regime` AS `pis_cofins_regime`,`e`.`recine_opt_in` AS `recine_opt_in`,`e`.`recine_join_date` AS `recine_join_date`,`e`.`active` AS `active`,`e`.`created_at` AS `created_at`,`e`.`updated_at` AS `updated_at`,`tr`.`name` AS `tax_regime_name`,`tr`.`description` AS `tax_regime_description`,`pcr`.`name` AS `pis_cofins_regime_name`,`pcr`.`allows_credit` AS `regime_allows_credit` from ((`companies` `e` left join `tax_regimes` `tr` on(`e`.`tax_regime` = `tr`.`id`)) left join `pis_cofins_regimes` `pcr` on(`e`.`pis_cofins_regime` = `pcr`.`id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_complete_sales`
--

/*!50001 DROP VIEW IF EXISTS `vw_complete_sales`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_complete_sales` AS select `v`.`id` AS `id`,`v`.`cinema_complex_id` AS `cinema_complex_id`,`v`.`sale_number` AS `sale_number`,`v`.`sale_date` AS `sale_date`,`v`.`sale_type` AS `sale_type`,`v`.`user_id` AS `user_id`,`v`.`customer_id` AS `customer_id`,`v`.`customer_cpf` AS `customer_cpf`,`c`.`name` AS `customer_name`,`c`.`email` AS `customer_email`,`v`.`total_amount` AS `total_amount`,`v`.`discount_amount` AS `discount_amount`,`v`.`net_amount` AS `net_amount`,`v`.`payment_method` AS `payment_method`,`v`.`status` AS `status`,`v`.`cancellation_date` AS `cancellation_date`,`v`.`cancellation_reason` AS `cancellation_reason`,`v`.`created_at` AS `created_at`,`st`.`name` AS `sale_type_name`,`st`.`convenience_fee` AS `convenience_fee`,`pm`.`name` AS `payment_method_name`,`pm`.`operator_fee` AS `operator_fee`,`pm`.`settlement_days` AS `settlement_days`,`ss`.`name` AS `status_name`,`ss`.`allows_modification` AS `status_allows_modification` from ((((`sales` `v` left join `customers` `c` on(`v`.`customer_id` = `c`.`id`)) left join `sale_types` `st` on(`v`.`sale_type` = `st`.`id`)) left join `payment_methods` `pm` on(`v`.`payment_method` = `pm`.`id`)) left join `sale_status` `ss` on(`v`.`status` = `ss`.`id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_critical_stock`
--

/*!50001 DROP VIEW IF EXISTS `vw_critical_stock`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_critical_stock` AS select `ps`.`product_id` AS `product_id`,`p`.`product_code` AS `product_code`,`p`.`name` AS `product_name`,`pc`.`name` AS `category_name`,`ps`.`complex_id` AS `complex_id`,`c`.`name` AS `complex_name`,`ps`.`current_quantity` AS `current_quantity`,`ps`.`minimum_quantity` AS `minimum_quantity`,`ps`.`maximum_quantity` AS `maximum_quantity`,round(`ps`.`current_quantity` / `ps`.`maximum_quantity` * 100,2) AS `stock_percentage`,case when `ps`.`current_quantity` = 0 then 'OUT_OF_STOCK' when `ps`.`current_quantity` <= `ps`.`minimum_quantity` then 'CRITICAL' when `ps`.`current_quantity` <= `ps`.`minimum_quantity` * 1.5 then 'ALERT' else 'NORMAL' end AS `stock_status`,`ps`.`location` AS `location` from (((`product_stock` `ps` join `products` `p` on(`ps`.`product_id` = `p`.`id`)) join `product_categories` `pc` on(`p`.`category_id` = `pc`.`id`)) join `cinema_complexes` `c` on(`ps`.`complex_id` = `c`.`id`)) where `ps`.`active` = 1 and (`ps`.`current_quantity` <= `ps`.`minimum_quantity` or `ps`.`current_quantity` = 0) order by case when `ps`.`current_quantity` = 0 then 'OUT_OF_STOCK' when `ps`.`current_quantity` <= `ps`.`minimum_quantity` then 'CRITICAL' when `ps`.`current_quantity` <= `ps`.`minimum_quantity` * 1.5 then 'ALERT' else 'NORMAL' end,`ps`.`current_quantity` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_customers_churn`
--

/*!50001 DROP VIEW IF EXISTS `vw_customers_churn`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_customers_churn` AS select `c`.`id` AS `id`,`c`.`name` AS `name`,`c`.`email` AS `email`,`c`.`phone` AS `phone`,`c`.`loyalty_level` AS `loyalty_level`,`c`.`accumulated_points` AS `accumulated_points`,max(`s`.`sale_date`) AS `last_purchase`,to_days(current_timestamp()) - to_days(max(`s`.`sale_date`)) AS `inactive_days`,count(distinct `s`.`id`) AS `total_historical_purchases`,coalesce(sum(`s`.`net_amount`),0) AS `total_amount_spent`,case when to_days(current_timestamp()) - to_days(max(`s`.`sale_date`)) > 180 then 'CRITICAL' when to_days(current_timestamp()) - to_days(max(`s`.`sale_date`)) > 90 then 'HIGH_RISK' else 'AT_RISK' end AS `churn_level` from (`customers` `c` left join `sales` `s` on(`c`.`id` = `s`.`customer_id` and `s`.`status` = 'CONFIRMED')) where `c`.`active` = 1 group by `c`.`id`,`c`.`name`,`c`.`email`,`c`.`phone`,`c`.`loyalty_level`,`c`.`accumulated_points` having `inactive_days` > 60 or `inactive_days` is null order by to_days(current_timestamp()) - to_days(max(`s`.`sale_date`)) desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_customers_complete_profile`
--

/*!50001 DROP VIEW IF EXISTS `vw_customers_complete_profile`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_customers_complete_profile` AS select `c`.`id` AS `id`,`c`.`cpf` AS `cpf`,`c`.`name` AS `name`,`c`.`email` AS `email`,`c`.`phone` AS `phone`,`c`.`birth_date` AS `birth_date`,timestampdiff(YEAR,`c`.`birth_date`,curdate()) AS `age`,`c`.`gender` AS `gender`,`c`.`city` AS `city`,`c`.`state` AS `state`,`c`.`accumulated_points` AS `accumulated_points`,`c`.`loyalty_level` AS `loyalty_level`,`c`.`loyalty_join_date` AS `loyalty_join_date`,timestampdiff(DAY,`c`.`loyalty_join_date`,current_timestamp()) AS `loyalty_days`,`c`.`accepts_marketing` AS `accepts_marketing`,`c`.`active` AS `active`,`cp`.`preferred_session_type` AS `preferred_session_type`,`cp`.`preferred_language` AS `preferred_language`,`cp`.`preferred_position` AS `preferred_position`,count(distinct `s`.`id`) AS `total_purchases`,coalesce(sum(`s`.`net_amount`),0) AS `total_amount_spent`,coalesce(avg(`s`.`net_amount`),0) AS `average_ticket`,max(`s`.`sale_date`) AS `last_purchase`,to_days(current_timestamp()) - to_days(max(`s`.`sale_date`)) AS `days_since_last_purchase`,count(distinct `t`.`id`) AS `total_tickets`,count(distinct `t`.`showtime_id`) AS `total_sessions_attended`,case when to_days(current_timestamp()) - to_days(max(`s`.`sale_date`)) <= 30 then 'RECENT' when to_days(current_timestamp()) - to_days(max(`s`.`sale_date`)) <= 90 then 'MEDIUM' else 'INACTIVE' end AS `recency`,case when count(distinct `s`.`id`) >= 10 then 'HIGH' when count(distinct `s`.`id`) >= 5 then 'MEDIUM' else 'LOW' end AS `frequency`,case when coalesce(sum(`s`.`net_amount`),0) >= 500 then 'HIGH' when coalesce(sum(`s`.`net_amount`),0) >= 200 then 'MEDIUM' else 'LOW' end AS `monetary_value` from (((`customers` `c` left join `customer_preferences` `cp` on(`c`.`id` = `cp`.`customer_id`)) left join `sales` `s` on(`c`.`id` = `s`.`customer_id` and `s`.`status` = (select `sale_status`.`id` from `sale_status` where `sale_status`.`name` = 'CONFIRMADA'))) left join `tickets` `t` on(`s`.`id` = `t`.`sale_id`)) group by `c`.`id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_daily_concession`
--

/*!50001 DROP VIEW IF EXISTS `vw_daily_concession`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_daily_concession` AS select `c`.`id` AS `complex_id`,`c`.`name` AS `complex_name`,cast(`cs`.`sale_date` as date) AS `date`,count(distinct `cs`.`id`) AS `total_sales`,sum(`cs`.`net_amount`) AS `concession_revenue`,sum(`csi`.`quantity`) AS `total_items_sold` from (((`concession_sales` `cs` join `sales` `s` on(`cs`.`sale_id` = `s`.`id`)) join `cinema_complexes` `c` on(`s`.`cinema_complex_id` = `c`.`id`)) join `concession_sale_items` `csi` on(`cs`.`id` = `csi`.`concession_sale_id`)) where `cs`.`status` = 'PAGO' group by `c`.`id`,`c`.`name`,cast(`cs`.`sale_date` as date) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_daily_sales`
--

/*!50001 DROP VIEW IF EXISTS `vw_daily_sales`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_daily_sales` AS select cast(`s`.`sale_date` as date) AS `sale_date`,`s`.`cinema_complex_id` AS `cinema_complex_id`,`c`.`name` AS `complex_name`,count(0) AS `total_sales`,sum(`s`.`total_amount`) AS `gross_total_amount`,sum(`s`.`discount_amount`) AS `total_discount`,sum(`s`.`net_amount`) AS `net_total_amount`,avg(`s`.`net_amount`) AS `average_ticket`,count(case when `st`.`name` = 'NORMAL' then 1 end) AS `normal_sales`,count(case when `st`.`name` = 'ONLINE' then 1 end) AS `online_sales`,count(case when `st`.`name` = 'CORTESIA' then 1 end) AS `courtesy_sales`,count(case when `ss`.`name` = 'CONFIRMADA' then 1 end) AS `confirmed_sales`,count(case when `ss`.`name` = 'CANCELADA' then 1 end) AS `cancelled_sales`,count(case when `ss`.`name` = 'PENDENTE' then 1 end) AS `pending_sales` from (((`sales` `s` join `cinema_complexes` `c` on(`s`.`cinema_complex_id` = `c`.`id`)) left join `sale_types` `st` on(`s`.`sale_type` = `st`.`id`)) left join `sale_status` `ss` on(`s`.`status` = `ss`.`id`)) where `s`.`sale_date` >= curdate() - interval 30 day group by cast(`s`.`sale_date` as date),`s`.`cinema_complex_id`,`c`.`name` order by cast(`s`.`sale_date` as date) desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_dashboard_permissoes`
--

/*!50001 DROP VIEW IF EXISTS `vw_dashboard_permissoes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_dashboard_permissoes` AS select 'Total de Usuários Ativos' AS `metrica`,count(0) AS `valor` from `system_users` where `system_users`.`active` = 1 union all select 'Total de Rotinas' AS `Total de Rotinas`,count(0) AS `COUNT(*)` from `system_routines` where `system_routines`.`active` = 1 union all select 'Total de Perfis' AS `Total de Perfis`,count(0) AS `COUNT(*)` from `access_profiles` where `access_profiles`.`active` = 1 union all select 'Permissões Individuais' AS `Permissões Individuais`,count(0) AS `COUNT(*)` from `user_permissions` where `user_permissions`.`active` = 1 union all select 'Permissões por Perfil' AS `Permissões por Perfil`,count(0) AS `COUNT(*)` from `profile_permissions` union all select 'Ações Sensíveis Hoje' AS `Ações Sensíveis Hoje`,count(0) AS `COUNT(*)` from `sensitive_actions_log` where cast(`sensitive_actions_log`.`created_at` as date) = curdate() */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_financial_performance`
--

/*!50001 DROP VIEW IF EXISTS `vw_financial_performance`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_financial_performance` AS select `mts`.`year` AS `year`,`mts`.`month` AS `month`,`mts`.`cinema_complex_id` AS `cinema_complex_id`,`c`.`name` AS `complex_name`,`mts`.`total_gross_revenue` AS `gross_total_revenue`,`mts`.`total_deductions` AS `total_deductions`,`mts`.`calculation_base_revenue` AS `calculation_base_revenue`,`mts`.`total_iss` AS `total_iss`,`mts`.`total_pis_payable` AS `total_pis_to_collect`,`mts`.`total_cofins_payable` AS `total_cofins_to_collect`,`mts`.`total_irpj` AS `total_irpj`,`mts`.`total_csll` AS `total_csll`,`mts`.`total_distributor_payment` AS `total_distributor_payout`,`mts`.`net_total_revenue` AS `net_total_revenue`,round((`mts`.`total_iss` + `mts`.`total_pis_payable` + `mts`.`total_cofins_payable` + `mts`.`total_irpj` + `mts`.`total_csll`) / `mts`.`total_gross_revenue` * 100,2) AS `tax_burden_percentage`,round(`mts`.`net_total_revenue` / `mts`.`total_gross_revenue` * 100,2) AS `net_margin_percentage` from (`monthly_tax_settlement` `mts` join `cinema_complexes` `c` on(`mts`.`cinema_complex_id` = `c`.`id`)) where `mts`.`status` = (select `settlement_status`.`id` from `settlement_status` where `settlement_status`.`name` = 'PROCESSADO') order by `mts`.`year` desc,`mts`.`month` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_funcionarios_ativos`
--

/*!50001 DROP VIEW IF EXISTS `vw_funcionarios_ativos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_funcionarios_ativos` AS select `f`.`id` AS `id`,`f`.`employee_number` AS `matricula`,`f`.`name` AS `nome`,`f`.`cpf` AS `cpf`,`f`.`email` AS `email`,`f`.`phone` AS `telefone`,`p`.`name` AS `cargo_nome`,`d`.`name` AS `departamento_nome`,`f`.`current_salary` AS `salario_atual`,`f`.`hire_date` AS `data_admissao`,timestampdiff(YEAR,`f`.`hire_date`,curdate()) AS `anos_empresa`,`ect`.`name` AS `tipo_contrato_nome`,`cc`.`name` AS `complexo_nome` from ((((`employees` `f` join `positions` `p` on(`f`.`position_id` = `p`.`id`)) join `departments` `d` on(`p`.`department_id` = `d`.`id`)) join `cinema_complexes` `cc` on(`f`.`complex_id` = `cc`.`id`)) left join `employment_contract_types` `ect` on(`f`.`contract_type` = `ect`.`id`)) where `f`.`active` = 1 order by `f`.`name` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_loyalty_customers`
--

/*!50001 DROP VIEW IF EXISTS `vw_loyalty_customers`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_loyalty_customers` AS select `cli`.`id` AS `id`,`cli`.`name` AS `name`,`cli`.`email` AS `email`,`cli`.`phone` AS `phone`,`cli`.`accumulated_points` AS `accumulated_points`,`cli`.`loyalty_level` AS `loyalty_level`,`cli`.`loyalty_join_date` AS `loyalty_join_date`,count(distinct `s`.`id`) AS `total_purchases`,sum(`s`.`net_amount`) AS `total_amount_spent`,max(`s`.`sale_date`) AS `last_purchase`,group_concat(distinct `cfg`.`genre` separator ',') AS `favorite_genres`,count(distinct `cfp`.`product_id`) AS `favorite_products_count` from (((`customers` `cli` left join `sales` `s` on(`cli`.`id` = `s`.`customer_id` and `s`.`status` = (select `sale_status`.`id` from `sale_status` where `sale_status`.`name` = 'CONFIRMADA'))) left join `customer_favorite_genres` `cfg` on(`cli`.`id` = `cfg`.`customer_id`)) left join `customer_favorite_products` `cfp` on(`cli`.`id` = `cfp`.`customer_id`)) where `cli`.`active` = 1 and `cli`.`blocked` = 0 group by `cli`.`id`,`cli`.`name`,`cli`.`email`,`cli`.`phone`,`cli`.`accumulated_points`,`cli`.`loyalty_level`,`cli`.`loyalty_join_date` order by `cli`.`accumulated_points` desc,sum(`s`.`net_amount`) desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_monthly_tax_summary`
--

/*!50001 DROP VIEW IF EXISTS `vw_monthly_tax_summary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_monthly_tax_summary` AS select `mts`.`id` AS `id`,`mts`.`cinema_complex_id` AS `cinema_complex_id`,`cc`.`name` AS `complex_name`,`cc`.`city` AS `city`,`cc`.`state` AS `state`,`e`.`tax_regime` AS `tax_regime`,`e`.`pis_cofins_regime` AS `pis_cofins_regime`,`mts`.`year` AS `year`,`mts`.`month` AS `month`,concat(lpad(`mts`.`month`,2,'0'),'/',`mts`.`year`) AS `competence`,`mts`.`gross_box_office_revenue` AS `gross_box_office_revenue`,`mts`.`gross_concession_revenue` AS `gross_concession_revenue`,`mts`.`gross_advertising_revenue` AS `gross_advertising_revenue`,`mts`.`gross_other_revenue` AS `gross_other_revenue`,`mts`.`total_gross_revenue` AS `total_gross_revenue`,`mts`.`total_deductions` AS `total_deductions`,`mts`.`calculation_base_revenue` AS `calculation_base_revenue`,`mts`.`total_iss_box_office` AS `total_iss_box_office`,`mts`.`total_iss_concession` AS `total_iss_concession`,`mts`.`total_iss` AS `total_iss`,round(`mts`.`total_iss` / nullif(`mts`.`calculation_base_revenue`,0) * 100,2) AS `iss_percentage`,`mts`.`total_pis_debit` AS `total_pis_debit`,`mts`.`total_pis_credit` AS `total_pis_credit`,`mts`.`total_pis_payable` AS `total_pis_payable`,round(`mts`.`total_pis_payable` / nullif(`mts`.`calculation_base_revenue`,0) * 100,2) AS `pis_percentage`,`mts`.`total_cofins_debit` AS `total_cofins_debit`,`mts`.`total_cofins_credit` AS `total_cofins_credit`,`mts`.`total_cofins_payable` AS `total_cofins_payable`,round(`mts`.`total_cofins_payable` / nullif(`mts`.`calculation_base_revenue`,0) * 100,2) AS `cofins_percentage`,`mts`.`irpj_base` AS `irpj_base`,`mts`.`irpj_base_15` AS `irpj_base_15`,`mts`.`irpj_additional_10` AS `irpj_additional_10`,`mts`.`total_irpj` AS `total_irpj`,round(`mts`.`total_irpj` / nullif(`mts`.`calculation_base_revenue`,0) * 100,2) AS `irpj_percentage`,`mts`.`csll_base` AS `csll_base`,`mts`.`total_csll` AS `total_csll`,round(`mts`.`total_csll` / nullif(`mts`.`calculation_base_revenue`,0) * 100,2) AS `csll_percentage`,`mts`.`total_iss` + `mts`.`total_pis_payable` + `mts`.`total_cofins_payable` + `mts`.`total_irpj` + `mts`.`total_csll` AS `total_tax_burden`,round((`mts`.`total_iss` + `mts`.`total_pis_payable` + `mts`.`total_cofins_payable` + `mts`.`total_irpj` + `mts`.`total_csll`) / nullif(`mts`.`total_gross_revenue`,0) * 100,2) AS `tax_burden_percentage`,`mts`.`total_distributor_payment` AS `total_distributor_payment`,round(`mts`.`total_distributor_payment` / nullif(`mts`.`gross_box_office_revenue`,0) * 100,2) AS `distributor_payout_percentage`,`mts`.`net_revenue_taxed` AS `net_revenue_taxed`,`mts`.`net_total_revenue` AS `net_total_revenue`,round(`mts`.`net_total_revenue` / nullif(`mts`.`total_gross_revenue`,0) * 100,2) AS `net_margin`,`mts`.`status` AS `status`,`mts`.`settlement_date` AS `settlement_date` from ((`monthly_tax_settlement` `mts` join `cinema_complexes` `cc` on(`mts`.`cinema_complex_id` = `cc`.`id`)) join `companies` `e` on(`cc`.`company_id` = `e`.`id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_movies_complete`
--

/*!50001 DROP VIEW IF EXISTS `vw_movies_complete`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_movies_complete` AS select `f`.`id` AS `id`,`f`.`distributor_id` AS `distributor_id`,`f`.`original_title` AS `original_title`,`f`.`brazil_title` AS `brazil_title`,`f`.`ancine_number` AS `ancine_number`,`f`.`duration_minutes` AS `duration_minutes`,`f`.`age_rating` AS `age_rating`,`f`.`genre` AS `genre`,`f`.`country_of_origin` AS `country_of_origin`,`f`.`production_year` AS `production_year`,`f`.`national` AS `national`,`f`.`active` AS `active`,`f`.`created_at` AS `created_at`,`ar`.`name` AS `age_rating_name`,`ar`.`minimum_age` AS `minimum_age`,`ar`.`description` AS `age_rating_description`,`s`.`trade_name` AS `distributor_name`,`s`.`is_film_distributor` AS `is_film_distributor` from ((`movies` `f` left join `age_ratings` `ar` on(`f`.`age_rating` = `ar`.`id`)) left join `suppliers` `s` on(`f`.`distributor_id` = `s`.`id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_recine_benefits`
--

/*!50001 DROP VIEW IF EXISTS `vw_recine_benefits`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_recine_benefits` AS select `rp`.`id` AS `project_id`,`rp`.`project_number` AS `project_number`,`cc`.`name` AS `complex_name`,`rp`.`description` AS `description`,`rp`.`project_type` AS `project_type`,`rp`.`status` AS `status`,`rp`.`total_project_value` AS `total_project_value`,count(`ra`.`id`) AS `total_acquisitions`,coalesce(sum(`ra`.`item_value`),0) AS `total_acquisition_value`,coalesce(sum(`ra`.`pis_cofins_saved`),0) AS `pis_cofins_savings`,coalesce(sum(`ra`.`ipi_saved`),0) AS `ipi_savings`,coalesce(sum(`ra`.`ii_saved`),0) AS `ii_savings`,coalesce(sum(`ra`.`total_benefit_value`),0) AS `total_benefit_realized`,round(coalesce(sum(`ra`.`total_benefit_value`),0) / nullif(`rp`.`total_project_value`,0) * 100,2) AS `savings_percentage`,`rp`.`start_date` AS `start_date`,`rp`.`expected_completion_date` AS `expected_completion_date`,`rp`.`actual_completion_date` AS `actual_completion_date` from ((`recine_projects` `rp` join `cinema_complexes` `cc` on(`rp`.`cinema_complex_id` = `cc`.`id`)) left join `recine_acquisitions` `ra` on(`rp`.`id` = `ra`.`recine_project_id`)) group by `rp`.`id`,`rp`.`project_number`,`cc`.`name`,`rp`.`description`,`rp`.`project_type`,`rp`.`status`,`rp`.`total_project_value`,`rp`.`start_date`,`rp`.`expected_completion_date`,`rp`.`actual_completion_date` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_recine_projects_complete`
--

/*!50001 DROP VIEW IF EXISTS `vw_recine_projects_complete`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_recine_projects_complete` AS select `pr`.`id` AS `id`,`pr`.`cinema_complex_id` AS `cinema_complex_id`,`pr`.`project_number` AS `project_number`,`pr`.`description` AS `description`,`pr`.`project_type` AS `project_type`,`pr`.`total_project_value` AS `total_project_value`,`pr`.`estimated_benefit_value` AS `estimated_benefit_value`,`pr`.`pis_cofins_suspended` AS `pis_cofins_suspended`,`pr`.`ipi_exempt` AS `ipi_exempt`,`pr`.`ii_exempt` AS `ii_exempt`,`pr`.`start_date` AS `start_date`,`pr`.`expected_completion_date` AS `expected_completion_date`,`pr`.`actual_completion_date` AS `actual_completion_date`,`pr`.`status` AS `status`,`pr`.`ancine_process_number` AS `ancine_process_number`,`pr`.`ancine_approval_date` AS `ancine_approval_date`,`pr`.`observations` AS `observations`,`pr`.`created_at` AS `created_at`,`pr`.`updated_at` AS `updated_at`,`rpt`.`name` AS `project_type_name`,`rpt`.`description` AS `project_type_description`,`rps`.`name` AS `status_name`,`rps`.`allows_modification` AS `status_allows_modification` from ((`recine_projects` `pr` left join `recine_project_types` `rpt` on(`pr`.`project_type` = `rpt`.`id`)) left join `recine_project_status` `rps` on(`pr`.`status` = `rps`.`id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_sales_complete`
--

/*!50001 DROP VIEW IF EXISTS `vw_sales_complete`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_sales_complete` AS select `v`.`id` AS `id`,`v`.`cinema_complex_id` AS `cinema_complex_id`,`v`.`sale_number` AS `sale_number`,`v`.`sale_date` AS `sale_date`,`v`.`sale_type` AS `sale_type`,`v`.`user_id` AS `user_id`,`v`.`customer_cpf` AS `customer_cpf`,`v`.`total_amount` AS `total_amount`,`v`.`discount_amount` AS `discount_amount`,`v`.`net_amount` AS `net_amount`,`v`.`payment_method` AS `payment_method`,`v`.`status` AS `status`,`v`.`cancellation_date` AS `cancellation_date`,`v`.`cancellation_reason` AS `cancellation_reason`,`v`.`created_at` AS `created_at`,`st`.`name` AS `sale_type_name`,`st`.`convenience_fee` AS `convenience_fee`,`pm`.`name` AS `payment_method_name`,`pm`.`operator_fee` AS `operator_fee`,`pm`.`settlement_days` AS `settlement_days`,`ss`.`name` AS `status_name`,`ss`.`allows_modification` AS `status_allows_modification` from (((`sales` `v` left join `sale_types` `st` on(`v`.`sale_type` = `st`.`id`)) left join `payment_methods` `pm` on(`v`.`payment_method` = `pm`.`id`)) left join `sale_status` `ss` on(`v`.`status` = `ss`.`id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_settlement_complete`
--

/*!50001 DROP VIEW IF EXISTS `vw_settlement_complete`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_settlement_complete` AS select `a`.`id` AS `id`,`a`.`cinema_complex_id` AS `cinema_complex_id`,`a`.`year` AS `year`,`a`.`month` AS `month`,`a`.`settlement_date` AS `settlement_date`,`a`.`tax_regime` AS `tax_regime`,`a`.`pis_cofins_regime` AS `pis_cofins_regime`,`a`.`gross_box_office_revenue` AS `gross_box_office_revenue`,`a`.`gross_concession_revenue` AS `gross_concession_revenue`,`a`.`gross_advertising_revenue` AS `gross_advertising_revenue`,`a`.`gross_other_revenue` AS `gross_other_revenue`,`a`.`total_gross_revenue` AS `total_gross_revenue`,`a`.`total_deductions` AS `total_deductions`,`a`.`calculation_base_revenue` AS `calculation_base_revenue`,`a`.`total_iss_box_office` AS `total_iss_box_office`,`a`.`total_iss_concession` AS `total_iss_concession`,`a`.`total_iss` AS `total_iss`,`a`.`total_pis_debit` AS `total_pis_debit`,`a`.`total_pis_credit` AS `total_pis_credit`,`a`.`total_pis_payable` AS `total_pis_payable`,`a`.`total_cofins_debit` AS `total_cofins_debit`,`a`.`total_cofins_credit` AS `total_cofins_credit`,`a`.`total_cofins_payable` AS `total_cofins_payable`,`a`.`irpj_base` AS `irpj_base`,`a`.`irpj_base_15` AS `irpj_base_15`,`a`.`irpj_additional_10` AS `irpj_additional_10`,`a`.`total_irpj` AS `total_irpj`,`a`.`csll_base` AS `csll_base`,`a`.`total_csll` AS `total_csll`,`a`.`gross_revenue_12m` AS `gross_revenue_12m`,`a`.`effective_simples_rate` AS `effective_simples_rate`,`a`.`total_simples_amount` AS `total_simples_amount`,`a`.`total_distributor_payment` AS `total_distributor_payment`,`a`.`net_revenue_taxed` AS `net_revenue_taxed`,`a`.`net_total_revenue` AS `net_total_revenue`,`a`.`status` AS `status`,`a`.`declaration_date` AS `declaration_date`,`a`.`payment_date` AS `payment_date`,`a`.`notes` AS `notes`,`a`.`created_at` AS `created_at`,`a`.`updated_at` AS `updated_at`,`ss`.`name` AS `status_name`,`ss`.`allows_modification` AS `status_allows_modification`,`ss`.`description` AS `status_description` from (`monthly_tax_settlement` `a` left join `settlement_status` `ss` on(`a`.`status` = `ss`.`id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_settlements_complete`
--

/*!50001 DROP VIEW IF EXISTS `vw_settlements_complete`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_settlements_complete` AS select `r`.`id` AS `id`,`r`.`contract_id` AS `contract_id`,`r`.`distributor_id` AS `distributor_id`,`r`.`cinema_complex_id` AS `cinema_complex_id`,`r`.`competence_start_date` AS `competence_start_date`,`r`.`competence_end_date` AS `competence_end_date`,`r`.`total_tickets_sold` AS `total_tickets_sold`,`r`.`gross_box_office_revenue` AS `gross_box_office_revenue`,`r`.`calculation_base` AS `calculation_base`,`r`.`taxes_deducted_amount` AS `taxes_deducted_amount`,`r`.`settlement_base_amount` AS `settlement_base_amount`,`r`.`distributor_percentage` AS `distributor_percentage`,`r`.`calculated_settlement_amount` AS `calculated_settlement_amount`,`r`.`minimum_guarantee` AS `minimum_guarantee`,`r`.`final_settlement_amount` AS `final_settlement_amount`,`r`.`deductions_amount` AS `deductions_amount`,`r`.`net_settlement_amount` AS `net_settlement_amount`,`r`.`irrf_rate` AS `irrf_rate`,`r`.`irrf_calculation_base` AS `irrf_calculation_base`,`r`.`irrf_amount` AS `irrf_amount`,`r`.`irrf_exempt` AS `irrf_exempt`,`r`.`retained_iss_amount` AS `retained_iss_amount`,`r`.`net_payment_amount` AS `net_payment_amount`,`r`.`status` AS `status`,`r`.`calculation_date` AS `calculation_date`,`r`.`approval_date` AS `approval_date`,`r`.`payment_date` AS `payment_date`,`r`.`notes` AS `notes`,`r`.`created_at` AS `created_at`,`r`.`updated_at` AS `updated_at`,`sb`.`name` AS `calculation_base_name`,`sb`.`description` AS `calculation_base_description`,`dss`.`name` AS `status_name`,`dss`.`allows_modification` AS `status_allows_modification` from ((`distributor_settlements` `r` left join `settlement_bases` `sb` on(`r`.`calculation_base` = `sb`.`id`)) left join `distributor_settlement_status` `dss` on(`r`.`status` = `dss`.`id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_tax_compensations_summary`
--

/*!50001 DROP VIEW IF EXISTS `vw_tax_compensations_summary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_tax_compensations_summary` AS select `tc`.`cinema_complex_id` AS `cinema_complex_id`,`cc`.`name` AS `complex_name`,`tc`.`tax_type` AS `tax_type`,sum(`tc`.`credit_amount`) AS `total_credit`,sum(`tc`.`compensated_amount`) AS `total_compensated`,sum(`tc`.`credit_balance`) AS `available_balance`,count(`tc`.`id`) AS `total_compensations` from (`tax_compensations` `tc` join `cinema_complexes` `cc` on(`tc`.`cinema_complex_id` = `cc`.`id`)) group by `tc`.`cinema_complex_id`,`cc`.`name`,`tc`.`tax_type` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_tax_kpi`
--

/*!50001 DROP VIEW IF EXISTS `vw_tax_kpi`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_tax_kpi` AS select `mts`.`cinema_complex_id` AS `cinema_complex_id`,`mts`.`year` AS `year`,`mts`.`month` AS `month`,round(`mts`.`total_iss` / nullif(`mts`.`calculation_base_revenue`,0) * 100,2) AS `iss_efficiency`,round((`mts`.`total_pis_payable` + `mts`.`total_cofins_payable`) / nullif(`mts`.`calculation_base_revenue`,0) * 100,2) AS `pis_cofins_efficiency`,round((`mts`.`total_iss` + `mts`.`total_pis_payable` + `mts`.`total_cofins_payable` + `mts`.`total_irpj` + `mts`.`total_csll`) / nullif(`mts`.`calculation_base_revenue`,0) * 100,2) AS `effective_tax_burden`,11.82 AS `simple_national_theoretical`,round(`mts`.`total_pis_credit` / nullif(`mts`.`total_pis_debit`,0) * 100,2) AS `pis_utilization`,round(`mts`.`total_cofins_credit` / nullif(`mts`.`total_cofins_debit`,0) * 100,2) AS `cofins_utilization` from `monthly_tax_settlement` `mts` where `mts`.`status` = 'APURADA' */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_tickets_complete`
--

/*!50001 DROP VIEW IF EXISTS `vw_tickets_complete`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_tickets_complete` AS select `i`.`id` AS `id`,`i`.`sale_id` AS `sale_id`,`i`.`showtime_id` AS `showtime_id`,`i`.`ticket_number` AS `ticket_number`,`i`.`ticket_type` AS `ticket_type`,`i`.`seat` AS `seat`,`i`.`face_value` AS `face_value`,`i`.`service_fee` AS `service_fee`,`i`.`total_amount` AS `total_amount`,`i`.`used` AS `used`,`i`.`usage_date` AS `usage_date`,`i`.`created_at` AS `created_at`,`tt`.`name` AS `ticket_type_name`,`tt`.`discount_percentage` AS `discount_percentage`,`tt`.`description` AS `ticket_type_description` from (`tickets` `i` left join `ticket_types` `tt` on(`i`.`ticket_type` = `tt`.`id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_usuario_permissoes_base`
--

/*!50001 DROP VIEW IF EXISTS `vw_usuario_permissoes_base`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_usuario_permissoes_base` AS select `u`.`id` AS `usuario_id`,`u`.`username` AS `username`,`u`.`email` AS `email`,`r`.`code` AS `rotina_codigo`,`r`.`name` AS `rotina_nome`,`r`.`module` AS `modulo`,`r`.`risk_level` AS `nivel_risco`,group_concat(distinct case when `up`.`operation` is not null then `up`.`operation` when `pp`.`operation` is not null then `pp`.`operation` end order by case when `up`.`operation` is not null then `up`.`operation` when `pp`.`operation` is not null then `pp`.`operation` end ASC separator ',') AS `operacoes` from ((((`system_users` `u` left join `user_permissions` `up` on(`u`.`id` = `up`.`user_id` and `up`.`active` = 1 and (`up`.`expiration_date` is null or `up`.`expiration_date` > current_timestamp()))) left join `user_profiles` `upf` on(`u`.`id` = `upf`.`user_id` and `upf`.`active` = 1)) left join `profile_permissions` `pp` on(`upf`.`profile_id` = `pp`.`profile_id`)) left join `system_routines` `r` on(`up`.`routine_code` = `r`.`code` or `pp`.`routine_code` = `r`.`code`)) where `u`.`active` = 1 and `r`.`code` is not null and `r`.`active` = 1 group by `u`.`id`,`u`.`username`,`u`.`email`,`r`.`code`,`r`.`name`,`r`.`module`,`r`.`risk_level` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_usuario_permissoes_completas`
--

/*!50001 DROP VIEW IF EXISTS `vw_usuario_permissoes_completas`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vw_usuario_permissoes_completas` AS select distinct `u`.`id` AS `usuario_id`,`u`.`username` AS `username`,`u`.`email` AS `email`,`e`.`name` AS `nome_completo`,`r`.`code` AS `rotina_codigo`,`r`.`name` AS `rotina_nome`,`r`.`module` AS `modulo`,`r`.`category` AS `categoria`,`r`.`risk_level` AS `nivel_risco`,`ro`.`operation` AS `operacao`,`ro`.`name` AS `operacao_nome`,case when `up`.`id` is not null then 'INDIVIDUAL' when `pp`.`id` is not null then 'PERFIL' else 'NENHUMA' end AS `origem_permissao`,coalesce(`p`.`name`,'N/A') AS `perfil_nome`,`r`.`requires_approval` AS `requer_aprovacao`,`r`.`requires_supervisor_password` AS `requer_senha_supervisor` from (((((((`system_users` `u` join `employees` `e` on(`u`.`employee_id` = `e`.`id`)) left join `user_permissions` `up` on(`u`.`id` = `up`.`user_id` and `up`.`active` = 1 and (`up`.`expiration_date` is null or `up`.`expiration_date` > current_timestamp()))) left join `user_profiles` `upf` on(`u`.`id` = `upf`.`user_id` and `upf`.`active` = 1)) left join `profile_permissions` `pp` on(`upf`.`profile_id` = `pp`.`profile_id`)) left join `access_profiles` `p` on(`upf`.`profile_id` = `p`.`id` and `p`.`active` = 1)) left join `system_routines` `r` on(`up`.`routine_code` = `r`.`code` or `pp`.`routine_code` = `r`.`code`)) left join `routine_operations` `ro` on(`r`.`code` = `ro`.`routine_code` and (`up`.`operation` = `ro`.`operation` or `pp`.`operation` = `ro`.`operation`))) where `u`.`active` = 1 and `r`.`active` = 1 and `ro`.`active` = 1 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-10-11 23:07:22
