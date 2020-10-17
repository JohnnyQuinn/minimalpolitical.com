//store DOM elements into variables
const searchbarInput = document.querySelector('#search-bar')
const autoListContainer = document.querySelector('#autocomplete-container')
const autoList = document.querySelector('#autocomplete-list')
const idName = document.querySelector('#id-name')
const idState = document.querySelector('#id-state')
const idParty = document.querySelector('#id-party')
const billTitle = document.getElementById('bill-title')
const billDate = document.querySelector('#bill-date')
const billVote = document.querySelector('#bill-vote')
let senateMembers
let houseMembers
let billInfo

/*Retrieves data from API

Link uses parameters after the congress/v1/ 

Key to access API: Hk6QVaUEQ453sdhadQMafiX9Ya5hblL7uwqVPEFw
*/
$.ajax({
    url: "https://api.propublica.org/congress/v1/116/senate/members.json",
    beforeSend: function(xhr) {
         xhr.setRequestHeader("X-API-Key", "Hk6QVaUEQ453sdhadQMafiX9Ya5hblL7uwqVPEFw")
    }, success: function(data){
       senateMembers = data.results[0].members
       console.log(senateMembers)
       console.log("Senate member list data retrieval successful!")
    }
});
$.ajax({
    url: "https://api.propublica.org/congress/v1/116/house/members.json",
    beforeSend: function(xhr) {
         xhr.setRequestHeader("X-API-Key", "Hk6QVaUEQ453sdhadQMafiX9Ya5hblL7uwqVPEFw")
    }, success: function(data){
       houseMembers = data.results[0].members
       console.log(houseMembers)
       console.log("House member list data retrieval successful!")
    }
});

//display searchbar suggestions
function searchbarSuggest() {
    clearList()
    const searchbarValue = (searchbarInput.value).toLowerCase()     //converts search bar value to lowercase

    let dataFirstName = ""
    let dataLastName = ""

    //runs through data names and compares search with names
    if(searchbarValue != ''){
        autoListContainer.style.display = 'block'           //displays autocomplete list when user types
        //senate members
        for(let i=0; i<senateMembers.length; ++i){
            dataFirstName = (senateMembers[i].first_name).toLowerCase()     //converts names from lawmaker-data to lowercase
            dataLastName = (senateMembers[i].last_name).toLowerCase()
            
            if(dataFirstName.substr(0, searchbarValue.length) == searchbarValue){       //if the search matches any part of data.first_name
                autoList.appendChild(createSugContainer(senateMembers[i]))
            }
            else if (dataLastName.substr(0, searchbarValue.length) == searchbarValue){      //if the search matches any part of data.last_name
                autoList.appendChild(createSugContainer(senateMembers[i]))
            }
            else if ((`${dataFirstName} ${dataLastName}`).substr(0, searchbarValue.length) == searchbarValue){
                autoList.appendChild(createSugContainer(senateMembers[i]))
            }
        }
        //house members
        for(let i=0; i<houseMembers.length; ++i){
            dataFirstName = (houseMembers[i].first_name).toLowerCase()      //converts names from lawmaker-data to lowercase
            dataLastName = (houseMembers[i].last_name).toLowerCase()
            
            if(dataFirstName.substr(0, searchbarValue.length) == searchbarValue){       //if the search matches any part of data.first_name
                autoList.appendChild(createSugContainer(houseMembers[i]))
            }
            else if (dataLastName.substr(0, searchbarValue.length) == searchbarValue){      //if the search matches any part of data.last_name
                autoList.appendChild(createSugContainer(houseMembers[i]))
            }
            else if ((`${dataFirstName} ${dataLastName}`).substr(0, searchbarValue.length) == searchbarValue){
                autoList.appendChild(createSugContainer(houseMembers[i]))
            } 
        }
    }
}

//creates element for autocomplete suggestion
function createSugContainer(memberIndex) {
    const suggestionContainer = document.createElement("li")
    suggestionContainer.innerHTML = getInfo('name', memberIndex)
    suggestionContainer.id = getInfo('name', memberIndex)
    suggestionContainer.addEventListener('click', function(e) {
        getBillInfo(memberIndex)
        clearList()
        searchbarInput.value = ''
        idName.innerText = getInfo('name', memberIndex)
        idState.innerText = getInfo('state', memberIndex)
        idParty.innerText = getInfo('party', memberIndex)
        console.log("clicked")
        billTitle.innerText = String(billInfo)
        console.log(billInfo)
    })
    return suggestionContainer
}

//clears autocomplete list
function clearList() {
    autoListContainer.style.display = 'none'        //hides autocomplete list
    while(autoList.firstChild){
        autoList.removeChild(autoList.firstChild)
    }
}

//returns basic info of a particular member based on index within data
function getInfo(info, memberIndex) {
    if(info == 'name'){
        return `${memberIndex.first_name}  ${memberIndex.last_name}`
    }
    if(info == 'party') {
        if(memberIndex.party == "R"){
            return "Republican"
        }
        if(memberIndex.party == "D"){
            return "Democrat"
        }
    }
    if(info == 'state'){
        return memberIndex.state
    }
    if(info == 'id'){
        return memberIndex.id
    }
}

function getBillInfo(memberIndex){
    let id = getInfo('id', memberIndex)
    $.ajax({
        url: `https://api.propublica.org/congress/v1/members/${id}/votes.json`,
        beforeSend: function(xhr) {
            xhr.setRequestHeader("X-API-Key", "Hk6QVaUEQ453sdhadQMafiX9Ya5hblL7uwqVPEFw")
        }, success: function(data){
            billInfo = data.results[0].votes[0].description
            console.log(billInfo)
            console.log("Bill info data retrieval successful!")
        }
    });
}

//when user types in to search bar, the autocomplete process runs
searchbarInput.addEventListener('input', searchbarSuggest)

