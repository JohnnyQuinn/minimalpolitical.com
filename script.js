import data from './lawmaker-data.js' //imports placeholder data

//store DOM elements into variables
const searchbarInput = document.querySelector('#search-bar')
const idName = document.querySelector('#id-name')
const idState = document.querySelector('#id-state')
const idParty = document.querySelector('#id-party')

/*
Handler function to evaluate user's input into the search bar
*/
function evalSearch(){
    const searchbarValue = searchbarInput.value
    searchbarValue.toLowerCase()
    console.log(searchbarValue)

    let dataFirstName = ""
    let dataLastName = ""

    //runs through lawmaker-data.js
    for(let i=0; i<data.length; ++i){
        console.log(data[i].first_name)
        dataFirstName = (data[i].first_name).toLowerCase()      //converts names from lawmaker-data to lowercase
        dataLastName = (data[i].last_name).toLowerCase()

        if(searchbarValue.includes(dataFirstName) || searchbarValue.includes(dataLastName)){ //if search bar input matches then display info
            idName.innerText = data[i].first_name + data[i].last_name
            idState.innerText = data[i].state
            idParty.innerText = data[i].party
        }
    }
}


searchbarInput.addEventListener('input', evalSearch)