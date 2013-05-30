function Vect() {
	this.X = 0;
	this.Y = 0;
	this.Z = 0;
}

function Equation() {
	this.A = 0;
	this.B = 0;
	this.C = 0;
	this.Delta = 0;
	this.K1 = 0;
	this.K2 = 0;
}

	/*************************************************************
	******************** THE REAL DEAL IS HERE *******************
	*************************************************************/

var RT = {

	Ctx: null,
	Scene: null,
	Res: 0,
	X: 0,
	Y: 0,
	K: 0,
	KX: 0,
	KY: 0,
	KZ: 0,
	Color: "#000000",
	Current: null,

	Raytracing: function(Scene) {
		this.Scene = Scene;
		this.StartCanvas();
		this.EachPix();
	},

	/*
	**	We call drawScene function for each pixel of the window
	*/
	EachPix: function() {
		for (this.Y = 0; this.Y < this.Scene.Window.Height; this.Y++)
		{
			for (this.X = 0; this.X < this.Scene.Window.Width; this.X++)
			{
				this.DrawScene();
			}
		}
	},

	/*
	**	Initialisation of the canvas object
	*/
	StartCanvas: function() {
		$("<canvas/>", {
	    	"id": "window"
		}).appendTo("#container");
		$('#window').attr("width", this.Scene.Window.Width+'px');
		$('#window').attr("height", this.Scene.Window.Height+'px');
		this.Ctx = document.getElementById('window').getContext("2d");
	},

	/*
	**	Get the color for the pixel and put it in the canvas
	*/
	DrawScene: function() {
		this.GetPixelColor();
		this.Ctx.fillStyle = this.Color;
		this.Ctx.fillRect(this.X, this.Y, 1, 1);
	},

	GetPixelColor: function() {
		var Vector = new Vect();
		Vector.X = 100;
		Vector.Y = (this.Scene.Window.Width / 2) - this.X;
		Vector.Z = (this.Scene.Window.Height / 2) - this.Y;
		//Vector = this.Normalize(Vector);

		for (var Obj in this.Scene) {
			this.Current = this.Scene[Obj];
			if (this.Current.Type == "Plan") {
				this.ItrPlan(Vector);
			}

			if (this.Current.Type == "Sphere") {
				this.ItrSphere(Vector);
			}

			/*if (this.K > 0.0000001) {
				console.log(this.K);
				this.Color = this.Current.Color;
			}
			else {
				this.Color = "#000000";
			}*/
		}
	},

	/*************************************************************
	*************** OBJECTS INTERSECTIONS FUNCTIONS **************
	*************************************************************/

	ItrSphere: function(Vector) {
		Eq = new Equation();

		// Translation for sphere
		Vector.X -= this.Scene.Eye.X - this.Current.X;
		Vector.Y -= this.Scene.Eye.Y - this.Current.Y;
		Vector.Z -= this.Scene.Eye.Z - this.Current.Z;
		// End translation

		Eq.A = (Vector.X * Vector.X) + (Vector.Y * Vector.Y) + (Vector.Z * Vector.Z);
		Eq.B = 2 * ((this.Scene.Eye.X * Vector.X) + (this.Scene.Eye.Y * Vector.Y) + (this.Scene.Eye.Z * Vector.Z));
		Eq.C = (((this.Scene.Eye.X * this.Scene.Eye.X) + (this.Scene.Eye.Y * this.Scene.Eye.Y) 
			+ (this.Scene.Eye.Z * this.Scene.Eye.Z)) - (this.Current.Radius * this.Current.Radius));
		Eq.Delta = (Eq.B * Eq.B) - (4 * (Eq.A * Eq.C));
		if (Eq.Delta == 0)
			this.Color = this.Current.Color;
		else if (Eq.Delta > 0)
			this.Color = this.Current.Color;
		else if (Eq.Delta < 0)
			this.Color = "#000000";
		/*if (Eq.Delta > 0.00000001)
		{
			Eq.K1 = (-Eq.B - Math.sqrt(Eq.Delta)) / (2 * Eq.A);
			Eq.K2 = (-Eq.B + Math.sqrt(Eq.Delta)) / (2 * Eq.A);

			if (Eq.K1 < Eq.K2)
				this.K = Eq.K1;
			else
				this.K = Eq.K2;
			//this.GetKCoor(Vector);
		}*/
	},

	ItrPlan: function(Vector) {
		this.K = (this.Scene.Eye.Z / Vector.Z) * -1;
		if (this.K == 0)
			this.Color = this.Current.Color;
		else if (this.K > 0)
			this.Color = this.Current.Color;
		else if (this.K < 0)
			this.Color = "#000000";
			
	},

	/******************************************************************
	*************** ROTATIONS AND TRANSLATIONS FUNCTIONS **************
	******************************************************************/

	GetKCoor: function (Vector) {
		this.KX = this.Scene.Eye.X + (this.K * Vector.X);
		this.KY = this.Scene.Eye.Y + (this.K * Vector.Y);
		this.KZ = this.Scene.Eye.Z + (this.K * Vector.Z);
	},

	Normalize : function (Vector) {
		var id = 1/Math.sqrt((Vector.X*Vector.X) + (Vector.Y*Vector.Y) + (Vector.Z*Vector.Z));
		Vector.X = Vector.X * id;
		Vector.Y = Vector.Y * id;
		Vector.Z = Vector.Z * id;
		return Vector;
	}
}

$.getJSON ('Scene.json', function (Scene) {
		RT.Raytracing(Scene);
	}
);