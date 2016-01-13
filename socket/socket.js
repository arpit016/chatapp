module.exports = function(io, rooms) {
	var chatrooms = io.of('/roomlist').on('connection', function (socket){
		console.log('Connection established on the server!');
		socket.emit('roomupdate', JSON.stringify(rooms));

		socket.on('newRoom', function (data){
			console.log("Inside socket.js");
			rooms.push(data);
			socket.broadcast.emit('roomupdate', JSON.stringify(rooms));
			socket.emit('roomupdate', JSON.stringify(rooms));
		})

	})

	var messages = io.of('/messages').on('connection', function (socket){
		console.log('Connected to the ChatRoom');
		socket.on('joinroom', function(data){
			socket.username = data.user;
			socket.userPic = data.userPic;
			socket.join(data.room);
		})
		socket.on('newMessage', function(data){
			socket.broadcast.to(data.room_number).emit('messagefeed', JSON.stringify(data));
		})
	})
}