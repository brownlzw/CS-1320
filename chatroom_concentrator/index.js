var intervalId

window.addEventListener('load', function(){
	intervalId = window.setInterval(refresh,5000)
}, false);

$(document).ready(function(){
	$('#start').click(redirect)
})

function refresh(){
	$.ajax({
		type: "GET",
		url: "http://localhost:8080/showrooms",
		dataType: "json",
		error: function(err,status){
			console.log(status);
			console.log(err);
		},
		success: function(data) {
			var now = new Date().getTime()
			for(var i=0,len=data.length;i<len;i++){
				var row = $('<tr></tr>')
				var a = $('<a></a>').text(data[i].room).attr('href',data[i].room)
				var room = $('<td></td>').append(a)
				var interval = getInterval(data[i].time,parseInt(now))
				var time = $('<td></td>').text(interval)
				$('#row'+i).empty()
				$('#row'+i).append(room,time)
			}
			console.log('Get rooms success!');
		}
	})
}

function getInterval(oldtime,newtime){
	var diff = (newtime-oldtime)/1000
	if(diff<60) return Math.floor(diff).toString()+" s before"
	diff/=60
	if(diff<60) return Math.floor(diff).toString()+" min before"
	diff/=60
	if(diff<60) return Math.floor(diff).toString()+" h before"
	return Math.floor(diff/24).toString()+"days before"
}

function redirect(event){
	$.ajax({
		type: "GET",
		url: "http://localhost:8080/room",
		dataType: "json",
		error: function(err,status){
			console.log('Get random roomName error!');
		},
		success: function(data) {
			location.href = '/'+data.roomName
		}
	})
}
