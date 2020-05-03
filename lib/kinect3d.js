// Create a 3d scatter plot within d3 selection parent.
var kinectV1Header = ["Time",
                      "HipCenterX", "HipCenterY", "HipCenterZ",
                      "SpineX", "SpineY", "SpineZ",
                      "ShoulderCenterX", "ShoulderCenterY", "ShoulderCenterZ",
                      "HeadX", "HeadY", "HeadZ",
                      "ShoulderLeftX", "ShoulderLeftY", "ShoulderLeftZ",
                      "ElbowLeftX", "ElbowLeftY", "ElbowLeftZ",
                      "WristLeftX", "WristLeftY", "WristLeftZ",
                      "HandLeftX", "HandLeftY", "HandLeftZ",
                      "ShoulderRightX", "ShoulderRightY", "ShoulderRightZ",
                      "ElbowRightX", "ElbowRightY", "ElbowRightZ",
                      "WristRightX", "WristRightY", "WristRightZ",
                      "HandRightX", "HandRightY", "HandRightZ",
                      "HipLeftX", "HipLeftY", "HipLeftZ",
                      "KneeLeftX", "KneeLeftY", "KneeLeftZ",
                      "AnkleLeftX", "AnkleLeftY", "AnkleLeftZ",
                      "FootLeftX", "FootLeftY", "FootLeftZ",
                      "HipRightX", "HipRightY", "HipRightZ",
                      "KneeRightX", "KneeRightY", "KneeRightZ",
                      "AnkleRightX", "AnkleRightY", "AnkleRightZ",
                      "FootRightX", "FootRightY", "FootRightZ", ""];

var kinectV2Header = ["Time",
                      "HeadX", "HeadY", "HeadZ", "HeadTrackingState",
                      "NeckX", "NeckY", "NeckZ", "NeckTrackingState",
                      "SpineShoulderX", "SpineShoulderY", "SpineShoulderZ", "SpineShoulderTrackingState",
                      "SpineMidX", "SpineMidY", "SpineMidZ", "SpineMidTrackingState",
                      "SpineBaseX", "SpineBaseY", "SpineBaseZ", "SpineBaseTrackingState",
                      "ShoulderLeftX", "ShoulderLeftY", "ShoulderLeftZ", "ShoulderLeftTrackingState",
                      "ShoulderRightX", "ShoulderRightY", "ShoulderRightZ", "ShoulderRightTrackingState",
                      "ElbowLeftX", "ElbowLeftY", "ElbowLeftZ", "ElbowLeftTrackingState",
                      "ElbowRightX", "ElbowRightY", "ElbowRightZ", "ElbowRightTrackingState",
                      "WristLeftX", "WristLeftY", "WristLeftZ", "WristLeftTrackingState",
                      "WristRightX", "WristRightY", "WristRightZ", "WristRightTrackingState",
                      "HandLeftX", "HandLeftY", "HandLeftZ", "HandLeftTrackingState",
                      "HandRightX", "HandRightY", "HandRightZ", "HandRightTrackingState",
                      "HandTipLeftX", "HandTipLeftY", "HandTipLeftZ", "HandTipLeftTrackingState",
                      "HandTipRightX", "HandTipRightY", "HandTipRightZ", "HandTipRightTrackingState",
                      "ThumbLeftX", "ThumbLeftY", "ThumbLeftZ", "ThumbLeftTrackingState",
                      "ThumbRightX", "ThumbRightY", "ThumbRightZ", "ThumbRightTrackingState",
                      "HipLeftX", "HipLeftY", "HipLeftZ", "HipLeftTrackingState",
                      "HipRightX", "HipRightY", "HipRightZ", "HipRightTrackingState",
                      "KneeLeftX", "KneeLeftY", "KneeLeftZ", "KneeLeftTrackingState",
                      "KneeRightX", "KneeRightY", "KneeRightZ", "KneeRightTrackingState",
                      "AnkleLeftX", "AnkleLeftY", "AnkleLeftZ", "AnkleLeftTrackingState",
                      "AnkleRightX", "AnkleRightY", "AnkleRightZ", "AnkleRightTrackingState",
                      "FootLeftX", "FootLeftY", "FootLeftZ", "FootLeftTrackingState",
                      "FootRightX", "FootRightY", "FootRightZ", "FootRightTrackingState"];

