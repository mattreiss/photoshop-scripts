function Compress(args) {
  var fileDirectory = args[0];
  var fileName = args[1];
  var outputDirectory = args[2];
  var quality = args[3];
  open(new File(fileDirectory + "/" + fileName));
  fileName = "compressed-" + quality + "-" + fileName;
  Util.saveJpg(outputDirectory, fileName, quality);
}
