document.addEventListener('DOMContentLoaded', function()
{
	var screenW = 1920;
	  screenH = 1080,
	  count = 8,
	  width = screenW/count,
	  height = screenW/count,
	  canvas = document.getElementById('checkerboard'),
	  oversizeCanvas = document.createElement('canvas'),
	  context2D = oversizeCanvas.getContext('2d');
	
	//document.body.appendChild(oversizeCanvas);
	
	oversizeCanvas.width = screenW;
	oversizeCanvas.height = screenW;
	
	for (var row = 0; row < count; row ++)
	{
		for (var column = 0; column < count; column ++)
		{
			// coordinates of the top-left corner
			var x = column * width;
			var y = row * height;
			
			if (row%2 == 0)
			{
				if (column%2 == 0)
				{
					context2D.fillStyle = 'black';
				}
				else
				{
					context2D.fillStyle = 'white';
				}
			}
			else
			{
				if (column%2 == 0)
				{
					context2D.fillStyle = 'white';
				}
				else
				{
					context2D.fillStyle = 'black';
				}
			}
			
			
			context2D.fillRect(x, y, width, height);
		}

		context2D.beginPath();
    context2D.arc(screenW/2, screenW/2, 5, 0, 2 * Math.PI, false);
    context2D.fillStyle = 'red';
    context2D.fill();
    context2D.stroke();


		var ctx  = canvas.getContext('2d');
		ctx.drawImage(oversizeCanvas, 0, (screenW-screenH)/2	, screenW, screenH, 0, 0, screenW, screenH);
	}
	
	
});