var csv_path = ""
var Time = [];
var HipCenter = []; // v1
var Spine = []; // v1
var ShoulderCenter = []; // v1
var Head = [];
var Neck = []; // v2
var SpineShoulder = []; // v2
var SpineMid = []; // v2
var SpineBase = []; // v2
var HandTipLeft = []; // v2
var HandTipRight = []; // v2
var ThumbLeft = []; // v2
var ThumbRight = []; // v2
var ShoulderLeft = [];
var ElbowLeft = [];
var WristLeft = [];
var HandLeft = [];
var ShoulderRight = [];
var ElbowRight = [];
var WristRight = [];
var HandRight = [];
var HipLeft = [];
var KneeLeft = [];
var AnkleLeft = [];
var FootLeft = [];
var HipRight = [];
var KneeRight = [];
var AnkleRight = [];
var FootRight = [];
var rows = [];
var timer;
var slider;
var kinectDataType = 0;

var noButton = true;
var play = false;
var lastStep=0;
var axisRange = [0, 10];
var scales = [];
var initialDuration = 0;
var defaultDuration = 800;
var ease = 'linear';
var time = 0;
var axisKeys = ["x", "y", "z"];

var spanText = d3.select('#dataType');
var divPlot = d3.select('#divPlot');
var x3d = divPlot.append("x3d");
x3d.style( "width", parseInt(divPlot.style("width"))+"px" );
x3d.style( "height", parseInt(divPlot.style("height"))+"px" );
x3d.style( "border", "none" );
  
var scene = x3d.append("scene");

scene.append("orthoviewpoint")
  .attr( "centerOfRotation", [5, 5, 5])
  .attr( "fieldOfView", [-5, -5, 15, 15])
  .attr( "orientation", [-0.5, 1, 0.2, 1.12*Math.PI/4])
  .attr( "position", [8, 4, 15])

scene.append("orthoviewpoint")
  .attr( "centerOfRotation", [5, 5, 5])
  .attr( "fieldOfView", [-5, -5, 15, 15])
  .attr( "orientation", [-0.5, 1, 0.2, 1.12*Math.PI/4])
  .attr( "position", [8, 4, 15])

function axisName( name, axisIndex ) {
  return ['x','y','z'][axisIndex] + name;
}

function constVecWithAxisValue( otherValue, axisValue, axisIndex ) {
  var result = [otherValue, otherValue, otherValue];
  result[axisIndex] = axisValue;
  return result;
}

// Used to make 2d elements visible
function makeSolid(selection, color) {
  selection.append("appearance")
    .append("material")
       .attr("diffuseColor", color||"black")
  return selection;
}

