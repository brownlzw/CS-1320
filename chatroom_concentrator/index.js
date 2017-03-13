var intervalId

window.addEventListener('load', function(){
	intervalId = window.setInterval(refresh,5000)
}, false);

$(document).ready(function(){
	$('#start').click(redirect)
	$('html').css('height','100%')
	$('body').css('height','100%')
	$('#list').css({'height':'60%','width':'60%'})
	$('tr').css('height','50px')
	$('#start').css('font-size','18px')
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
				var room = $('<td></td>').append(a).attr('style','vertical-align:middle')
				var interval = getInterval(data[i].time,parseInt(now))
				var time = $('<td></td>').text(interval).attr('style','vertical-align:middle')
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
	if(diff<24) return Math.floor(diff).toString()+" h before"
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
