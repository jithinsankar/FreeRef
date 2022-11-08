import { fabric } from "fabric";
var canvasWrapper = document.getElementById('canvas-wrapper');
var canvas = new fabric.Canvas("c",{
     backgroundColor: '#333',
    HOVER_CURSOR: 'pointer'
  });
  

// canvas.setWidth(1000);
// canvas.setWidth(document.body.scrollWidth);
// canvas.setHeight(400)

// var bg = new fabric.Rect({ width: 300, height: 300, strokeWidth: 10, fill: 'pink', evented: false, selectable: false });
// bg.fill = new fabric.Pattern({ source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAASElEQVQ4y2NkYGD4z0A6+M3AwMBKrGJWBgYGZiibEQ0zIInDaCaoelYyHYcX/GeitomjBo4aOGrgQBj4b7RwGFwGsjAwMDAAAD2/BjgezgsZAAAAAElFTkSuQmCC' },
// // bg.fill = new fabric.Pattern({ source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABMSURBVDhPYwwNDWUgEQQGBkZGRgIZTBA+SeDQoUMfP34EMpi1tbUhQsSD79+/Hzt27PPnz+Q4Gw7IcTYcjGomEYxqJhGMaiYJMDAAADW/Ec6kM/QIAAAAAElFTkSuQmCC' },
//  function() { bg.dirty = true; canvas.requestRenderAll() });
// // bg.fill = '#333'
// bg.canvas = canvas;
// var bg = new fabric.Rect({ width: 300, height: 300, strokeWidth: 10, fill: 'pink', evented: false, selectable: false });
// bg.fill = new fabric.Pattern({ source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAASElEQVQ4y2NkYGD4z0A6+M3AwMBKrGJWBgYGZiibEQ0zIInDaCaoelYyHYcX/GeitomjBo4aOGrgQBj4b7RwGFwGsjAwMDAAAD2/BjgezgsZAAAAAElFTkSuQmCC' },
// // bg.fill = new fabric.Pattern({ source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABMSURBVDhPYwwNDWUgEQQGBkZGRgIZTBA+SeDQoUMfP34EMpi1tbUhQsSD79+/Hzt27PPnz+Q4Gw7IcTYcjGomEYxqJhGMaiYJMDAAADW/Ec6kM/QIAAAAAElFTkSuQmCC' },
//  function() { bg.dirty = true; canvas.requestRenderAll() });
// // bg.fill = '#333'
// bg.canvas = canvas;



const imgWidth = 50;

const polka_ctx = document.createElement("canvas");
polka_ctx.width = imgWidth;
polka_ctx.height = imgWidth;

const ctx = polka_ctx.getContext('2d');
ctx.fillStyle = '#333';
ctx.fillRect(0,0,imgWidth,imgWidth);
ctx.beginPath();
ctx.arc(5,5,1,0,2*Math.PI);
ctx.strokeStyle = "gray"
ctx.stroke();

const polka_ctx_url = polka_ctx.toDataURL();



const myImage = new Image(10, 10);
// myImage.src = 'static/images/GitHub-Mark-Light-32px.png';
myImage.src = 'static/images/polka.png'

const bgUrl = myImage;
canvas.setBackgroundColor(
  {source: polka_ctx_url, repeat: 'repeat'}, 
  canvas.renderAll.bind(canvas),
);

// canvas.backgroundImage = bg;

var text = new fabric.Textbox('Enter text here', {
            width:250,
            cursorColor :"gray",
            top:10,
            left:10,
            fontFamily:'Inter',
        });
text.set({fill: 'white'})
canvas.add(text)

