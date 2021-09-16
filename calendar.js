function updateSheet() {
  var infoSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Info');

  infoSheet.clear();
  
  /** NOTE
  * If we want to change the number of events, please change numOfEvents accordingly
  **/

  var numOfEvents = 5

  // Populates sheet with events
  infoSheet.getRange(1,1).setValue( "=IMPORTHTML(\"events_site/?number=" + numOfEvents + "\",\"list\",0)");
  
  
  var dateSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Date and Event');

  dateSheet.clear();
  
  // Separates date from event name
  for (var i = 1; i <= numOfEvents; i++){
    dateSheet.getRange(i,1).setValue("=SPLIT(Info!A"+ i +",\"*\", FALSE, TRUE)");
  }
}
