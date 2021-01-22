var LayerUtil = {};

LayerUtil.runAction = function(action, actionSet) {
  if (!action) return;
  var idPly = charIDToTypeID( "Ply " );
  var desc12 = new ActionDescriptor();
  var idnull = charIDToTypeID( "null" );
  var ref9 = new ActionReference();
  var idActn = charIDToTypeID( "Actn" );
  ref9.putName( idActn, action || "Action" );
  var idASet = charIDToTypeID( "ASet" );
  ref9.putName( idASet, actionSet || "Stacker" );
  desc12.putReference( idnull, ref9 );
  executeAction( idPly, desc12, DialogModes.NO );
}

LayerUtil.checkBackground = function() {
  activeDocument.activeLayer = activeDocument.layers[activeDocument.layers.length-1];
  if (activeDocument.activeLayer.isBackgroundLayer) {
    activeDocument.activeLayer.name = activeDocument.activeLayer.name;
  }
}

LayerUtil.deleteLayer = function(layer) {
  if(!layer.visisible) layer.visible = true;
  if(layer.locked) layer.locked = false;
  layer.remove();
}

LayerUtil.selectAllLayers = function() {
  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
  desc.putReference( charIDToTypeID('null'), ref );
  executeAction( stringIDToTypeID('selectAllLayers'), desc, DialogModes.NO );
}

LayerUtil.duplicateLayer = function(DocName) {
  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
  desc.putReference( charIDToTypeID('null'), ref );
  var ref2 = new ActionReference();
  ref2.putName( charIDToTypeID('Dcmn'), DocName);
  desc.putReference( charIDToTypeID('T   '), ref2 );
  desc.putInteger( charIDToTypeID('Vrsn'), 5 );
  executeAction( charIDToTypeID('Dplc'), desc, DialogModes.NO );
}

LayerUtil.mergeLayers = function() {
  LayerUtil.selectAllLayers() ;
  activeDocument.activeLayer.merge();
}


LayerUtil.restoreDefaultLayers = function(start, end) {
  for (var index = start; index <= end; index++) {
    var layer = activeDocument.layers[index];
    layer.blendMode = BlendMode.NORMAL;
    layer.visible = true;
    layer.opacity = 100;
    LayerUtil.deleteMask(layer);
  }
}

LayerUtil.hideLayers = function(start, end) {
  if (!end || end >= activeDocument.layers.length) {
    end = activeDocument.layers.length - 1;
  }
  for (var index = start; index <= end; index++) {
    var layer = activeDocument.layers[index];
    LayerUtil.selectSingleLayer(layer);
    layer.visible = false;
    LayerUtil.deleteMask(layer);
  }
}


LayerUtil.selectArea = function(x, y, w, h) {
  if ( !x || x < 0 ) x = 0;
  if ( !y || y < 0 ) y = 0;
  if ( !w || x + w > activeDocument.width ) w = activeDocument.width - x;
  if ( !h || y + h > activeDocument.height ) h = activeDocument.height - y;
  activeDocument.selection.select([ [x,y], [x,y+h], [x+w,y+h], [x+w,y] ]);
}

LayerUtil.createMask = function() {
  var maskType = 'RvlS' ; //from selection
  //requires a selection 'RvlS'  complete mask 'RvlA' otherThanSelection 'HdSl'
  var desc140 = new ActionDescriptor();
  desc140.putClass( charIDToTypeID('Nw  '), charIDToTypeID('Chnl') );
  var ref51 = new ActionReference();
  ref51.putEnumerated( charIDToTypeID('Chnl'), charIDToTypeID('Chnl'), charIDToTypeID('Msk ') );
  desc140.putReference( charIDToTypeID('At  '), ref51 );
  desc140.putEnumerated( charIDToTypeID('Usng'), charIDToTypeID('UsrM'), charIDToTypeID(maskType) );
  executeAction( charIDToTypeID('Mk  '), desc140, DialogModes.NO );
}

