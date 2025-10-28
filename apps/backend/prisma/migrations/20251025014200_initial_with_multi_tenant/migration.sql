-- CreateTable
CREATE TABLE `access_levels` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `access_profiles` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `hierarchy_level` INTEGER NULL DEFAULT 0,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_code`(`code`),
    INDEX `idx_company`(`company_id`),
    INDEX `idx_company_active`(`company_id`, `active`),
    UNIQUE INDEX `uk_company_code`(`company_id`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account_natures` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounting_movement_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `age_ratings` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `code` VARCHAR(5) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `minimum_age` INTEGER NULL,
    `description` TEXT NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_code`(`company_id`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ancillary_obligations` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `obligation_code` VARCHAR(20) NOT NULL,
    `description` VARCHAR(200) NOT NULL,
    `periodicity` BIGINT NULL,
    `due_day` INTEGER NULL,
    `complex_id` BIGINT NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_obligation_periodicity`(`periodicity`),
    INDEX `idx_code`(`obligation_code`),
    INDEX `idx_complex`(`complex_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audio_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `additional_value` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campaign_categories` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `campaign_id` BIGINT NOT NULL,
    `category_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_campaign_category_campaign`(`campaign_id`),
    INDEX `idx_campaign_category_category`(`category_id`),
    UNIQUE INDEX `uk_campaign_category`(`campaign_id`, `category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campaign_complexes` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `campaign_id` BIGINT NOT NULL,
    `complex_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_campaign_complex_campaign`(`campaign_id`),
    INDEX `idx_campaign_complex_complex`(`complex_id`),
    UNIQUE INDEX `uk_campaign_complex`(`campaign_id`, `complex_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campaign_movies` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `campaign_id` BIGINT NOT NULL,
    `movie_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_campaign_movie_campaign`(`campaign_id`),
    INDEX `idx_campaign_movie_movie`(`movie_id`),
    UNIQUE INDEX `uk_campaign_movie`(`campaign_id`, `movie_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campaign_rooms` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `campaign_id` BIGINT NOT NULL,
    `room_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_campaign_room_campaign`(`campaign_id`),
    INDEX `idx_campaign_room_room`(`room_id`),
    UNIQUE INDEX `uk_campaign_room`(`campaign_id`, `room_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campaign_session_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `campaign_id` BIGINT NOT NULL,
    `projection_type_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_campaign_session_type_campaign`(`campaign_id`),
    INDEX `idx_campaign_session_type_type`(`projection_type_id`),
    UNIQUE INDEX `uk_campaign_session_type`(`campaign_id`, `projection_type_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campaign_weekdays` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `campaign_id` BIGINT NOT NULL,
    `weekday` TINYINT NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_campaign_weekday_campaign`(`campaign_id`),
    INDEX `idx_campaign_weekday_weekday`(`weekday`),
    UNIQUE INDEX `uk_campaign_weekday`(`campaign_id`, `weekday`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cast_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chart_of_accounts` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `account_code` VARCHAR(20) NOT NULL,
    `account_name` VARCHAR(200) NOT NULL,
    `account_type` BIGINT NULL,
    `account_nature` BIGINT NULL,
    `level` INTEGER NOT NULL,
    `parent_account_id` BIGINT NULL,
    `allows_entry` BOOLEAN NULL DEFAULT true,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_account_nature`(`account_nature`),
    INDEX `idx_account_code`(`account_code`),
    INDEX `idx_account_type`(`account_type`),
    INDEX `idx_parent_account`(`parent_account_id`),
    INDEX `idx_company`(`company_id`),
    INDEX `idx_company_active`(`company_id`, `active`),
    INDEX `idx_company_level`(`company_id`, `level`),
    UNIQUE INDEX `uk_company_account_code`(`company_id`, `account_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cinema_complexes` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `cnpj` VARCHAR(18) NULL,
    `address` TEXT NULL,
    `city` VARCHAR(100) NULL,
    `state` CHAR(2) NULL,
    `postal_code` VARCHAR(10) NULL,
    `ibge_municipality_code` VARCHAR(7) NOT NULL,
    `ancine_registry` VARCHAR(50) NULL,
    `opening_date` DATE NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `code`(`code`),
    INDEX `idx_code`(`code`),
    INDEX `idx_company`(`company_id`),
    INDEX `idx_municipality`(`ibge_municipality_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `combo_products` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `combo_id` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,

    INDEX `product_id`(`product_id`),
    UNIQUE INDEX `uk_combo_product`(`combo_id`, `product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `combos` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `combo_code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `sale_price` DECIMAL(10, 2) NOT NULL,
    `promotional_price` DECIMAL(10, 2) NULL,
    `promotion_start_date` DATE NULL,
    `promotion_end_date` DATE NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `combo_code`(`combo_code`),
    INDEX `idx_combo_code`(`combo_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `identities` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL,
    `keycloak_id` VARCHAR(100) NULL,
    `auth_provider` ENUM('LOCAL', 'KEYCLOAK', 'GOOGLE', 'AZURE_AD') NOT NULL DEFAULT 'KEYCLOAK',
    `external_id` VARCHAR(200) NULL,
    `identity_type` ENUM('EMPLOYEE', 'CUSTOMER', 'SYSTEM', 'PARTNER') NOT NULL DEFAULT 'CUSTOMER',
    `password_hash` VARCHAR(255) NULL,
    `password_changed_at` TIMESTAMP(0) NULL,
    `password_expires_at` TIMESTAMP(0) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `email_verified` BOOLEAN NULL DEFAULT false,
    `email_verification_token` VARCHAR(100) NULL,
    `email_verification_expires_at` TIMESTAMP(0) NULL,
    `blocked_until` TIMESTAMP(0) NULL,
    `block_reason` TEXT NULL,
    `failed_login_attempts` INTEGER NULL DEFAULT 0,
    `last_failed_login` TIMESTAMP(0) NULL,
    `requires_2fa` BOOLEAN NULL DEFAULT false,
    `secret_2fa` VARCHAR(100) NULL,
    `backup_codes_2fa` LONGTEXT NULL,
    `reset_token` VARCHAR(100) NULL,
    `reset_token_expires_at` TIMESTAMP(0) NULL,
    `last_login_date` TIMESTAMP(0) NULL,
    `last_login_ip` VARCHAR(45) NULL,
    `last_user_agent` VARCHAR(500) NULL,
    `login_count` INTEGER NULL DEFAULT 0,
    `linked_identity_id` BIGINT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `identities_keycloak_id_key`(`keycloak_id`),
    INDEX `idx_email`(`email`),
    INDEX `idx_keycloak`(`keycloak_id`),
    INDEX `idx_type`(`identity_type`, `active`),
    INDEX `idx_reset_token`(`reset_token`),
    UNIQUE INDEX `identities_email_identity_type_key`(`email`, `identity_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `companies` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `corporate_name` VARCHAR(200) NOT NULL,
    `trade_name` VARCHAR(200) NULL,
    `cnpj` VARCHAR(18) NOT NULL,
    `state_registration` VARCHAR(20) NULL,
    `municipal_registration` VARCHAR(20) NULL,
    `tax_regime` BIGINT NULL,
    `pis_cofins_regime` BIGINT NULL,
    `recine_opt_in` BOOLEAN NULL DEFAULT false,
    `recine_join_date` DATE NULL,
    `tenant_slug` VARCHAR(50) NOT NULL,
    `logo_url` VARCHAR(500) NULL,
    `max_complexes` INTEGER NULL DEFAULT 5,
    `max_employees` INTEGER NULL DEFAULT 50,
    `max_storage_gb` INTEGER NULL DEFAULT 10,
    `plan_type` ENUM('FREE', 'BASIC', 'PROFESSIONAL', 'ENTERPRISE') NOT NULL DEFAULT 'BASIC',
    `plan_expires_at` DATE NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `suspended` BOOLEAN NULL DEFAULT false,
    `suspension_reason` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `cnpj`(`cnpj`),
    UNIQUE INDEX `companies_tenant_slug_key`(`tenant_slug`),
    INDEX `fk_company_pis_cofins_regime`(`pis_cofins_regime`),
    INDEX `idx_cnpj`(`cnpj`),
    INDEX `idx_regime`(`tax_regime`, `pis_cofins_regime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `concession_sale_items` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `concession_sale_id` BIGINT NOT NULL,
    `product_id` BIGINT NULL,
    `combo_id` BIGINT NULL,
    `quantity` INTEGER NOT NULL,
    `unit_price` DECIMAL(10, 2) NOT NULL,
    `total_price` DECIMAL(10, 2) NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `combo_id`(`combo_id`),
    INDEX `idx_concession_sale`(`concession_sale_id`),
    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `concession_sales` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `sale_id` BIGINT NOT NULL,
    `sale_date` TIMESTAMP(0) NOT NULL,
    `total_amount` DECIMAL(10, 2) NOT NULL,
    `discount_amount` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `net_amount` DECIMAL(10, 2) NOT NULL,
    `status` BIGINT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_sale_date`(`sale_date`),
    INDEX `idx_status`(`status`),
    INDEX `sale_id`(`sale_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `concession_status` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `allows_modification` BOOLEAN NULL DEFAULT true,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contingency_reserves` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `complexo_id` BIGINT NOT NULL,
    `contingency_type` BIGINT NULL,
    `reserve_amount` DECIMAL(15, 2) NOT NULL,
    `reason` TEXT NOT NULL,
    `inclusion_date` DATE NOT NULL,
    `clearance_date` DATE NULL,
    `status` BIGINT NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_contingency_type`(`contingency_type`),
    INDEX `idx_complex`(`complexo_id`),
    INDEX `idx_status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contingency_status` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contingency_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contract_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `courtesy_parameters` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `cinema_complex_id` BIGINT NULL,
    `courtesy_taxation_percentage` DECIMAL(5, 2) NULL DEFAULT 0.00,
    `monthly_courtesy_limit` INTEGER NULL DEFAULT 1000,
    `validity_start` DATE NOT NULL,
    `validity_end` DATE NULL,

    INDEX `cinema_complex_id`(`cinema_complex_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `credit_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `credit_percentage` DECIMAL(5, 2) NULL DEFAULT 100.00,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer_favorite_combos` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_customer_id` BIGINT NOT NULL,
    `combo_id` BIGINT NOT NULL,
    `purchase_count` INTEGER NULL DEFAULT 0,
    `last_purchase` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `customersId` BIGINT NULL,

    INDEX `idx_customer_combo_combo`(`combo_id`),
    INDEX `idx_cfc_company_customer`(`company_customer_id`),
    UNIQUE INDEX `uk_cfc_company_combo`(`company_customer_id`, `combo_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer_favorite_genres` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_customer_id` BIGINT NOT NULL,
    `genre` VARCHAR(100) NOT NULL,
    `preference_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `customersId` BIGINT NULL,

    INDEX `idx_cfgen_company_customer`(`company_customer_id`),
    INDEX `idx_customer_genre_genre`(`genre`),
    UNIQUE INDEX `uk_cfgen_company_genre`(`company_customer_id`, `genre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer_favorite_products` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_customer_id` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL,
    `purchase_count` INTEGER NULL DEFAULT 0,
    `last_purchase` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `customersId` BIGINT NULL,

    INDEX `idx_cfp_company_customer`(`company_customer_id`),
    INDEX `idx_customer_product_product`(`product_id`),
    UNIQUE INDEX `uk_cfp_company_product`(`company_customer_id`, `product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer_interactions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_customer_id` BIGINT NOT NULL,
    `interaction_type` VARCHAR(50) NOT NULL,
    `channel` VARCHAR(30) NULL,
    `description` TEXT NULL,
    `metadata` LONGTEXT NULL,
    `origin_id` BIGINT NULL,
    `origin_type` VARCHAR(50) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `customersId` BIGINT NULL,

    INDEX `idx_ci_company_type`(`company_customer_id`, `interaction_type`),
    INDEX `idx_origin`(`origin_type`, `origin_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer_points` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_customer_id` BIGINT NOT NULL,
    `movement_type` ENUM('CREDIT', 'DEBIT', 'EXPIRATION', 'ADJUSTMENT') NOT NULL,
    `points` INTEGER NOT NULL,
    `previous_balance` INTEGER NOT NULL,
    `current_balance` INTEGER NOT NULL,
    `origin_type` VARCHAR(50) NULL,
    `origin_id` BIGINT NULL,
    `description` TEXT NULL,
    `expiration_date` DATE NULL,
    `valid` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `customersId` BIGINT NULL,

    INDEX `idx_cp_company_customer`(`company_customer_id`),
    INDEX `idx_cp_customer_date`(`company_customer_id`, `created_at`),
    INDEX `idx_cp_expiration`(`expiration_date`, `valid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer_preferences` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_customer_id` BIGINT NOT NULL,
    `preferred_session_type` VARCHAR(30) NULL,
    `preferred_language` VARCHAR(30) NULL,
    `preferred_position` ENUM('CENTER', 'LEFT_SIDE', 'RIGHT_SIDE', 'BACK', 'FRONT') NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `customersId` BIGINT NULL,

    INDEX `idx_cpref_company_customer`(`company_customer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer_preferred_rows` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_customer_id` BIGINT NOT NULL,
    `row_code` VARCHAR(5) NOT NULL,
    `usage_count` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `customersId` BIGINT NULL,

    INDEX `idx_cpr_company_customer`(`company_customer_id`),
    INDEX `idx_customer_row_row`(`row_code`),
    UNIQUE INDEX `uk_cpr_company_row`(`company_customer_id`, `row_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer_preferred_times` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_customer_id` BIGINT NOT NULL,
    `time_slot` VARCHAR(20) NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `customersId` BIGINT NULL,

    INDEX `idx_cpt_company_customer`(`company_customer_id`),
    INDEX `idx_customer_time_time`(`time_slot`),
    UNIQUE INDEX `uk_cpt_company_time`(`company_customer_id`, `time_slot`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer_preferred_weekdays` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_customer_id` BIGINT NOT NULL,
    `weekday` TINYINT NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `customersId` BIGINT NULL,

    INDEX `idx_cpw_company_customer`(`company_customer_id`),
    INDEX `idx_customer_weekday_pref_weekday`(`weekday`),
    UNIQUE INDEX `uk_cpw_company_weekday`(`company_customer_id`, `weekday`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customers` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `identity_id` BIGINT NOT NULL,
    `cpf` VARCHAR(14) NOT NULL,
    `full_name` VARCHAR(200) NOT NULL,
    `email` VARCHAR(100) NULL,
    `phone` VARCHAR(20) NULL,
    `birth_date` DATE NULL,
    `gender` ENUM('M', 'F', 'OTHER', 'NOT_INFORMED') NULL DEFAULT 'NOT_INFORMED',
    `zip_code` VARCHAR(10) NULL,
    `address` TEXT NULL,
    `city` VARCHAR(100) NULL,
    `state` CHAR(2) NULL,
    `accepts_marketing` BOOLEAN NULL DEFAULT false,
    `accepts_sms` BOOLEAN NULL DEFAULT false,
    `accepts_email` BOOLEAN NULL DEFAULT true,
    `terms_accepted` BOOLEAN NULL DEFAULT false,
    `terms_acceptance_date` TIMESTAMP(0) NULL,
    `data_anonymized` BOOLEAN NULL DEFAULT false,
    `anonymization_date` TIMESTAMP(0) NULL,
    `acceptance_ip` VARCHAR(45) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `blocked` BOOLEAN NULL DEFAULT false,
    `block_reason` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `collection_purposes` LONGTEXT NULL,
    `subject_aware_rights` BOOLEAN NULL DEFAULT false,
    `rights_awareness_date` TIMESTAMP(0) NULL,
    `anonymization_requested` BOOLEAN NULL DEFAULT false,
    `registration_source` VARCHAR(50) NULL,
    `registration_responsible` BIGINT NULL,

    UNIQUE INDEX `customers_identity_id_key`(`identity_id`),
    UNIQUE INDEX `cpf`(`cpf`),
    INDEX `fk_customer_registration_responsible`(`registration_responsible`),
    INDEX `idx_anonymization`(`data_anonymized`),
    INDEX `idx_birth_date`(`birth_date`),
    INDEX `idx_cpf`(`cpf`),
    INDEX `idx_email`(`email`),
    INDEX `idx_phone`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company_customers` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `customer_id` BIGINT NOT NULL,
    `is_active_in_loyalty` BOOLEAN NULL DEFAULT true,
    `tenant_loyalty_number` VARCHAR(50) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `accumulated_points` INTEGER NULL DEFAULT 0,
    `loyalty_level` VARCHAR(20) NULL DEFAULT 'BRONZE',
    `loyalty_join_date` TIMESTAMP(0) NULL,

    INDEX `idx_cc_company`(`company_id`),
    INDEX `idx_cc_customer`(`customer_id`),
    UNIQUE INDEX `uk_company_customer`(`company_id`, `customer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company_users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `identity_id` BIGINT NOT NULL,
    `employee_id` BIGINT NULL,
    `role` ENUM('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER', 'VIEWER') NOT NULL DEFAULT 'USER',
    `permissions_override` LONGTEXT NULL,
    `allowed_complexes` LONGTEXT NULL,
    `ip_whitelist` LONGTEXT NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `start_date` DATE NULL DEFAULT CURRENT_TIMESTAMP(3),
    `end_date` DATE NULL,
    `assigned_by` BIGINT NULL,
    `assigned_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `last_access` TIMESTAMP(0) NULL,
    `access_count` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company_identity`(`company_id`, `identity_id`),
    INDEX `idx_role`(`role`, `active`),
    INDEX `idx_end_date`(`end_date`),
    UNIQUE INDEX `company_users_company_id_identity_id_key`(`company_id`, `identity_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `delivery_history` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `obligation_id` BIGINT NOT NULL,
    `delivery_date` DATE NULL,
    `status` BIGINT NULL,
    `receipt_number` VARCHAR(100) NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_delivery_date`(`delivery_date`),
    INDEX `idx_obligation`(`obligation_id`),
    INDEX `idx_status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_sessions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `identity_id` BIGINT NOT NULL,
    `company_id` BIGINT NULL,
    `access_token_hash` VARCHAR(255) NOT NULL,
    `refresh_token_hash` VARCHAR(255) NULL,
    `session_id` VARCHAR(100) NOT NULL,
    `keycloak_session_id` VARCHAR(100) NULL,
    `session_context` ENUM('EMPLOYEE', 'CUSTOMER') NOT NULL,
    `expires_at` TIMESTAMP(0) NOT NULL,
    `last_activity` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `ip_address` VARCHAR(45) NULL,
    `user_agent` VARCHAR(500) NULL,
    `device_fingerprint` VARCHAR(255) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `revoked` BOOLEAN NULL DEFAULT false,
    `revoked_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `user_sessions_session_id_key`(`session_id`),
    INDEX `idx_identity`(`identity_id`),
    INDEX `idx_expires`(`expires_at`, `active`),
    INDEX `idx_session_id`(`session_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `opa_decision_cache` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `identity_id` BIGINT NOT NULL,
    `company_id` BIGINT NOT NULL,
    `permission` VARCHAR(100) NOT NULL,
    `context_hash` VARCHAR(64) NOT NULL,
    `decision` BOOLEAN NOT NULL,
    `decision_metadata` LONGTEXT NULL,
    `expires_at` TIMESTAMP(0) NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_expires`(`expires_at`),
    INDEX `idx_lookup`(`identity_id`, `company_id`, `permission`, `context_hash`),
    UNIQUE INDEX `opa_decision_cache_identity_id_company_id_permission_context_key`(`identity_id`, `company_id`, `permission`, `context_hash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_log` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `identity_id` BIGINT NOT NULL,
    `company_id` BIGINT NULL,
    `employee_id` BIGINT NULL,
    `action` VARCHAR(100) NOT NULL,
    `entity_type` VARCHAR(50) NULL,
    `entity_id` BIGINT NULL,
    `action_description` TEXT NULL,
    `data_before` LONGTEXT NULL,
    `data_after` LONGTEXT NULL,
    `status` ENUM('SUCCESS', 'FAILED', 'DENIED') NOT NULL,
    `error_message` TEXT NULL,
    `ip_address` VARCHAR(45) NULL,
    `user_agent` VARCHAR(500) NULL,
    `session_id` VARCHAR(100) NULL,
    `request_id` VARCHAR(100) NULL,
    `requires_approval` BOOLEAN NULL DEFAULT false,
    `approved_by` BIGINT NULL,
    `approval_date` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_identity_date`(`identity_id`, `created_at`),
    INDEX `idx_company_date`(`company_id`, `created_at`),
    INDEX `idx_action`(`action`, `created_at`),
    INDEX `idx_entity`(`entity_type`, `entity_id`),
    INDEX `idx_status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `departments` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `complex_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `cost_center` VARCHAR(50) NULL,
    `manager_id` BIGINT NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_department_manager`(`manager_id`),
    INDEX `idx_complex`(`complex_id`),
    INDEX `idx_company`(`company_id`),
    INDEX `idx_company_complex`(`company_id`, `complex_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `distributor_settlement_status` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `allows_modification` BOOLEAN NULL DEFAULT true,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `distributor_settlements` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `contract_id` BIGINT NOT NULL,
    `distributor_id` BIGINT NOT NULL,
    `cinema_complex_id` BIGINT NOT NULL,
    `competence_start_date` DATE NOT NULL,
    `competence_end_date` DATE NOT NULL,
    `total_tickets_sold` INTEGER NULL DEFAULT 0,
    `gross_box_office_revenue` DECIMAL(15, 2) NOT NULL,
    `calculation_base` BIGINT NULL,
    `taxes_deducted_amount` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `settlement_base_amount` DECIMAL(15, 2) NOT NULL,
    `distributor_percentage` DECIMAL(5, 2) NOT NULL,
    `calculated_settlement_amount` DECIMAL(15, 2) NOT NULL,
    `minimum_guarantee` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `final_settlement_amount` DECIMAL(15, 2) NOT NULL,
    `deductions_amount` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `net_settlement_amount` DECIMAL(15, 2) NOT NULL,
    `irrf_rate` DECIMAL(5, 2) NULL DEFAULT 0.00,
    `irrf_calculation_base` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `irrf_amount` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `irrf_exempt` BOOLEAN NULL DEFAULT false,
    `retained_iss_amount` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `net_payment_amount` DECIMAL(15, 2) NOT NULL,
    `status` BIGINT NULL,
    `calculation_date` DATE NULL,
    `approval_date` DATE NULL,
    `payment_date` DATE NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `calculation_base`(`calculation_base`),
    INDEX `contract_id`(`contract_id`),
    INDEX `idx_competence`(`competence_start_date`, `competence_end_date`),
    INDEX `idx_complex`(`cinema_complex_id`),
    INDEX `idx_distributor`(`distributor_id`),
    INDEX `idx_status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee_time_records` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `employee_id` BIGINT NOT NULL,
    `record_date` DATE NOT NULL,
    `entry_time` TIME(0) NULL,
    `exit_time` TIME(0) NULL,
    `break_start_time` TIME(0) NULL,
    `break_end_time` TIME(0) NULL,
    `total_hours_worked` DECIMAL(5, 2) NULL,
    `observations` TEXT NULL,
    `registration_ip` VARCHAR(45) NULL,
    `latitude` DECIMAL(10, 8) NULL,
    `longitude` DECIMAL(11, 8) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_employee_date`(`employee_id`, `record_date`),
    INDEX `idx_time_records_period`(`employee_id`, `record_date`),
    UNIQUE INDEX `uk_employee_date`(`employee_id`, `record_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `identity_id` BIGINT NOT NULL,
    `company_id` BIGINT NOT NULL,
    `complex_id` BIGINT NOT NULL,
    `position_id` BIGINT NOT NULL,
    `employee_number` VARCHAR(50) NOT NULL,
    `work_email` VARCHAR(100) NULL,
    `full_name` VARCHAR(200) NOT NULL,
    `cpf` VARCHAR(14) NOT NULL,
    `rg` VARCHAR(20) NULL,
    `birth_date` DATE NULL,
    `phone` VARCHAR(20) NULL,
    `hire_date` DATE NOT NULL,
    `termination_date` DATE NULL,
    `current_salary` DECIMAL(10, 2) NOT NULL,
    `contract_type` BIGINT NOT NULL,
    `photo_url` VARCHAR(500) NULL,
    `address` TEXT NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `employees_identity_id_key`(`identity_id`),
    UNIQUE INDEX `employee_number`(`employee_number`),
    UNIQUE INDEX `cpf`(`cpf`),
    INDEX `contract_type`(`contract_type`),
    INDEX `idx_complex`(`complex_id`),
    INDEX `idx_cpf`(`cpf`),
    INDEX `idx_employee_number`(`employee_number`),
    INDEX `idx_position`(`position_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employment_contract_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exhibition_contracts` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `movie_id` BIGINT NOT NULL,
    `cinema_complex_id` BIGINT NOT NULL,
    `contract_number` VARCHAR(50) NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `distributor_percentage` DECIMAL(5, 2) NOT NULL,
    `exhibitor_percentage` DECIMAL(5, 2) NOT NULL,
    `guaranteed_minimum` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `contract_type` BIGINT NULL,
    `revenue_base` BIGINT NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `distributor_id` BIGINT NOT NULL,
    `minimum_guarantee` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `contract_terms` TEXT NULL,
    `active` BOOLEAN NULL DEFAULT true,

    UNIQUE INDEX `contract_number`(`contract_number`),
    INDEX `fk_contract_revenue_base`(`revenue_base`),
    INDEX `fk_contract_type`(`contract_type`),
    INDEX `idx_cinema_complex`(`cinema_complex_id`),
    INDEX `idx_contract_supplier`(`distributor_id`),
    INDEX `idx_movie`(`movie_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `federal_tax_rates` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `tax_regime` BIGINT NULL,
    `pis_cofins_regime` BIGINT NULL,
    `revenue_type` BIGINT NULL,
    `pis_rate` DECIMAL(5, 2) NOT NULL,
    `cofins_rate` DECIMAL(5, 2) NOT NULL,
    `credit_allowed` BOOLEAN NULL DEFAULT false,
    `irpj_base_rate` DECIMAL(5, 2) NULL,
    `irpj_additional_rate` DECIMAL(5, 2) NULL,
    `irpj_additional_limit` DECIMAL(15, 2) NULL,
    `csll_rate` DECIMAL(5, 2) NULL,
    `presumed_profit_percentage` DECIMAL(5, 2) NULL,
    `validity_start` DATE NOT NULL,
    `validity_end` DATE NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_tax_rate_pis_cofins_regime`(`pis_cofins_regime`),
    INDEX `fk_tax_rate_revenue_type`(`revenue_type`),
    INDEX `idx_regime_revenue_validity`(`tax_regime`, `pis_cofins_regime`, `revenue_type`, `validity_start`),
    INDEX `idx_company`(`company_id`),
    INDEX `idx_company_validity`(`company_id`, `validity_start`, `validity_end`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gdpr_consents` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `subject_type` VARCHAR(20) NOT NULL,
    `subject_id` BIGINT NOT NULL,
    `purpose` VARCHAR(100) NOT NULL,
    `purpose_description` TEXT NOT NULL,
    `data_categories` LONGTEXT NOT NULL,
    `sensitive_data` BOOLEAN NULL DEFAULT false,
    `consent_given` BOOLEAN NOT NULL,
    `consent_date` TIMESTAMP(0) NULL,
    `revocation_date` TIMESTAMP(0) NULL,
    `terms_version` VARCHAR(20) NOT NULL,
    `consent_ip` VARCHAR(45) NULL,
    `user_agent` TEXT NULL,
    `channel` VARCHAR(30) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_active`(`active`),
    INDEX `idx_consent_date`(`consent_date`),
    INDEX `idx_gdpr_sensitive_data`(`sensitive_data`, `active`),
    INDEX `idx_gdpr_subject`(`subject_type`, `subject_id`, `active`),
    INDEX `idx_purpose`(`purpose`),
    INDEX `idx_sensitive_data`(`sensitive_data`),
    INDEX `idx_subject`(`subject_type`, `subject_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gdpr_data_subject_requests` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `subject_type` VARCHAR(20) NOT NULL,
    `subject_id` BIGINT NOT NULL,
    `subject_name` VARCHAR(200) NOT NULL,
    `subject_email` VARCHAR(100) NOT NULL,
    `subject_cpf` VARCHAR(14) NULL,
    `request_type` VARCHAR(50) NOT NULL,
    `description` TEXT NOT NULL,
    `identity_documents` LONGTEXT NULL,
    `status` VARCHAR(30) NULL DEFAULT 'PENDENTE',
    `rejection_reason` TEXT NULL,
    `request_date` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `response_deadline` TIMESTAMP(0) NOT NULL,
    `response_date` TIMESTAMP(0) NULL,
    `completion_date` TIMESTAMP(0) NULL,
    `handled_by` BIGINT NULL,
    `handling_notes` TEXT NULL,
    `export_file_url` VARCHAR(500) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `handled_by`(`handled_by`),
    INDEX `idx_deadline`(`response_deadline`, `status`),
    INDEX `idx_requests_deadline`(`response_deadline`, `status`),
    INDEX `idx_status`(`status`),
    INDEX `idx_subject`(`subject_type`, `subject_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gdpr_security_incidents` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `incident_number` VARCHAR(50) NOT NULL,
    `incident_type` VARCHAR(50) NOT NULL,
    `severity` VARCHAR(20) NOT NULL,
    `description` TEXT NOT NULL,
    `discovery_date` TIMESTAMP(0) NOT NULL,
    `estimated_occurrence_date` TIMESTAMP(0) NULL,
    `affected_subjects` INTEGER NULL,
    `exposed_data_categories` LONGTEXT NULL,
    `sensitive_data_exposed` BOOLEAN NULL DEFAULT false,
    `immediate_actions` TEXT NULL,
    `corrective_actions` TEXT NULL,
    `requires_anpd_notification` BOOLEAN NULL DEFAULT false,
    `anpd_notification_date` TIMESTAMP(0) NULL,
    `anpd_protocol` VARCHAR(100) NULL,
    `subjects_notified` BOOLEAN NULL DEFAULT false,
    `subjects_notification_date` TIMESTAMP(0) NULL,
    `notification_channel` VARCHAR(30) NULL,
    `status` VARCHAR(30) NULL DEFAULT 'ABERTO',
    `resolution_date` TIMESTAMP(0) NULL,
    `detected_by` BIGINT NULL,
    `investigation_responsible` BIGINT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `incident_number`(`incident_number`),
    INDEX `detected_by`(`detected_by`),
    INDEX `idx_anpd_notification`(`requires_anpd_notification`, `anpd_notification_date`),
    INDEX `idx_number`(`incident_number`),
    INDEX `idx_severity_status`(`severity`, `status`),
    INDEX `investigation_responsible`(`investigation_responsible`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `iss_withholdings` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `cinema_complex_id` BIGINT NOT NULL,
    `service_received_id` BIGINT NULL,
    `service_description` VARCHAR(200) NULL,
    `withholding_rate` DECIMAL(5, 2) NOT NULL,
    `withholding_amount` DECIMAL(15, 2) NOT NULL,
    `service_code` VARCHAR(10) NULL,
    `withholding_date` DATE NOT NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `cinema_complex_id`(`cinema_complex_id`),
    INDEX `idx_date`(`withholding_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `journal_entries` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `cinema_complex_id` BIGINT NOT NULL,
    `entry_number` VARCHAR(50) NOT NULL,
    `entry_date` DATE NOT NULL,
    `entry_type` BIGINT NULL,
    `origin_type` VARCHAR(50) NULL,
    `origin_id` BIGINT NULL,
    `description` TEXT NOT NULL,
    `total_amount` DECIMAL(15, 2) NOT NULL,
    `status` BIGINT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `entry_number`(`entry_number`),
    INDEX `fk_journal_entry_type`(`entry_type`),
    INDEX `idx_complex_date`(`cinema_complex_id`, `entry_date`),
    INDEX `idx_date`(`entry_date`),
    INDEX `idx_origin`(`origin_type`, `origin_id`),
    INDEX `idx_status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `journal_entry_items` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `journal_entry_id` BIGINT NOT NULL,
    `account_id` BIGINT NOT NULL,
    `movement_type` BIGINT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `item_description` TEXT NULL,

    INDEX `fk_journal_item_movement_type`(`movement_type`),
    INDEX `idx_account`(`account_id`),
    INDEX `idx_journal_entry`(`journal_entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `journal_entry_status` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `allows_modification` BOOLEAN NULL DEFAULT true,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `journal_entry_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `nature` VARCHAR(20) NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `media_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `monthly_income_statement` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `cinema_complex_id` BIGINT NOT NULL,
    `year` INTEGER NOT NULL,
    `month` INTEGER NOT NULL,
    `total_gross_revenue` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `sales_deductions` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `net_revenue` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `cost_of_goods_sold` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `distributor_payouts` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `gross_profit` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `administrative_expenses` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `selling_expenses` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `financial_expenses` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `financial_income` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `operational_result` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `irpj_provision` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `csll_provision` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `net_result` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `gross_margin_percent` DECIMAL(5, 2) NULL,
    `net_margin_percent` DECIMAL(5, 2) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_period`(`year`, `month`),
    UNIQUE INDEX `uk_complex_period`(`cinema_complex_id`, `year`, `month`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `monthly_tax_settlement` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `cinema_complex_id` BIGINT NOT NULL,
    `year` INTEGER NOT NULL,
    `month` INTEGER NOT NULL,
    `settlement_date` DATE NOT NULL,
    `tax_regime` VARCHAR(50) NULL,
    `pis_cofins_regime` VARCHAR(50) NULL,
    `gross_box_office_revenue` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `gross_concession_revenue` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `gross_advertising_revenue` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `gross_other_revenue` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `total_gross_revenue` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `total_deductions` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `calculation_base_revenue` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `total_iss_box_office` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `total_iss_concession` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `total_iss` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `total_pis_debit` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `total_pis_credit` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `total_pis_payable` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `total_cofins_debit` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `total_cofins_credit` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `total_cofins_payable` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `irpj_base` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `irpj_base_15` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `irpj_additional_10` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `total_irpj` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `csll_base` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `total_csll` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `gross_revenue_12m` DECIMAL(15, 2) NULL,
    `effective_simples_rate` DECIMAL(5, 2) NULL,
    `total_simples_amount` DECIMAL(15, 2) NULL,
    `total_distributor_payment` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `net_revenue_taxed` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `net_total_revenue` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `status` BIGINT NULL,
    `declaration_date` DATE NULL,
    `payment_date` DATE NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_period`(`year`, `month`),
    INDEX `idx_status`(`status`),
    UNIQUE INDEX `uk_complex_period`(`cinema_complex_id`, `year`, `month`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movie_cast` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `movie_id` BIGINT NOT NULL,
    `artist_name` VARCHAR(200) NOT NULL,
    `character_name` VARCHAR(200) NULL,
    `cast_type` BIGINT NOT NULL,
    `credit_order` INTEGER NULL DEFAULT 0,
    `photo_url` VARCHAR(500) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `display_order` INTEGER NULL DEFAULT 0,

    INDEX `idx_artist`(`artist_name`),
    INDEX `idx_cast_type`(`cast_type`),
    INDEX `idx_movie`(`movie_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movie_categories` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `minimum_age` INTEGER NULL DEFAULT 0,
    `slug` VARCHAR(100) NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_name`(`name`),
    INDEX `idx_slug`(`slug`),
    INDEX `idx_company`(`company_id`),
    INDEX `idx_company_active`(`company_id`, `active`),
    UNIQUE INDEX `uk_company_slug`(`company_id`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movie_media` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `movie_id` BIGINT NOT NULL,
    `media_type` BIGINT NOT NULL,
    `media_url` VARCHAR(500) NOT NULL,
    `description` TEXT NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `width` INTEGER NULL,
    `height` INTEGER NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `title` VARCHAR(200) NULL,

    INDEX `idx_movie_media`(`movie_id`, `media_type`, `active`),
    INDEX `movie_media_ibfk_2`(`media_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movies` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `original_title` VARCHAR(300) NOT NULL,
    `brazil_title` VARCHAR(300) NULL,
    `ancine_number` VARCHAR(50) NULL,
    `duration_minutes` INTEGER NOT NULL,
    `age_rating` BIGINT NULL,
    `genre` VARCHAR(100) NULL,
    `country_of_origin` VARCHAR(50) NULL,
    `production_year` INTEGER NULL,
    `national` BOOLEAN NULL DEFAULT false,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `category_id` BIGINT NULL,
    `synopsis` TEXT NULL,
    `short_synopsis` VARCHAR(500) NULL,
    `budget` DECIMAL(15, 2) NULL,
    `worldwide_box_office` DECIMAL(15, 2) NULL,
    `website` VARCHAR(200) NULL,
    `tmdb_id` VARCHAR(50) NULL,
    `imdb_id` VARCHAR(20) NULL,
    `tags_json` LONGTEXT NULL,
    `worldwide_release_date` DATE NULL,
    `original_language` VARCHAR(50) NULL,
    `slug` VARCHAR(200) NULL,
    `distributor_id` BIGINT NOT NULL,

    UNIQUE INDEX `slug`(`slug`),
    INDEX `fk_movie_age_rating`(`age_rating`),
    INDEX `fk_movie_category`(`category_id`),
    INDEX `idx_movies_distributor`(`distributor_id`, `active`),
    INDEX `idx_national`(`national`),
    INDEX `idx_supplier_distributor`(`distributor_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company_movies` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `movie_id` BIGINT NOT NULL,
    `is_active_for_tenant` BOOLEAN NOT NULL DEFAULT true,
    `is_promoted` BOOLEAN NOT NULL DEFAULT false,
    `internal_notes` TEXT NULL,
    `tenant_movie_code` VARCHAR(50) NULL,

    INDEX `idx_company_movies_company`(`company_id`),
    INDEX `idx_company_movies_movie`(`movie_id`),
    UNIQUE INDEX `idx_unique_company_movie`(`company_id`, `movie_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `municipal_tax_parameters` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `ibge_municipality_code` VARCHAR(7) NOT NULL,
    `municipality_name` VARCHAR(100) NOT NULL,
    `state` CHAR(2) NOT NULL,
    `iss_rate` DECIMAL(5, 2) NOT NULL,
    `iss_service_code` VARCHAR(10) NULL,
    `iss_concession_applicable` BOOLEAN NULL DEFAULT false,
    `iss_concession_service_code` VARCHAR(10) NULL,
    `iss_withholding` BOOLEAN NULL DEFAULT false,
    `validity_start` DATE NOT NULL,
    `validity_end` DATE NULL,
    `notes` TEXT NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_ibge_code`(`ibge_municipality_code`),
    INDEX `idx_municipality_validity`(`ibge_municipality_code`, `validity_start`, `validity_end`),
    INDEX `idx_company`(`company_id`),
    INDEX `idx_company_municipality`(`company_id`, `ibge_municipality_code`),
    UNIQUE INDEX `uk_company_municipality_validity`(`company_id`, `ibge_municipality_code`, `validity_start`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `obligation_status` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_status` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `allows_modification` BOOLEAN NULL DEFAULT true,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_policies` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `min_length` INTEGER NULL DEFAULT 8,
    `require_uppercase` BOOLEAN NULL DEFAULT true,
    `require_lowercase` BOOLEAN NULL DEFAULT true,
    `require_number` BOOLEAN NULL DEFAULT true,
    `require_special` BOOLEAN NULL DEFAULT true,
    `allowed_special_chars` VARCHAR(50) NULL DEFAULT '!@#$%^&*()_+-=[]{}|;:,.<>?',
    `prohibit_sequences` BOOLEAN NULL DEFAULT true,
    `prohibit_repetitions` BOOLEAN NULL DEFAULT true,
    `prohibit_personal_data` BOOLEAN NULL DEFAULT true,
    `password_history_count` INTEGER NULL DEFAULT 5,
    `password_validity_days` INTEGER NULL DEFAULT 90,
    `expiration_warning_days` INTEGER NULL DEFAULT 7,
    `max_login_attempts` INTEGER NULL DEFAULT 5,
    `block_time_minutes` INTEGER NULL DEFAULT 30,
    `application_level` VARCHAR(30) NULL DEFAULT 'TODOS',
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    INDEX `idx_company_active`(`company_id`, `active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_methods` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `operator_fee` DECIMAL(5, 2) NULL DEFAULT 0.00,
    `settlement_days` INTEGER NULL DEFAULT 0,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `periodicities` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `months` INTEGER NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NULL,
    `module_id` BIGINT NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `action` VARCHAR(20) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_code`(`code`),
    INDEX `idx_module`(`module_id`),
    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_code`(`company_id`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pis_cofins_credits` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `cinema_complex_id` BIGINT NOT NULL,
    `credit_type` BIGINT NULL,
    `description` TEXT NOT NULL,
    `fiscal_document` VARCHAR(50) NULL,
    `document_date` DATE NOT NULL,
    `competence_date` DATE NOT NULL,
    `base_amount` DECIMAL(15, 2) NOT NULL,
    `pis_credit_rate` DECIMAL(5, 2) NOT NULL,
    `pis_credit_amount` DECIMAL(15, 2) NOT NULL,
    `cofins_credit_rate` DECIMAL(5, 2) NOT NULL,
    `cofins_credit_amount` DECIMAL(15, 2) NOT NULL,
    `processed` BOOLEAN NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_credit_type`(`credit_type`),
    INDEX `idx_competence_date`(`competence_date`),
    INDEX `idx_complex_competence`(`cinema_complex_id`, `competence_date`),
    INDEX `idx_credits_competence`(`competence_date`, `processed`),
    INDEX `idx_processed`(`processed`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pis_cofins_regimes` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `allows_credit` BOOLEAN NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `positions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `department_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `base_salary` DECIMAL(10, 2) NULL,
    `weekly_hours` INTEGER NULL DEFAULT 44,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_department`(`department_id`),
    INDEX `idx_company`(`company_id`),
    INDEX `idx_company_department`(`company_id`, `department_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_categories` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `code` VARCHAR(20) NOT NULL,
    `description` TEXT NULL,
    `active` BOOLEAN NULL DEFAULT true,

    INDEX `idx_company`(`company_id`),
    INDEX `idx_company_active`(`company_id`, `active`),
    UNIQUE INDEX `uk_company_code`(`company_id`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_stock` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `product_id` BIGINT NOT NULL,
    `complex_id` BIGINT NOT NULL,
    `current_quantity` INTEGER NULL DEFAULT 0,
    `minimum_quantity` INTEGER NULL DEFAULT 10,
    `maximum_quantity` INTEGER NULL DEFAULT 100,
    `location` VARCHAR(100) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_complex`(`complex_id`),
    INDEX `idx_minimum_alert`(`current_quantity`, `minimum_quantity`),
    INDEX `idx_quantity`(`current_quantity`),
    UNIQUE INDEX `uk_product_complex`(`product_id`, `complex_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `category_id` BIGINT NOT NULL,
    `product_code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `ncm_code` VARCHAR(10) NULL,
    `unit` VARCHAR(10) NULL DEFAULT 'UN',
    `sale_price` DECIMAL(10, 2) NOT NULL,
    `cost_price` DECIMAL(10, 2) NOT NULL,
    `minimum_stock` INTEGER NULL DEFAULT 0,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `product_code`(`product_code`),
    INDEX `idx_category`(`category_id`),
    INDEX `idx_product_code`(`product_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profile_permissions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `profile_id` BIGINT NOT NULL,
    `routine_id` BIGINT NOT NULL,
    `operation` ENUM('CREATE', 'READ', 'UPDATE', 'DELETE', 'EXECUTE') NOT NULL,

    INDEX `idx_profile_routine`(`profile_id`, `routine_id`),
    INDEX `idx_routine`(`routine_id`),
    UNIQUE INDEX `uk_profile_routine_operation`(`profile_id`, `routine_id`, `operation`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projection_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `additional_value` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promotion_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `code` VARCHAR(30) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `order_index` INTEGER NULL DEFAULT 0,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    INDEX `idx_company_active`(`company_id`, `active`),
    UNIQUE INDEX `uk_company_code`(`company_id`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promotion_types_domain` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(30) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `order_index` INTEGER NULL DEFAULT 0,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `code`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promotional_campaigns` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `campaign_code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `promotion_type_id` BIGINT NOT NULL,
    `start_date` TIMESTAMP(0) NOT NULL,
    `end_date` TIMESTAMP(0) NOT NULL,
    `start_time` TIME(0) NULL,
    `end_time` TIME(0) NULL,
    `min_age` INTEGER NULL,
    `max_age` INTEGER NULL,
    `min_loyalty_level` VARCHAR(20) NULL,
    `new_customers_only` BOOLEAN NULL DEFAULT false,
    `discount_value` DECIMAL(10, 2) NULL,
    `discount_percentage` DECIMAL(5, 2) NULL,
    `buy_quantity` INTEGER NULL,
    `get_quantity` INTEGER NULL,
    `fixed_price` DECIMAL(10, 2) NULL,
    `points_multiplier` DECIMAL(5, 2) NULL DEFAULT 1.00,
    `max_total_uses` INTEGER NULL,
    `used_count` INTEGER NULL DEFAULT 0,
    `max_uses_per_customer` INTEGER NULL,
    `min_purchase_value` DECIMAL(10, 2) NULL,
    `combinable` BOOLEAN NULL DEFAULT false,
    `priority` INTEGER NULL DEFAULT 0,
    `active` BOOLEAN NULL DEFAULT true,
    `requires_coupon` BOOLEAN NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `campaign_code`(`campaign_code`),
    INDEX `idx_company_code`(`company_id`, `campaign_code`),
    INDEX `idx_campaigns_validity_active`(`start_date`, `end_date`, `active`),
    INDEX `idx_code`(`campaign_code`),
    INDEX `idx_type`(`promotion_type_id`),
    INDEX `idx_validity`(`start_date`, `end_date`, `active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promotional_coupons` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `campaign_id` BIGINT NOT NULL,
    `coupon_code` VARCHAR(50) NOT NULL,
    `customer_id` BIGINT NULL,
    `start_date` TIMESTAMP(0) NOT NULL,
    `end_date` TIMESTAMP(0) NOT NULL,
    `max_uses` INTEGER NULL DEFAULT 1,
    `used_count` INTEGER NULL DEFAULT 0,
    `active` BOOLEAN NULL DEFAULT true,
    `used` BOOLEAN NULL DEFAULT false,
    `first_use_date` TIMESTAMP(0) NULL,
    `last_use_date` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `coupon_code`(`coupon_code`),
    INDEX `idx_campaign`(`campaign_id`),
    INDEX `idx_code`(`coupon_code`),
    INDEX `idx_customer`(`customer_id`),
    INDEX `idx_validity`(`start_date`, `end_date`, `active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promotions_used` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `sale_id` BIGINT NOT NULL,
    `campaign_id` BIGINT NOT NULL,
    `coupon_id` BIGINT NULL,
    `customer_id` BIGINT NULL,
    `promotion_type_id` BIGINT NOT NULL,
    `discount_applied` DECIMAL(10, 2) NOT NULL,
    `original_value` DECIMAL(10, 2) NOT NULL,
    `final_value` DECIMAL(10, 2) NOT NULL,
    `points_earned` INTEGER NULL DEFAULT 0,
    `usage_date` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `coupon_id`(`coupon_id`),
    INDEX `idx_campaign`(`campaign_id`),
    INDEX `idx_customer`(`customer_id`),
    INDEX `idx_sale`(`sale_id`),
    INDEX `idx_usage_date`(`usage_date`),
    INDEX `promotion_type_id`(`promotion_type_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recine_acquisition_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recine_acquisitions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `recine_project_id` BIGINT NOT NULL,
    `acquisition_type` BIGINT NULL,
    `item_type` BIGINT NULL,
    `item_description` TEXT NOT NULL,
    `supplier` VARCHAR(200) NULL,
    `invoice_number` VARCHAR(50) NULL,
    `acquisition_date` DATE NOT NULL,
    `item_value` DECIMAL(15, 2) NOT NULL,
    `pis_cofins_saved` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `ipi_saved` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `ii_saved` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `total_benefit_value` DECIMAL(15, 2) NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_recine_acquisition_item_type`(`item_type`),
    INDEX `fk_recine_acquisition_type`(`acquisition_type`),
    INDEX `idx_date`(`acquisition_date`),
    INDEX `idx_project`(`recine_project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recine_deadline_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recine_deadlines` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `project_id` BIGINT NOT NULL,
    `deadline_type` BIGINT NULL,
    `due_date` DATE NOT NULL,
    `completion_date` DATE NULL,
    `estimated_penalty` DECIMAL(15, 2) NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_recine_deadline_type`(`deadline_type`),
    INDEX `idx_due_date`(`due_date`),
    INDEX `idx_project`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recine_item_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recine_project_status` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `allows_modification` BOOLEAN NULL DEFAULT true,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recine_project_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recine_projects` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `cinema_complex_id` BIGINT NOT NULL,
    `project_number` VARCHAR(50) NOT NULL,
    `description` TEXT NOT NULL,
    `project_type` BIGINT NULL,
    `total_project_value` DECIMAL(15, 2) NOT NULL,
    `estimated_benefit_value` DECIMAL(15, 2) NOT NULL,
    `pis_cofins_suspended` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `ipi_exempt` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `ii_exempt` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `start_date` DATE NOT NULL,
    `expected_completion_date` DATE NOT NULL,
    `actual_completion_date` DATE NULL,
    `status` BIGINT NULL,
    `ancine_process_number` VARCHAR(50) NULL,
    `ancine_approval_date` DATE NULL,
    `observations` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `project_number`(`project_number`),
    INDEX `fk_recine_project_type`(`project_type`),
    INDEX `idx_complex`(`cinema_complex_id`),
    INDEX `idx_status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `revenue_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `applies_iss` BOOLEAN NULL DEFAULT true,
    `applies_pis_cofins` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rooms` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `cinema_complex_id` BIGINT NOT NULL,
    `room_number` VARCHAR(10) NOT NULL,
    `name` VARCHAR(100) NULL,
    `capacity` INTEGER NOT NULL,
    `projection_type` BIGINT NULL,
    `audio_type` BIGINT NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `seat_layout` LONGTEXT NULL,
    `total_rows` INTEGER NULL,
    `total_columns` INTEGER NULL,
    `room_design` VARCHAR(30) NULL,
    `layout_image` VARCHAR(255) NULL,

    INDEX `fk_room_audio_type`(`audio_type`),
    INDEX `fk_room_projection_type`(`projection_type`),
    INDEX `idx_cinema_complex`(`cinema_complex_id`),
    UNIQUE INDEX `uk_complex_room`(`cinema_complex_id`, `room_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `routine_operations` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `routine_id` BIGINT NOT NULL,
    `operation` ENUM('CREATE', 'READ', 'UPDATE', 'DELETE', 'EXECUTE') NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `api_endpoint` VARCHAR(200) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_operation`(`operation`),
    INDEX `idx_routine`(`routine_id`),
    UNIQUE INDEX `uk_routine_operation`(`routine_id`, `operation`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sale_status` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `allows_modification` BOOLEAN NULL DEFAULT true,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sale_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `convenience_fee` DECIMAL(5, 2) NULL DEFAULT 0.00,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sales` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `cinema_complex_id` BIGINT NOT NULL,
    `sale_number` VARCHAR(50) NOT NULL,
    `sale_date` TIMESTAMP(0) NOT NULL,
    `sale_type` BIGINT NULL,
    `user_id` BIGINT NULL,
    `customer_cpf` VARCHAR(14) NULL,
    `customer_id` BIGINT NULL,
    `total_amount` DECIMAL(10, 2) NOT NULL,
    `discount_amount` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `net_amount` DECIMAL(10, 2) NOT NULL,
    `payment_method` BIGINT NULL,
    `status` BIGINT NULL,
    `cancellation_date` TIMESTAMP(0) NULL,
    `cancellation_reason` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `sale_number`(`sale_number`),
    INDEX `fk_sale_payment_method`(`payment_method`),
    INDEX `fk_sale_type`(`sale_type`),
    INDEX `idx_complex_sale_date`(`cinema_complex_id`, `sale_date`),
    INDEX `idx_customer`(`customer_id`),
    INDEX `idx_customer_cpf`(`customer_cpf`),
    INDEX `idx_sale_complex_date_status`(`cinema_complex_id`, `sale_date`, `status`),
    INDEX `idx_sale_date_complex`(`sale_date`, `cinema_complex_id`),
    INDEX `idx_sale_number`(`sale_number`),
    INDEX `idx_sales_cpf`(`customer_cpf`),
    INDEX `idx_sales_customer_status`(`customer_id`, `status`),
    INDEX `idx_sales_date_status`(`sale_date`, `status`),
    INDEX `idx_sales_status_date`(`status`, `sale_date`),
    INDEX `idx_status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seat_status` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `allows_modification` BOOLEAN NULL DEFAULT true,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seat_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `additional_value` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seats` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `room_id` BIGINT NOT NULL,
    `seat_code` VARCHAR(10) NOT NULL,
    `row_code` VARCHAR(5) NOT NULL,
    `column_number` INTEGER NOT NULL,
    `seat_type` BIGINT NULL,
    `position_x` INTEGER NULL,
    `position_y` INTEGER NULL,
    `accessible` BOOLEAN NULL DEFAULT false,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_room`(`room_id`),
    INDEX `seat_type`(`seat_type`),
    UNIQUE INDEX `uk_room_seat`(`room_id`, `seat_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sensitive_actions_log` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `routine_code` INTEGER NOT NULL,
    `operation` VARCHAR(20) NULL,
    `entity_type` VARCHAR(50) NULL,
    `entity_id` BIGINT NULL,
    `origin_ip` VARCHAR(45) NULL,
    `user_agent` VARCHAR(255) NULL,
    `data_before` LONGTEXT NULL,
    `data_after` LONGTEXT NULL,
    `approved_by` BIGINT NULL,
    `approval_date` TIMESTAMP(0) NULL,
    `status` ENUM('PENDENTE', 'APROVADO', 'NEGADO') NULL DEFAULT 'APROVADO',
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_created_routine`(`created_at`, `routine_code`),
    INDEX `idx_entity`(`entity_type`, `entity_id`),
    INDEX `idx_log_entity`(`entity_type`, `entity_id`),
    INDEX `idx_log_user_date`(`user_id`, `created_at`),
    INDEX `idx_routine`(`routine_code`),
    INDEX `idx_status`(`status`),
    INDEX `idx_user_date`(`user_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session_languages` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `abbreviation` VARCHAR(10) NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session_seat_status` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `showtime_id` BIGINT NOT NULL,
    `seat_id` BIGINT NOT NULL,
    `status` BIGINT NOT NULL,
    `sale_id` BIGINT NULL,
    `reservation_uuid` VARCHAR(100) NULL,
    `reservation_date` TIMESTAMP(0) NULL,
    `expiration_date` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_expiration`(`expiration_date`),
    INDEX `idx_reservation`(`reservation_uuid`),
    INDEX `sale_id`(`sale_id`),
    INDEX `seat_id`(`seat_id`),
    INDEX `status`(`status`),
    UNIQUE INDEX `uk_session_seat`(`showtime_id`, `seat_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session_status` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `allows_modification` BOOLEAN NULL DEFAULT true,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settlement_bases` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settlement_status` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `allows_modification` BOOLEAN NULL DEFAULT true,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `showtime_schedule` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `cinema_complex_id` BIGINT NOT NULL,
    `room_id` BIGINT NOT NULL,
    `movie_id` BIGINT NOT NULL,
    `session_date` DATE NOT NULL,
    `session_time` TIME(0) NOT NULL,
    `projection_type` BIGINT NULL,
    `audio_type` BIGINT NULL,
    `session_language` BIGINT NULL,
    `status` BIGINT NULL,
    `available_seats` INTEGER NULL DEFAULT 0,
    `sold_seats` INTEGER NULL DEFAULT 0,
    `blocked_seats` INTEGER NULL DEFAULT 0,
    `base_ticket_price` DECIMAL(10, 2) NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `audio_type`(`audio_type`),
    INDEX `cinema_complex_id`(`cinema_complex_id`),
    INDEX `idx_movie`(`movie_id`),
    INDEX `idx_room`(`room_id`),
    INDEX `idx_session_date_time`(`session_date`, `session_time`),
    INDEX `projection_type`(`projection_type`),
    INDEX `session_language`(`session_language`),
    INDEX `status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `simple_national_brackets` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `annex` VARCHAR(10) NOT NULL,
    `bracket` INTEGER NOT NULL,
    `gross_revenue_12m_from` DECIMAL(15, 2) NOT NULL,
    `gross_revenue_12m_to` DECIMAL(15, 2) NOT NULL,
    `nominal_rate` DECIMAL(5, 2) NOT NULL,
    `irpj_percentage` DECIMAL(5, 2) NULL,
    `csll_percentage` DECIMAL(5, 2) NULL,
    `cofins_percentage` DECIMAL(5, 2) NULL,
    `pis_percentage` DECIMAL(5, 2) NULL,
    `cpp_percentage` DECIMAL(5, 2) NULL,
    `iss_percentage` DECIMAL(5, 2) NULL,
    `validity_start` DATE NOT NULL,
    `validity_end` DATE NULL,
    `active` BOOLEAN NULL DEFAULT true,

    INDEX `idx_annex_revenue`(`annex`, `gross_revenue_12m_from`, `gross_revenue_12m_to`),
    INDEX `idx_company`(`company_id`),
    INDEX `idx_company_annex`(`company_id`, `annex`),
    UNIQUE INDEX `uk_company_annex_bracket`(`company_id`, `annex`, `bracket`, `validity_start`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `state_icms_parameters` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `state` CHAR(2) NOT NULL,
    `icms_rate` DECIMAL(5, 2) NULL,
    `mva_percentage` DECIMAL(5, 2) NULL,
    `tax_substitution_applicable` BOOLEAN NULL DEFAULT false,
    `validity_start` DATE NOT NULL,
    `validity_end` DATE NULL,
    `active` BOOLEAN NULL DEFAULT true,

    INDEX `idx_state_validity`(`state`, `validity_start`),
    INDEX `idx_company`(`company_id`),
    INDEX `idx_company_state`(`company_id`, `state`),
    UNIQUE INDEX `uk_company_state_validity`(`company_id`, `state`, `validity_start`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_movement_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `affects_stock` BOOLEAN NULL DEFAULT true,
    `operation_type` VARCHAR(10) NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_movements` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `product_id` BIGINT NOT NULL,
    `complex_id` BIGINT NOT NULL,
    `movement_type` BIGINT NOT NULL,
    `quantity` INTEGER NOT NULL,
    `previous_quantity` INTEGER NOT NULL,
    `current_quantity` INTEGER NOT NULL,
    `origin_type` VARCHAR(50) NULL,
    `origin_id` BIGINT NULL,
    `unit_value` DECIMAL(10, 2) NULL,
    `total_value` DECIMAL(15, 2) NULL,
    `observations` TEXT NULL,
    `user_id` BIGINT NULL,
    `movement_date` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_complex`(`complex_id`),
    INDEX `idx_movement_date`(`movement_date`),
    INDEX `idx_origin`(`origin_type`, `origin_id`),
    INDEX `idx_product`(`product_id`),
    INDEX `movement_type`(`movement_type`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `supplier_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `suppliers` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `corporate_name` VARCHAR(200) NOT NULL,
    `trade_name` VARCHAR(200) NULL,
    `cnpj` VARCHAR(18) NULL,
    `phone` VARCHAR(20) NULL,
    `email` VARCHAR(100) NULL,
    `address` TEXT NULL,
    `supplier_type` BIGINT NULL,
    `contact_name` VARCHAR(200) NULL,
    `contact_phone` VARCHAR(20) NULL,
    `delivery_days` INTEGER NULL DEFAULT 7,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_film_distributor` BOOLEAN NULL DEFAULT false,

    INDEX `idx_type`(`supplier_type`),
    INDEX `idx_company`(`company_id`),
    INDEX `idx_company_active`(`company_id`, `active`),
    UNIQUE INDEX `uk_company_cnpj`(`company_id`, `cnpj`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_modules` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NULL,
    `code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `icon` VARCHAR(50) NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_code`(`company_id`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_routines` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NULL,
    `code` INTEGER NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `module` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `category` VARCHAR(100) NULL,
    `risk_level` ENUM('BAIXO', 'MEDIO', 'ALTO', 'CRITICO') NULL DEFAULT 'BAIXO',
    `requires_approval` BOOLEAN NULL DEFAULT false,
    `requires_supervisor_password` BOOLEAN NULL DEFAULT false,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_category`(`category`),
    INDEX `idx_code`(`code`),
    INDEX `idx_module`(`module`),
    INDEX `idx_routine_module_active`(`module`, `active`),
    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_code`(`company_id`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `employee_id` BIGINT NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `last_login_date` TIMESTAMP(0) NULL,
    `reset_token` VARCHAR(100) NULL,
    `token_expiration_date` TIMESTAMP(0) NULL,
    `failed_login_attempts` INTEGER NULL DEFAULT 0,
    `blocked_until` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `requires_2fa` BOOLEAN NULL DEFAULT false,
    `secret_2fa` VARCHAR(100) NULL,
    `backup_codes_2fa` LONGTEXT NULL,
    `last_ip` VARCHAR(45) NULL,
    `last_location` VARCHAR(200) NULL,
    `active_sessions` INTEGER NULL DEFAULT 0,
    `max_simultaneous_sessions` INTEGER NULL DEFAULT 3,
    `password_policy` LONGTEXT NULL,
    `password_expiration_date` DATE NULL,
    `password_history` LONGTEXT NULL,
    `security_questions` LONGTEXT NULL,

    UNIQUE INDEX `username`(`username`),
    UNIQUE INDEX `email`(`email`),
    INDEX `employee_id`(`employee_id`),
    INDEX `idx_2fa`(`requires_2fa`),
    INDEX `idx_email`(`email`),
    INDEX `idx_last_ip`(`last_ip`),
    INDEX `idx_token`(`reset_token`),
    INDEX `idx_username`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tax_compensations` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `cinema_complex_id` BIGINT NOT NULL,
    `tax_type` BIGINT NULL,
    `credit_amount` DECIMAL(15, 2) NOT NULL,
    `compensated_amount` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `credit_balance` DECIMAL(15, 2) NOT NULL,
    `credit_competence_date` DATE NOT NULL,
    `usage_date` DATE NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_compensation_tax_type`(`tax_type`),
    INDEX `idx_complex_tax`(`cinema_complex_id`, `tax_type`),
    INDEX `idx_credit_balance`(`credit_balance`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tax_entries` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `cinema_complex_id` BIGINT NOT NULL,
    `source_type` BIGINT NULL,
    `source_id` BIGINT NOT NULL,
    `competence_date` DATE NOT NULL,
    `entry_date` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `gross_amount` DECIMAL(15, 2) NOT NULL,
    `deductions_amount` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `calculation_base` DECIMAL(15, 2) NOT NULL,
    `apply_iss` BOOLEAN NULL DEFAULT true,
    `iss_rate` DECIMAL(5, 2) NULL DEFAULT 0.00,
    `iss_amount` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `ibge_municipality_code` VARCHAR(7) NULL,
    `iss_service_code` VARCHAR(10) NULL,
    `withheld_at_source` BOOLEAN NULL DEFAULT false,
    `pis_cofins_regime` BIGINT NULL,
    `pis_rate` DECIMAL(5, 2) NOT NULL,
    `pis_debit_amount` DECIMAL(15, 2) NOT NULL,
    `pis_credit_amount` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `pis_amount_payable` DECIMAL(15, 2) NOT NULL,
    `cofins_rate` DECIMAL(5, 2) NOT NULL,
    `cofins_debit_amount` DECIMAL(15, 2) NOT NULL,
    `cofins_credit_amount` DECIMAL(15, 2) NULL DEFAULT 0.00,
    `cofins_amount_payable` DECIMAL(15, 2) NOT NULL,
    `irpj_csll_base` DECIMAL(15, 2) NULL,
    `presumed_percentage` DECIMAL(5, 2) NULL,
    `snapshot_rates` LONGTEXT NULL,
    `processed` BOOLEAN NULL DEFAULT false,
    `processing_date` TIMESTAMP(0) NULL,
    `processing_user_id` BIGINT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_tax_entry_pis_cofins_regime`(`pis_cofins_regime`),
    INDEX `idx_competence_date`(`competence_date`),
    INDEX `idx_complex_competence`(`cinema_complex_id`, `competence_date`),
    INDEX `idx_processed`(`processed`),
    INDEX `idx_source`(`source_type`, `source_id`),
    INDEX `idx_source_competence`(`source_type`, `source_id`, `competence_date`),
    INDEX `idx_tax_entries_competence_type`(`competence_date`, `source_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tax_regimes` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tax_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `jurisdiction` VARCHAR(20) NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `discount_percentage` DECIMAL(5, 2) NULL DEFAULT 0.00,
    `display_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_company_name`(`company_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tickets` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `sale_id` BIGINT NOT NULL,
    `showtime_id` BIGINT NOT NULL,
    `seat_id` BIGINT NULL,
    `ticket_number` VARCHAR(50) NOT NULL,
    `ticket_type` BIGINT NULL,
    `seat` VARCHAR(10) NULL,
    `face_value` DECIMAL(10, 2) NOT NULL,
    `service_fee` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `total_amount` DECIMAL(10, 2) NOT NULL,
    `used` BOOLEAN NULL DEFAULT false,
    `usage_date` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `ticket_number`(`ticket_number`),
    INDEX `idx_sale`(`sale_id`),
    INDEX `idx_showtime`(`showtime_id`),
    INDEX `idx_ticket_number`(`ticket_number`),
    INDEX `seat_id`(`seat_id`),
    INDEX `ticket_type`(`ticket_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_permissions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `company_id` BIGINT NULL,
    `routine_id` BIGINT NOT NULL,
    `operation` ENUM('CREATE', 'READ', 'UPDATE', 'DELETE', 'EXECUTE') NOT NULL,
    `granted_by` BIGINT NULL,
    `grant_date` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `expiration_date` TIMESTAMP(0) NULL,
    `reason` TEXT NULL,
    `active` BOOLEAN NULL DEFAULT true,

    INDEX `granted_by`(`granted_by`),
    INDEX `idx_active`(`active`),
    INDEX `idx_expiration`(`expiration_date`),
    INDEX `idx_routine`(`routine_id`),
    INDEX `idx_user`(`user_id`),
    INDEX `idx_user_routine_active`(`user_id`, `routine_id`, `active`),
    INDEX `idx_company`(`company_id`),
    UNIQUE INDEX `uk_user_routine_operation`(`user_id`, `routine_id`, `operation`),
    UNIQUE INDEX `uk_user_company_routine_operation`(`company_id`, `user_id`, `routine_id`, `operation`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_profiles` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `profile_id` BIGINT NOT NULL,
    `assigned_by` BIGINT NULL,
    `assignment_date` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `active` BOOLEAN NULL DEFAULT true,

    INDEX `assigned_by`(`assigned_by`),
    INDEX `profile_id`(`profile_id`),
    UNIQUE INDEX `uk_user_profile`(`user_id`, `profile_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_access_levelsTopositions` (
    `A` BIGINT NOT NULL,
    `B` BIGINT NOT NULL,

    UNIQUE INDEX `_access_levelsTopositions_AB_unique`(`A`, `B`),
    INDEX `_access_levelsTopositions_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `access_levels` ADD CONSTRAINT `access_levels_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `access_profiles` ADD CONSTRAINT `access_profiles_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `account_natures` ADD CONSTRAINT `account_natures_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `account_types` ADD CONSTRAINT `account_types_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accounting_movement_types` ADD CONSTRAINT `accounting_movement_types_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `age_ratings` ADD CONSTRAINT `age_ratings_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ancillary_obligations` ADD CONSTRAINT `ancillary_obligations_ibfk_1` FOREIGN KEY (`complex_id`) REFERENCES `cinema_complexes`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ancillary_obligations` ADD CONSTRAINT `fk_obligation_periodicity` FOREIGN KEY (`periodicity`) REFERENCES `periodicities`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `audio_types` ADD CONSTRAINT `audio_types_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `campaign_categories` ADD CONSTRAINT `fk_campaign_category_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `promotional_campaigns`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `campaign_categories` ADD CONSTRAINT `fk_campaign_category_category` FOREIGN KEY (`category_id`) REFERENCES `movie_categories`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `campaign_complexes` ADD CONSTRAINT `fk_campaign_complex_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `promotional_campaigns`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `campaign_complexes` ADD CONSTRAINT `fk_campaign_complex_complex` FOREIGN KEY (`complex_id`) REFERENCES `cinema_complexes`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `campaign_movies` ADD CONSTRAINT `fk_campaign_movie_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `promotional_campaigns`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `campaign_movies` ADD CONSTRAINT `fk_campaign_movie_movie` FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `campaign_rooms` ADD CONSTRAINT `fk_campaign_room_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `promotional_campaigns`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `campaign_rooms` ADD CONSTRAINT `fk_campaign_room_room` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `campaign_session_types` ADD CONSTRAINT `fk_campaign_session_type_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `promotional_campaigns`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `campaign_session_types` ADD CONSTRAINT `fk_campaign_session_type_type` FOREIGN KEY (`projection_type_id`) REFERENCES `projection_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `campaign_weekdays` ADD CONSTRAINT `fk_campaign_weekday_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `promotional_campaigns`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `cast_types` ADD CONSTRAINT `cast_types_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chart_of_accounts` ADD CONSTRAINT `chart_of_accounts_ibfk_1` FOREIGN KEY (`parent_account_id`) REFERENCES `chart_of_accounts`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `chart_of_accounts` ADD CONSTRAINT `fk_account_nature` FOREIGN KEY (`account_nature`) REFERENCES `account_natures`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `chart_of_accounts` ADD CONSTRAINT `fk_account_type` FOREIGN KEY (`account_type`) REFERENCES `account_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `chart_of_accounts` ADD CONSTRAINT `chart_of_accounts_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cinema_complexes` ADD CONSTRAINT `cinema_complexes_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `combo_products` ADD CONSTRAINT `combo_products_ibfk_1` FOREIGN KEY (`combo_id`) REFERENCES `combos`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `combo_products` ADD CONSTRAINT `combo_products_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `combos` ADD CONSTRAINT `combos_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `identities` ADD CONSTRAINT `identities_linked_identity_id_fkey` FOREIGN KEY (`linked_identity_id`) REFERENCES `identities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `companies` ADD CONSTRAINT `fk_company_pis_cofins_regime` FOREIGN KEY (`pis_cofins_regime`) REFERENCES `pis_cofins_regimes`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `companies` ADD CONSTRAINT `fk_company_tax_regime` FOREIGN KEY (`tax_regime`) REFERENCES `tax_regimes`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `concession_sale_items` ADD CONSTRAINT `concession_sale_items_ibfk_1` FOREIGN KEY (`concession_sale_id`) REFERENCES `concession_sales`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `concession_sale_items` ADD CONSTRAINT `concession_sale_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `concession_sale_items` ADD CONSTRAINT `concession_sale_items_ibfk_3` FOREIGN KEY (`combo_id`) REFERENCES `combos`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `concession_sales` ADD CONSTRAINT `concession_sales_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `concession_sales` ADD CONSTRAINT `concession_sales_ibfk_2` FOREIGN KEY (`status`) REFERENCES `concession_status`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `concession_status` ADD CONSTRAINT `concession_status_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contingency_reserves` ADD CONSTRAINT `contingency_reserves_ibfk_1` FOREIGN KEY (`complexo_id`) REFERENCES `cinema_complexes`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `contingency_reserves` ADD CONSTRAINT `fk_contingency_status` FOREIGN KEY (`status`) REFERENCES `contingency_status`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `contingency_reserves` ADD CONSTRAINT `fk_contingency_type` FOREIGN KEY (`contingency_type`) REFERENCES `contingency_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `contingency_status` ADD CONSTRAINT `contingency_status_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contingency_types` ADD CONSTRAINT `contingency_types_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contract_types` ADD CONSTRAINT `contract_types_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `courtesy_parameters` ADD CONSTRAINT `courtesy_parameters_ibfk_1` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `credit_types` ADD CONSTRAINT `credit_types_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customer_favorite_combos` ADD CONSTRAINT `fk_customer_combo_combo` FOREIGN KEY (`combo_id`) REFERENCES `combos`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `customer_favorite_combos` ADD CONSTRAINT `fk_cfc_company_customer` FOREIGN KEY (`company_customer_id`) REFERENCES `company_customers`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `customer_favorite_combos` ADD CONSTRAINT `customer_favorite_combos_customersId_fkey` FOREIGN KEY (`customersId`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customer_favorite_genres` ADD CONSTRAINT `fk_cfgen_company_customer` FOREIGN KEY (`company_customer_id`) REFERENCES `company_customers`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `customer_favorite_genres` ADD CONSTRAINT `customer_favorite_genres_customersId_fkey` FOREIGN KEY (`customersId`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customer_favorite_products` ADD CONSTRAINT `fk_customer_product_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `customer_favorite_products` ADD CONSTRAINT `fk_cfp_company_customer` FOREIGN KEY (`company_customer_id`) REFERENCES `company_customers`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `customer_favorite_products` ADD CONSTRAINT `customer_favorite_products_customersId_fkey` FOREIGN KEY (`customersId`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customer_interactions` ADD CONSTRAINT `fk_ci_company_customer` FOREIGN KEY (`company_customer_id`) REFERENCES `company_customers`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `customer_interactions` ADD CONSTRAINT `customer_interactions_customersId_fkey` FOREIGN KEY (`customersId`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customer_points` ADD CONSTRAINT `fk_customer_points_cc` FOREIGN KEY (`company_customer_id`) REFERENCES `company_customers`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `customer_points` ADD CONSTRAINT `customer_points_customersId_fkey` FOREIGN KEY (`customersId`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customer_preferences` ADD CONSTRAINT `fk_cpref_company_customer` FOREIGN KEY (`company_customer_id`) REFERENCES `company_customers`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `customer_preferences` ADD CONSTRAINT `customer_preferences_customersId_fkey` FOREIGN KEY (`customersId`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customer_preferred_rows` ADD CONSTRAINT `fk_cpr_company_customer` FOREIGN KEY (`company_customer_id`) REFERENCES `company_customers`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `customer_preferred_rows` ADD CONSTRAINT `customer_preferred_rows_customersId_fkey` FOREIGN KEY (`customersId`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customer_preferred_times` ADD CONSTRAINT `fk_cpt_company_customer` FOREIGN KEY (`company_customer_id`) REFERENCES `company_customers`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `customer_preferred_times` ADD CONSTRAINT `customer_preferred_times_customersId_fkey` FOREIGN KEY (`customersId`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customer_preferred_weekdays` ADD CONSTRAINT `fk_cpw_company_customer` FOREIGN KEY (`company_customer_id`) REFERENCES `company_customers`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `customer_preferred_weekdays` ADD CONSTRAINT `customer_preferred_weekdays_customersId_fkey` FOREIGN KEY (`customersId`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `fk_customer_registration_responsible` FOREIGN KEY (`registration_responsible`) REFERENCES `employees`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `customers_identity_id_fkey` FOREIGN KEY (`identity_id`) REFERENCES `identities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_customers` ADD CONSTRAINT `fk_cc_company` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_customers` ADD CONSTRAINT `fk_cc_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_users` ADD CONSTRAINT `company_users_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_users` ADD CONSTRAINT `company_users_identity_id_fkey` FOREIGN KEY (`identity_id`) REFERENCES `identities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_users` ADD CONSTRAINT `company_users_assigned_by_fkey` FOREIGN KEY (`assigned_by`) REFERENCES `employees`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `delivery_history` ADD CONSTRAINT `delivery_history_ibfk_1` FOREIGN KEY (`obligation_id`) REFERENCES `ancillary_obligations`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `delivery_history` ADD CONSTRAINT `fk_delivery_status` FOREIGN KEY (`status`) REFERENCES `obligation_status`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_sessions` ADD CONSTRAINT `user_sessions_identity_id_fkey` FOREIGN KEY (`identity_id`) REFERENCES `identities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_sessions` ADD CONSTRAINT `user_sessions_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `opa_decision_cache` ADD CONSTRAINT `opa_decision_cache_identity_id_fkey` FOREIGN KEY (`identity_id`) REFERENCES `identities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `opa_decision_cache` ADD CONSTRAINT `opa_decision_cache_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_log` ADD CONSTRAINT `audit_log_identity_id_fkey` FOREIGN KEY (`identity_id`) REFERENCES `identities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_log` ADD CONSTRAINT `audit_log_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_log` ADD CONSTRAINT `audit_log_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `departments` ADD CONSTRAINT `departments_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `departments` ADD CONSTRAINT `departments_complex_id_fkey` FOREIGN KEY (`complex_id`) REFERENCES `cinema_complexes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `departments` ADD CONSTRAINT `departments_manager_id_fkey` FOREIGN KEY (`manager_id`) REFERENCES `employees`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `distributor_settlement_status` ADD CONSTRAINT `distributor_settlement_status_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `distributor_settlements` ADD CONSTRAINT `distributor_settlements_ibfk_1` FOREIGN KEY (`contract_id`) REFERENCES `exhibition_contracts`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `distributor_settlements` ADD CONSTRAINT `distributor_settlements_ibfk_2` FOREIGN KEY (`distributor_id`) REFERENCES `suppliers`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `distributor_settlements` ADD CONSTRAINT `distributor_settlements_ibfk_3` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `distributor_settlements` ADD CONSTRAINT `distributor_settlements_ibfk_4` FOREIGN KEY (`calculation_base`) REFERENCES `settlement_bases`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `distributor_settlements` ADD CONSTRAINT `distributor_settlements_ibfk_5` FOREIGN KEY (`status`) REFERENCES `distributor_settlement_status`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `employee_time_records` ADD CONSTRAINT `employee_time_records_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_identity_id_fkey` FOREIGN KEY (`identity_id`) REFERENCES `identities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_complex_id_fkey` FOREIGN KEY (`complex_id`) REFERENCES `cinema_complexes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_position_id_fkey` FOREIGN KEY (`position_id`) REFERENCES `positions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_ibfk_3` FOREIGN KEY (`contract_type`) REFERENCES `employment_contract_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `employment_contract_types` ADD CONSTRAINT `employment_contract_types_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exhibition_contracts` ADD CONSTRAINT `fk_contract_complex` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `exhibition_contracts` ADD CONSTRAINT `fk_contract_movie` FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `exhibition_contracts` ADD CONSTRAINT `fk_contract_revenue_base` FOREIGN KEY (`revenue_base`) REFERENCES `settlement_bases`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `exhibition_contracts` ADD CONSTRAINT `fk_contract_supplier` FOREIGN KEY (`distributor_id`) REFERENCES `suppliers`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `exhibition_contracts` ADD CONSTRAINT `fk_contract_type` FOREIGN KEY (`contract_type`) REFERENCES `contract_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `federal_tax_rates` ADD CONSTRAINT `fk_tax_rate_pis_cofins_regime` FOREIGN KEY (`pis_cofins_regime`) REFERENCES `pis_cofins_regimes`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `federal_tax_rates` ADD CONSTRAINT `fk_tax_rate_revenue_type` FOREIGN KEY (`revenue_type`) REFERENCES `revenue_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `federal_tax_rates` ADD CONSTRAINT `fk_tax_rate_tax_regime` FOREIGN KEY (`tax_regime`) REFERENCES `tax_regimes`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `federal_tax_rates` ADD CONSTRAINT `federal_tax_rates_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gdpr_data_subject_requests` ADD CONSTRAINT `gdpr_data_subject_requests_ibfk_1` FOREIGN KEY (`handled_by`) REFERENCES `system_users`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `gdpr_security_incidents` ADD CONSTRAINT `gdpr_security_incidents_ibfk_1` FOREIGN KEY (`detected_by`) REFERENCES `system_users`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `gdpr_security_incidents` ADD CONSTRAINT `gdpr_security_incidents_ibfk_2` FOREIGN KEY (`investigation_responsible`) REFERENCES `system_users`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `iss_withholdings` ADD CONSTRAINT `iss_withholdings_ibfk_1` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `journal_entries` ADD CONSTRAINT `fk_journal_entry_status` FOREIGN KEY (`status`) REFERENCES `journal_entry_status`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `journal_entries` ADD CONSTRAINT `fk_journal_entry_type` FOREIGN KEY (`entry_type`) REFERENCES `journal_entry_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `journal_entries` ADD CONSTRAINT `journal_entries_ibfk_1` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `journal_entry_items` ADD CONSTRAINT `fk_journal_item_movement_type` FOREIGN KEY (`movement_type`) REFERENCES `accounting_movement_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `journal_entry_items` ADD CONSTRAINT `journal_entry_items_ibfk_1` FOREIGN KEY (`journal_entry_id`) REFERENCES `journal_entries`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `journal_entry_items` ADD CONSTRAINT `journal_entry_items_ibfk_2` FOREIGN KEY (`account_id`) REFERENCES `chart_of_accounts`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `journal_entry_status` ADD CONSTRAINT `journal_entry_status_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journal_entry_types` ADD CONSTRAINT `journal_entry_types_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `media_types` ADD CONSTRAINT `media_types_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `monthly_income_statement` ADD CONSTRAINT `monthly_income_statement_ibfk_1` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `monthly_tax_settlement` ADD CONSTRAINT `fk_settlement_status` FOREIGN KEY (`status`) REFERENCES `settlement_status`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `monthly_tax_settlement` ADD CONSTRAINT `monthly_tax_settlement_ibfk_1` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `movie_cast` ADD CONSTRAINT `movie_cast_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `movie_cast` ADD CONSTRAINT `movie_cast_ibfk_2` FOREIGN KEY (`cast_type`) REFERENCES `cast_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `movie_categories` ADD CONSTRAINT `movie_categories_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movie_media` ADD CONSTRAINT `movie_media_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `movie_media` ADD CONSTRAINT `movie_media_ibfk_2` FOREIGN KEY (`media_type`) REFERENCES `media_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `movies` ADD CONSTRAINT `fk_movie_age_rating` FOREIGN KEY (`age_rating`) REFERENCES `age_ratings`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `movies` ADD CONSTRAINT `fk_movie_category` FOREIGN KEY (`category_id`) REFERENCES `movie_categories`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `movies` ADD CONSTRAINT `fk_movie_supplier` FOREIGN KEY (`distributor_id`) REFERENCES `suppliers`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `company_movies` ADD CONSTRAINT `fk_company_movies_company` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `company_movies` ADD CONSTRAINT `fk_company_movies_movie` FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `municipal_tax_parameters` ADD CONSTRAINT `municipal_tax_parameters_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `obligation_status` ADD CONSTRAINT `obligation_status_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_status` ADD CONSTRAINT `order_status_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `password_policies` ADD CONSTRAINT `password_policies_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_methods` ADD CONSTRAINT `payment_methods_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `periodicities` ADD CONSTRAINT `periodicities_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permissions` ADD CONSTRAINT `permissions_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `system_modules`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `permissions` ADD CONSTRAINT `permissions_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pis_cofins_credits` ADD CONSTRAINT `fk_credit_type` FOREIGN KEY (`credit_type`) REFERENCES `credit_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pis_cofins_credits` ADD CONSTRAINT `pis_cofins_credits_ibfk_1` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pis_cofins_regimes` ADD CONSTRAINT `pis_cofins_regimes_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `positions` ADD CONSTRAINT `positions_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `positions` ADD CONSTRAINT `positions_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_categories` ADD CONSTRAINT `product_categories_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_stock` ADD CONSTRAINT `product_stock_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `product_stock` ADD CONSTRAINT `product_stock_ibfk_2` FOREIGN KEY (`complex_id`) REFERENCES `cinema_complexes`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `product_categories`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile_permissions` ADD CONSTRAINT `profile_permissions_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `access_profiles`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `profile_permissions` ADD CONSTRAINT `profile_permissions_routine_id_fkey` FOREIGN KEY (`routine_id`) REFERENCES `system_routines`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `projection_types` ADD CONSTRAINT `projection_types_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promotion_types` ADD CONSTRAINT `promotion_types_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promotional_campaigns` ADD CONSTRAINT `promotional_campaigns_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promotional_campaigns` ADD CONSTRAINT `promotional_campaigns_ibfk_1` FOREIGN KEY (`promotion_type_id`) REFERENCES `promotion_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `promotional_coupons` ADD CONSTRAINT `promotional_coupons_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `promotional_campaigns`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `promotional_coupons` ADD CONSTRAINT `promotional_coupons_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `promotions_used` ADD CONSTRAINT `promotions_used_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `promotions_used` ADD CONSTRAINT `promotions_used_ibfk_2` FOREIGN KEY (`campaign_id`) REFERENCES `promotional_campaigns`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `promotions_used` ADD CONSTRAINT `promotions_used_ibfk_3` FOREIGN KEY (`coupon_id`) REFERENCES `promotional_coupons`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `promotions_used` ADD CONSTRAINT `promotions_used_ibfk_4` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `promotions_used` ADD CONSTRAINT `promotions_used_ibfk_5` FOREIGN KEY (`promotion_type_id`) REFERENCES `promotion_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `recine_acquisition_types` ADD CONSTRAINT `recine_acquisition_types_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recine_acquisitions` ADD CONSTRAINT `fk_recine_acquisition_item_type` FOREIGN KEY (`item_type`) REFERENCES `recine_item_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `recine_acquisitions` ADD CONSTRAINT `fk_recine_acquisition_type` FOREIGN KEY (`acquisition_type`) REFERENCES `recine_acquisition_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `recine_acquisitions` ADD CONSTRAINT `recine_acquisitions_ibfk_1` FOREIGN KEY (`recine_project_id`) REFERENCES `recine_projects`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `recine_deadline_types` ADD CONSTRAINT `recine_deadline_types_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recine_deadlines` ADD CONSTRAINT `fk_recine_deadline_type` FOREIGN KEY (`deadline_type`) REFERENCES `recine_deadline_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `recine_deadlines` ADD CONSTRAINT `recine_deadlines_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `recine_projects`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `recine_item_types` ADD CONSTRAINT `recine_item_types_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recine_project_status` ADD CONSTRAINT `recine_project_status_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recine_project_types` ADD CONSTRAINT `recine_project_types_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recine_projects` ADD CONSTRAINT `fk_recine_project_status` FOREIGN KEY (`status`) REFERENCES `recine_project_status`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `recine_projects` ADD CONSTRAINT `fk_recine_project_type` FOREIGN KEY (`project_type`) REFERENCES `recine_project_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `recine_projects` ADD CONSTRAINT `recine_projects_ibfk_1` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `revenue_types` ADD CONSTRAINT `revenue_types_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rooms` ADD CONSTRAINT `fk_room_audio_type` FOREIGN KEY (`audio_type`) REFERENCES `audio_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `rooms` ADD CONSTRAINT `fk_room_projection_type` FOREIGN KEY (`projection_type`) REFERENCES `projection_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `rooms` ADD CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `routine_operations` ADD CONSTRAINT `routine_operations_routine_id_fkey` FOREIGN KEY (`routine_id`) REFERENCES `system_routines`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `sale_status` ADD CONSTRAINT `sale_status_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sale_types` ADD CONSTRAINT `sale_types_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `fk_sale_payment_method` FOREIGN KEY (`payment_method`) REFERENCES `payment_methods`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `fk_sale_status` FOREIGN KEY (`status`) REFERENCES `sale_status`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `fk_sale_type` FOREIGN KEY (`sale_type`) REFERENCES `sale_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `seat_status` ADD CONSTRAINT `seat_status_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `seat_types` ADD CONSTRAINT `seat_types_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `seats` ADD CONSTRAINT `seats_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `seats` ADD CONSTRAINT `seats_ibfk_2` FOREIGN KEY (`seat_type`) REFERENCES `seat_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `sensitive_actions_log` ADD CONSTRAINT `sensitive_actions_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `system_users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `session_languages` ADD CONSTRAINT `session_languages_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `session_seat_status` ADD CONSTRAINT `session_seat_status_ibfk_1` FOREIGN KEY (`showtime_id`) REFERENCES `showtime_schedule`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `session_seat_status` ADD CONSTRAINT `session_seat_status_ibfk_2` FOREIGN KEY (`seat_id`) REFERENCES `seats`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `session_seat_status` ADD CONSTRAINT `session_seat_status_ibfk_3` FOREIGN KEY (`status`) REFERENCES `seat_status`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `session_seat_status` ADD CONSTRAINT `session_seat_status_ibfk_4` FOREIGN KEY (`sale_id`) REFERENCES `sales`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `session_status` ADD CONSTRAINT `session_status_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlement_bases` ADD CONSTRAINT `settlement_bases_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlement_status` ADD CONSTRAINT `settlement_status_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `showtime_schedule` ADD CONSTRAINT `showtime_schedule_ibfk_1` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `showtime_schedule` ADD CONSTRAINT `showtime_schedule_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `showtime_schedule` ADD CONSTRAINT `showtime_schedule_ibfk_3` FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `showtime_schedule` ADD CONSTRAINT `showtime_schedule_ibfk_4` FOREIGN KEY (`projection_type`) REFERENCES `projection_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `showtime_schedule` ADD CONSTRAINT `showtime_schedule_ibfk_5` FOREIGN KEY (`audio_type`) REFERENCES `audio_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `showtime_schedule` ADD CONSTRAINT `showtime_schedule_ibfk_6` FOREIGN KEY (`session_language`) REFERENCES `session_languages`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `showtime_schedule` ADD CONSTRAINT `showtime_schedule_ibfk_7` FOREIGN KEY (`status`) REFERENCES `session_status`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `simple_national_brackets` ADD CONSTRAINT `simple_national_brackets_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `state_icms_parameters` ADD CONSTRAINT `state_icms_parameters_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_movement_types` ADD CONSTRAINT `stock_movement_types_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_movements` ADD CONSTRAINT `stock_movements_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `stock_movements` ADD CONSTRAINT `stock_movements_ibfk_2` FOREIGN KEY (`complex_id`) REFERENCES `cinema_complexes`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `stock_movements` ADD CONSTRAINT `stock_movements_ibfk_3` FOREIGN KEY (`movement_type`) REFERENCES `stock_movement_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `stock_movements` ADD CONSTRAINT `stock_movements_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `system_users`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `supplier_types` ADD CONSTRAINT `supplier_types_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `suppliers` ADD CONSTRAINT `suppliers_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `system_modules` ADD CONSTRAINT `system_modules_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `system_routines` ADD CONSTRAINT `system_routines_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `system_users` ADD CONSTRAINT `system_users_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tax_compensations` ADD CONSTRAINT `fk_compensation_tax_type` FOREIGN KEY (`tax_type`) REFERENCES `tax_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tax_compensations` ADD CONSTRAINT `tax_compensations_ibfk_1` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tax_entries` ADD CONSTRAINT `fk_tax_entry_pis_cofins_regime` FOREIGN KEY (`pis_cofins_regime`) REFERENCES `pis_cofins_regimes`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tax_entries` ADD CONSTRAINT `fk_tax_entry_source_type` FOREIGN KEY (`source_type`) REFERENCES `revenue_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tax_entries` ADD CONSTRAINT `tax_entries_ibfk_1` FOREIGN KEY (`cinema_complex_id`) REFERENCES `cinema_complexes`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tax_regimes` ADD CONSTRAINT `tax_regimes_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tax_types` ADD CONSTRAINT `tax_types_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket_types` ADD CONSTRAINT `ticket_types_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`showtime_id`) REFERENCES `showtime_schedule`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_ibfk_3` FOREIGN KEY (`seat_id`) REFERENCES `seats`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_ibfk_4` FOREIGN KEY (`ticket_type`) REFERENCES `ticket_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_permissions` ADD CONSTRAINT `user_permissions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `system_users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_permissions` ADD CONSTRAINT `user_permissions_routine_id_fkey` FOREIGN KEY (`routine_id`) REFERENCES `system_routines`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_permissions` ADD CONSTRAINT `user_permissions_granted_by_fkey` FOREIGN KEY (`granted_by`) REFERENCES `system_users`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `system_users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_ibfk_2` FOREIGN KEY (`profile_id`) REFERENCES `access_profiles`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_ibfk_3` FOREIGN KEY (`assigned_by`) REFERENCES `system_users`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `_access_levelsTopositions` ADD CONSTRAINT `_access_levelsTopositions_A_fkey` FOREIGN KEY (`A`) REFERENCES `access_levels`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_access_levelsTopositions` ADD CONSTRAINT `_access_levelsTopositions_B_fkey` FOREIGN KEY (`B`) REFERENCES `positions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