//https://stackoverflow.com/a/73555340
canvas.on('drop', function(event) {
    
    // prevent the file to open in new tab
    
    event.e.stopPropagation();
    event.e.stopImmediatePropagation();
    event.e.preventDefault();

    // Use DataTransfer interface to access the file(s)
    
    if(event.e.dataTransfer.files.length > 0){

        var files = event.e.dataTransfer.files;
        
        for (var i = 0, f; f = files[i]; i++) {

            // Only process image files.
            
            if (f.type.match('image.*')) {            
                
                // Read the File objects in this FileList.
                
                var reader = new FileReader();
                
                // listener for the onload event
                
                reader.onload = function(evt) {
                    
                    // put image on canvas
                    
                    fabric.Image.fromURL(evt.target.result, function(obj) {
                        
                        //obj.scaleToHeight(canvas.height);
        
                        obj.set('strokeWidth',0);
                        
                        canvas.add(obj);       
                    
                    });
                };
               
                // Read in the image file as a data URL.
               
                reader.readAsDataURL(f);
            }
        }
    }  
}); 
canvas.on('mouse:wheel', function(opt) {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 2) zoom = 2;
    if (zoom < 0.3) zoom = 0.3;
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
    var vpt = this.viewportTransform;
    if (zoom < 0.4) {
      vpt[4] = 200 - 1000 * zoom / 2;
      vpt[5] = 200 - 1000 * zoom / 2;
    } else {
      if (vpt[4] >= 0) {
        vpt[4] = 0;
      } else if (vpt[4] < canvas.getWidth() - 1000 * zoom) {
        vpt[4] = canvas.getWidth() - 1000 * zoom;
      }
      if (vpt[5] >= 0) {
        vpt[5] = 0;
      } else if (vpt[5] < canvas.getHeight() - 1000 * zoom) {
        vpt[5] = canvas.getHeight() - 1000 * zoom;
      }
    }
  });




  
canvas.on('mouse:down', function(opt) {
var evt = opt.e;
if (evt.altKey === true) {
    this.isDragging = true;
    this.selection = false;
    this.lastPosX = evt.clientX;
    this.lastPosY = evt.clientY;
}
});
canvas.on('mouse:move', function(opt) {
if (this.isDragging) {
    var e = opt.e;
    var zoom = canvas.getZoom();
    var vpt = this.viewportTransform;
    if (zoom < 0.4) {
    vpt[4] = 200 - 1000 * zoom / 2;
    vpt[5] = 200 - 1000 * zoom / 2;
    } else {
    vpt[4] += e.clientX - this.lastPosX;
    vpt[5] += e.clientY - this.lastPosY;
    if (vpt[4] >= 0) {
        vpt[4] = 0;
    } else if (vpt[4] < canvas.getWidth() - 1000 * zoom) {
        vpt[4] = canvas.getWidth() - 1000 * zoom;
    }
    if (vpt[5] >= 0) {
        vpt[5] = 0;
    } else if (vpt[5] < canvas.getHeight() - 1000 * zoom) {
        vpt[5] = canvas.getHeight() - 1000 * zoom;
    }
    }
    this.requestRenderAll();
    this.lastPosX = e.clientX;
    this.lastPosY = e.clientY;
}
});
canvas.on('mouse:up', function(opt) {
this.setViewportTransform(this.viewportTransform);
this.isDragging = false;
this.selection = true;
});



canvas.on('mouse:up', function(opt) {
  this.setViewportTransform(this.viewportTransform);
  this.isDragging = false;
  this.selection = true;
  });


// canvas.addEventListener("keydown", checkDelete, false);
// //https://stackoverflow.com/a/71201986
// document.onkeydown=function checkDelete(e) {
//   console.log("activated");
//   if (
//     e.key == 'Delete' ||
//     e.code == 'Delete' ||
//     e.key == 'Backspace'
//   ) {
//     if (canvas.getActiveObject()) {
//       if (canvas.getActiveObject().isEditing) {
//         return
//       }
//       canvas.remove(canvas.getActiveObject());
//     }
//   }
// }
// https://codepen.io/agenziabrand/details/QWLKMWz
function Copy() {
  if(canvas.getActiveObject() === null){
    return;
  }
  canvas.getActiveObject().clone(function(cloned) {
    //push cloned object into clipboard
    _clipboard = cloned;
  });
}

function Cut() {
  if(canvas.getActiveObject() === null){
    return;
  }
  canvas.getActiveObject().clone(function(cloned) {
    _clipboard = cloned;
    //remove after cloned to clipboard
    canvas.remove(canvas.getActiveObject());
  });
  

}

function Paste() {
  
  if(_clipboard === false){
    return;
  }
  // clone again, so you can do multiple copies.
  _clipboard.clone(function(clonedObj) {
    canvas.discardActiveObject();
    clonedObj.set({
      left: clonedObj.left + 10,
      top: clonedObj.top + 10,
      evented: true,
    });
    if (clonedObj.type === 'activeSelection') {
      // active selection needs a reference to the canvas.
      clonedObj.canvas = canvas;
      clonedObj.forEachObject(function(obj) {
        canvas.add(obj);
      });
      // this should solve the unselectability
      clonedObj.setCoords();
    } else {
      canvas.add(clonedObj);
    }
    _clipboard.top += 10;
    _clipboard.left += 10;
    canvas.setActiveObject(clonedObj);
    canvas.requestRenderAll();
  });
}

