CREATE DATABASE  IF NOT EXISTS `apnic` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `apnic`;
-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: localhost    Database: apnic
-- ------------------------------------------------------
-- Server version	5.7.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `data`
--

DROP TABLE IF EXISTS `data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `registry` varchar(25) NOT NULL COMMENT 'The registry from which the data is taken.\n               For APNIC resources, this will be:\n\n                   apnic',
  `cc` varchar(2) NOT NULL COMMENT 'ISO 3166 2-letter code of the organisation to\n               which the allocation or assignment was made.',
  `type` varchar(4) NOT NULL,
  `start` varchar(20) NOT NULL COMMENT 'In the case of records of type ''ipv4'' or\n               ''ipv6'' this is the IPv4 or IPv6 ''first\n               address'' of the	range.\n\n               In the case of an 16 bit AS number, the\n               format is the integer value in the range:\n\n                   0 - 65535\n\n               In the case of a 32 bit ASN,  the value is\n               in the range:\n\n                   0 - 4294967296\n  \n               No distinction is drawn between 16 and 32\n               bit ASN values in the range 0 to 65535.',
  `value` int(11) NOT NULL DEFAULT '1' COMMENT 'In the case of IPv4 address the count of\n               hosts for this range. This count does not \n               have to represent a CIDR range.\n\n               In the case of an IPv6 address the value \n               will be the CIDR prefix length from the \n               ''first address''	value of <start>.\n\n               In the case of records of type ''asn'' the \n               number is the count of AS from this start \n               value.',
  `date` date NOT NULL COMMENT 'Date on this allocation/assignment was made\n               by the RIR in the format:\n\n                   YYYYMMDD\n\n               Where the allocation or assignment has been\n               transferred from another registry, this date\n               represents the date of first assignment or\n               allocation as received in from the original\n               RIR.\n\n               It is noted that where records do not show a \n               date of first assignment, this can take the \n               0000/00/00 value.',
  `status` varchar(25) NOT NULL COMMENT 'Type of record from the set:\n\n                   {available, allocated, assigned, reserved}\n\n                   available    The resource has not been allocated\n                                or assigned to any entity.\n\n                   allocated    An allocation made by the registry \n                                producing the file.\n\n                   assigned     An assignment made by the registry\n                                producing the file.\n\n                   reserved     The resource has not been allocated\n                                or assigned to any entity, and is\n                                not available for allocation or\n                                assignment.',
  `opaque-id` int(11) DEFAULT NULL COMMENT 'This is an in-series identifier which uniquely\n               identifies a single organisation, an Internet\n               number resource holder.\n\n               All records in the file with the same opaque-id\n               are registered to the same resource holder.\n\n               The opaque-id is not guaranteed to be constant\n               between versions of the file.\n\n               If the records are collated by type, opaque-id and\n               date, records of the same type for the same opaque-id\n               for the same date can be held to be a single\n               assignment or allocation',
  `extensions` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-06-12  0:05:49