LayerUtil.selectLayerMask = function(layer) {
  var idslct = charIDToTypeID( "slct" );
  var desc58 = new ActionDescriptor();
  var idnull = charIDToTypeID( "null" );
  var ref43 = new ActionReference();
  var idChnl = charIDToTypeID( "Chnl" );
  var idChnl = charIDToTypeID( "Chnl" );
  var idMsk = charIDToTypeID( "Msk " );
  ref43.putEnumerated( idChnl, idChnl, idMsk );
  var idLyr = charIDToTypeID( "Lyr " );
  ref43.putName( idLyr, layer.name );
  desc58.putReference( idnull, ref43 );
  var idMkVs = charIDToTypeID( "MkVs" );
  desc58.putBoolean( idMkVs, false );
  executeAction( idslct, desc58, DialogModes.NO );
}

LayerUtil.hasMask = function() {
  var ref = new ActionReference();
  ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
  var desc = executeActionGet(ref);
  return desc.hasKey(charIDToTypeID("UsrM"));
}

LayerUtil.deleteMask = function(layer) {
  if (LayerUtil.hasMask()) {
    LayerUtil.selectLayerMask(layer);
    var idDlt = charIDToTypeID( "Dlt " );
    var desc15 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref10 = new ActionReference();
    var idChnl = charIDToTypeID( "Chnl" );
    var idOrdn = charIDToTypeID( "Ordn" );
    var idTrgt = charIDToTypeID( "Trgt" );
    ref10.putEnumerated( idChnl, idOrdn, idTrgt );
    desc15.putReference( idnull, ref10 );
    executeAction( idDlt, desc15, DialogModes.NO );
  }
}

LayerUtil.applyNormalEffect = function(options, start, end) {
  for (var index = start; index <= end; index++) {
    var layer = activeDocument.layers[index];
    layer.blendMode = index == end ? BlendMode.NORMAL : options.blendMode;
    layer.visible = true;
    layer.opacity = 100;
  }
}

LayerUtil.fill = function() {
  var idFl = charIDToTypeID( "Fl  " );
  var desc123 = new ActionDescriptor();
  var idUsng = charIDToTypeID( "Usng" );
  var idFlCn = charIDToTypeID( "FlCn" );
  var idFrgC = charIDToTypeID( "FrgC" );
  desc123.putEnumerated( idUsng, idFlCn, idFrgC );
  var idOpct = charIDToTypeID( "Opct" );
  var idPrc = charIDToTypeID( "#Prc" );
  desc123.putUnitDouble( idOpct, idPrc, 100.000000 );
  var idMd = charIDToTypeID( "Md  " );
  var idBlnM = charIDToTypeID( "BlnM" );
  var idNrml = charIDToTypeID( "Nrml" );
  desc123.putEnumerated( idMd, idBlnM, idNrml );
  executeAction( idFl, desc123, DialogModes.NO );
}

LayerUtil.selectWhite = function() {// =======================================================
  var idsetd = charIDToTypeID( "setd" );
  var desc130 = new ActionDescriptor();
  var idnull = charIDToTypeID( "null" );
  var ref14 = new ActionReference();
  var idClr = charIDToTypeID( "Clr " );
  var idFrgC = charIDToTypeID( "FrgC" );
  ref14.putProperty( idClr, idFrgC );
  desc130.putReference( idnull, ref14 );
  var idT = charIDToTypeID( "T   " );
  var desc131 = new ActionDescriptor();
  var idH = charIDToTypeID( "H   " );
  var idAng = charIDToTypeID( "#Ang" );
  desc131.putUnitDouble( idH, idAng, 0.000000 );
  var idStrt = charIDToTypeID( "Strt" );
  desc131.putDouble( idStrt, 0.000000 );
  var idBrgh = charIDToTypeID( "Brgh" );
  desc131.putDouble( idBrgh, 100.000000 );
  var idHSBC = charIDToTypeID( "HSBC" );
  desc130.putObject( idT, idHSBC, desc131 );
  var idSrce = charIDToTypeID( "Srce" );
  desc130.putString( idSrce, """photoshopPicker""" );
  executeAction( idsetd, desc130, DialogModes.NO );
}


