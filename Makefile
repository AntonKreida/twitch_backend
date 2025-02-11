include .env

build-db:
	docker-compose -f docker-compose.yml build postgres redis_db

up-db:
	docker-compose -f docker-compose.yml up postgres redis_db -d

down-db:
	docker-compose -f docker-compose.yml down postgres redis_db

stop-db:
	docker-compose -f docker-compose.yml stop postgres redis_db

start:
	docker-compose up -d --build

up-dev:
	docker-compose -f docker-compose.dev.yml -f docker-compose.yml up postgres redis_db mailer -d

stop-dev:
	docker-compose -f docker-compose.dev.yml -f docker-compose.yml stop postgres redis_db mailer
