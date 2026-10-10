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

    tagList.forEach((tag, index) =>{
        if(string !== '' && !utils.tags.includes(index) && (tag.Title.toLowerCase().includes(string)  || utils.contains(tag.AlternativeNames, string) )) {
            const result = document.getElementById(tag.Id)
            result.style.display = 'block'
            utils.underlineSearchedString(result, string)
        }
    })

    e.target.setAttribute('aria-expanded', utils.visibleResults().length > 0)
})

document.getElementById('tag-input').addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        utils.moveActive(e.key === 'ArrowDown' ? 1 : -1)
    } else if (e.key === 'Enter') {
        const active = document.querySelector('.tag-result.active')
        if (active) {
            e.preventDefault()
            active.click()
        }
    } else if (e.key === 'Escape') {
        utils.clearInput()
    }
})
