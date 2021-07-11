const socket = io("/");
const videoGrid = $("#video-grid");
const myPeer = new Peer(undefined,{
	config: {
		iceServers: PEER_SERVER,
	},
});
const scrollToBottom = () => {
	let d = $(".room-right-chat");
	d.scrollTop(d.prop("scrollHeight"));
};
if(chats!==undefined){
	chats.forEach((chat) => {
		appendToChat(chat);
	});
	scrollToBottom();
}
let myVideoStream;
const myVideo = document.createElement("video");
myVideo.muted = true;
const peers = {};
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
})
.then((stream) => {  
	myVideoStream = stream;
    addVideoStream(myVideo, stream);
	//CALL EVENT
    myPeer.on("call", (call) => {
    	call.answer(stream);
    	const video = document.createElement("video");
    	call.on("stream", (userVideoStream) => {
    		addVideoStream(video, userVideoStream);
      	});
		call.on("close", () => {
			video.remove();
		});
		peers[call.peer] = call;
    });
	//NEW USER CONNECT EVENT
    socket.on("user-connected", (userId) => {
    	connectToNewUser(userId, stream);
    });
	//MESSAGE SEND EVENT
    let text = $("#send-message");
    $("html").keydown((e)=>{
    	if (e.which == 13 && text.val().length !== 0) {
    		const message = {
    			sender: MY_NAME,
    			body: text.val(),
    		};
    		socket.emit("message", message);
        	text.val("");
      	}
    });
    $("#send").click(()=>{ 
    	const message = {
        	sender: MY_NAME,
        	body: text.val(),
      	};
      	socket.emit("message", message);
      	text.val("");
    });
    socket.on("create-message", (message) => {
		appendToChat(message);
      	scrollToBottom();
    });
});
//JOIN EVENT
myPeer.on("open", (id) => {
	socket.emit("join-room", ROOM_ID, id, MY_NAME);
});
//DISCONNECT EVENT
socket.on("user-disconnected", (userId) => {
	if (peers[userId]) peers[userId].close();
});

function connectToNewUser(userId, stream) {
	const call = myPeer.call(userId, stream);
	const video = document.createElement("video");
	call.on("stream", (userVideoStream) => {
		addVideoStream(video, userVideoStream);
  	});
  	call.on("close", () => {
    	video.remove();
  	});
	peers[userId] = call;
}

function addVideoStream(video, stream) {
	video.srcObject = stream;
	video.addEventListener("loadedmetadata", () => {
		video.play();
	});
	videoGrid.append(video);
}
function appendToChat({sender, body, date, control}){
	let node = ``
	const now = new Date(date);
	const hrs = now.getHours();
	const mins = now.getMinutes();
	const time = `${hrs<10?'0':''}${hrs}:${mins<10?'0':''}${mins}`
	if(control === 0){
		node = `<li class="row">
					<div class="col">
						<div class="row">
							<b class="author text-break" style="width: 10rem;">${sender}</b>
						</div>
						<div class="row">
							<p class="text-break" style="width: 10rem;">${body}</p>
						</div>
					</div>
					<div class="col">
						<p class="text-end">${time}</p>
					</div>
				</li>`
	}else if(control === 1){
		node = `<li class="row">
					<div class="col">
						<p class="text-break join" style="width: 10rem;">${body}</p>
					</div>
					<div class="col">
						<p class="text-end">${time}</p>
					</div>
				</li>`
	}else if(control === 2){
		node = `<li class="row">
					<div class="col">
						<p class="text-break leave" style="width: 10rem;">${body}</p>
					</div>
					<div class="col">
						<p class="text-end">${time}</p>
					</div>
				</li>`
	}else{
		console.log("Not Handled")
	}
	$("ul").append(node);
}
const muteUnmute = () => {
	const enabled = myVideoStream.getAudioTracks()[0].enabled;
	if (enabled) {
    	myVideoStream.getAudioTracks()[0].enabled = false;
    	setUnmuteButton();
  	}else{
    	setMuteButton();
    	myVideoStream.getAudioTracks()[0].enabled = true;
  	}
};

const playStop = () => {
  	let enabled = myVideoStream.getVideoTracks()[0].enabled;
  	if(enabled){
    	myVideoStream.getVideoTracks()[0].enabled = false;
    	setPlayVideo();
  	}else{
    	setStopVideo();
    	myVideoStream.getVideoTracks()[0].enabled = true;
  	}
};

const setMuteButton = () => {
	$("#mute-btn").html(`<i class="fas fa-microphone"></i><span>Mute</span>`);
};
const setUnmuteButton = () => {
  	$("#mute-btn").html(`<i class="unmute fas fa-microphone-slash"></i><span class="unmute">Unmute</span>`);
};

const setStopVideo = () => {
	$("#video-btn").html(`<i class="fas fa-video"></i><span>Stop Video</span>`);
};

const setPlayVideo = () => {
	$("#video-btn").html(`<i class="stop fas fa-video-slash"></i><span class="stop">Play Video</span>`);
};
const leaveMeeting = () => {
	location.href='/'
}