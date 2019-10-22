var corpusFolderName = "corpus";
var resultFolderName = "results";

var fs = require("fs");

// Функция чтения всех файлов из папки корпуса:
function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
      fs.readFile(dirname + filename, "utf-8", function(err, content) {
        if (err) {
          onError(err);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
}

// Функция создания нового файла в папке результата:
function writeFile(filename, newStr) {
  fs.writeFile("./" + resultFolderName + "/" + filename, newStr, function(err) {
    if (err) {
      return console.log(err);
    }
  });
}

// Удаление одиночных переносов строк:
function deleteLineBreaks(str) {
  var newLine = str;
  var lineArr = newLine.split("");
  lineArr = lineArr.map(function(ch, i) {
    if (ch == "\n") {
      if (lineArr[i + 1] !== "\n") {
        return " ";
      } else return "\n";
    } else return ch;
  });
  newLine = lineArr.join("");
  return newLine;
}

function formatDocument(filename, content) {
  // Удаляем множественные пробелы:
  var newLine = content.replace(/ + /g, " ");
  // Удаляем нумерацию страниц:
  newLine = newLine.replace(/(\s){2,}\d+\n/g, "");
  // Удаляем одиночные переносы строк:
  newLine = deleteLineBreaks(newLine);
  writeFile(filename, newLine);
}

function main() {
  if (!fs.existsSync("./" + resultFolderName + "/")) {
    fs.mkdirSync("./" + resultFolderName + "/");
  }
  // Считывает все файлы корпуса и запускает функцию formatDocument для каждого файла:
  readFiles(corpusFolderName + "/", formatDocument, function(err) {
    throw err;
  });
}

main();