function initializeAxis( axisIndex )
  {
    var key = axisKeys[axisIndex];
    drawAxis( axisIndex, key, initialDuration );

    var scaleMin = axisRange[0];
    var scaleMax = axisRange[1];

    // the axis line
    var newAxisLine = scene.append("transform")
         .attr("class", axisName("Axis", axisIndex))
         .attr("rotation", ([[0,0,0,0],[0,0,1,Math.PI/2],[0,1,0,Math.PI/2]][axisIndex]))
      .append("shape")
    newAxisLine
      .append("appearance")
      .append("material")
        .attr("emissiveColor", "lightgray")
    newAxisLine
      .append("polyline2d")
         // Line drawn along y axis does not render in Firefox, so draw one
         // along the x axis instead and rotate it (above).
        .attr("lineSegments", "0 0," + scaleMax + " 0")

   // axis labels
   var newAxisLabel = scene.append("transform")
       .attr("class", axisName("AxisLabel", axisIndex))
       .attr("translation", constVecWithAxisValue( 0, scaleMin + 1.1 * (scaleMax-scaleMin), axisIndex ))

	if(axisIndex=='2'){
		newAxisLabel = scene.append("transform")
       .attr("class", axisName("AxisLabel", axisIndex))
       .attr("translation", constVecWithAxisValue( 0, scaleMin -1.1 * (scaleMax-scaleMin), axisIndex ))

	}

   var newAxisLabelShape = newAxisLabel
     .append("billboard")
       .attr("axisOfRotation", "0 0 0") // face viewer
     .append("shape")
     .call(makeSolid)

   var labelFontSize = 0.6;

   newAxisLabelShape
     .append("text")
       .attr("class", axisName("AxisLabelText", axisIndex))
       .attr("solid", "true")
       .attr("string", key)
    .append("fontstyle")
       .attr("size", labelFontSize)
       .attr("family", "SANS")
       .attr("justify", "END MIDDLE" )
  }

  // Assign key to axis, creating or updating its ticks, grid lines, and labels.
  function drawAxis( axisIndex, key, duration ) {

    var scale = d3.scale.linear()
      .domain( [-5,5] ) // demo data range
      .range( axisRange )
    
    scales[axisIndex] = scale;

    var numTicks = 0;
    var tickSize = 0.1;
    var tickFontSize = 0.5;

    // ticks along each axis
    var ticks = scene.selectAll( "."+axisName("Tick", axisIndex) )
       .data( scale.ticks( numTicks ));
    var newTicks = ticks.enter()
      .append("transform")
        .attr("class", axisName("Tick", axisIndex));
    newTicks.append("shape").call(makeSolid)
      .append("box")
        .attr("size", tickSize + " " + tickSize + " " + tickSize);
    // enter + update
    ticks.transition().duration(duration)
      .attr("translation", function(tick) { 
         return constVecWithAxisValue( 0, scale(tick), axisIndex ); })
    ticks.exit().remove();

    // tick labels
    var tickLabels = ticks.selectAll("billboard shape text")
      .data(function(d) { return [d]; });
    var newTickLabels = tickLabels.enter()
      .append("billboard")
         .attr("axisOfRotation", "0 0 0")     
      .append("shape")
      .call(makeSolid)
    newTickLabels.append("text")
      .attr("string", scale.tickFormat(10))
      .attr("solid", "true")
      .append("fontstyle")
        .attr("size", tickFontSize)
        .attr("family", "SANS")
        .attr("justify", "END MIDDLE" );
    tickLabels // enter + update
      .attr("string", scale.tickFormat(10))
    tickLabels.exit().remove();

  }

function initializePlot() {
  initializeAxis(0);
  initializeAxis(1);
  initializeAxis(2);
}

function clearData(){
  Time = [];
  HipCenter = []; // v1
  Spine = []; // v1
  ShoulderCenter = []; // v1
  Head = [];
  Neck = []; // v2
  SpineShoulder = []; // v2
  SpineMid = []; // v2
  SpineBase = []; // v2
  HandTipLeft = []; // v2
  HandTipRight = []; // v2
  ThumbLeft = []; // v2
  ThumbRight = []; // v2
  ShoulderLeft = [];
  ElbowLeft = [];
  WristLeft = [];
  HandLeft = [];
  ShoulderRight = [];
  ElbowRight = [];
  WristRight = [];
  HandRight = [];
  HipLeft = [];
  KneeLeft = [];
  AnkleLeft = [];
  FootLeft = [];
  HipRight = [];
  KneeRight = [];
  AnkleRight = [];
  FootRight = [];
  rows = [];
}

function kinect3d()
{
  clearData();

  // Update the data points (spheres) and stems.
  
  initializeDataGrid();
  initializePlot();
}