function Del()  {
 
    if (canvas.getActiveObjects()) {
      if (canvas.getActiveObject().isEditing) {
        return
      }
      canvas.remove(...canvas.getActiveObjects());
      canvas.discardActiveObject()
    }
    
  
}

function newImage(){


  if (canvas.getActiveObject()) {
    if (canvas.getActiveObject().isEditing) {
      
      return
    }
  }
  
  // fabric.Image.fromURL('https://source.unsplash.com/random/300x203', function(img) {
  fabric.Image.fromURL('http://placekitten.com/200/300', function(img) {
    img.set({
        // id : 'image_'+index,
        width : canvas.width / 2,
        height : canvas.height / 2
    });
    canvas.add(img).renderAll().setActiveObject(img);
},
{ crossOrigin: "anonymous" });
}

function newText(){


  if (canvas.getActiveObject()) {
    if (canvas.getActiveObject().isEditing) {
      
      return
    }
  }
  
  let newText = new fabric.Textbox('Enter text here', {
    width:250,
    cursorColor :"gray",
    top:10,
    left:10,
    fontFamily:'Inter',
    fill: 'white',
    
  })
  
  canvas.add(newText);
  canvas.setActiveObject(newText)

}



var _clipboard = false;


window.onload = function() {
  
    var ctrlDown = false,
        shiftDown = false,
        ctrlKey = 17,
        cmdKey = 91,
        delKey = 8,
        shiftKey = 16,
        vKey = 86,
        xKey = 88,
        cKey = 67,
        nKey  = 78,
        iKey  = 73,
        zKey  = 90,
        yKey  = 89,
        tKey  = 84;
  
    document.addEventListener('keydown', function(e) {
      
      console.log(e.keyCode);
      
      if (e.keyCode == ctrlKey || e.keyCode == cmdKey){
        ctrlDown = true;
      } 
      if (e.keyCode == shiftKey){
        shiftDown = true;
      } 
       
      if (ctrlDown && (e.keyCode == cKey)){
        Copy();
      } 
      if (ctrlDown && (e.keyCode == xKey)){
        Cut();
      } 
      if (ctrlDown && (e.keyCode == vKey)) {
        Paste();
      }
      if (ctrlDown && (e.keyCode == zKey) && !shiftDown) {
        undo();
      }
      if (ctrlDown && (e.keyCode == zKey) && shiftDown) {
        redo();
      }

      if(e.keyCode == delKey){
        Del(e);
      }
      if(e.keyCode == nKey){
       newText();
      }
      if(e.keyCode == iKey){
       newImage();
      }
      
    }, false);
  
    document.addEventListener('keyup', function(e) {
       
      if (e.keyCode == ctrlKey || e.keyCode == cmdKey){
          ctrlDown = false;
        
      } 
      if (e.keyCode == shiftKey ){
          shiftDown = false;
        
      } 
      
    }, false);
  
}

//https://github.com/abhi06991/Undo-Redo-Fabricjs
var _config = {
  canvasState             : [],
  currentStateIndex       : -1,
  undoStatus              : false,
  redoStatus              : false,
  undoFinishedStatus      : 1,
  redoFinishedStatus      : 1,

};
canvas.on(
  'object:modified', function(){
      updateCanvasState();
  }
);

canvas.on(
  'object:added', function(){
      updateCanvasState();
  }
);

var updateCanvasState = function() {
  if((_config.undoStatus == false && _config.redoStatus == false)){
      var jsonData        = canvas.toJSON();
      var canvasAsJson        = JSON.stringify(jsonData);
      if(_config.currentStateIndex < _config.canvasState.length-1){
          var indexToBeInserted                  = _config.currentStateIndex+1;
          _config.canvasState[indexToBeInserted] = canvasAsJson;
          var numberOfElementsToRetain           = indexToBeInserted+1;
          _config.canvasState                    = _config.canvasState.splice(0,numberOfElementsToRetain);
      }else{
      _config.canvasState.push(canvasAsJson);
      }
  _config.currentStateIndex = _config.canvasState.length-1;
if((_config.currentStateIndex == _config.canvasState.length-1) && _config.currentStateIndex != -1){

}
  }
}


