const express = require("express"); 
var Excel = require('exceljs');
const fs = require('fs');

var workbook = new Excel.Workbook();
var accordanceFile; var NumbersList = []; var NameList = [];

var app = express();

app.use("/download",function(req,res){
	console.log('got');
	workbook.xlsx.readFile('test.xlsx').then(function() {
        var worksheet = workbook.getWorksheet(1);        
        worksheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
	       	NumbersList.push(row.values[1]);
	       	NameList.push(row.values[2]);
        });
        res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
        res.status(200).send(NumbersList).end();
    })
})
app.use("/makePath",function(req,res){
	req.on('data',function(data){
		console.log(JSON.parse(data.toString()));
		for(var i = 0; i < accordanceFile.length;i++){
			if(accordanceFile[i].ID == JSON.parse(data.toString()).user){
				let organisationName = '';
				for(var j = 0; j < NumbersList.length;j++){
					if(accordanceFile[i].phone == NumbersList[j]){
						organisationName = NameList[j];
					}
				}				
				fs.stat(__dirname+'/uploads/'+organisationName+'/'+JSON.parse(data.toString()).file, function(err) {
				    if (!err) {
				    	console.log(__dirname+'/uploads/'+organisationName+'/'+JSON.parse(data.toString()).file);
				        res.status(200).end();
				    }
				    else if (err.code === 'ENOENT') {		    	
				        fs.mkdir(__dirname+'/uploads/'+organisationName,{ recursive: true },function(err){
				        	if(err) {
				        		res.status(500).end();
				        	}
				        	else{
				        		fs.copyFile('C:/users/glouder4/downloads/'+JSON.parse(data.toString()).file, __dirname+'/uploads/'+organisationName+'/'+JSON.parse(data.toString()).file, (err) => {
								  if (err) throw err;
								  else{
								  	console.log(organisationName);
				        			res.status(200).end();
								  }								  
								});				        		
				        	}
				        });
				    }
				    else{
				    	console.log(51,err);

				    }
				});
				break;
			}
			else if(i == accordanceFile.length-1){
				res.setHeader('Access-Control-Allow-Origin', '*');
				res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
				res.status(404).end();
			}
		}
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
		res.status(200).end();
	})
})
app.use("/accordance",function(req,res){
	req.on('data',function(data){
		accordanceFile = JSON.parse(data.toString());		
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
		res.status(200).end();
	})
})

app.listen(3000);
module.exports.app = app;