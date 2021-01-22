var fileList;
var outputDir;


function Stacker(args) {

  // function test(args) {
  //   selectedFolder = new Folder(args[0]);
  //   var options = StackerOptions.init(args[1]);
  //   // fileList = FileUtil.sortFiles(selectedFolder).reverse();
  //   LayerUtil.applyEffect(options, fileList.length - 1, 0, null);
  //   // goStack(options);
  //   // options.outputDir = selectedFolder + "/test";
  //   // FileUtil.putFilesIntoLayers(fileList, options);
  //   // FileUtil.exportVideo(fileList, options, options.outputDir + "/mp4", "original-" + options.video + ".mp4")
  // }
  // return test(args);

  if (app.documents && app.documents.length > 0) {
    var c = confirm("All open documents must be closed before continuing. Would you like to continue and close all open documents without saving?");
    if (!c) return;
    while(app.documents && app.documents.length > 0) {
      app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    }
  }
  var selectedFolder;
  if (args.length < 1) {
    selectedFolder = Folder.selectDialog( "Please select input folder");
    if (selectedFolder !== null)  {
      fileList = FileUtil.sortFiles(selectedFolder);
    }
    if (!fileList) return;
    StackerOptions.getOptions(goStack);
  } else {
    selectedFolder = new Folder(args[0]);
    var options = StackerOptions.init(args[1]);
    options.selectedFolder = selectedFolder;
    fileList = FileUtil.sortFiles(selectedFolder);
    goStack(options);
  }

  function goStack(options) {
    var defaultRulerUnits = app.preferences.rulerUnits;
    app.preferences.rulerUnits = Units.PIXELS;
    var time = Date.now();
    outputDir = selectedFolder + "/stacks-of-" + options.stackLength;
    FileUtil.folder(outputDir);
    alert("Stacking " + fileList.length + " files!")
    stack(fileList, outputDir, options);
    time = (Date.now() - time) / (1000 * 60);
    alert("Finished Stacking in " + parseFloat(time).toFixed(2) + " minutes!");
    app.preferences.rulerUnits = defaultRulerUnits;
  }

  /**
  Create an array of indecies to stack, e.g [{i,j},{i,j},{i,j}]
  **/
  function createStackArray(fileList, options) {
    var growthList = [];
    var constantList = [];
    var decayList = [];
    var hasGrowth = "13".indexOf(options.stackGrowth) != -1;
    var hasDecay = "23".indexOf(options.stackGrowth) != -1;
    var hasOverlap = hasGrowth && hasDecay && fileList.length < (options.stackLength * 3);
    var growEvery = options.growEvery;
    var start = fileList.length - 1;
    var end = 0;
    if (options.stackOnce) {
      return [{i: start, j: end}];
    }
    if (options.effect == "tileBend") {
      for (var i = 0; i < fileList.length; i++) {
        constantList.push({i: start, j:end});
      }
      return constantList;
    }
    if (hasOverlap) {
      alert("Warning: The stack length of " + options.stackLength + " is not obtainable with only " + fileList.length + " files. The rate of change will be increased.");
      // options.displacement++;
      growEvery++;
    }
    if (hasGrowth) {
      var i = start;
      var j = i - 1;
      var count = 0;
      while (i - j < options.stackLength && j >= 0) {
        growthList.push({i:i,j:j})
        j -= options.displacement;
        count++;
        if (growEvery > 1 && count % growEvery == 0) i--;
      }
      start = i;
      if (j == 0) {
        alert("Warning: The stack length of " + options.stackLength + " is not obtainable with only " + fileList.length + " files");
        return growthList;
      }
    }
    if (hasDecay) {
      var j = end;
      var i = j + 1;
      var count = 0;
      while (i - j <= options.stackLength && i < fileList.length) {
        decayList.push({i:i,j:j})
        i += options.displacement;
        count++;
        if (growEvery > 1 && count % growEvery == 0) j++;
      }
      end = (growEvery > 1 && count % growEvery != 0) ? j + 1 : j;
      if (i == fileList.length) {
        alert("Warning: The stack length of " + options.stackLength + " is not obtainable with only " + fileList.length + " files");
        return decayList;
      }
    }
    var i = start;
    var j = i - options.stackLength;
    if (j < end) {
      end = 0;
      decayList = [];
      if (hasDecay) {
        var c = confirm("Warning: The stack length of " + options.stackLength + " is not obtainable for growth and decay with only " + fileList.length + " files. Result will only have growth, continue?");
        if (!c) return null;
      }
    }
    while (j >= end) {
      constantList.push({i:i,j:j});
      i -= options.displacement;
      j -= options.displacement;
    }
    return growthList.concat(constantList).concat(decayList.reverse());
  }

  function stack(fileList, outputDir, options) {
    options.outputDir = outputDir
    var array = createStackArray(fileList, options);
    // Log.info("array: ")
    // for (var index in array) {
    //   var item = array[index];
    //   var str = "{i: " + item.i + ", j: " + item.j + "}";
    //   Log.info(str)
    // }
    // return;
    if (array == null || array.length == 0) return;
    FileUtil.putFilesIntoLayers(fileList, options);
    var fileCount = 1;
    for (var k in array) {
    if (options.stackLength == 1) break;
      var i = array[k].i;
      var j = array[k].j;
      LayerUtil.applyEffect(options, i, j, k);
      FileUtil.saveJpg(outputDir + "/jpg", fileCount);
      LayerUtil.hideLayers(j, i);
      fileCount++;
      // if (fileCount < 3) {
      //   var c = confirm("Continue stacking?");
      //   if (!c) return;
      // }
    }
    if (options.video && !options.stackOnce) {
      LayerUtil.restoreDefaultLayers(0, fileList.length - 1);
      FileUtil.exportVideo(fileList, options, outputDir + "/mp4", "original-" + options.video + ".mp4")
      if (options.stackLength > 1) {
        app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
        fileList = FileUtil.sortFiles(new Folder(outputDir + "/jpg"));
        FileUtil.putFilesIntoLayers(fileList, options, true);
        FileUtil.exportVideo(fileList, options, outputDir + "/mp4", "stacked-" + options.video + ".mp4");
      }
    }
  }

}
