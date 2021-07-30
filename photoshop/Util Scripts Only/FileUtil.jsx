var FileUtil = {};

FileUtil.saveJpg = function(dir, fileName, quality) {
  var folder = FileUtil.folder(dir);
  var jpgFile = new File(dir + '/' + fileName + '.jpg');
  jpgSaveOptions = new JPEGSaveOptions();
  jpgSaveOptions.embedColorProfile = true;
  jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
  jpgSaveOptions.matte = MatteType.NONE;
  jpgSaveOptions.quality = quality || 10;
  app.activeDocument.saveAs(jpgFile, jpgSaveOptions, true, Extension.LOWERCASE);
}

FileUtil.sortFiles = function(folder) {
  var selectedFileList = folder.getFiles(/\.(jpg|jpeg|cr2|ARW|psd|dng|png)$/i);
  if (!selectedFileList || selectedFileList.length < 2) {
    return alert("Please select a folder with 2 or more files you want to stack");
  }
  var filteredFileList = [];
  var uniqueFiles = {};
  for (var i in selectedFileList) {
    var file = selectedFileList[i];
    if (!uniqueFiles[StringUtil.stripOutInteger(file)]) {
      uniqueFiles[StringUtil.stripOutInteger(file)] = true;
      var cleanFile = File(String(file).replace("._", ""));
      filteredFileList.push(cleanFile);
    }
  }
  filteredFileList.sort(function(a, b) {
    return StringUtil.stripOutInteger(a) - StringUtil.stripOutInteger(b);
  });
  return filteredFileList;
}

FileUtil.openFileAsLayer = function(filePath) {
  var idPlc = charIDToTypeID( "Plc " );
  var desc516 = new ActionDescriptor();
  var idnull = charIDToTypeID( "null" );
  desc516.putPath( idnull, new File( filePath ) );
  var idFTcs = charIDToTypeID( "FTcs" );
  var idQCSt = charIDToTypeID( "QCSt" );
  var idQcsa = charIDToTypeID( "Qcsa" );
  desc516.putEnumerated( idFTcs, idQCSt, idQcsa );
  var idOfst = charIDToTypeID( "Ofst" );
  var desc517 = new ActionDescriptor();
  var idHrzn = charIDToTypeID( "Hrzn" );
  var idRlt = charIDToTypeID( "#Rlt" );
  desc517.putUnitDouble( idHrzn, idRlt, 0.000000 );
  var idVrtc = charIDToTypeID( "Vrtc" );
  var idRlt = charIDToTypeID( "#Rlt" );
  desc517.putUnitDouble( idVrtc, idRlt, 0.000000 );
  var idOfst = charIDToTypeID( "Ofst" );
  desc516.putObject( idOfst, idOfst, desc517 );
  executeAction( idPlc, desc516, DialogModes.NO );

  // =======================================================
  var idrasterizeLayer = stringIDToTypeID( "rasterizeLayer" );
  var desc518 = new ActionDescriptor();
  var idnull = charIDToTypeID( "null" );
  var ref440 = new ActionReference();
  var idLyr = charIDToTypeID( "Lyr " );
  var idOrdn = charIDToTypeID( "Ordn" );
  var idTrgt = charIDToTypeID( "Trgt" );
  ref440.putEnumerated( idLyr, idOrdn, idTrgt );
  desc518.putReference( idnull, ref440 );
  executeAction( idrasterizeLayer, desc518, DialogModes.NO );
}

