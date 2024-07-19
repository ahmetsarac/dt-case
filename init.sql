DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'dt_db') THEN
        CREATE DATABASE dt_db;
    END IF;
END
$$;
