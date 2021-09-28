function updateSheet() {
  var infoSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Info');

  infoSheet.clear();
  
  /** NOTE
  * If we want to change the number of events, please change numOfEvents variable accordingly
  **/

  var numOfEvents = 5
  var url = "http://www.hmc.edu/non-wp-sites/events/?number=" + numOfEvents
  // Populates sheet with events
  infoSheet.getRange(1,1).setValue("=ARRAYFORMULA(SUBSTITUTE(IMPORTHTML("+"\""+url+"\""+", " + "\"list\""+", 0),CHAR(10),"+"\"\"))");
  
  
  var dateSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Date and Event');

  dateSheet.clear();
  
  // Separates date from event name
  for (var i = 1; i <= numOfEvents; i++){
    dateSheet.getRange(i,1).setValue("=SPLIT(Info!A"+ i +",\"*\", FALSE, TRUE)");
  }

}
