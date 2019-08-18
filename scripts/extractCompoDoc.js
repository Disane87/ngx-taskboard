const tablemark = require('tablemark');
const replace = require('replace-in-file');
const path = require('path');

var parsedJSON = require('../docs/documentation.json');
var readmeFile = 'README.MD';
var readmeFilePath = path.join(process.cwd(), readmeFile);

console.log("Current path" + readmeFilePath);

var board = parsedJSON.components.find(comp => comp.name == 'BoardComponent');

var documentationparts = ['inputsClass', 'outputsClass'];

documentationparts.forEach(part => {
    let partData = board[part].sort((a, b) => a.name < b.name);
    replaceText(part, tablemark(prepareData(part, partData)));
})

function prepareData(part, object) {
    console.info(`Creating documentation for ${part}`);
    let error = false;
    object.forEach(input => {
        delete input.line;
        if (input.description) {
            input.description = (input.description.replace(/<[^>]*>?/gm, '')).replace(/(\r\n|\n|\r)/gm, "");
        } else {
            console.error(`[${part}] ${input.name} is undocumented`);
            error = true;
        }
    })
    if (error) {
        throw (`[Error] There are undocumented ${part}`)
    }
    return object;
}


function replaceText(marker, text) {
    var replaceString = `<!-- Start AutoDoc ${marker} -->@REPLACE@<!-- End AutoDoc ${marker} -->`;
    var replaceRegex = replaceString.replace('@REPLACE@', '([\\s\\S]*?)')
    var replaceToString = replaceString.replace('@REPLACE@', `\r\n${text}\r\n`);


    var regexp = new RegExp(replaceRegex, "gmi");

    console.info(`Replacing "${replaceString}" to "${replaceToString}"`);

    replace({
        files: readmeFilePath,
        from: regexp,
        to: replaceToString
    })
        .then(results => {
            console.log('Replacement results:', results);
        })
        .catch(error => {
            console.error('Error occurred:', error);
        });

}