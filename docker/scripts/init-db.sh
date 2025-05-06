#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create extension for UUID generation if needed
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- Create schemas if needed
    -- CREATE SCHEMA IF NOT EXISTS auth;
    
    -- This script will initialize the database with some base tables if needed
    -- We'll let TypeORM handle most of the schema creation and migration
    
    -- Create some basic roles for development
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_user') THEN
            CREATE ROLE app_user WITH LOGIN PASSWORD 'app_user_password';
            GRANT ALL PRIVILEGES ON DATABASE food_delivery TO app_user;
        END IF;
    END
    $$;
    
    -- Grant permissions
    GRANT ALL PRIVILEGES ON SCHEMA public TO app_user;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_user;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO app_user;
    GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO app_user;
    
    -- Additional initialization can be added here
EOSQL
