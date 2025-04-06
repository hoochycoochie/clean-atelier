start:
	docker-compose up 
stop:
	docker-compose down
migratesql:
	docker container exec api-container npm run typeorm:run-migrations && docker container restart api-container
test:
	docker container exec api-container npm run test