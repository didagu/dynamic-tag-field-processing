const utils = new Utils()

document.addEventListener('DOMContentLoaded', () => {
    const tagDiv = document.querySelector('#tag-results')
    tagList.forEach(element => {
        const markup = `
            <div class="tag-result" id="${element.Id}">
                <b><span class="tag-title">${element.Title}</span></b>
                <p class="tag-description">${element.Description}</p>
                <div class="tag-alternative-names">
                    ${element.AlternativeNames.map(alternative_name => 
                        `<div class="tag-alternative-name">${alternative_name}</div>`
                    ).join('')}
                </div>
            </div>
        `
        tagDiv.innerHTML += markup
    });
    
    utils.attachClickListener()    

})

document.getElementById('tag-input').addEventListener('input', (e) => {
       
    utils.clearFields()

    let string = e.target.value

    tagList.forEach((tag) =>{
        if(string !== '' & (tag.Title.includes(string)  || utils.contains(tag.AlternativeNames, string) )) {
            document.getElementById(`${tag.Id}`).style.display = 'block'
            utils.underlineSearchedString(string)
        }
    })
})








