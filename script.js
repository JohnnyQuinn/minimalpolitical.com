import data from './lawmaker-data.js' //imports placeholder data

//store DOM elements into variables
const searchbarInput = document.querySelector('#search-bar')
const basicIDInfo = document.querySelector('#basic-id-info')

/*
Handler function to evaluate user's input into the search bar
*/
function search(){
    searchbarValue = searchbarInput.value
    searchbarValue.toLowerCase();

    //runs through lawmaker-data.js
    for(let i=0; i<data.length; ++i){
        if(data[i].first_name == searchbarValue){

        }
        else {
            return
        }
    }
}


searchbarInput.addEventListener('input', search())