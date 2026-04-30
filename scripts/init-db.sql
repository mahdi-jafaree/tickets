SELECT 'CREATE DATABASE "ticket"'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ticket')\gexec