function plotData( duration ) {
    
  if (!rows) {
   console.log("no rows to plot.")
   return;
  }

  var x = scales[0], y = scales[1], z = scales[2];
  var sphereRadius = 0.1	;

  // Draw a sphere at each x,y,z coordinate.
  var datapoints = scene.selectAll(".datapoint").data( rows );
  datapoints.exit().remove()

  var newDatapoints = datapoints.enter()
    .append("transform")
      .attr("class", "datapoint")
      .attr("scale", [sphereRadius, sphereRadius, sphereRadius])
    .append("shape");
  newDatapoints
    .append("appearance")
    .append("material");
  newDatapoints
    .append("sphere")
     // Does not work on Chrome; use transform instead
     //.attr("radius", sphereRadius)

  datapoints.selectAll("shape appearance material")
      .attr("diffuseColor", 'steelblue' )

  datapoints.transition().ease(ease).duration(duration)
      .attr("translation", function(row) { 
        xCoord = row[axisKeys[0]] *5;
        yCoord = -row[axisKeys[1]] * 5;
        zCoord = -row[axisKeys[2]] * 5;
        return x(xCoord) + " " + y(yCoord) + " " + z(zCoord)})

  // Draw a stem from the x-z plane to each sphere at elevation y.
  // This convention was chosen to be consistent with x3d primitive ElevationGrid. 
  // var stems = scene.selectAll(".stem").data( rows );
//     stems.exit().remove();
// 
//      var newStems = stems.enter()
//       .append("transform")
//         .attr("class", "stem")
//       .append("shape");
//     newStems
//       .append("appearance")
//       .append("material")
//         .attr("emissiveColor", "gray")
//     newStems
//       .append("polyline2d")
//         .attr("lineSegments", function(row) { return "0 1, 0 0"; })
// 
//  	stems.transition().ease(ease).duration(duration)
//         .attr("translation", 
//            function(row) { 
// 	          xCoord = row[axisKeys[0]] *5;
//     	      yCoord = row[axisKeys[1]] * 5;
//         	  zCoord = -row[axisKeys[2]] * 5;
// 	          return "" + x(xCoord) + " 0 " + z(zCoord); 
// 	        })
//         .attr("scale",
//            function(row) { return [1, y(row[axisKeys[1]] * 5)]; })


}

function clock() {
  //console.log('tick')
  updateData(lastStep+1)
}

function toggle(el){
  if(el.className!="pause")
  {
      el.src='images/pause+button.jpg';
      el.className="pause";
      return true;
  }
  else if(el.className=="pause")
  {
      el.src='images/blue-play-button-md.png';
      el.className="play";
      return false;
  }
}

function gup( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return null;
  else
    return results[1];
}

