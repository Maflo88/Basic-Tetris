document.addEventListener('DOMContentLoaded', () => {
//Random colors for the title //
var colors = ["yellow", "orange", "red", "purple", "blue", "green"];
var title = document.querySelector('#title');
let txt = title.textContent;
let letters = txt.split('');

//window.onload = function eachLetterColor(){
  //let newTxt = ''
  //for(let i = 0; i < txt.length; i++){
  //  let idx = Math.floor(Math.random() * colors.length)
  //  newTxt += '<span style="color: ' + colors[idx] + '">' + letters[i] + '</span>'
    //newTxt += txt.charAt(i).fontcolor(colors[idx])      fontcolor depricated??
  //}
  //title.innerHTML = newTxt
//}

});
