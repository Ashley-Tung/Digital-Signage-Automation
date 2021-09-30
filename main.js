/*
Digital Signs code to automatically update
from the HMC news and events site
Written in Spring 2020 by
Suki Liang '21
Samuel Nunoo '22
Shanaya Stephenson '21
Ashley Tung '22

Updated by Ashley Tung '22
in September '21
*/

/*
-----If changes are needed-----
To change number of events shown, please go to Calendar list -> Tools -> Code Editor -> change value in numOfEvents
To change the background image, please update the id on line 88
To change the images on the slides, upload or delete any images in the "Fliers" Folder
*/

// Declares IDs
var dataSpreadsheetId = 'data-spreadsheet-id';

// Uses the Sheets API to load data from agenda sheet
var sheet = SpreadsheetApp.openById(dataSpreadsheetId);

// Variables that store the date and event info
var dateArr = [];
var eventArr = [];

// Variables we will use often
var slide = SlidesApp.getActivePresentation().getSlides()[0];
var imgCount = 0;


//Creates digital signs slides with updated textbox
function slidesGenerator() { 
  storeData(); // Store event and news data from spreadsheets
  insertImages(); // Create slides for every image in the "Fliers" folder
  createBox(); // Create textbox to insert event daya
  insertNews(); // Insert news data
}


// Takes info from spreadsheet and stores them into the arrays
function storeData() {
  var data = sheet.getDataRange().getDisplayValues();
  for (var i = 0; i < data.length; i++) {
    var date = data[i][0];
    var splitDate = date.split("00:00");
    dateArr.push(splitDate[0]);
    eventArr.push(data[i][1].trim());
  }
}


// Insert images onto slides
function insertImages() {
  
  
  // Clear slides
  var currSlide = SlidesApp.getActivePresentation().getSlides();
  for (i = 0; i < currSlide.length; i++) {
    currSlide[i].remove();
  }
  
  // Access image folder and count
  var activeSlides = SlidesApp.getActivePresentation().getId();
  var slidesFile = DriveApp.getFileById(activeSlides);
  var parentFolder = slidesFile.getParents().next();
  var folder = parentFolder.getFolders().next();
  var files = folder.getFiles();


  // 09/09/2021
  // Please have ONLY image files in the folder! SlidesApp cannot insert videos into the slides
  while (files.hasNext()) {
    
    var file = files.next();
    
    if (DriveApp.getFileById(file.getId()).getMimeType() != "video/mp4") {
      
      // Make new slides
      var newSlide = SlidesApp.getActivePresentation().appendSlide(SlidesApp.PredefinedLayout.BLANK);

      // Set slide background
      // IMPORTANT NOTE - Images need to have link sharing ON
      var image = DriveApp.getFileById('slide-background-image-id').getBlob();
      newSlide.insertImage(image);
      
      // Set slide image
      // IMPORTANT NOTE - Images need to have link sharing ON
      newSlide.insertImage(DriveApp.getFileById(file.getId()), 50, 60, 380, 300);
      imgCount++;
    }
  }
}

// Creates textbos to insert event information
function createBox() {
  var numOfSlide = SlidesApp.getActivePresentation().getSlides().length;

  for (var i = 0; i < numOfSlide; i++) {
  
    var slideIter = SlidesApp.getActivePresentation().getSlides()[i];

    // Insert text box on the (just added) first slide of presentation.
    var titleShape = slideIter.insertShape(SlidesApp.ShapeType.TEXT_BOX, 500, 50, 200, 30);
    var textRange = titleShape.getText();
    
    // Add the title of the box
    var string = 'Harvey Mudd Events' + '\n\n\n';
    textRange.setText(string);
    textRange.getTextStyle().setFontSize(14).setBold(true);
    
    // Append the rest of the events to another textbox
    var eventShape = slideIter.insertShape(SlidesApp.ShapeType.TEXT_BOX, 500, 72, 200, 300);
    textRange = eventShape.getText();
    var dateText;
    var eventText;
    
    for (var j = 0; j < dateArr.length; j++) {
      
      // Want to store string length so we can correctly append
      string = dateArr[j];
      
      // If we have missing values, do not add any more to the box
      if (string == '#VALUE!') {
        break;
      }
      
      // Formatting according to recommendations
      dateText = textRange.appendText(string);
      dateText.getTextStyle().setFontSize(11).setBold(true);
      
      // Update length with length from newly appended string
      eventText = textRange.appendText(' ' + eventArr[j] + '\n\n');
      eventText.getTextStyle().setFontSize(10.75).setBold(false);
    }
    
    // Add final lines to box
    string = "See ";
    var seeText = textRange.appendText(string);
    seeText.getTextStyle().setFontSize(11).setBold(false);
    var hmcText = textRange.appendText('hmc.edu/calendar ');
    hmcText.getTextStyle().setFontSize(11).setBold(true);
    string = "for event information";
    var restText = textRange.appendText(string);
    restText.getTextStyle().setFontSize(11).setBold(false);
    
  }
}

// Inserts news text at the bottom of the banner
function insertNews() {

  // Retrieving news info
  var response = UrlFetchApp.fetch('http://www.hmc.edu/non-wp-sites/news/').getContentText();
  var begin = response.indexOf('<p><span>',1) +9//starting substring
  var finish = response.indexOf('</p>',begin) // finishing substring
  var eventString = response.substring(begin, finish);
  var result = eventString.split("</span>&nbsp;&nbsp;&bull;&nbsp;&nbsp;");
  
  // Middle strings will have an extra "<span>" substring
  for (var i = 0; i < result.length; i++) {
    
    // We want to remove the <span> substring from the middle elements
    if (i != 0 && i != result.length - 1) {
      var spanString = result[i];
      var spanArr = spanString.split("<span>");
      result[i] = spanArr[1];
    }
  }
  
  var numOfSlide = SlidesApp.getActivePresentation().getSlides().length;
  
  //Placing news banner on slides
  for (var i = 0; i < numOfSlide; i++) {
  
    var slideIter = SlidesApp.getActivePresentation().getSlides()[i];
    
    //Insert news banner
    var newsShape = slideIter.insertShape(SlidesApp.ShapeType.TEXT_BOX, 115, 377, 600, 25);
    var textRange = newsShape.getText();
    var index = randInt(0, result.length -1);
    var newsText = textRange.setText(result[index] +" - " + result[result.length-1]);
    newsText.getTextStyle().setFontSize(10).setForegroundColor('#FFFFFF');
  }
}


// Helper function for randon integer generation (for news banner)
function randInt(start, end) {
  // range is from start to end + 1 so it is inclusive
  r = end - start
  return Math.floor(Math.random() * r) + start;
}