function updateData(step) {
  //console.log(play)
  //console.log(step)
  lastStep=step;
  rows=[];
  if(kinectDataType == 1){
    if(HipCenter[step] !=null && HipCenter[step][0]!="") rows.push({x:HipCenter[step][0] , y: HipCenter[step][1], z: HipCenter[step][2]});
    if(Spine[step] != null && Spine[step][0]!="") rows.push({x:Spine[step][0] , y: Spine[step][1], z: Spine[step][2]});
    if(ShoulderCenter[step] != null && ShoulderCenter[step][0]!="") rows.push({x:ShoulderCenter[step][0] , y: ShoulderCenter[step][1], z: ShoulderCenter[step][2]});
  }
  if(kinectDataType == 2){
    if(Neck[step] != null && Neck[step][0]!="") rows.push({x:Neck[step][0] , y: Neck[step][1], z: Neck[step][2]});
    if(SpineShoulder[step] != null && SpineShoulder[step][0]!="") rows.push({x:SpineShoulder[step][0] , y: SpineShoulder[step][1], z: SpineShoulder[step][2]});
    if(SpineMid[step] != null && SpineMid[step][0]!="") rows.push({x:SpineMid[step][0] , y: SpineMid[step][1], z: SpineMid[step][2]});
    if(SpineBase[step] != null && SpineBase[step][0]!="") rows.push({x:SpineBase[step][0] , y: SpineBase[step][1], z: SpineBase[step][2]});
    if(HandTipLeft[step] != null && HandTipLeft[step][0]!="") rows.push({x:HandTipLeft[step][0] , y: HandTipLeft[step][1], z: HandTipLeft[step][2]});
    if(HandTipRight[step] != null && HandTipRight[step][0]!="") rows.push({x:HandTipRight[step][0] , y: HandTipRight[step][1], z: HandTipRight[step][2]});
    if(ThumbLeft[step] != null && ThumbLeft[step][0]!="") rows.push({x:ThumbLeft[step][0] , y: ThumbLeft[step][1], z: ThumbLeft[step][2]});
    if(ThumbRight[step] != null && ThumbRight[step][0]!="") rows.push({x:ThumbRight[step][0] , y: ThumbRight[step][1], z: ThumbRight[step][2]});
  }
  if(Head[step] != null && Head[step][0]!="") rows.push({x:Head[step][0] , y: Head[step][1], z: Head[step][2]});
  if(ShoulderLeft[step] != null && ShoulderLeft[step][0]!="") rows.push({x:ShoulderLeft[step][0] , y: ShoulderLeft[step][1], z: ShoulderLeft[step][2]});
  if(ElbowLeft[step] != null && ElbowLeft[step][0]!="") rows.push({x:ElbowLeft[step][0] , y: ElbowLeft[step][1], z: ElbowLeft[step][2]});
  if(WristLeft[step] != null && WristLeft[step][0]!="") rows.push({x:WristLeft[step][0] , y: WristLeft[step][1], z: WristLeft[step][2]});
  if(HandLeft[step] != null && HandLeft[step][0]!="") rows.push({x:HandLeft[step][0] , y: HandLeft[step][1], z: HandLeft[step][2]});
  if(ShoulderRight[step] != null && ShoulderRight[step][0]!="") rows.push({x:ShoulderRight[step][0] , y: ShoulderRight[step][1], z: ShoulderRight[step][2]});
  if(ElbowRight[step] != null && ElbowRight[step][0]!="") rows.push({x:ElbowRight[step][0] , y: ElbowRight[step][1], z: ElbowRight[step][2]});
  if(WristRight[step] != null && WristRight[step][0]!="") rows.push({x:WristRight[step][0] , y: WristRight[step][1], z: WristRight[step][2]});
  if(HandRight[step] != null && HandRight[step][0]!="") rows.push({x:HandRight[step][0] , y: HandRight[step][1], z: HandRight[step][2]});
  if(HipLeft[step] != null && HipLeft[step][0]!="") rows.push({x:HipLeft[step][0] , y: HipLeft[step][1], z: HipLeft[step][2]});
  if(KneeLeft[step] != null && KneeLeft[step][0]!="") rows.push({x:KneeLeft[step][0] , y: KneeLeft[step][1], z: KneeLeft[step][2]});
  if(AnkleLeft[step] != null && AnkleLeft[step][0]!="") rows.push({x:AnkleLeft[step][0] , y: AnkleLeft[step][1], z: AnkleLeft[step][2]});
  if(FootLeft[step] != null && FootLeft[step][0]!="") rows.push({x:FootLeft[step][0] , y: FootLeft[step][1], z: FootLeft[step][2]});
  if(HipRight[step] != null && HipRight[step][0]!="") rows.push({x:HipRight[step][0] , y: HipRight[step][1], z: HipRight[step][2]});
  if(KneeRight[step] != null && KneeRight[step][0]!="") rows.push({x:KneeRight[step][0] , y: KneeRight[step][1], z: KneeRight[step][2]});
  if(AnkleRight[step] != null && AnkleRight[step][0]!="") rows.push({x:AnkleRight[step][0] , y: AnkleRight[step][1], z: AnkleRight[step][2]});
  if(FootRight[step] != null && FootRight[step][0]!="") rows.push({x:FootRight[step][0] , y: FootRight[step][1], z: FootRight[step][2]});

  if(step==0) plotData(defaultDuration);
  else plotData(5);

  if(slider!=null && slider.value!=step){
    slider.slider( "value", step );
    $( "#frame" ).val( $( "#slider" ).slider( "value" ) );
  }

  return true;
}

function arr_diff (a1, a2) {
  var a = [], diff = [];
  for (var i = 0; i < a1.length; i++) {
      a[a1[i]] = true;
  }
  for (var i = 0; i < a2.length; i++) {
      if (a[a2[i]]) {
          delete a[a2[i]];
      } else {
          a[a2[i]] = true;
      }
  }
  for (var k in a) {
      diff.push(k);
  }
  return diff;
}

