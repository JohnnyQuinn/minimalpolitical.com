import data from './lawmaker-data.js' //imports placeholder data

//store DOM elements into variables
const searchbarInput = document.querySelector('#search-bar')
const autoList = document.querySelector('#autocomplete-list')
const idName = document.querySelector('#id-name')
const idState = document.querySelector('#id-state')
const idParty = document.querySelector('#id-party')


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

searchbarInput.addEventListener('input', searchbarSuggest)

var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}

$.ajax({
    url: "https://api.propublica.org/congress/v1/116/senate/members.json",
    beforeSend: function(xhr) {
         xhr.setRequestHeader("X-API-Key", "Hk6QVaUEQ453sdhadQMafiX9Ya5hblL7uwqVPEFw")
    }, success: function(data){
       console.log(data)
    }
})