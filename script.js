import data from './lawmaker-data.js' //imports placeholder data

//store DOM elements into variables
const searchbarInput = document.querySelector('#search-bar')
const autoList = document.querySelector('#autocomplete-list')
const idName = document.querySelector('#id-name')
const idState = document.querySelector('#id-state')
const idParty = document.querySelector('#id-party')

/*
Handler function to evaluate user's input into the search bar
*/
function evalSearch(){
    const searchbarValue = (searchbarInput.value).toLowerCase()
    console.log(searchbarValue)

    let dataFirstName = ""
    let dataLastName = ""

    //runs through lawmaker-data.js
    for(let i=0; i<data.length; ++i){
        dataFirstName = (data[i].first_name).toLowerCase()  //converts names from lawmaker-data to lowercase
        dataLastName = (data[i].last_name).toLowerCase()

        //if search bar input matches then display info
        if(searchbarValue.includes(dataFirstName) || searchbarValue.includes(dataLastName)){ 
            idName.innerText = `${data[i].first_name}  ${data[i].last_name}`
            idState.innerText = data[i].state
            idParty.innerText = data[i].party
        }
    }
}

//display searchbar suggestions
function searchbarSuggest() {
    clearList()
    const searchbarValue = (searchbarInput.value).toLowerCase()
    
    let dataFirstName = ""
    let dataLastName = ""

    //runs through data names and compares search with names
    if(searchbarValue != ''){
        for(let i=0; i<data.length; ++i){
            dataFirstName = (data[i].first_name).toLowerCase()  //converts names from lawmaker-data to lowercase
            dataLastName = (data[i].last_name).toLowerCase()
            
            if(dataFirstName.substr(0, searchbarValue.length) == searchbarValue){   //if the search matches any part of data.first_name
                autoList.appendChild(createSugContainer(i))
            }
            else if (dataLastName.substr(0, searchbarValue.length) == searchbarValue){  //if the search matches any part of data.last_name
                autoList.appendChild(createSugContainer(i))
            }
            else if ((`${dataFirstName} ${dataLastName}`).substr(0, searchbarValue.length) == searchbarValue){
                autoList.appendChild(createSugContainer(i))
            }
        }
    }
    autoList.chil
}

//creates element for autocomplete suggestion
function createSugContainer(dataIndex) {
    const suggestionContainer = document.createElement("li")
    suggestionContainer.innerHTML = `${data[dataIndex].first_name} ${data[dataIndex].last_name}`
    suggestionContainer.id = `${data[dataIndex].first_name}-${data[dataIndex].last_name}`
    suggestionContainer.addEventListener('click', function(e) {
        clearList()
        searchbarInput.value = ''
        idName.innerText = `${data[dataIndex].first_name}  ${data[dataIndex].last_name}`
        idState.innerText = data[dataIndex].state
        idParty.innerText = data[dataIndex].party
    })
    return suggestionContainer
}

function clearList() {
    while(autoList.firstChild){
        autoList.removeChild(autoList.firstChild)
    }
}

// searchbarInput.addEventListener('input', evalSearch)
searchbarInput.addEventListener('input', searchbarSuggest)