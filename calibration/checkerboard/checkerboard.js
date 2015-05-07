document.addEventListener('DOMContentLoaded', function()
{
	var screenW = 1920;
	var screenH = 1080;
	var count = 8;
	var width = screenW/count;
	var height = screenH/count;

	var canvas = document.getElementById("checkerboard");
	var context2D = canvas.getContext("2d");
	
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
					context2D.fillStyle = "black";
				}
				else
				{
					context2D.fillStyle = "white";
				}
			}
			else
			{
				if (column%2 == 0)
				{
					context2D.fillStyle = "white";
				}
				else
				{
					context2D.fillStyle = "black";
				}
			}
			
			
			context2D.fillRect(x, y, width, height);
		}

		context2D.beginPath();
    context2D.arc(screenW/2, screenH/2, 5, 0, 2 * Math.PI, false);
    context2D.fillStyle = 'red';
    context2D.fill();
    context2D.stroke();
	}
	
	
});

