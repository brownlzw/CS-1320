// JavaScript Document
var context;
var words;
var len;
var n = 0;
$(document).ready(function(){
	start();
})
function start(){
	var tmp = n;
	while(tmp==n){
		tmp = Math.floor(madlibs.length*Math.random());
	}
	n = tmp;
	context = madlibs[n];
	words = getItems(context.content||context.original);
	var container = $("<div></div>").attr("id","container");
	var head = $("<h1></h1>").text(context.title);
	head.css("color","white");
	var orderlist = $("<ol></ol>");
	var button = $("<input type=\"button\" class=\"button\" id=\"submit\" value=\"Submit!\" onclick=\"showResult()\">");
	$("#container").empty();
	$("#container").append(head,orderlist,button);
	for(var i=0;i<words.length;i++){
		$("ol").append("<li>"+words[i]+" <input type=\"text\" class=\"item\" id=\"idx"+i+"\">"+"</li><br>");
	}
	len = 0.5*$(".item").width();
	$("input").focus(function(){
		$(this).animate({width:"+="+len+"px"});
		$(this).css("background","pink");
	})
	$("input").blur(function(){
		$(this).animate({width:"-="+len+"px"});
		$(this).css("background","white");
	})
	$("input").keyup(function(event){
		if(event.keyCode==13){
			$(this).parent().next().next().children("input").focus();
			//next().children("input").focus();
		}
	})
}

function showResult(){
	$("#container").fadeOut("fast");
	var content = [];
	for(var i=0;i<words.length;i++){
		var word = ($("#idx"+i).val()||"___").fontcolor("aqua");
		content.push(word);
	}
	var result = $("<p>"+replaceItems(context.content||context.original,content)+"</p>");
	var button = $("<input type=\"button\" class=\"button\" value=\"Retry\" onclick=\"redo()\">");
	$("#resultRegion").empty();
	$("#resultRegion").append(result,button);
	$("#resultRegion").fadeIn("fast");
	$("input").focus(function(){
		$(this).animate({width:"+="+len+"px"});
		$(this).css("background","pink");
	})
	$("input").blur(function(){
		$(this).animate({width:"-="+len+"px"});
		$(this).css("background","white");
	})
}

function redo(){
	$("#resultRegion").fadeOut("fast");
	start();
	$("#container").fadeIn("fast");
//	$("#submit").fadeToggle("fast");
}

