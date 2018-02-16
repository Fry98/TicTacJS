var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var offBox = document.getElementById("offBox");
var sizeBox = document.getElementById("sizeBox");
var shaper, idx = 0, offset, lineL, patType, onHold = false, gameField, cellAmount = sizeBox.value, col01, col02;
var undo = document.getElementById("but2");
var redraw = document.getElementById("but1");
var cp1 = document.getElementById("cp1");
var cp2 = document.getElementById("cp2");
var undoX = [], undoY = [];
var scoreDisp1 = document.getElementById("s1");
var scoreDisp2 = document.getElementById("s2");
var scoReset = document.getElementById("reset");
var p1score = 0, p2score = 0;
var switcher = false;

drawCanvas(offBox.value,cellAmount*offBox.value);

reset.addEventListener("click", function(event){
	p1score = 0;
	p2score = 0;
	scoreDisp1.innerHTML = '0';
	scoreDisp2.innerHTML = '0';
	onHold = false;
	cellAmount = sizeBox.value;
	switcher = false;
	drawCanvas(offBox.value,cellAmount*offBox.value);
});

redraw.addEventListener("click", function(event){
	onHold = false;
	cellAmount = sizeBox.value;
	drawCanvas(offBox.value,cellAmount*offBox.value);
});

undo.addEventListener("click", function(event){
	if(onHold == false && idx > 0){
		idx--;
		var actX = undoX[idx];
		var actY = undoY[idx];
		gameField[actX][actY] = 0;
		var rectX = (actX*offset)+2;
		var rectY = (actY*offset)+2;
		var rectWH = offset - 2;
		ctx.fillStyle="white";
		ctx.fillRect(rectX,rectY,rectWH,rectWH);
		shaper = !shaper;
	}
});

c.addEventListener("click", function(event){
	if(onHold == false){
		var rect = canvas.getBoundingClientRect();
		var mouseX = event.clientX - rect.left;
		var mouseY = event.clientY - rect.top;
		var cellX = (mouseX - (mouseX%offset))/offset;
		var cellY = (mouseY - (mouseY%offset))/offset;
		if(gameField[cellX][cellY] == 0){
			actX = cellX;
			actY = cellY;
			if (shaper==false){
				drawX(cellX, cellY);
				shaper = true;
				gameField[cellX][cellY] = 1;
			}
			else{
				drawCircle(cellX, cellY);
				shaper = false;	
				gameField[cellX][cellY] = 2;
			}
			undoX[idx] = cellX;
			undoY[idx] = cellY;
			idx++;
			checkWin(cellX, cellY);
		}
	}
});

function drawCanvas(a,b) {	
	col01 = "#" + cp1.value;
	col02 = "#" + cp2.value;
	scoreDisp1.style.color = col01;
	scoreDisp2.style.color = col02;
	idx = 0;

	if(switcher==false){
		shaper = false;
	}
	else{
		shaper = true;
	}
	
	switcher = !switcher;
	c.width = b+2;
	c.height = b+2;
	offset = a;
	lineL = c.width;
	ctx.fillStyle="white";
	ctx.fillRect(0,0,c.width,c.height);
	for (i = 0; i <= cellAmount; i++) {
		ctx.beginPath();
		ctx.lineWidth=2;
		ctx.moveTo(offset*i+1,0);
		ctx.lineTo(offset*i+1,lineL);
		ctx.stroke();
		ctx.closePath();
		ctx.beginPath();
		ctx.moveTo(0,offset*i+1);
		ctx.lineTo(lineL,offset*i+1);
		ctx.stroke();
		ctx.closePath();
	}

	gameField = [];
	for(var i = 0; i < cellAmount; i++){
		gameField[i] = [];
		for(var j = 0; j < cellAmount; j++){
			gameField[i][j] = 0;
		}
	}

}

function drawX(cellX, cellY){
	var lineOff = offset/10;
	var lineX1 = (offset*cellX)+lineOff;
	var lineY1 = (offset*cellY)+lineOff;
	var lineX2 = (offset*(cellX+1))-lineOff;
	var lineY2 = (offset*(cellY+1))-lineOff;
	ctx.strokeStyle=col01;
	ctx.beginPath();
	ctx.moveTo(lineX1+1,lineY1+1);
	ctx.lineTo(lineX2+1,lineY2+1);
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
	ctx.moveTo(lineX2+1,lineY1+1);
	ctx.lineTo(lineX1+1,lineY2+1);
	ctx.stroke();
	ctx.closePath();
}

