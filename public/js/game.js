var game = {
	alerts : 0,
	naviPage : 2,
	authenticated : false,
	variables : {},
	socket : null,
	initialize : function() {
		logging.logConsole('Game initializing..');
		if('WebSocket' in window) {
			logging.logConsole('Connecting to WebSocket..');
			game.socket = io();

			game.socket.on('connect', function() {
				logging.logConsole('Successfully connected');
				
				$('#login').submit(e => {
					e.preventDefault();
					let username = $('.login-username').val();
					let password = $('.login-password').val();
					game.socket.emit('auth', {username: username, password: password});
					game.socket.on('auth', (data) => {
						if(data.message == 'ok')
						{
							game.authenticated = true;
							game.getRooms();
							game.loadNavigation();
							game.removeLoginForm();
							game.loadInformation(data);
						}
						else if(data.message == 'incorrect password')
						{
							alert('Incorrect password!');
							return;
						}
					})

				})
			});
		} else {
			game.sendNotif('Dein Browser scheint WebSockets leider nicht zu unterst&uuml;tzen.');
		}
	},
	getRooms : function() {
		game.socket.on('rooms', function(data) {
			console.log(data);
			if(data.length < 1)
				{
					$('#roomListing').append(
						'<span id="navLoading" style="display:block;cursor:default;margin-left:-43px;margin-top:-28px">No rooms found!</span>'
					);
					return;
				}
			data.forEach(room => {
				$('#roomListing').append('<li><a onclick="game.loadRoom('+ room[0].model +')">'+ room[0].caption +'</a></li>')
			});
			
			
		});
	},
	loadRoom : function(model) {
		var c = document.getElementById("room");
		c.width = window.innerWidth;
		c.height = window.innerHeight;
		var ctx = c.getContext("2d");

		var xAxis = {x : 1, y: 0.5};
		var yAxis = {x : -1, y: 0.5};
		var origin = {x : 0, y : 0};

		ctx.setTransform(xAxis.x / 2, xAxis.y / 2, yAxis.x / 2, yAxis.y / 2, origin.x, origin.y);

 		var image = new Image();
		image.src = "./img/tile.png";
		image.addEventListener("load",function(){
			ctx.drawImage(this,c.width-this.width,-this.height * 1.2);
		});
	},
	endGame : function() {
		$('#game').empty();
		game.sendNotif('Der Server wurde anscheinend neugestartet, bitte lade den Client neu.');
	},
	serverMessage : function(msg) {
		this.server.send(msg.getResult());
		//logging.logConsole('Sent message with id ' + msg.id);
	},
	loadNavigation : function() {
		$(".nav-tabs a").click(function(){
				$(this).tab('show');
		});

		$('.panel-navigation').draggable();

		$('#pubOff').click(function() {
			if($(this).hasClass('fa-minus')) {
				$(this).removeClass('fa-minus');
				$(this).addClass('fa-plus');

				$('#officialRooms').slideUp();
			} else if($(this).hasClass('fa-plus')) {
				$(this).removeClass('fa-plus');
				$(this).addClass('fa-minus');

				$('#officialRooms').slideDown();
			}
		});
	},
	sendNotif : function(txt) {
		//logging.logConsole('Send notif \'' + txt + '\'');
		var id = ++this.alerts;
		$('#game').append(
			'<div id="alert' + id + '" class="alert"><div class="top"><div id="title">Alert from Habbo Staff!</div><div id="close" onclick="$(this).parent().parent().remove();"></div></div><div class="content"><span>' + txt + '</span><br><br><button class="closebtn" onclick="$(this).parent().parent().remove();"></button></div><div class="bottom"></div>'
		);
		$('#alert' + id).draggable({
			containment: 'parent',
			handle: '.top'
		})
	},
	removeLoginForm: function() {
		$('#login').remove();
		$('.user-footer').html(
			'<input type="text" class="form-control input-illu" placeholder="Type here to talk!" />'
		)
	},
	loadInformation: function(data) {
		$('#useravatar').append('<img src="https://www.habbo.com/habbo-imaging/avatarimage?figure='+ data.userData.look+'&direction=4&gesture=sml&action=wav"/>')
		$('.motto').text(data.userData.motto)
	}
};

var cursorX;
var cursorY;
var z = 10000;
document.onmousemove = function(e){
    cursorX = e.pageX;
    cursorY = e.pageY;
}
