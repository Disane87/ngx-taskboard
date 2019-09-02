var fs = require('fs');
var files = ['README.md', 'CHANGELOG.md'];

var outputFolder = "./dist";

files.forEach(file => {
  console.log(`Copying './${file}' to '${outputFolder}/${file}'`)
  fs.createReadStream(`./${file}`).pipe(fs.createWriteStream(`${outputFolder}/${file}`));
})
