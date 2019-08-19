const tablemark = require('tablemark');
const replace = require('replace-in-file');
const path = require('path');
var fs = require('fs');



var documentationJson = require('../docs/documentation.json');
// var readmeFile = 'projects/ngx-taskboard/README.MD';
var readmeFile = 'README.MD';
var readmeFilePath = path.join(process.cwd(), readmeFile);

main();

function main() {
    var regExpr = new RegExp(/<!-- Start AutoDoc ([\s\S]*?) -->/gi);

    fs.readFile(readmeFilePath, 'utf8', function (err, contents) {
        while ((m = regExpr.exec(contents)) !== null) {
            if (m.index === regExpr.lastIndex) {
                regExpr.lastIndex++;
            }

            console.log(`Found match, group ${m.index}: ${m[1]}`);
            var match = m[1];

            var matchProperties = match.split("-");
            if (matchProperties.length > 1) {
                var data = documentationJson;
                matchProperties.forEach((part, index) => {
                    part = part.trim();
                    if (part.indexOf("=") == -1) {
                        data = data[part]
                    } else {
                        data = data.find(item => {
                            return item[part.split("=")[0]] == part.split("=")[1];
                        });
                    }
                    if (index == (matchProperties.length - 1)) {
                        if (data) {
                            var text = tablemark(prepareData(match, data));
                            replaceText(match, text);
                        }
                    }
                })
            } else {
                var data = documentationJson[match.toLowerCase()];
                var text = tablemark(prepareData(match, data));
                replaceText(match, text);
            }

        }
    });
}

function prepareData(part, object) {
    console.info(`Creating documentation for ${part}`);
    let error = false;
    object.forEach(input => {

        deleteNotNeedingProperties(['Name', 'Description', 'DefaultValue', 'Type'], input);
        if (input.description) {

            input.description = input.description.replace(/(\r\n|\n|\r)/gm, "");
            input.description = input.description.replace(/<[^>]*>?/gm, '');
            if (input.type) {
                input.type = input.type.replace("<", '&lt;');
                input.type = input.type.replace(">", '&gt;');
                input.type = '`'+input.type+'`';
            }

            if (input.defaultValue) {
                input.defaultValue = input.defaultValue.replace("<", '&lt;');
                input.defaultValue = input.defaultValue.replace(">", '&gt;');
            }

        } else {
            console.warn(`[${part}] ${input.name} is undocumented`);
            error = false;
        }
    })
    if (error) {
        throw (`[Error] There are undocumented ${part}`)
    }
    return object;
}

function deleteNotNeedingProperties(props, obj) {
    var propsToDelete = Object.keys(obj).filter(key => props.every(prop => prop.toLowerCase() != key.toLowerCase()));
    propsToDelete.forEach(prop => {
        delete obj[prop];
    })
}


function replaceText(marker, text) {
    var replaceString = `<!-- Start AutoDoc ${marker} -->@REPLACE@<!-- End AutoDoc ${marker} -->`;
    var replaceRegex = replaceString.replace('@REPLACE@', '([\\s\\S]*?)')
    var replaceToString = replaceString.replace('@REPLACE@', `\r\n${text}\r\n`);


    var regexp = new RegExp(replaceRegex, "gmi");

    console.info(`Replacing "${replaceRegex}" to "${replaceToString}"`);
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