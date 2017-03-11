var intervalId
var nickname
var roomName = meta('roomName')
var lasttime = parseInt(meta('create-time'))

console.log(lasttime);
$(document).ready(function(){
  nickname = window.prompt("Create a nickname for yourself")
  window.addEventListener('load', function(){
    intervalId = window.setInterval(refresh,8000)
  }, false);
  var messageForm = $('#messageForm').submit(sendMessage);

});

function meta(name) {
    var tag = document.querySelector('meta[name=' + name + ']');
    if (tag != null)
        return tag.content;
    return '';
}

function refresh(){
	var ul = $('#message');
	$.ajax({
		type: "GET",
		url: 'http://localhost:8080/'+roomName+'/messages',
    headers:{'time':lasttime},
		dataType: "json",
		// error: function(err,status){
		// 	console.log(err);
		// },
		success: function(data) {
			for(var i=0,len=data.length;i<len;i++){
        var username = data[i].nickname
        var message = data[i].body
        var date = new Date(data[i].time)
        var time = date.getHours()<10?'0':''+date.getHours()+':'+date.getMinutes()<10?'0':''+date.getMinutes()+':'+date.getSeconds()<10?'0':''+date.getSeconds()
				var li = $('<li></li>').addClass('left clearfix')
        var span1 = $('<span></span>').html('<img src="./photo.jpg" alt="User Avatar" class="img-circle">')
        var p0 = $('<p></p>').html('<strong>&nbsp;&nbsp;'+username+'</strong>&nbsp;&nbsp;<br>&nbsp;&nbsp;'+time+'&nbsp;&nbsp;')
        if (username===nickname){
          span1.addClass('chat-img1 pull-right')
          p0.addClass('text-right')
        } else{
          span1.addClass('chat-img1 pull-left')
          p0.addClass('text-left')
        }
        var p = $('<p></p>').text(message)
        var div = $('<div></div>').append(p).addClass('chat-body1 clearfix')
				li.append(span1,p0,div)
				ul.append(li)
        if(i===(len-1)){
          lasttime = data[i].time
          console.log(time)
        }
			}
      $('#area').scrollTop(ul[0].scrollHeight)
      console.log('Get all messages success');
    }
	})
}

function sendMessage(event) {

    // prevent the page from redirecting
    event.preventDefault()
    // get the parameters
    var mymessage = $('#messageField').val() // get message
    // send it to the server
    $('#messageForm')[0].reset()
    $.post('/' + roomName + '/messages', {nickname:nickname,message:mymessage}, function(res){
        //you might want to add callback function that is executed post request success
        console.log('Send message successfully');
    });
}