var undo = function() {
  if(_config.undoFinishedStatus){
      if(_config.currentStateIndex == -1){
      _config.undoStatus = false;
      }
      else{
      if (_config.canvasState.length >= 1) {
      _config.undoFinishedStatus = 0;
        if(_config.currentStateIndex != 0){
              _config.undoStatus = true;
            canvas.loadFromJSON(_config.canvasState[_config.currentStateIndex-1],function(){
                          var jsonData = JSON.parse(_config.canvasState[_config.currentStateIndex-1]);
                      canvas.renderAll();
                  _config.undoStatus = false;
                  _config.currentStateIndex -= 1;
                      _config.undoFinishedStatus = 1;
          });
        }
        else if(_config.currentStateIndex == 0){
           canvas.clear();
           console.log("cleared")
           canvas.backgroundColor="#333";
                  _config.undoFinishedStatus = 1;
          _config.currentStateIndex -= 1;
        }
      }
      }
  }
}

var redo = function() {
  if(_config.redoFinishedStatus){
      if((_config.currentStateIndex == _config.canvasState.length-1) && _config.currentStateIndex != -1){
      }else{
      if (_config.canvasState.length > _config.currentStateIndex && _config.canvasState.length != 0){
              _config.redoFinishedStatus = 0;
          _config.redoStatus = true;
        canvas.loadFromJSON(_config.canvasState[_config.currentStateIndex+1],function(){
                      var jsonData = JSON.parse(_config.canvasState[_config.currentStateIndex+1]);
                  canvas.renderAll();
                  _config.redoStatus = false;
              _config.currentStateIndex += 1;
                  _config.redoFinishedStatus = 1;

        });
      }
      }
  }
}

// https://codepen.io/morrowsend/pen/JgmBQj?editors=1010
var imageSaver = document.getElementById('download');
imageSaver.addEventListener('click', saveImage, false);

function saveImage(e) {
  var link = document.createElement("a");
  var imgData = canvas.toDataURL({format:"png", quality:0.8});
  var strDataURI = imgData.substr(22, imgData.length);
  var blob = dataURLtoBlob(imgData);
  var objurl = URL.createObjectURL(blob);

  link.download = "canvas.png";
  link.href = objurl;
  link.click();
}

function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}

const saveBtn = document.querySelector('#save')
saveBtn.addEventListener('click', save)
function save () {
  console.log("ran");
  saveJSON = JSON.stringify(canvas)
  console.log(saveJSON)
  localStorage.setItem("canvas_drawing", saveJSON);
}

const loadBtn = document.querySelector('#load')
loadBtn.addEventListener('click', load)
function load () {
  var dta = localStorage.getItem("canvas_drawing")
  console.log(dta)
  canvas.loadFromJSON(dta);
}
const clearlocalBtn = document.querySelector('#clearlocal')
clearlocalBtn.addEventListener('click', clearlocal)
function clearlocal () {
  localStorage.clear();
}

document.addEventListener('DOMContentLoaded', function () 
{
const width  = window.innerWidth || document.documentElement.clientWidth || 
document.body.clientWidth;
const height = window.innerHeight|| document.documentElement.clientHeight|| 
document.body.clientHeight;

console.log(width, height);
// document.getElementById('c').setAttribute("style",`width:${width}px;height:${height}px`);

  if(localStorage.getItem("canvas_drawing"))
  {canvas.loadFromJSON(localStorage.getItem("canvas_drawing"))}
}, false);


// https://codepen.io/technokami/pen/RwWYOzQ?editors=1010
const menu = document.getElementById('menu')
const outClick = document.getElementById('out-click')

canvasWrapper.addEventListener('contextmenu', e => {
  e.preventDefault()

  menu.style.top = `${e.clientY}px`
  menu.style.left = `${e.clientX}px`
  menu.classList.add('show')

  outClick.style.display = "block"
})
canvasWrapper.addEventListener('click', () => {
  menu.classList.remove('show')
  outClick.style.display = "none"
})

menu.addEventListener('click',e=>{
  menu.classList.remove('show')

});