var socket = io.connect();

var id
var roomName = meta('roomName')
var name = roomName.substr(0,8);
var nickname
var joined = false;
var typeTimeout
var typing = false;
var idle = 0
var isaway = false;

$(document).ready(function(){
    //roomname
    $('#header').text(name)
    // get the nickname
    nickname = prompt('Enter a nickname:');
    $('#username').text(nickname)
    $('#username').dblclick(changename)
    //send message
    var messageForm = $('#messageForm').submit(sendMessage);
    //idle detect
    var idleInterval = setInterval(function(){
      idle++
      if(!isaway&&idle>3){
        console.log('30s timeout');
        socket.emit('away',roomName)
        isaway = true;
      }
    }, 10000);
    $(window).mousemove(function () {
      if(isaway&&$('#status').hasClass('online')){
        isaway = false;
        socket.emit('focus',roomName)
      }
      idle = 0
    })
    $(window).keypress(function () {
      if(isaway&&$('#status').hasClass('online')){
        isaway = false;
        socket.emit('focus',roomName)
      }
      idle = 0
    })
    $('#status').click(function(){
        console.log('click red');
        if(isaway){
          socket.emit('focus',roomName)
          $('#status').removeClass('away').addClass('online')
          isaway = false;
        } else{
          socket.emit('away',roomName)
          $('#status').removeClass('online').addClass('away')
          isaway = true
        }


    })


    //switch tabs
      $(window).blur(function(){
        if(!isaway&&joined){
          socket.emit('away',roomName)
          isaway = true;
        }
      })
      $(window).focus(function(){
        if(isaway&&joined){
          socket.emit('focus',roomName)
          isaway = false;
        }
      })
    //typing
    $('#messageField').keyup(function(event){
      if(event.which==13){
        sendMessage(event)
      } else{
        if (!typing){
          typing = true;
          socket.emit('typing',roomName)
        } else{
          clearTimeout(typeTimeout)
        }
        typeTimeout = setTimeout(function(){
          typing = false;
          socket.emit('endtyping',roomName)
        }, 1000)
      }
    })

    socket.on('message', function(socketid,nickname, message, time){
        // display a newly-arrived message
        var content= []
        content[0]=new Object()
        content[0].id = socketid
        content[0].nickname = nickname
        content[0].body = message;
        content[0].time = time;
        show(content)
    });

    // handle room membership changes
    // you may want to consider having separate handlers for members joining, leaving, and changing their nickname
    socket.on('membershipChanged', function(members){
        // display the new member list
        showmember(members)
    });

    socket.on('broadcast',function(notice){
      var ul = $('#message')
      var li = $('<li></li>').text(' - - - '+notice+' - - - ').addClass('system text-center center-block')
      ul.append(li);
      $('#area').scrollTop(ul[0].scrollHeight)
    })

    //get back the id and nickname of the socket that is typing
    socket.on('typing',function(data){
      var ul = $('#message')
      var li = $('<li></li>').text(data.name+' is typing... ').addClass('system text-center center-block').attr('id',data.id).css('font-style','italic')
      $('#message').append(li)
      $('#area').scrollTop(ul[0].scrollHeight)
    })

    socket.on('endtyping',function(socketid){
      $('#'+socketid).remove()
    })

    socket.on('away',function(socketid){
      $('li[name='+socketid+']>.glyphicon').removeClass('online').addClass('away')
    })

    socket.on('focus',function(socketid){
      $('li[name='+socketid+']>.glyphicon').removeClass('away').addClass('online')
    })

    socket.on('leave',function(socketid){
      $(function() {
          $('li[name='+socketid+']').remove()
      })
    })

    // join the room
    socket.emit('join', meta('roomName'), nickname, function(content){
        // process the list of messages the server sent back
        id = content.id
        show(content.messages);
        $('li[name='+id+']').remove()
        $('#membercount').text('Active member: '+($('#members li').length+1))
        joined = true;
        console.log('entered');
    });

});

function meta(name) {
    var tag = document.querySelector('meta[name=' + name + ']');
    if (tag != null)
        return tag.content;
    return '';
}