function initializeDataGrid() {
  clearData();
  if(csv_path == "filepath"){
    return;
  }
  d3.csv(csv_path, function(csv){
  var header = d3.keys(csv[0]);

  if (arr_diff(header, kinectV1Header).length == 0){
    spanText.text("Using v1 header");
    kinectDataType = 1;
  }
  else if (arr_diff(header, kinectV2Header).length == 0){
    spanText.text("Using v2 header");
    kinectDataType = 2;
  }
  else{
    spanText.text("Unknown header");
    kinectDataType = 0;
  }
  csv.map(function(d) {
      Time.push(d.Time);
      HipCenter.push([d.HipCenterX, d.HipCenterY, d.HipCenterZ]);    	
      Spine.push([d.SpineX, d.SpineY, d.SpineZ]);    	
      ShoulderCenter.push([d.ShoulderCenterX, d.ShoulderCenterY, d.ShoulderCenterZ]); 
      Head.push([d.HeadX, d.HeadY, d.HeadZ]);    	
      ShoulderLeft.push([d.ShoulderLeftX, d.ShoulderLeftY, d.ShoulderLeftZ]);    	
      ElbowLeft.push([d.ElbowLeftX, d.ElbowLeftY, d.ElbowLeftZ]);    	
      WristLeft.push([d.WristLeftX, d.WristLeftY, d.WristLeftZ]);    	
      HandLeft.push([d.HandLeftX, d.HandLeftY, d.HandLeftZ]);    	
      ShoulderRight.push([d.ShoulderRightX, d.ShoulderRightY, d.ShoulderRightZ]);    	
      ElbowRight.push([d.ElbowRightX, d.ElbowRightY, d.ElbowRightZ]);    	
      WristRight.push([d.WristRightX, d.WristRightY, d.WristRightZ]);    	
      HandRight.push([d.HandRightX, d.HandRightY, d.HandRightZ]);
      HipLeft.push([d.HipLeftX, d.HipLeftY, d.HipLeftZ]);    	
      KneeLeft.push([d.KneeLeftX, d.KneeLeftY, d.KneeLeftZ]);    	
      AnkleLeft.push([d.AnkleLeftX, d.AnkleLeftY, d.AnkleLeftZ]);    	
      FootLeft.push([d.FootLeftX, d.FootLeftY, d.FootLeftZ]);    	
      HipRight.push([d.HipRightX, d.HipRightY, d.HipRightZ]);    	
      KneeRight.push([d.KneeRightX, d.KneeRightY, d.KneeRightZ]);    	
      AnkleRight.push([d.AnkleRightX, d.AnkleRightY, d.AnkleRightZ]);    	
      FootRight.push([d.FootRightX, d.FootRightY, d.FootRightZ]);  

  });    
  var frame = gup( 'frame' );
  if(frame==null) frame =0;
  updateData(frame);
  var axis = d3.svg.axis().orient("top").ticks(4);
  //var maxTime=Time[Time.length-1];
  //var a = maxTime.split(':'); // split it at the colons
  //var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
    
    
    slider=$( "#slider" ).slider({
        range: "max",
       min: 1,
        max: Time.length-1,
        value: frame,
        slide: function( event, ui ) {
          updateData(ui.value);
        plotData(5);
        }
    });
    
  $( "#frame" ).val( $( "#slider" ).slider( "value" ) );
  
  if(noButton){
    d3.select('#buttons').append('input')
        .attr('type', 'image')
        .attr('src', 'images/blue-play-button-md.png')
        .attr('class', 'play')
      .on("click", function(evt, value) {
        play = toggle(this);
        if(play){
          timer = window.setInterval(clock, 34);
          //console.log('start')
        }
        else{
          //console.log('clear')
          clearInterval(timer);
        }
      });
      noButton = false;
    };

  });
}

function init_kinect3d(){
  d3.csv("valuesforDD.csv", function(error, data) {
    var select = d3.select("#dataSelector")

    select
      .on("change", function(d) {
        csv_path = d3.select(this).property("value");
        console.log(csv_path)
        initializeDataGrid();
        initializePlot();
      });

    select.selectAll("option")
      .data(data)
      .enter()
        .append("option")
        .attr("value", function (d) { return d.value; })
        .text(function (d) { return d.label; });
    });
}

init_kinect3d();