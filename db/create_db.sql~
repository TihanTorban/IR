SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';


CREATE TABLE `test_collections` (
  `id_test_collections` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL,
  `privacy` tinyint(4) DEFAULT '1',
  PRIMARY KEY (`id_test_collections`),
  UNIQUE KEY `id_test_collections_UNIQUE` (`id_test_collections`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8;

CREATE TABLE `queries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_collection` int(11) NOT NULL,
  `id_query` varchar(255) NOT NULL,
  `query_text` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_queries_1_idx` (`id_collection`),
  CONSTRAINT `fk_queries_1` FOREIGN KEY (`id_collection`) REFERENCES `test_collections` (`id_test_collections`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11665 DEFAULT CHARSET=utf8;

CREATE TABLE `qrels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_collection` int(11) NOT NULL,
  `id_query` int(11) NOT NULL,
  `doc_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `relevant` int(5) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_qrels_2_idx` (`id_query`),
  KEY `fk_qrels_1` (`id_collection`),
  CONSTRAINT `fk_qrels_1` FOREIGN KEY (`id_collection`) REFERENCES `test_collections` (`id_test_collections`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_qrels_2` FOREIGN KEY (`id_query`) REFERENCES `queries` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=104721 DEFAULT CHARSET=utf8;

CREATE TABLE `runs` (
  `id_run` int(11) NOT NULL AUTO_INCREMENT,
  `id_collection` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `privacy` tinyint(1) DEFAULT '1',
  `id_user` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_run`),
  UNIQUE KEY `id_run_UNIQUE` (`id_run`),
  KEY `fk_runs_1_idx` (`id_collection`),
  CONSTRAINT `fk_runs_1` FOREIGN KEY (`id_collection`) REFERENCES `test_collections` (`id_test_collections`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8;

CREATE TABLE `results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_run` int(11) NOT NULL,
  `id_query` int(11) NOT NULL,
  `id_collection` int(11) NOT NULL,
  `doc_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `rank` int(11) DEFAULT NULL,
  `score` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_results_1_idx` (`id_run`),
  KEY `fk_results_2_idx` (`id_query`),
  KEY `results_1_idx` (`id_collection`,`id_query`,`id_run`),
  CONSTRAINT `fk_results_1` FOREIGN KEY (`id_run`) REFERENCES `runs` (`id_run`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_results_2` FOREIGN KEY (`id_query`) REFERENCES `queries` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=968041 DEFAULT CHARSET=utf8;

CREATE TABLE `trec_eval` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_run` int(11) NOT NULL,
  `id_query` int(11) NOT NULL,
  `id_collection` int(11) NOT NULL,
  `name` varchar(60) NOT NULL,
  `value` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_trec_eval_2_idx` (`id_query`),
  KEY `fk_trec_eval_1_idx` (`id_run`),
  CONSTRAINT `fk_trec_eval_1` FOREIGN KEY (`id_run`) REFERENCES `runs` (`id_run`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_trec_eval_2` FOREIGN KEY (`id_query`) REFERENCES `queries` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=223126 DEFAULT CHARSET=utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