LayerUtil.applyTileBendEffect = function(options, start, end, vertex) {
  var stackSize = end - start + 1;
  var width = activeDocument.width;
  var height = activeDocument.height;
  var y = 0;
  var w = width / stackSize;
  var h = height;
  function maskLayer(layer, x, y, w, h) {
    layer.blendMode = options.blendMode;
    layer.visible = true;
    LayerUtil.selectSingleLayer(layer);
    if (!LayerUtil.hasMask()) {
      LayerUtil.selectArea(x - 1, y, w + 2, h);
      LayerUtil.createMask();
    } else {
        LayerUtil.selectLayerMask(layer);
        LayerUtil.selectWhite();
        LayerUtil.selectArea(x - 1, y, w + 2, h);
        LayerUtil.fill();
    }
  }
  var isReverse = true;
  var layerIndex = isReverse ? 1 : activeDocument.layers.length - 2;
  for (var index = vertex - 1; index >= 0; index--) {
    var x = index * w;
    var layer = activeDocument.layers[layerIndex];
    maskLayer(layer, x, y, w, h);
    isReverse ? layerIndex++ : layerIndex--;
  }
  layerIndex = isReverse ? 0 : activeDocument.layers.length - 1;
  for (var index = vertex; index <= end; index++) {
    var x = index * w;
    var layer = activeDocument.layers[layerIndex];
    maskLayer(layer, x, y, w, h);
    isReverse ? layerIndex++ : layerIndex--;
  }
}

LayerUtil.applyTileEffect = function(options, start, end) {
  var stackSize = end - start + 1;
  var width = activeDocument.width;
  var height = activeDocument.height;
  var x = 0;
  var y = 0;
  var w = width / stackSize;
  var h = height;
  for (var index = start; index <= end; index++) {
    var layer = activeDocument.layers[index];
    layer.blendMode = options.blendMode;
    layer.visible = true;
    LayerUtil.selectSingleLayer(layer);
    LayerUtil.deleteMask(layer);
    LayerUtil.selectArea(x - 1, y, w + 2, h);
    LayerUtil.createMask();
    x += w;
  }
}

LayerUtil.applyReverseTileEffect = function(options, start, end) {
  var stackSize = end - start + 1;
  var width = activeDocument.width;
  var height = activeDocument.height;
  var y = 0;
  var w = width / stackSize;
  var h = height;
  var x = width - w;
  for (var index = start; index <= end; index++) {
    var layer = activeDocument.layers[index];
    layer.blendMode = options.blendMode;
    layer.visible = true;
    LayerUtil.selectSingleLayer(layer);
    LayerUtil.deleteMask(layer);
    LayerUtil.selectArea(x - 1, y, w + 2, h);
    LayerUtil.createMask();
    x -= w;
  }
}


LayerUtil.lightenAllLayers = function() {
  alert("start")
  LayerUtil.hideLayers(0);
  var start = 0;
  var end = activeDocument.layers.length -1;
  LayerUtil.applyCommetEffect({blendMode: BlendMode.NORMAL}, start, end);
  alert("end")
}

LayerUtil.applyCommetEffect = function(options, start, end) {
  var opacity = 100;
  var increments = 100 / (end - start + 1);
  for (var index = start; index <= end; index++) {
    var layer = activeDocument.layers[index];
    layer.blendMode = options.blendMode;
    layer.visible = true;
    layer.opacity = opacity;
    opacity -= increments;
  }
}

LayerUtil.applyReverseCommetEffect = function(options, start, end) {
  Log.info("applyReverseCommetEffect start=" + start + " end=" + end);
  var opacity = 100;
  var increments = 100 / (end - start + 1);
  for (var index = end; index >= start; index--) {
    var layer = activeDocument.layers[index];
    layer.blendMode = options.blendMode;
    layer.visible = true;
    layer.opacity = opacity;
    opacity -= increments;
  }
}

