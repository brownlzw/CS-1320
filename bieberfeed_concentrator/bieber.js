/*
    bieber.js
    An implementation of the BieberFeed project.
*/

// This code will be executed when the page finishes loading
var idList = [];
var intervalId;
var data;

window.addEventListener('load', function(){
    // Fill me in!
	intervalId = window.setInterval(refresh,5000); 
	$('body').css({'background-color':'#F4F8FA'});
	$('#goToTop').click(function(){
		$('html,body').animate({scrollTop:0},'slow');         
	});
	$('#profile').css({'text-align':'center'});
	$('#container h2').css('text-align','center');
	$('#container h5').text("Waiting...").css('text-align','center').show();
//	$('#container h3').show();
	$('ul').css({'list-style':'none'}); 
	$('#control').css({'position':'fixed','top':'50%'});
}, false);

function refresh(){
	var ul = $('#tweets');
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if(this.readyState==4&&this.status==200){
			$('#container h5').hide();
			var content = this.responseText;
            data = JSON.parse(content);
			for(var i=0;i<data.length;i++){
				if(idList.indexOf(data[i].id_str)==-1){
				      var li = $('<li></li>');
					 li.html('<div class=\"panel panel-info\ vertical-align:center">'+
							     '<div class=\"panel-heading\">'+
							         '<h4><a href=#><img src="'+data[i].user.profile_image_url+'\"><\a>'+
							              '&nbsp;&nbsp;&nbsp;'+data[i].user.name+' - @'+
							               data[i].user.screen_name+' - '+data[i].created_at.substring(4,11)+
							         '</h4>'+
							     '</div>'+'<div class=\"panel-body\">'+
							        '<p>'+data[i].text+'<\p>'+
							     '</div>'+
							  '</div>'
							  );
                      ul.prepend(li);
					  idList.push(data[i].id_str);
				}
			}
			console.log($('#tweets li').length);
			while($('#tweets li').length>26){
				$('#tweets li:last-child').remove();
			}
			console.log($('#tweets li').length);
		} else{
			$('#container h5').text("Status:"+this.status+" "+this.statusText).show();
			console.log("Status:"+this.status+" "+this.statusText);
		}
	}
	xhttp.open('GET','http://ec2-54-210-131-157.compute-1.amazonaws.com/feed/:zliu28',true);
	xhttp.send();
}

function check(){
	if($('#stop').is(":checked")){
		clearInterval(intervalId);
	    alert("Refresh stop!");
	} else{
		intervalId = window.setInterval(refresh,5000);
		alert("Refresh begin!")
	}
	
}