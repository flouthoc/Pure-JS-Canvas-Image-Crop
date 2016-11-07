
/* Pure Javascript Image Crop Plugin

	Author:flouthoc(flouthoc@gmail.com)
	Github:https://github.com/flouthoc

	Selectable Shape 
	http://rectangleworld.com/blog/archives/129
	http://simonsarris.com/blog/140-canvas-moving-selectable-shapes

*/


var ourObject = {

	x:100,
	y:100,
	width:70,
	height:70
} 

var closeEnough = 5;

var mx;
var my;
var mouseX;
var mouseY;
var dragging = false;

var drag_pos_x;
var drag_pos_y;

var drag_se = false;
var drag_sw = false;
var drag_nw = false;
var drag_ne = false;

var canvas;
var ctx;

var x;
var y;

var image;
var image_new;
var image_div = document.getElementsByName('prev');
var image_skeleton;


if(image_div){}
else{
	alert('NULL');
}


window.onload = function(){

	init();
}



function init(){
    //select our working area by Id i.e "canvas" you can change it up here according to your need
	canvas = document.getElementById('canvas');

	//let  me style the canvas a little bit so that we can see our canvas on screen
	canvas.setAttribute("style","border:1px solid black;");



	//creating canavs for our use
	if(canvas.getContext){
		  ctx = canvas.getContext('2d');
	}
	else{
		alert('Fella Sorry to Say that your browser does not support Canvas');
	}

	 image=document.getElementById("this");
    ctx.drawImage(image,0,0,300,300);

	//calback the main draw function

	canvas.addEventListener("mousedown",trigger_mousedown,false);
	canvas.addEventListener("mousemove",trigger_watch_cursor,false);



	//window.addEventListener("mouseup",trigger_mouseup,false);
	
    return setInterval(draw,10)
   
    
}

function drawCircle(x,y,radius){

	 ctx.fillStyle = "#FF0000";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();

}


function drawHandles() {
    drawCircle(ourObject.x, ourObject.y, closeEnough);
    drawCircle(ourObject.x + ourObject.width, ourObject.y, closeEnough);
    drawCircle(ourObject.x + ourObject.width, ourObject.y + ourObject.height, closeEnough);
    drawCircle(ourObject.x, ourObject.y + ourObject.height, closeEnough);
}


function draw(){
clear_screen();


    /*
    alert(ourObject.x);
	alert(ourObject.y);
	alert(ourObject.height);
	alert(ourObject.width);
	*/

//ctx.fillRect(ourObject.x,ourObject.y,ourObject.width,ourObject.height);
ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
ctx.fillRect(ourObject.x,ourObject.y, ourObject.width, ourObject.height);
ctx.stroke(); 
drawHandles();

	 
}
    

function clear_screen(){
//ctx.fillStyle = "white";
//ctx.fillRect(0,0,canvas.width,canvas.height);


 ctx.clearRect(0, 0,canvas.width,canvas.height);
 var image=document.getElementById("this");
    ctx.drawImage(image,0,0,300,300);

}
	
	





function trigger_mousedown(e){

//var rect = canvas.getBoundingClientRect();

mx = e.clientX;
my = e.clientY;
mouseX = mx - canvas.offsetLeft;
mouseY = my - canvas.offsetTop;



//add the collide code
if((mouseX>ourObject.x && (mouseX<ourObject.x + ourObject.width)) && (mouseY>ourObject.y && mouseY<(ourObject.y+ourObject.height))){

  dragging = true;

  

  ourObject.x = mouseX;// - canvas.offsetLeft;
  ourObject.y = mouseY;// - canvas.offsetTop;
  canvas.removeEventListener("mousedown",trigger_mousedown,false);
  window.addEventListener("mousemove",trigger_mousemove);
  window.addEventListener("mouseup",trigger_mouseup);
}


if((mouseX>ourObject.x - closeEnough && (mouseX<ourObject.x)) && (mouseY>(ourObject.y - closeEnough) && mouseY<(ourObject.y))){

	
}


//if((mouseX>ourObject.x - closeEnough && (mouseX<ourObject.x + ourObject.width)) && (mouseY>(ourObject.y - closeEnough) && mouseY<(ourObject.y))){

//	alert('Top Left');
//}



 /* if(dragging){
  	
    drag_pos_X = mouseX;
    //alert("i am drag pos X"+drag_pos_X+"");
    drag_pos_y = mouseY;
    //alert("i am drag pos y"+drag_pos_y+"");
    
    return;
  }*/
}





function trigger_mouseup(evt){
	canvas.addEventListener("mousemove",trigger_watch_cursor,false);
	canvas.addEventListener("mousedown",trigger_mousedown,false);
	window.removeEventListener("mouseup",trigger_mouseup,false);
	window.removeEventListener("mousemove",trigger_mousemove,false);
	if(dragging){
		dragging = false;
	
}

crop(evt);

}

