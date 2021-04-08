start mongod --auth --bind_ip 127.0.0.1 --port 5050 --dbpath mongo\data
timeout 5
node server.js