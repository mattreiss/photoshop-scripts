var Log = {};

Log.info = function(str) {
  app.system("echo \"" + str + "\" >> ~/StackerLog.txt");
}
