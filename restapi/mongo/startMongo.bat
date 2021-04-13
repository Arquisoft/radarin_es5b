if not exist data (
	mkdir data
)
mongod --bind_ip 127.0.0.1 --port 5050 --dbpath .\data