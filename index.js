const child_process = require('child_process');
const path = require('path');

const PATH_TO_SCRIPTS = path.resolve(__dirname, './bash');

function execute(script, callback, onError) {
    console.log("Executing script " +  script)
    child_process.exec(PATH_TO_SCRIPTS + "/" + script,
        function (error, stdout, stderr) {
            stdout && console.log(script + " stdout " + stdout)
            stderr && console.log(script + " stderr " + stderr)
            error && console.log(script + " error " + error)
            callback(stdout)
            var errorMessage = stderr || error;
            if (errorMessage && onError) onError(errorMessage)
        }
    );
}
  
function spawn(script, args, callback, onError, onComplete) {
    console.log("Executing script " +  script, args)
    const stream = child_process.spawn(PATH_TO_SCRIPTS + "/" + script, args);
    stream.stdout.on('data', callback);
    stream.stderr.on('data', onError);
    stream.on('close', function(code) {
      console.log("Finished excecuting script", script, code);
      if (onComplete) onComplete();
    })
}

module.exports.photoshop = function(command, args) {
    const params = [command];
    if (args && args.length > 0) {
        for (var i in args) {
            params.push(args[i]);
        }
    }
    spawn("photoshop.sh", params,
    function(stdout) {
        // console.log('photoshop.sh stdout', stdout);
    }, 
    function(stderr) {
        console.log('photoshop.sh stderr', stderr);
    });
};