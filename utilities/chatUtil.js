//Utility Date Function
function getUTCDate(){
	const now = new Date();
	return now.toUTCString();
}
//Utility Chat Cleanup
function chatCleanup(chatThread){
	while(chatThread.length>500){
		chatThread.shift();
	}
}

module.exports = {
    getUTCDate,
    chatCleanup
}