LayerUtil.alignLayers = function(options) {
  function align() {
    var idAlgn = charIDToTypeID( "Algn" );
    var desc242 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref240 = new ActionReference();
    var idLyr = charIDToTypeID( "Lyr " );
    var idOrdn = charIDToTypeID( "Ordn" );
    var idTrgt = charIDToTypeID( "Trgt" );
    ref240.putEnumerated( idLyr, idOrdn, idTrgt );
    desc242.putReference( idnull, ref240 );
    var idUsng = charIDToTypeID( "Usng" );
    var idADSt = charIDToTypeID( "ADSt" );
    var idADSContent = stringIDToTypeID( "ADSContent" );
    desc242.putEnumerated( idUsng, idADSt, idADSContent );
    var idAply = charIDToTypeID( "Aply" );
    var idprojection = stringIDToTypeID( "projection" );
    var idAuto = charIDToTypeID( "Auto" );
    desc242.putEnumerated( idAply, idprojection, idAuto );
    var idvignette = stringIDToTypeID( "vignette" );
    desc242.putBoolean( idvignette, false );
    var idradialDistort = stringIDToTypeID( "radialDistort" );
    desc242.putBoolean( idradialDistort, false );
    executeAction( idAlgn, desc242, DialogModes.NO );
  }

  var size = app.activeDocument.layers.length;
  var layer0 = app.activeDocument.layers[0];
  layer0.visible = true;
  LayerUtil.setLayerLocked(layer0, true);
  for (var i = 1; i < size; i++) {
    var layer = app.activeDocument.layers[i];
    layer.visible = true;
    LayerUtil.selectSingleLayer(layer0);
    LayerUtil.addToLayerSelection(layer);
    align();
    layer.visible = false;
  }
  LayerUtil.setLayerLocked(layer0, false);
  for (var i = 0; i < size; i++) {
    var layer = app.activeDocument.layers[i];
    layer.visible = true;
    FileUtil.saveJpg(options.outputDir + "/aligned", layer.name);
    layer.visible = false;
  }
}

LayerUtil.applyEffect = function(options, i, j, k) {
  switch (options.effect) {
    case 'normal': return LayerUtil.applyNormalEffect(options, j, i);
    case 'reverseCommet': return LayerUtil.applyReverseCommetEffect(options, j, i);
    case "commet": return LayerUtil.applyCommetEffect(options, j, i);
    case "tile": return LayerUtil.applyTileEffect(options, j, i);
    case "tileBend": return LayerUtil.applyTileBendEffect(options, j, i, k);
    case "reverseTile": return LayerUtil.applyReverseTileEffect(options, j, i);
  }
}

LayerUtil.setLayerLocked = function(layer, isLocked) {
  layer.allLocked = isLocked;
  layer.pixelsLocked = isLocked;
  layer.positionLocked = isLocked;
  layer.transparentPixelsLocked = isLocked;
}

LayerUtil.selectSingleLayer = function(layer) {
  var idslct = charIDToTypeID( "slct" );
  var desc8 = new ActionDescriptor();
  var idnull = charIDToTypeID( "null" );
  var ref3 = new ActionReference();
  var idLyr = charIDToTypeID( "Lyr " );
  ref3.putName( idLyr, layer.name );
  desc8.putReference( idnull, ref3 );
  var idMkVs = charIDToTypeID( "MkVs" );
  desc8.putBoolean( idMkVs, false );
  executeAction( idslct, desc8, DialogModes.NO );
}

LayerUtil.addToLayerSelection = function(layer) {
  var idslct = charIDToTypeID( "slct" );
  var desc18 = new ActionDescriptor();
  var idnull = charIDToTypeID( "null" );
  var ref11 = new ActionReference();
  var idLyr = charIDToTypeID( "Lyr " );
  ref11.putName( idLyr, layer.name );
  desc18.putReference( idnull, ref11 );
  var idselectionModifier = stringIDToTypeID( "selectionModifier" );
  var idselectionModifierType = stringIDToTypeID( "selectionModifierType" );
  var idaddToSelection = stringIDToTypeID( "addToSelection" );
  desc18.putEnumerated( idselectionModifier, idselectionModifierType, idaddToSelection );
  var idMkVs = charIDToTypeID( "MkVs" );
  desc18.putBoolean( idMkVs, false );
  executeAction( idslct, desc18, DialogModes.NO );
}

LayerUtil.putLayersIntoTimeline = function() {
  var idmakeFrameAnimation = stringIDToTypeID( "makeFrameAnimation" );
  executeAction( idmakeFrameAnimation, undefined, DialogModes.NO );
  var idanimationFramesFromLayers = stringIDToTypeID( "animationFramesFromLayers" );
  var desc2665 = new ActionDescriptor();
  executeAction( idanimationFramesFromLayers, desc2665, DialogModes.NO );
}
