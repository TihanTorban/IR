SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `ir` DEFAULT CHARACTER SET utf8 ;
USE `ir` ;

-- -----------------------------------------------------
-- Table `ir`.`test_collections`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ir`.`test_collections` (
  `id_test_collections` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `id_user` INT(11) NULL DEFAULT NULL,
  `privacy` TINYINT(4) NULL DEFAULT '1',
  PRIMARY KEY (`id_test_collections`),
  UNIQUE INDEX `id_test_collections_UNIQUE` (`id_test_collections` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 23
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ir`.`queries`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ir`.`queries` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `id_collection` INT(11) NOT NULL,
  `id_query` VARCHAR(255) NOT NULL,
  `query_text` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_queries_1_idx` (`id_collection` ASC),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  CONSTRAINT `fk_queries_1`
    FOREIGN KEY (`id_collection`)
    REFERENCES `ir`.`test_collections` (`id_test_collections`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ir`.`qrels`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ir`.`qrels` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `id_collection` INT(11) NOT NULL,
  `id_query` INT(11) NOT NULL,
  `doc_id` VARCHAR(255) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NOT NULL,
  `relevant` INT(5) NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_qrels_2_idx` (`id_query` ASC),
  CONSTRAINT `fk_qrels_1`
    FOREIGN KEY (`id_collection`)
    REFERENCES `ir`.`test_collections` (`id_test_collections`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_qrels_2`
    FOREIGN KEY (`id_query`)
    REFERENCES `ir`.`queries` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ir`.`runs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ir`.`runs` (
  `id_run` INT(11) NOT NULL AUTO_INCREMENT,
  `id_collection` INT(11) NOT NULL,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `privacy` TINYINT(1) NULL DEFAULT '1',
  `id_user` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id_run`),
  UNIQUE INDEX `id_run_UNIQUE` (`id_run` ASC),
  INDEX `fk_runs_1_idx` (`id_collection` ASC),
  CONSTRAINT `fk_runs_1`
    FOREIGN KEY (`id_collection`)
    REFERENCES `ir`.`test_collections` (`id_test_collections`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 72
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ir`.`results`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ir`.`results` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `id_run` INT(11) NOT NULL,
  `id_query` INT(11) NOT NULL,
  `id_collection` INT(11) NOT NULL,
  `doc_id` VARCHAR(255) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NOT NULL,
  `rank` INT(11) NULL DEFAULT NULL,
  `score` DOUBLE NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_results_1_idx` (`id_run` ASC),
  INDEX `fk_results_2_idx` (`id_query` ASC),
  CONSTRAINT `fk_results_1`
    FOREIGN KEY (`id_run`)
    REFERENCES `ir`.`runs` (`id_run`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_results_2`
    FOREIGN KEY (`id_query`)
    REFERENCES `ir`.`queries` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ir`.`trec_eval`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ir`.`trec_eval` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_run` INT(11) NOT NULL,
  `id_query` INT(11) NOT NULL,
  `id_collection` INT(11) NOT NULL,
  `name` VARCHAR(60) NOT NULL,
  `value` VARCHAR(10) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_trec_eval_2_idx` (`id_query` ASC),
  INDEX `fk_trec_eval_1_idx` (`id_run` ASC),
  CONSTRAINT `fk_trec_eval_2`
    FOREIGN KEY (`id_query`)
    REFERENCES `ir`.`queries` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_trec_eval_1`
    FOREIGN KEY (`id_run`)
    REFERENCES `ir`.`runs` (`id_run`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
