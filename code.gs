function doGet(e){
	Logger.log(e);
  var op = e.parameter.action;

  var ss=SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1KFkl9n-RjB2Kxj10yRhT8Xolv_suM7sw-KMBEaEJ1Zk/edit#gid=0");
  var sheet = ss.getSheetByName("DATA");


  if(op=="insert")
    return insert_value(e,sheet);
  
  //Make sure you are sending proper parameters 
  if(op=="read")
    return read_value(e,ss);
  
  if(op=="update")
    return update_value(e,sheet);
  
  if(op=="delete")
    return delete_value(e,sheet); 
}

//Recieve parameter and pass it to function to handle

function insert_value(request,sheet){
 
   var id = request.parameter.id;
  var country = request.parameter.name;
   var gender = request.parameter.gender;
    var email = request.parameter.email;
     var phone = request.parameter.phone;
  
  var flag=1;
  var lr= sheet.getLastRow();
  for(var i=1;i<=lr;i++){
    var id1 = sheet.getRange(i, 2).getValue();
    if(id1==id){
      flag=0;
  var result="Id sudah terdaftar.";
    } }
  //add new row with recieved parameter from client
  if(flag==1){
  var d = new Date();
    var currentTime = d.toLocaleString();
  var rowData = sheet.appendRow([currentTime,id,country,gender,email,phone]);  
  var result="Input Data berhasil!";
  }
     result = JSON.stringify({
    "result": result
  });  
    
  return ContentService
  .createTextOutput(request.parameter.callback + "(" + result + ")")
  .setMimeType(ContentService.MimeType.JAVASCRIPT);   
  }
  

function read_value(request,ss){
  
 
  var output  = ContentService.createTextOutput(),
      data    = {};
  //Note : here sheet is sheet name , don't get confuse with other operation 
      var sheet="DATA";

  data.records = readData_(ss, sheet);
  
  var callback = request.parameters.callback;
  
  if (callback === undefined) {
    output.setContent(JSON.stringify(data));
  } else {
    output.setContent(callback + "(" + JSON.stringify(data) + ")");
  }
  output.setMimeType(ContentService.MimeType.JAVASCRIPT);
  
  return output;
}


function readData_(ss, sheetname, properties) {

  if (typeof properties == "undefined") {
    properties = getHeaderRow_(ss, sheetname);
    properties = properties.map(function(p) { return p.replace(/\s+/g, '_'); });
  }
  
  var rows = getDataRows_(ss, sheetname),
      data = [];

  for (var r = 0, l = rows.length; r < l; r++) {
    var row     = rows[r],
        record  = {};

    for (var p in properties) {
      record[properties[p]] = row[p];
    }
    
    data.push(record);

  }
  return data;
}



function getDataRows_(ss, sheetname) {
  var sh = ss.getSheetByName(sheetname);

  return sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues();
}


function getHeaderRow_(ss, sheetname) {
  var sh = ss.getSheetByName(sheetname);

  return sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];  
} 
  

//update function

function update_value(request,sheet){

var output  = ContentService.createTextOutput();
   var id = request.parameter.id;
  var flag=0;
  var country = request.parameter.name;
  var gender = request.parameter.gender;
    var email = request.parameter.email;
     var phone = request.parameter.phone;
  
  var lr= sheet.getLastRow();
  for(var i=1;i<=lr;i++){
    var rid = sheet.getRange(i, 2).getValue();
    if(rid==id){
      sheet.getRange(i,3).setValue(country);
      sheet.getRange(i,4).setValue(gender);
      sheet.getRange(i,5).setValue(email);
      sheet.getRange(i,6).setValue(phone);
      var result="Data berhasil diupdate!";
      flag=1;
    }
}
  if(flag==0)
    var result="ID tidak ditemukan!";
  
   result = JSON.stringify({
    "result": result
  });  
    
  return ContentService
  .createTextOutput(request.parameter.callback + "(" + result + ")")
  .setMimeType(ContentService.MimeType.JAVASCRIPT);   
  
  
}

function delete_value(request,sheet){
  
  var output  = ContentService.createTextOutput();
   var id = request.parameter.id;
  var country = request.parameter.name;
    var gender = request.parameter.gender;
    var email = request.parameter.email;
     var phone = request.parameter.phone;
  
  var flag=0;

  var lr= sheet.getLastRow();
  for(var i=1;i<=lr;i++){
    var rid = sheet.getRange(i, 2).getValue();
    if(rid==id){
      sheet.deleteRow(i);
      var result="Data berhasil dihapus!";
      flag=1;
    }
    
  }

  if(flag==0)
    var result="ID tidak ditemukan!";
  
  
 
   result = JSON.stringify({
    "result": result
  });  
    
  return ContentService
  .createTextOutput(request.parameter.callback + "(" + result + ")")
  .setMimeType(ContentService.MimeType.JAVASCRIPT);   
  


}