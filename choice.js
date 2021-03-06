let arr = []; //array of options we are working with right now
let newArr = [];  //array of options chosen by user
let fakeOptions = [
    'https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?h=350&dpr=2&auto=compress&cs=tinysrgb',
    'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?h=350&dpr=2&auto=compress&cs=tinysrgb',
    'https://images.pexels.com/photos/126407/pexels-photo-126407.jpeg?h=350&dpr=2&auto=compress&cs=tinysrgb',
    'https://images.pexels.com/photos/58997/pexels-photo-58997.jpeg?h=350&dpr=2&auto=compress&cs=tinysrgb',
    'https://images.pexels.com/photos/8700/wall-animal-dog-pet.jpg?h=350&dpr=2&auto=compress&cs=tinysrgb',
    'https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg?h=350&dpr=2&auto=compress&cs=tinysrgb'
]

let MIN_LENGTH = 5;
let ENTER_KEY_NUM = 13;
let SHOW_REPEAT_BUTTON_IN = 1000;


prepare();
function prepare() {
    addDropZoneEventListeners();
    addSampleButtonListener();
    addHelperButtonListener();
}

function init() {
    prepareChoicesScreen();
    addEventListeners();
    start();
}

function prepareChoicesScreen() {
    $('.prepare-options').addClass('hide');
    $('.game').removeClass('hide');
}

function addDropZoneEventListeners() {
    let dropZone = $('#drop_zone');
    let uploadButton = $('.upload-button');
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

function addSampleButtonListener() {
    let samplButton = $('#sample-button');
    let hoverToShowMessage = $('.message-shower');

    samplButton
        .click(function(){
            loadKittens(); 
        });
    
    hoverToShowMessage
        .mouseenter(function(){
            $('.your-files-message').css('opacity', 1);
            $('.sample-message').css('opacity', 1);
            $('.or-message').css('opacity', 1);
        })
        .mouseleave(function(){
            $('.your-files-message').css('opacity', 0);
            $('.sample-message').css('opacity', 0);
            $('.or-message').css('opacity', 0);
        });

}

function addHelperButtonListener() {
    let helperButton = $('.help-message-show');

    helperButton
        .mouseenter(function(){
            $('.help-message').css('opacity', 1);
        })
        .mouseleave(function(){
            $('.help-message').css('opacity', 0);
        });

}

// Load hardcoded data with pet images
function loadKittens() {
    for (var i = 0; i < fakeOptions.length; i++) {
        //extract img name from url
        let urlParts = fakeOptions[i].split('/');
        let nameParts = urlParts[urlParts.length-1].split('-');
        let name = nameParts.splice(0, nameParts.length-1).join(' ');

        newArr.push({
            name: i + ' ' + name,
            img: fakeOptions[i],
            desc: 'Description for option number ' + i,
            number: i
        });
    }
    displayOptionsToModify();
}

// displayOptionsToModify();
function displayOptionsToModify() {
    prepareOptionsScreen();
    cloneOptions();
    addOptionsEventListeners();
}

function prepareOptionsScreen() {
    $('.prepare-images').addClass('hide');
}

function cloneOptions() {
    let optionCard = $('.option-card:first');
    let prepareOptionsContainer = $('#prepare-options-container');

    $('.prepare-options').removeClass('hide');

    for (var i = 0; i < newArr.length; i ++) {
        let option = newArr[i];
        let newOption = optionCard.clone();
        
        newOption.find('img').attr('src', option.img);
        newOption.find('.card-title').text(option.name);
        newOption.find('input').attr('data-option-number', i);
        newOption.find('.desc').text(option.desc);
        
        prepareOptionsContainer.append(newOption);
    }

    optionCard.remove();
}

//Once user uploaded images we want them to write down
//titles and descriptions for their options
function addOptionsEventListeners() {
    let optionCard = $('.option-card');
    let editableField = optionCard.find('.editable-field');
    let optionInput = optionCard.find('input');
    let doneButton = $('#done-button');

    editableField
        .click(function(){
            $(this).addClass('hide');
            $(this).next().removeClass('hide').focus();
        })
   
    optionInput
        .focusout(function(){
            editingDone(this);
        })
        .keyup(function(){
            if(event.keyCode == ENTER_KEY_NUM){
                editingDone(this);
            }
        });

    doneButton
        .click(function(){
            init();
        });

    function editingDone(input) {
        let inp = $(input);

        if (!input.value || input.value.length === 0) { return; }

        let optionNumber = inp.data("option-number");

        inp.addClass('hide');
        inp.prev().text(input.value);
        inp.prev().removeClass('hide');

        let cardTitle = inp.parent().find('.card-title').text();
        let cardDesc = inp.parent().find('.desc').text();
        
        updateData(optionNumber, cardTitle, cardDesc);
    }
    
    function updateData(optNum, name, desc) {
        newArr.forEach(function(option){
            if (option.number === optNum) {
                option.name = name || option.name;
                option.desc = desc || option.desc;
            }
        });
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
            chooseOption( $(this).data("option-number") );
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
        setNextOptions(arr);
    } else {
        let choice = arr[0];
        let answerContainer = $('#final-answer');
        let repeatButton = $('#again-button');

        answerContainer
            .removeClass('hide')
            .find('img').attr('src', choice.img);
        
        answerContainer
            .find('.name').each(function(){ $(this).text(choice.name)} );

        answerContainer
            .find('.desc:first').text(choice.desc);

        let timeout = setTimeout(function(){
            repeatButton.removeClass('hide');
        }, SHOW_REPEAT_BUTTON_IN)

        repeatButton.click(function(){
            location.reload();
        });
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
    el.data("option-number", data.number);
}

function getActive(position, arr) {
    if (position === 'first') {
        return arr[0];
    } else {
        return arr[arr.length-1];
    }
}

function chooseOption(optionNumber) {
    let optionIndex = _.findIndex(arr, {number: optionNumber});
    newArr.push( arr.splice(optionIndex, 1)[0] ); //move chosen option from arr to newArr
    
    //remove opposite as well
    if (optionIndex === 0) {
        console.log('Deleting last', arr[arr.length-1]);
        arr.pop();
    } else {
        console.log('Deleting 0', arr[0]);
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

function addOption(image, number) {
        newArr.push({
            img: image,
            desc: 'Option description',
            name: 'Option name',
            number: newArr.length
        });

}

function readFile(file, totalFiles) {
    let fr = new FileReader(); // FileReader instance
    fr.onload = function () {
        // Do stuff on onload, use fr.result for contents of file

        addOption(fr.result);

        if (newArr.length === totalFiles) {
            displayOptionsToModify();
        }
    };
    fr.readAsDataURL( file );
}

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

    let totalFiles = input.files.length;

    if ( input.files && totalFiles > MIN_LENGTH ) {
        for (let i = 0; i < totalFiles; i++) {
            let file = input.files[i]; // The file
            readFile(file, totalFiles);
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
    var totalFiles = dt.items.length;

    if (dt.items && totalFiles > MIN_LENGTH) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i=0; i < totalFiles; i++) {
        if (dt.items[i].kind == "file") {
            var f = dt.items[i].getAsFile();
            readFile(f, totalFiles);
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