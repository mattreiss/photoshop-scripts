function Test(args) {
  alert("Test")
  var util = args[0];
  var functionName = args[1];

  switch(util) {
    case 'LayerUtil': return testUtil(LayerUtil, functionName);
    case 'FileUtil': return testUtil(FileUtil, functionName);
  }
}

function testUtil(utilName, functionName) {
  if (typeof utilName[functionName] == 'function') {
    utilName[functionName]();
  }
}
