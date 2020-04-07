const express = require("express"); 
var Excel = require('exceljs');
const fs = require('fs');

var workbook = new Excel.Workbook();

var app = express();

app.use("/download",function(req,res){
	console.log('getted');
	workbook.xlsx.readFile('test.xlsx').then(function() {
        var worksheet = workbook.getWorksheet(1);
        var NumbersList = [];
        worksheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
	       	NumbersList.push(row.values[1]);
        });
        res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
        res.status(200).send(NumbersList).end();
    })
})

app.listen(3000);
module.exports.app = app;