// var parsedJSON = require('../docs/documentation.json');
// var readmeFile = './../README.MD';

// var board = parsedJSON.components.find(comp => comp.name == 'BoardComponent');

// var inputs = board.inputsClass.sort((a,b) => a.name < b.name);
// var outputs = board.outputsClass.sort((a,b) => a.name < b.name);
// console.info("Current cwd", process.cwd());

// cleanMarker('Inputs');


// function cleanMarker(marker, del = true){
//     var lineReader = require('readline').createInterface({
//         input: require('fs').createReadStream(readmeFile)
//     });
    
//     const start_marker = '<!-- Start AutoDoc '+marker+' -->';
//     const end_marker = '<!-- End AutoDoc '+marker+' -->';
//     var deleteEnabled = true;

    
//     lineReader.on('line', function(line) {
//         if (!deleteEnabled && line.startsWith(start_marker)) {
//             // console.log(line);
//             deleteEnabled = true;
//         } else if (deleteEnabled && line.startsWith(end_marker)) {
//             deleteEnabled = false;
//         }
    
//         if (!deleteEnabled) {
//             // console.log(line);
//         }
//     });
// }
