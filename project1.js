// define our global variables...
let numVineyardRows = 5;
let slider;
let df;
// arrays for our values in the wine_data.csv...
let WW_wineries = [];
let years = [];
let Walla_growth = [];
let Wa_growth = [];
let higher_lower_test = [];   // if value is 1, they have not taken the test yet for that year! pretty impt.
let higher_lower_test_rand_values = [];
let higher_lower_test_correct = [];
let higher_lower_test_done;   // flag if we have clicked the higher or lower button yet!
// values of the current year on the slider...
let ww_wineries;
let walla_growth;
let wa_growth;
let isHigher;   // this is for our higher or lower game!
let buttons = [];   // collecting the higher or lower buttons in an array 
// I had an issue at the last step (line 167) that I needed to store the value of i as a var so im doing that here...
let j;

function checkHigher(x) {
  isHigher = WW_wineries[x] > higher_lower_test_rand_values[x];
  if(isHigher) {
    higher_lower_test_correct[x] = "Correct";
  }
  else {
    higher_lower_test_correct[x] = "Incorrect";
  }
  higher_lower_test[x] = 1;
}

function checkLower(x) {
  isHigher = WW_wineries[x] > higher_lower_test_rand_values[x];
  if(!isHigher) {
    higher_lower_test_correct[x] = "Correct";
  }
  else {
    higher_lower_test_correct[x] = "Incorrect";
  }
  higher_lower_test[x] = 1;
}

// loading in our data...
function preload() {
  df = loadTable("wine_data.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight - 15);
  
  // slider will represent the years... 
  slider = createSlider(2009, 2020, 2009); 
  slider.position(windowWidth / 6, windowHeight / 3);
  slider.style('width', '380px');

  // initialize data arrays whose values we will constantly be updating when we change the year slider defined above...
  for (let i = 0; i < df.getRowCount(); i++) {
    years[i] = int(df.get(i, 0)); 
    WW_wineries[i] = int(df.get(i, 1));
    Wa_growth[i] = int(df.get(i, 2) * 100); 
    Walla_growth[i] = int(df.get(i, 3) * 100);
    higher_lower_test[i] = 0;
    higher_lower_test_rand_values[i] = int(random(90, 188));
  }
}

function draw() {
  background(220);

  // Draw sky...
  fill(135, 206, 250);
  rect(0, 0, width, height / 1.5);

  // Draw ground...
  fill("green");
  rect(0, height / 1.5, width, height / 1.5);

  // Draw sun...
  fill(255, 255, 0);
  ellipse(width, 10, 200, 200);

  // Draw year text...
  fill(0);
  textSize(16);
  text("Year: " + slider.value(), windowWidth / 4, windowHeight / 3);

  // updating our values used for data visuals (defined the arrays above)...
  for (let i = 0; i < years.length; i++) {
    j = i;  // used in line 167
    if (slider.value() === years[i]) {
      // check if we can draw the vines yet (have we taken the higher or lower test)...
      if (higher_lower_test[i] == 0) {
        higher_lower_test_done = false;
        // question text...
        text("Did Walla Walla in " + years[i] + " have...", windowWidth / 1.65, windowHeight / 3.5);

        // this is kind of redundant but im adding in another check to see if we can draw the vines or not. my code didnt work too well without this check...
        if (higher_lower_test[i] !== 1) {
          let higherButton = createButton("MORE");
          // i know a bit of html and css and I took advantage here...
          higherButton.style("background-color", color("#CBC3E3"));
          higherButton.position(windowWidth / 1.5, windowHeight / 3);
          higherButton.mousePressed(function() {
            checkHigher(i);
          });
          // something cool I learned is when you create a button, it stays on the page. So Im adding the higher and lower buttons to an arry hoping that I can get rid of them after I push em
          buttons.push(higherButton); 

          // adding in the or text...
          text("OR", windowWidth / 1.48, windowHeight / 2.6);

          // lower button...
          let lowerButton = createButton("LESS");
          lowerButton.style("background-color", color("#CBC3E3"));
          lowerButton.position(windowWidth / 1.5, windowHeight / 2.5);
          lowerButton.mousePressed(function() {
            checkLower(i);
          });
          buttons.push(lowerButton);
        }

        // searches text...
        text("than " + higher_lower_test_rand_values[i] + " wineries in total?", windowWidth / 1.6, windowHeight / 2);
      } 
      else {
        numVineyardRows = WW_wineries[i];
        ww_wineries = WW_wineries[i];
        wa_growth = Wa_growth[i];
        walla_growth = Walla_growth[i];
        higher_lower_test_done = true;

        // Remove buttons from the DOM (got this code from chatgpt)
        for (let button of buttons) {
          button.remove();
        }
        buttons = [];

        break;
      }
    }
  }
  // if we have taken the test for the year, we will show the stuff...
  if(higher_lower_test_done) {

    // draw vineyards...
    let row = width / (numVineyardRows + 1);
    for (let i = 1; i <= numVineyardRows; i++) {
      let x = i * row;
      line(x, (height / 1.5), x, (height / 1.5 - 40));
    }
  
    // draw slider value...
    fill(0);
    textSize(16);
    // text("Year: " + slider.value(), windowWidth / 4, windowHeight / 3);
    text("Total Walla Walla Wineries (vineyards): " + ww_wineries, windowWidth / 2, windowHeight / 3 - 25);
  
    // setting up our annual growth text...
    fill(0);
    text("Winery Growth - Walla Walla: ", windowWidth / 2, windowHeight / 3);
    text("Winery Growth - WA: ", windowWidth / 2, windowHeight / 3 + 25);
    // updating the values in the text...
    if(walla_growth <= 0) {
      text(walla_growth + "%", windowWidth / 2 + 250, windowHeight / 3);
    }
    else if(walla_growth > 0) {
      text("+" + walla_growth + "%", windowWidth / 2 + 250, windowHeight / 3);
    }
    if(wa_growth <= 0) {
      text(wa_growth + "%", windowWidth / 2 + 250, windowHeight / 3 + 25); 
    }
    else if(wa_growth > 0) {
      text("+" + wa_growth + "%", windowWidth / 2 + 250, windowHeight / 3 + 25); 
    }

    // last little bit, I wanna indicate if the user guessed wrong or not in the higher lower mini game!
    if(higher_lower_test_correct[j] == "Correct") {
      textSize(25);
      fill("green");
      text("CORRECT", windowWidth / 2, windowHeight / 4);
    }
    else {
      textSize(25);
      fill("red");
      text("INCORRECT", windowWidth / 2, windowHeight / 4);
    }
  }
}

/* 
I used ChatGPT as shown in some comment above. A lot of the new stuff like the buttons I looked up in the p5js documentation.
A lot of this project was just me coming up with stuff on the fly as you can see based on my horrible documentation haha but there was a lot of stuff I looked up in the documentation.
I did run the whole code at one point in chatgpt asking why it wasn't working. It was for the higher_lower_test[i]. I struggled so hard with this. Everytime I pressed more, the vines appeared which is good, but the buttons wouldnt disappear. I thought that since the draw function is constantly updating, it would not draw the buttons if higher_lower_test[i] was not 0, but I was wrong haha.
*/