function show(data){
  var ul = $('#message')
  for(var i=0,len=data.length;i<len;i++){
    var socketid = data[i].id
    var username = data[i].nickname
    var message = data[i].body
    var date = new Date(data[i].time)
    var time = date.toLocaleString().replace('\/(19|20)\d{2},','')
    var li = $('<li></li>').addClass('left clearfix')
    var span = $('<span></span>').html('<img src="./photo.jpg" alt="User Avatar" class="img-circle">')
    var p0 = $('<p></p>').html("<strong class='name'>&nbsp;&nbsp;"+username+"&nbsp;&nbsp;</strong><br><span class='system'>&nbsp;&nbsp;"+time+'&nbsp;&nbsp;</span>')
    var p = $("<p class='news'></p>").text(message)
    if (socketid===id){
      span.addClass('chat-img1 pull-right')
      p0.addClass('text-right')
      p.addClass('chat-self pull-right ')
    } else{
      span.addClass('chat-img1 pull-left')
      p0.addClass('text-left')
      p.addClass('pull-left chat-other')
    }
    var div = $('<div></div>').append(p).addClass('chat-body1 clearfix')
    li.append(span,p0,div)
    ul.append(li)
    if($('li[name='+socketid+']').length!==0){
      $('li[name='+socketid+']').remove()
      li = $('<li></li>').addClass('left clearfix').attr('name',socketid)
      span = $('<span></span>').html('<img src="./photo.jpg" alt="User Avatar" class="img-circle">').addClass('chat-img1 pull-left')
      var now = new Date().getHours().toString()+':'+new Date().getMinutes().toString()
      div = $('<div></div>').html('&nbsp;&nbsp;<strong>'+username+'</strong>&nbsp;&nbsp;&nbsp;'+now)
      p = $('<p></p>').text(message.substring(0,24)).css({'margin':'1% 0 1% 3%','color':'#979ca3','display':'inline-block'})
      var button = $('<span></span>').addClass('glyphicon glyphicon-record pull-right online vertical')
      li.append(span,div,p,button)
      $('#members').prepend(li)
    }
  }
  $('#area').scrollTop(ul[0].scrollHeight)
  console.log('Get all messages success');
}

function showmember(members){
  var memberlist = $('#members');
  members.forEach(function(member){
    if($('li[name='+member.id+']').length!==0){
      if($('li[name='+member.id+']>div>strong').text()!=member.nickname){
        $('li[name='+member.id+']').remove()
        var li = $('<li></li>').addClass('left clearfix').attr('name',member.id)
        var span = $('<span></span>').html('<img src="./photo.jpg" alt="User Avatar" class="img-circle">').addClass('chat-img1 pull-left')
        var now = new Date().getHours().toString()+':'+new Date().getMinutes().toString()
        var div = $('<div></div>').html('&nbsp;&nbsp;<strong>'+member.nickname+'</strong>&nbsp;&nbsp;&nbsp;'+now)
        var p = $('<p></p>').text('Change nickname').css({'margin':'1% 0 1% 3%','color':'#979ca3','display':'inline-block'})
        var button = $('<span></span>').addClass('glyphicon glyphicon-record pull-right online vertical')
        li.append(span,div,p,button)
      }
    } else if(member.id!=id){
      var li = $('<li></li>').addClass('left clearfix').attr('name',member.id)
      var span = $('<span></span>').html('<img src="./photo.jpg" alt="User Avatar" class="img-circle">').addClass('chat-img1 pull-left')
      var button = $('<span></span>').addClass('glyphicon glyphicon-record pull-right online vertical')
      if(joined){
        var now = new Date().getHours().toString()+':'+new Date().getMinutes().toString()
        var div = $('<div></div>').html('&nbsp;&nbsp;<strong>'+member.nickname+'</strong>&nbsp;&nbsp;&nbsp'+now)
        var p = $('<p></p>').text('Join this room').css({'margin':'1% 0 1% 3%','color':'#979ca3','display':'inline-block'})
        li.append(span,div,p,button)
      } else{
        var div = $('<div></div>').html('&nbsp;&nbsp;<strong>'+member.nickname+'</strong>')
        li.append(span,div,button)
      }
    }
    memberlist.prepend(li)
  })
  $('#membercount').text('Active member: '+($('#members li').length+1))
}

function sendMessage(event) {

    // prevent the page from redirecting
    event.preventDefault()
    // get the parameters
    var mymessage = $('#messageField').val() // get message
    // send it to the server
    $('#messageForm')[0].reset()
    socket.emit('message',mymessage)
}

function changename(){
    txt = $('#username').text();
    if (txt) {
      $('#username').html($("<input type='text'value='" + txt + "'/>"));
      $("#username > input").focus().blur(function () {
        var newtxt = $(this).val()
        if (newtxt != txt) {
          $('#username').html(newtxt);
          socket.emit('nickname',newtxt)
        }
      })
    }
}
