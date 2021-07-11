const createRoom = () => {
	$("#code").val(ROOM_ID);
	$("#createRoom").prop("disabled", true);
	$("#copyCode").prop("disabled", false);
};
const isBlank = (word)=>{
	if (!word) {
        return true;
    }
    return !/[^\s]+/.test(word);
}
const createAlert = (message)=>{
	$(".alert").text(message);
	$(".alert").show();
	$(".alert").fadeOut(2500);
}
const joinRoom = async () => {
	try{
		const data = {
			name : $("#name").val(),
			roomId : $("#roomId").val()
		}
		if(isBlank(data.name)||isBlank(data.roomId)) throw new Error("Name/Room ID is blank !");
		const response = await fetch("/joinRoom", {
			method: 'POST',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
			  'Content-Type': 'application/json'
			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer',
			body: JSON.stringify(data)
		});
		const val = await response.json();
		if(val.status==="success"){
			location.href = val.url
		}else{
			throw new Error("Server Error... Try Again in Sometime");
		}
	}catch(err){
		createAlert(err.message);
	}
};
const copyCode = () =>{
	const copyText = document.getElementById("code");
  	copyText.select();
  	copyText.setSelectionRange(0, 99999);
  	document.execCommand("copy");
	createAlert("Copied !")
}