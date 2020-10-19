//store DOM elements into variables
const searchbarInput = document.querySelector('#search-bar')
const autoListContainer = document.querySelector('#autocomplete-container')
const autoList = document.querySelector('#autocomplete-list')
const idName = document.querySelector('#id-name')
const idState = document.querySelector('#id-state')
const idParty = document.querySelector('#id-party')
const lawmakerInfo = document.querySelector('#lawmaker-info')
const billCardsContainer = document.querySelector('#bill-cards-container')
let senateMembers
let houseMembers
let currentID

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
    clearSugList()
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
    suggestionContainer.innerHTML = getLawmakerInfo('name', memberIndex)
    suggestionContainer.id = getLawmakerInfo('name', memberIndex)
    suggestionContainer.addEventListener('click', function(e) {
        clearSugList()
        searchbarInput.value = ''
        currentID = getLawmakerInfo('id', memberIndex)
        idName.innerText = getLawmakerInfo('name', memberIndex)
        idState.innerText = getLawmakerInfo('state', memberIndex)
        idParty.innerText = getLawmakerInfo('party', memberIndex)
        getBillData(currentID)
    })
    suggestionContainer.addEventListener('mouseenter', function(e){
        event.target.style.backgroundColor = '#00FFFF';
    })
    suggestionContainer.addEventListener('mouseleave', function(e){
        event.target.style.backgroundColor = 'white';
    })
    return suggestionContainer
}

//clears autocomplete list
function clearSugList() {
    autoListContainer.style.display = 'none'        //hides autocomplete list
    while(autoList.firstChild){
        autoList.removeChild(autoList.firstChild)
    }
}

//returns basic info of a particular lawmaker based on index within data
function getLawmakerInfo(info, memberIndex) {
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

//Takes in member id, then recieves most 20 most recently voted on bills
function getBillData(id){
    id = currentID
    $.ajax({
        url: `https://api.propublica.org/congress/v1/members/${id}/votes.json`,
        beforeSend: function(xhr) {
            xhr.setRequestHeader("X-API-Key", "Hk6QVaUEQ453sdhadQMafiX9Ya5hblL7uwqVPEFw")
        }, success: function(data){
            let billInfo = data.results[0]
            console.log(billInfo)
            console.log("Bill info data retrieval successful!")
            setBillCards(billInfo)
        }
    });
}

//sets billcard info based on last 5 voted on bills
function setBillCards(data) {
    clearBillList()
    let date
    let title
    let vote
    for(let i = 0; i<5; i++){
        date = data.votes[i].date
        title = data.votes[i].bill.title
        vote = data.votes[i].position
        makeBillCard(date, title, vote)
    }
}

//creates and styles bill cards
function makeBillCard(date, title, vote) {
    //make elements
    const billCard = document.createElement('div')
    billCard.class = 'bill-cards'

    const billDate = document.createElement('p') 
    billDate.id = 'bill-date'
    billDate.innerText = date;

    const billTitle = document.createElement('p')
    billTitle.id = 'bill-title'
    console.log(title)
    billTitle.innerText = title

    const billVote = document.createElement('p')
    billVote.id = 'bill-vote'
    billVote.innerText = vote

    // const expandButton = document.createElement('button')
    // expandButton.id = 'expand'
    // expandButton.innerText = 'V'

    //style elements
    billCard.style.borderTop = 'solid'
    // billCard.style.borderBottom = 'solid'
    billCard.style.borderWidth = '0.75px'
    billCard.style.display = 'flex'
    billCard.style.flexDirection = 'row'
    billCard.style.height = '3em'
    billCard.style.overflow = 'hidden'
    billCard.style.padding = '1em'

    billCard.appendChild(billDate)
    billCard.appendChild(billTitle)
    billCard.appendChild(billVote)
    // billCard.appendChild(expandButton)

    billCardsContainer.appendChild(billCard)
}

//clears bill cards
function clearBillList() {
    while(billCardsContainer.firstChild){
        billCardsContainer.removeChild(billCardsContainer.firstChild)
    }
}

function truncateText(text, maxLength) {
    let truncated = text
    if (text.length > maxLength) {
        truncated = text.substr(0,maxLength) + '...';
    }
    return truncated;
}

//when user types in to search bar, the autocomplete process runs
searchbarInput.addEventListener('input', searchbarSuggest)