FileUtil.putFilesIntoLayers = function(fileList, options, keepVisible) {
  var comboFolder = new Folder(options.selectedFolder + "/combine");
  var comboFileList = comboFolder.exists ? FileUtil.sortFiles(comboFolder) : [];
  for (var i = 0; i < fileList.length; i++) {
    if (i == 0 || options.action) {
      open(fileList[i]);
      if (!keepVisible && options.action) {
        if (comboFolder.exists && comboFileList.length > 0) {
          var comboFile = comboFileList[i];
          if (!comboFile) comboFile = comboFileList[comboFileList.length - 1]; // default to last
          FileUtil.openFileAsLayer(comboFile);
        }
        LayerUtil.runAction(options.action)
        // LayerUtil.runAction('SetupSky');
        // for (var j = 0; j <= i / 2; j++) {
        //   LayerUtil.runAction('spin');
        // }
        // LayerUtil.runAction('merge');
        FileUtil.saveJpg(options.outputDir + "/transformed", i);
      }
      LayerUtil.checkBackground();
      if (i > 0) {
        LayerUtil.duplicateLayer(app.documents[0].name);
        app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
      }
    } else {
      FileUtil.openFileAsLayer(fileList[i]);
    }
    var layer = activeDocument.layers[0];
    LayerUtil.setLayerLocked(layer, false);
    layer.name = 'Layer ' + i;
    layer.visible = keepVisible || false;
  }
  if (options.autoAlign && !keepVisible) {
    LayerUtil.selectAllLayers();
    alignLayersByContent(); // defined in StackSupport.jsx
    for (var i = 0; i < app.activeDocument.layers.length; i++) {
      var layer = app.activeDocument.layers[i];
      layer.visible = true;
      FileUtil.saveJpg(options.outputDir + "/aligned", layer.name);
      layer.visible = false;
    }
  }
}

FileUtil.folder = function(path) {
  var folder = new Folder(path);
  if (!folder.exists) {
    folder.create()
  }
  return folder;
}

FileUtil.exportVideo = function(fileList, options, outputDir, fileName) {

  var video = options.video.split("@");
  var height = parseInt(video[0]);
  var fps = parseInt(video[1]);
  function getWidth() {
    switch(height) {
      case 2304: return 3936;
      case 1080: return 1920;
      case 720: return 1280;
    }
  }
  var width = getWidth();

  LayerUtil.putLayersIntoTimeline()
  var mp4Folder = FileUtil.folder(outputDir);

  var idExpr = charIDToTypeID( "Expr" );
  var desc4 = new ActionDescriptor();
  var idUsng = charIDToTypeID( "Usng" );
  var desc5 = new ActionDescriptor();
  var iddirectory = stringIDToTypeID( "directory" );
  desc5.putPath( iddirectory, mp4Folder );
  var idNm = charIDToTypeID( "Nm  " );
  desc5.putString( idNm, fileName );
  var idameFormatName = stringIDToTypeID( "ameFormatName" );
  desc5.putString( idameFormatName, """H.264""" );
  var idamePresetName = stringIDToTypeID( "amePresetName" );
  desc5.putString( idamePresetName, """1_High Quality.epr""" );
  var idWdth = charIDToTypeID( "Wdth" );
  desc5.putInteger( idWdth, width );
  var idHght = charIDToTypeID( "Hght" );
  desc5.putInteger( idHght, height );
  var idframeRate = stringIDToTypeID( "frameRate" );
  desc5.putDouble( idframeRate, fps );
  var idpixelAspectRatio = stringIDToTypeID( "pixelAspectRatio" );
  var idpixelAspectRatio = stringIDToTypeID( "pixelAspectRatio" );
  var idDcmn = charIDToTypeID( "Dcmn" );
  desc5.putEnumerated( idpixelAspectRatio, idpixelAspectRatio, idDcmn );
  var idfieldOrder = stringIDToTypeID( "fieldOrder" );
  var idvideoField = stringIDToTypeID( "videoField" );
  var idpreset = stringIDToTypeID( "preset" );
  desc5.putEnumerated( idfieldOrder, idvideoField, idpreset );
  var idmanage = stringIDToTypeID( "manage" );
  desc5.putBoolean( idmanage, true );
  var idallFrames = stringIDToTypeID( "allFrames" );
  desc5.putBoolean( idallFrames, true );
  var idrenderAlpha = stringIDToTypeID( "renderAlpha" );
  var idalphaRendering = stringIDToTypeID( "alphaRendering" );
  var idNone = charIDToTypeID( "None" );
  desc5.putEnumerated( idrenderAlpha, idalphaRendering, idNone );
  var idQlty = charIDToTypeID( "Qlty" );
  desc5.putInteger( idQlty, 1 );
  var idvideoExport = stringIDToTypeID( "videoExport" );
  desc4.putObject( idUsng, idvideoExport, desc5 );
  executeAction( idExpr, desc4, DialogModes.NO );
}
