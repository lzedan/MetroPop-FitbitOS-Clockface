// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

//Function: colorAssociation
//There is a known limitation with FitBit OS where a ColorSelect in settings can only have one value attached.
//In the context of this app/clockface, the theme of the clockface is dependent on an initial colour, with two darker shades.
//This function takes an input string of the first color and returns an array containing the strings associated with the hex
//codes of the darker colours within the same theme as the first colour.
export function colorAssociation(inputColor) {
  var outputColors = new Array(2);
  if(inputColor == '#e8004e'){
    outputColors[0] = '#a1063a';
    outputColors[1] = '#571d2f';
  }
  else if(inputColor == '#00b6e8'){
    outputColors[0] = '#0680a1';
    outputColors[1] = '#1d4957';
  }
  else if(inputColor == '#d300e8'){
    outputColors[0] = '#9306a1';
    outputColors[1] = '#531d57';
  }
  else if(inputColor == '#91d805'){
    outputColors[0] = '#669509';
    outputColors[1] = '#3e511d';
  }
  else if(inputColor == '#7d94a8'){
    outputColors[0] = '#5c7086';
    outputColors[1] = '#304a6e';
  }
  else if(inputColor == '#eb9d0c'){
    outputColors[0] = '#9e5b00';
    outputColors[1] = '#785124';
  }
  else{
    outputColors[0] = '#a1063a';
    outputColors[1] = '#571d2f';
  }
  
  return outputColors;
}