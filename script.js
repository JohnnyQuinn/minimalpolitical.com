//store DOM elements into variables
const searchbarInput = document.querySelector('#search-bar')
const autoList = document.querySelector('#autocomplete-list')
const idName = document.querySelector('#id-name')
const idState = document.querySelector('#id-state')
const idParty = document.querySelector('#id-party')
let members

/* */
$.ajax({
    url: "https://api.propublica.org/congress/v1/116/senate/members.json",
    beforeSend: function(xhr) {
         xhr.setRequestHeader("X-API-Key", "Hk6QVaUEQ453sdhadQMafiX9Ya5hblL7uwqVPEFw")
    }, success: function(data){
       members = data.results[0].members
       console.log("Data retrieval successful!")
}});

//display searchbar suggestions
function searchbarSuggest() {
    clearList()
    const searchbarValue = (searchbarInput.value).toLowerCase()
    
    let dataFirstName = ""
    let dataLastName = ""

    //runs through data names and compares search with names
    if(searchbarValue != ''){
        for(let i=0; i<members.length; ++i){
            dataFirstName = (members[i].first_name).toLowerCase()  //converts names from lawmaker-data to lowercase
            dataLastName = (members[i].last_name).toLowerCase()
            
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
    suggestionContainer.innerHTML = `${members[dataIndex].first_name} ${members[dataIndex].last_name}`
    suggestionContainer.id = `${members[dataIndex].first_name}-${members[dataIndex].last_name}`
    suggestionContainer.addEventListener('click', function(e) {
        clearList()
        searchbarInput.value = ''
        idName.innerText = `${members[dataIndex].first_name}  ${members[dataIndex].last_name}`
        idState.innerText = members[dataIndex].state
        idParty.innerText = getInfo('party', dataIndex)
    })
    return suggestionContainer
}

function clearList() {
    while(autoList.firstChild){
        autoList.removeChild(autoList.firstChild)
    }
}

function getInfo(info, dataIndex) {
    if(info == 'party') {
        if(members[dataIndex].party == "R"){
            return "Republican"
        }
        if(members[dataIndex].party == "D"){
            return "Democrat"
        }
    }
}

searchbarInput.addEventListener('input', searchbarSuggest)