function drawCircle(cellX, cellY){
	var centerX = (cellX*offset) + (offset/2) + 1;
	var centerY = (cellY*offset) + (offset/2) + 1;
	var radius = (offset/2) - (offset/10);
	ctx.strokeStyle=col02;
	ctx.beginPath();
	ctx.arc(centerX,centerY,radius,0,2*Math.PI);
	ctx.stroke();
	ctx.closePath();
}

function checkWin(cellX, cellY){
	for(var y = 0; y < cellAmount; y++){
		for(var x = 0; x < cellAmount; x++){
			if(gameField[x][y] != 0){			
				if(patterCheck(x, y, gameField[x][y])){
					end_screen(gameField[x][y], x, y);
					return;
				}
			}
		}
	}
}

function patterCheck(x, y, shape){
	var matchFound, i;
	if(x<=cellAmount-5){
		matchFound=true;
		// HORIZONTAL CHECK
		for(i=1;i<5;i++){
			if(gameField[x+i][y] != shape){
				matchFound = false;
				break;
			}
		}
		if(matchFound){
			patType = 0;
			return true;
		}
		if(y<=cellAmount-5){
			matchFound=true;
			// RIGHT-DIAGONAL CHECK
			for(i=1;i<5;i++){
				if(gameField[x+i][y+i] != shape){
					matchFound = false;
					break;
				}
			}
			if(matchFound){
				patType = 1;
				return true;
			}
		}
	}
	if(y<=cellAmount-5){
		matchFound=true;
		// VERTICAL CHECK
		for (i=1;i<5;i++){
			if(gameField[x][y+i] != shape){
				matchFound = false;
				break;
			}
		}
		if(matchFound){
			patType = 2;
			return true;
		}
		if(x>=4){
			matchFound=true;
			// LEFT-DIAGONAL CHECK
			for(i=1;i<5;i++){
				if(gameField[x-i][y+i] != shape){
					matchFound = false;
					break;
				}
			}
			if(matchFound){
				patType = 3;
				return true;
			}
			else{return false;}
		}
	}
}

function end_screen(shape, cellX, cellY){
	onHold = true;	
	var canSize = cellAmount*offBox.value + 2;
	var startPosX = (cellX*offset) + (offset/2) + 1;
	var startPosY = (cellY*offset) + (offset/2) + 1;
	var overshot = offset/10;
	var adder = 4*offset + overshot;
	var endPosX, endPosY;
	switch(patType){
		case 0:
			endPosX = startPosX + adder;
			endPosY = startPosY;
			startPosX -= overshot;
		break;
		case 1:
			endPosX = startPosX + adder;
			endPosY = startPosY + adder;
			startPosX -= overshot;
			startPosY -= overshot;
		break;
		case 2:
			endPosX = startPosX;
			endPosY = startPosY + adder;
			startPosY -= overshot;
		break;
		case 3:
			endPosX = startPosX + overshot;
			endPosY = startPosY - overshot;
			startPosX = startPosX - adder;
			startPosY = startPosY + adder;
		break;
	}

	ctx.beginPath();
	ctx.lineWidth=5;
	ctx.moveTo(startPosX, startPosY);
	ctx.lineTo(endPosX,endPosY);	
	switch(shape){
		case 1:
			ctx.strokeStyle = col02;
			p1score++;
			scoreDisp1.innerHTML = p1score;			
		break;
		case 2:
			ctx.strokeStyle = col01;
			p2score++;
			scoreDisp2.innerHTML = p2score;
		break;
	}
	ctx.stroke();	
	ctx.lineWidth=2;
	ctx.closePath();

	ctx.fillStyle = 'rgba(255,255,255,0.6)';
	ctx.fillRect(0,0,canSize,canSize);
	
	ctx.font = "bold 40px Roboto";
	ctx.textAlign = "center";
	ctx.shadowColor = "rgb(255, 255, 255)";
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = 3;
	switch(shape){
		case 1:
			ctx.fillStyle = col01;
			ctx.fillText("X has won the game!",canSize/2,canSize/2);
			ctx.fillStyle = col02;
		break;
		case 2:
			ctx.fillStyle = col02;						
			ctx.fillText("O has won the game!",canSize/2,canSize/2);
			ctx.fillStyle = col01;
		break;
	}

	ctx.font = "bold 20px Roboto";
	ctx.fillText("Click \"Next Game\" to restart...",canSize/2,(canSize/2)+27);

}