function trigger_watch_cursor(e){

mx = e.clientX;
my = e.clientY;
mouseX = mx - canvas.offsetLeft;
mouseY = my - canvas.offsetTop;



//add the collide code
if((mouseX>ourObject.x && (mouseX<ourObject.x + ourObject.width)) && (mouseY>ourObject.y && mouseY<(ourObject.y+ourObject.height))){

	document.body.style.cursor = 'move';
  
}else if((mouseX>ourObject.x - closeEnough && (mouseX<ourObject.x)) && (mouseY>(ourObject.y - closeEnough) && mouseY<(ourObject.y))){

	document.body.style.cursor = 'se-resize';
	drag_se = true;
	canvas.addEventListener("mousedown",press_handle,false);

	
}else if((mouseX>(ourObject.x+ourObject.width) && (mouseX<ourObject.x + ourObject.width + closeEnough)) && (mouseY>(ourObject.y - closeEnough) && mouseY<(ourObject.y))){

	document.body.style.cursor = 'sw-resize';
	drag_se = true;
	canvas.addEventListener("mousedown",press_handle,false);

}else if((mouseX > (ourObject.x + ourObject.width) && (mouseX < ourObject.x + ourObject.width + closeEnough)) && (mouseY>(ourObject.y + ourObject.height) && mouseY<(ourObject.y + ourObject.height + closeEnough))){

	document.body.style.cursor = 'nw-resize';
	drag_nw = true;
	canvas.addEventListener("mousedown",press_handle,false);

}else if((mouseX>ourObject.x - closeEnough && (mouseX<ourObject.x)) && (mouseY>(ourObject.y + ourObject.height) && mouseY<(ourObject.y + ourObject.height + closeEnough))){

	document.body.style.cursor = 'ne-resize';
	drage_ne = true;
	canvas.addEventListener("mousedown",press_handle,false);

	
}
else{

	document.body.style.cursor = 'default';

}

}

function press_handle(){

	canvas.removeEventListener('mousemove',trigger_mousemove,false);
	canvas.addEventListener('mousemove',drag_handle,false);


}

function drag_handle(e){

	mx = e.clientX;
	my = e.clientY;
	mouseX = mx - canvas.offsetLeft;
	mouseY = my - canvas.offsetTop;



	canvas.addEventListener('mouseup',drag_handle_done,false);

	if(drag_se){

		ourObject.height += ourObject.y - mouseY;
		ourObject.width += ourObject.x - mouseX; 
		ourObject.x = mouseX;
		ourObject.y = mouseY;
		
	}else if(drag_ne){

		ourObject.height += ourObject.y - mouseY;
		ourObject.width += ourObject.x - mouseX; 
		ourObject.x = mouseX;
		ourObject.y = mouseY;

	}


}


function drag_handle_done(){
	

	canvas.removeEventListener("mousedown",press_handle,false);
	canvas.removeEventListener("mousemove",drag_handle,false);
	canvas.removeEventListener("mouseup",drag_handle_down,false);
	canvas.addEventListener("mousemove",trigger_mousemove,false);
	drag_se = false;
	drag_ne = false;
	drag_sw = false;
	drag_nw = false;
}

function trigger_mousemove(evt){

canvas.removeEventListener('mousemove',trigger_watch_cursor,false);	

	if (dragging){
  ourObject.x = evt.clientX - canvas.offsetLeft;
  ourObject.y = evt.clientY - canvas.offsetTop;
 }




}


function crop(evt){


var image_ghost = document.getElementById('image_skel');

var preview = document.getElementById('preview');



	//let  me style the canvas a little bit so that we can see our canvas on screen
	preview.setAttribute("style","border:1px solid black;");
	image_ghost.setAttribute("style","border:1px solid black; display:none;");


	if(image_ghost.getContext){
		  var itx = image_ghost.getContext('2d');
	}
	else{
		alert('Fella Sorry to Say that your browser does not support Canvas');}




	//creating canavs for our use
	if(preview.getContext){
		  var ptx = preview.getContext('2d');}
	else{
		alert('Fella Sorry to Say that your browser does not support Canvas');}



image=document.getElementById("this");
var sx = ourObject.x;
//alert(sx);
var sy = ourObject.y;
//alert(sy);
var swidth = ourObject.width;
//alert(swidth);
var sheight = ourObject.height;
//alert(sheight);





itx.drawImage(image,0,0,300,300);

image_skeleton = new Image();
image_skeleton.src = image_ghost.toDataURL("image/png");

//alert(image_skeleton.src);


ptx.drawImage(image_skeleton,sx,sy,swidth,sheight,0,0,300,300);




//image_new = new Image();
//image_new.src = canvas.toDataURL("image/png");
//alert(image_new.src);
//image_div = document.getElementById('prev');
//image_div.src = image_new.src;
//image_div = document.getElementById('prev');
//alert(image_new.src);

clear_screen();


}


