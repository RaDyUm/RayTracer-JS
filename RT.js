$.getJSON('Scene.json', function (Scene) {
				var ctx = startCanvas(Scene);
				raytracer(Scene, ctx);
			}
)

function raytracer (Scene, ctx)
{
	var i = 0;
	//tu fais un boucle et puis c'est bon
}

function startCanvas (Scene)
{
	$("<canvas/>", {
    	"id": "window"
	}).appendTo("#container");
	$('#window').attr("width", Scene.Window.Width+'px');
	$('#window').attr("height", Scene.Window.Height+'px');
	var ctx = document.getElementById('window').getContext("2d");
	return ctx;
}
