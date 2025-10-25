CREATE DATABASE  IF NOT EXISTS `is463backend` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `is463backend`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: is463backend
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `digestor`
--

DROP TABLE IF EXISTS `digestor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `digestor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `stallid` int NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `digestor_stall_fk_idx` (`stallid`),
  CONSTRAINT `digestor_stall_fk` FOREIGN KEY (`stallid`) REFERENCES `stall` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `digestor`
--

LOCK TABLES `digestor` WRITE;
/*!40000 ALTER TABLE `digestor` DISABLE KEYS */;
INSERT INTO `digestor` VALUES (1,1,'2025-10-22 00:16:20'),(2,1,'2025-10-22 00:16:20'),(3,1,'2025-10-22 00:16:20'),(4,2,'2025-10-22 00:16:20'),(6,1,'2025-10-22 00:16:20'),(7,1,'2025-10-22 01:24:51'),(8,1,'2025-10-22 01:27:34');
/*!40000 ALTER TABLE `digestor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `points`
--

DROP TABLE IF EXISTS `points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `points` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `points` varchar(45) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `points_userid_fk_idx` (`userid`),
  CONSTRAINT `points_userid_fk` FOREIGN KEY (`userid`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `points`
--

LOCK TABLES `points` WRITE;
/*!40000 ALTER TABLE `points` DISABLE KEYS */;
INSERT INTO `points` VALUES (1,1,'500','2025-10-22 00:17:15'),(2,1,'-500','2025-10-22 00:17:15'),(3,1,'234','2025-10-22 00:17:15'),(4,2,'12','2025-10-22 00:17:15'),(5,2,'32','2025-10-22 00:17:15');
/*!40000 ALTER TABLE `points` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase`
--

DROP TABLE IF EXISTS `purchase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `stallid` int NOT NULL,
  `pointid` int NOT NULL,
  `image` longtext,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `purchase_user_fk_idx` (`userid`),
  KEY `purchase_stall_fk_idx` (`stallid`),
  KEY `purchase_point_fk_idx` (`pointid`),
  CONSTRAINT `purchase_point_fk` FOREIGN KEY (`pointid`) REFERENCES `points` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchase_stall_fk` FOREIGN KEY (`stallid`) REFERENCES `stall` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchase_user_fk` FOREIGN KEY (`userid`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase`
--

LOCK TABLES `purchase` WRITE;
/*!40000 ALTER TABLE `purchase` DISABLE KEYS */;
INSERT INTO `purchase` VALUES (1,1,1,1,NULL,'2025-10-22 00:18:15'),(2,1,2,3,NULL,'2025-10-22 00:18:15'),(3,2,1,4,NULL,'2025-10-22 00:18:15'),(4,2,1,5,NULL,'2025-10-22 00:18:15');
/*!40000 ALTER TABLE `purchase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reward`
--

DROP TABLE IF EXISTS `reward`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reward` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reward` varchar(45) NOT NULL,
  `cost` varchar(45) NOT NULL,
  `valid_until` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reward`
--

LOCK TABLES `reward` WRITE;
/*!40000 ALTER TABLE `reward` DISABLE KEYS */;
INSERT INTO `reward` VALUES (1,'$5 Shopee Voucher','500','2025-10-22 00:16:00','2025-10-22 00:16:00'),(2,'$5 BOSS e-credits','9000','2025-10-22 00:16:00','2025-10-22 00:16:00'),(3,'Starbucks 1-for-1 venti drink','2000','2025-10-22 00:16:00','2025-10-22 00:16:00');
/*!40000 ALTER TABLE `reward` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rewardredemption`
--

DROP TABLE IF EXISTS `rewardredemption`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rewardredemption` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `rewardid` int NOT NULL,
  `pointid` int NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `redemption_user_id_idx` (`userid`),
  KEY `redemption_reward_id_idx` (`rewardid`),
  KEY `redemption_point_id_idx` (`pointid`),
  CONSTRAINT `redemption_point_id` FOREIGN KEY (`pointid`) REFERENCES `points` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `redemption_reward_id` FOREIGN KEY (`rewardid`) REFERENCES `reward` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `redemption_user_id` FOREIGN KEY (`userid`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rewardredemption`
--

LOCK TABLES `rewardredemption` WRITE;
/*!40000 ALTER TABLE `rewardredemption` DISABLE KEYS */;
INSERT INTO `rewardredemption` VALUES (1,1,1,2,'2025-10-22 00:17:25');
/*!40000 ALTER TABLE `rewardredemption` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stall`
--

DROP TABLE IF EXISTS `stall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stall` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `shorten_location` varchar(45) NOT NULL,
  `location` longtext,
  `image` longtext,
  `description` longtext NOT NULL,
  `contact` varchar(45) DEFAULT NULL,
  `opening_hours` longtext,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stall`
--

LOCK TABLES `stall` WRITE;
/*!40000 ALTER TABLE `stall` DISABLE KEYS */;
INSERT INTO `stall` VALUES (1,'1983 A Taste of Nanyang','LKS','70 Stamford Road #01-21 Li Ka Shing Library Building, Singapore 178901',NULL,'Be transported back to the 1980s with tastes of great local fares, weaving together a strong Nanyang culture. Proud signatures include Nasi Lemak, Curry Chicken with Rice/ Bread, Traditional kopi and toast sets, 1983 A Taste of Nanyang dedicates to preserving the nostalgic tastes of Singapore.',NULL,'Mon-Fri:7am-6pm,Sat:7am-3pm,Sun & Public Holidays:Closed','2025-10-22 00:10:21'),(2,'BRÆK. – Vegetarian Options','LKS','70 Stamford Road #B1-25 Li Ka Shing Library Building, Singapore 178901',NULL,'At bræk., we aim to provide individuals with a place to escape from everyday chaos. We believe in creating a nurturing space that fosters meaningful connections and unforgettable conversations. With every visit to bræk., we are dedicated to delivering our customers an exceptional experience filled with unexpected happiness.','tristan.lim@givemeabraek.com','Mon-Fri:9am-10pm,Sat & Sun:11.30am-6pm,Public Holidays:Closed','2025-10-22 00:10:21'),(3,'Each-a-Cup','LKS','70 Stamford Road #B1-45 Li Ka Shing Library Building, Singapore 178901',NULL,'Each-a-Cup at SMU is not just about your childhood bubble tea drink, but a one stop destination to grab a bite and have a game of Floor is Lava to refresh yourself.','+65 8835 4859','Daily:9am – 9pm','2025-10-22 00:10:21');
/*!40000 ALTER TABLE `stall` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `faculty` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Zion','zion.tan.2024@computing.smu.edu.sg','scis','test','2025-10-22 00:05:06'),(2,'qj','qj.yang.2024@computing.smu.edu.sg','scis','test','2025-10-22 00:05:06'),(3,'test scis','test.sci.2024s@computing.smu.edu.sg','scis','test','2025-10-22 00:05:06'),(4,'test soe','test.soe.2024@soe.com.sg','soe','test','2025-10-22 00:05:06'),(5,'test sob','test.sob.2024@soe.com.sg','sob','test','2025-10-22 00:05:06');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-22  1:40:38

--
-- Additional tables for challenges and completions
--
DROP TABLE IF EXISTS `challenge`;
CREATE TABLE `challenge` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` longtext,
  `points` int NOT NULL DEFAULT 0,
  `created_by` varchar(100) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `challenge_completion`;
CREATE TABLE `challenge_completion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `challengeid` int NOT NULL,
  `userid` int NOT NULL,
  `evidence` longtext,
  `points_awarded` int NOT NULL,
  `verified` tinyint(1) NOT NULL DEFAULT 0,
  `date_completed` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `completion_challenge_idx` (`challengeid`),
  KEY `completion_user_idx` (`userid`),
  CONSTRAINT `completion_challenge_fk` FOREIGN KEY (`challengeid`) REFERENCES `challenge` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `completion_user_fk` FOREIGN KEY (`userid`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

