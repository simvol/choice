//TODO
// 1. input form for many optiosn with names descriptions and files
// - i'd say let them upload all pictures first, then ask for name and desc for each

// 2. styles



let arr = []; //array of options we are working with right now
let newArr = [];  //array of options chosen by user
let choice1 = {option:{ name:'', img: '', desc: ''}};
let choice2 = {option:{ name:'', img: '', desc: ''}};

let MIN_LENGTH = 5;
let ENTER_KEY_NUM = 13;

//hardcoded, like it was chosen by user
// for (var i = 0; i < 10; i++) {
//     newArr.push({
//         name: 'option #' + i,
//         img: 'https://www.cats.org.uk/uploads/images/featurebox_sidebar_kids/grief-and-loss.jpg',
//         desc: 'test'
//     });
// }
//.hardcoded

prepare();

function init() {
    addEventListeners();
    start();
}

function prepare() {
    addDropZoneEventListeners();
}

function addDropZoneEventListeners() {
    let dropZone = $('#drop_zone');
    let inputElement = $('#fileupload');

    // hover highlight
    dropZone
        .mouseenter(function(){
            $(this)
                .addClass('drop_zone_active');
        })
        .mouseleave(function(){
            $(this)
                .removeClass('drop_zone_active')
        });

    // click to open browse files
    dropZone.click(function(){
        inputElement.trigger('click');
    });
    
    inputElement.change(function(event){
        inputHandler(event.target);
    });
}

displayOptionsToModify();
function displayOptionsToModify() {
    addOptionsEventListeners();
}

function addOptionsEventListeners() {
    let optionCard = $('.option-card');
    let editableField = optionCard.find('.editable-field');
    let optionInput = optionCard.find('input');

    editableField
        .click(function(){
            $(this).addClass('hide');
            $(this).next().removeClass('hide').focus();
        })
   
    optionInput
        .focusout(function(){
            hideInputShowContent(this);
        })
        .keyup(function(){
            if(event.keyCode == ENTER_KEY_NUM){
                hideInputShowContent(this);
            }
        });
    

    function hideInputShowContent(input) {
        $(input).addClass('hide');
        $(input).prev().removeClass('hide');
    }
    
}

function showUploadedImages() {
    newArr.forEach(function(item){
        $( '#file-content' ).append( $( '<img/>' ).attr('src', item.img ) )
    });
}

function addEventListeners() {
    let choiceContainer = $('.choice');
   
    choiceContainer
        .click(function(){
            chooseOption( $(this).find('.name')[0].innerText );
        })
        .mouseenter(function(){
            $(this)
                .removeClass('z-depth-1')
                .addClass('z-depth-5');
        })
        .mouseleave(function(){
            $(this)
                .removeClass('z-depth-5')
                .addClass('z-depth-1');
        })
        .mousedown(function(){
            $(this)
                .removeClass('z-depth-1')
                .addClass('z-depth-0');

        })
        .mouseup(function(){
            $(this)
                .removeClass('z-depth-0')
                .addClass('z-depth-1');
        });
}

function start(){
    console.log('All options ', newArr);

    arr = newArr.splice(0, newArr.length); //move everything from newArr to arr

    if (arr.length > 1) {
        setNextOptions(arr, choice1, choice2);
    } else {
        let choice = arr[0];
        let answerContainer = $('#final-answer');

        answerContainer
            .removeClass('hide')
            .find('img').attr('src', choice.img)
            .find('.name').each(function(){ $(this).text(choice.name)} );

        answerContainer
            .find('.desc:first').text(choice.desc);
    }
}

function setNextOptions(arr) {

    arr = shuffleArray(arr);

    let options = [];
    options[1] = getActive('first', arr);
    options[2] = getActive('last', arr);

    setOption(1, options[1]);
    setOption(2, options[2]);
}

function setOption(number, data) {
    let el = $('#choice' + number);

    el.find('.name').text(data.name);
    el.find('img').attr('src', data.img);
    el.find('.desc').text(data.desc);
}

function getActive(position, arr) {
    if (position === 'first') {
        return arr[0];
    } else {
        return arr[arr.length-1];
    }
}

function chooseOption(optionName) {
    let optionIndex = _.findIndex(arr, {name: optionName});
    newArr.push( arr.splice(optionIndex, 1)[0] ); //move chosen option from arr to newArr
    
    //remove opposite as well
    if (optionIndex === 0) {
        console.log('Deleting ', arr[arr.length-1]);
        arr.pop();
    } else {
        console.log('Deleting ', arr[0]);
        arr.shift();
    }

    //if there is the last option left, push it automatically
    if (arr.length === 1) {
        newArr.push( arr.splice(0,1)[0] );
    }

    //if there is no options, restart with the options left
    if (arr.length === 0) {
        start();
    } else {
        setNextOptions(arr); //set new elements
    }
}

// function inputHandler(input) {
//     file = input.files[0];
//     fr = new FileReader();
//     fr.onload = receivedText;
//     //fr.readAsText(file);
//     fr.readAsDataURL(file);
    
//     //wtf is this
//     fr.result
// }

//External stuff
//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function inputHandler(input) {
    if ( ! window.FileReader ) {
        return alert( 'FileReader API is not supported by your browser.' );
    }
    if ( input.files && input.files.length > MIN_LENGTH ) {
        for (let i = 0; i < input.files.length; i++) {
            let file = input.files[i]; // The file
            let fr = new FileReader(); // FileReader instance
            fr.onload = function () {
                // Do stuff on onload, use fr.result for contents of file
                newArr.push({img: fr.result});

                if (newArr.length === input.files.length) {
                    showUploadedImages();
                }
            };
            //fr.readAsText( file );
            fr.readAsDataURL( file );
        }
    } else {
        // Handle errors here
        alert('Please select more than ' + MIN_LENGTH + ' images');
    }
}

//https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
function drop_handler(ev) {
    console.log("Drop");
    ev.preventDefault();
    // If dropped items aren't files, reject them
    var dt = ev.dataTransfer;
    if (dt.items && dt.items.length > MIN_LENGTH) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i=0; i < dt.items.length; i++) {
        if (dt.items[i].kind == "file") {
          var f = dt.items[i].getAsFile();
          console.log("... file[" + i + "].name = " + f.name);
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
    //   for (var i=0; i < dt.files.length; i++) {
    //     console.log("... file[" + i + "].name = " + dt.files[i].name);
    //   }
        alert('Please select more than ' + MIN_LENGTH + ' images');
    }
  }

  function dragover_handler(ev) {
    console.log("dragOver");
    // Prevent default select and drag behavior
    ev.preventDefault();
  }

  function dragend_handler(ev) {
    console.log("dragEnd");
    // Remove all of the drag data
    var dt = ev.dataTransfer;
    if (dt.items) {
      // Use DataTransferItemList interface to remove the drag data
      for (var i = 0; i < dt.items.length; i++) {
        dt.items.remove(i);
      }
    } else {
      // Use DataTransfer interface to remove the drag data
      ev.dataTransfer.clearData();
    }
  }