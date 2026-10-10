const utils = new Utils()

document.addEventListener('DOMContentLoaded', () => {
    const tagDiv = document.querySelector('#tag-results')
    const fragment = document.createDocumentFragment()

    tagList.forEach(element => {
        fragment.appendChild(utils.createTagResult(element))
    })

    tagDiv.appendChild(fragment)

    utils.attachClickListener()    

})

document.getElementById('tag-input').addEventListener('input', (e) => {
       
    utils.clearFields()

    let string = e.target.value.trim().toLowerCase()

    tagList.forEach((tag) =>{
        if(string !== '' && (tag.Title.toLowerCase().includes(string)  || utils.contains(tag.AlternativeNames, string) )) {
            const result = document.getElementById(tag.Id)
            result.style.display = 'block'
            utils.underlineSearchedString(result, string)
        }
    })
})
