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
const createRoom = async () => {
	try{
		const response = await fetch("/createRoom", {
			method: 'POST',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
			  'Content-Type': 'application/json'
			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer',
			body: JSON.stringify({})
		});
		const responseObject = await response.json();
		if(responseObject.status==="success"){
			$("#code").val(responseObject.roomId);
			$("#copyCode").prop("disabled", false);
		}else{
			throw new Error("Server Error... Try Again in Sometime");
		}
	}catch(err){
		createAlert(err.message);
	}
};
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
		const responseObject = await response.json();
		if(responseObject.status==="success"){
			location.href = responseObject.body
		}else{
			throw new Error(responseObject.body);
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