const log = console.log
const isMobile = window.matchMedia('(max-width: 768px)').matches

const classActive = (el, el2) => {
    if (el.classList.contains('active')) {
        el.classList.remove('active')
    } else {
        el.classList.add('active')
    }
    if (el2) {
        if (el2.classList.contains('active')) {
            el2.classList.remove('active')
        } else {
            el2.classList.add('active')
        }
    }
}

const autoHeight = (content, container) => {
    if (container.classList.contains('active')) {
        content.style.height = 0
    } else {
        content.style.height = 'auto'
        const height = content.offsetHeight
        content.style.height = 0
        content.style.transition = 'height .3s'
        setTimeout(() => content.style.height = `${height}px`, 0)
    }
}

const emailTest = i =>
    !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(i.value)

const formAddError = i => {
    i.parentElement.classList.add('_error')
    i.classList.add('_error')
}

const formRemoveError = i => {
    i.parentElement.classList.remove('_error')
    i.classList.remove('_error')
}

const formValidate = f => {
    let error = 0
    const req = f.querySelectorAll('._req')
    for (let i = 0; i < req.length; i++) {
        const input = req[i]
        formRemoveError(input)
        if (input.classList.contains('_email')) {
            if (emailTest(input)) {
                formAddError(input)
                error++
            }
        } else if (input.classList.contains('_name')) {
            if (input.value.length < 2) {
                formAddError(input)
                error++
            }
        } else if (input.getAttribute('type') === 'checkbox' &&
            input.checked === false) {
            formAddError(input)
            error++
        }
    }
    return error
}

const formSend = async e => {
    e.preventDefault()
    const form = e.target
    const error = formValidate(form)
    const formData = new FormData(form)

    if (error === 0) {
        form.classList.add('_sending')
        const response = await fetch('../mail.php', {
            method: 'POST',
            body: formData
        })
        if (response.ok) {
            // const result = await response.json()
            log('form sended')

            form.reset()
            form.classList.remove('_sending')
        } else {
            log('sending error')
            form.classList.remove('_sending')
        }
    } else {
        log('validation error')
    }
}

const header = document.querySelector('header')
const sandwich = document.getElementById('sandwich')
const menu = document.querySelector('header nav')
const menuUl = menu.querySelector('ul')
sandwich.addEventListener('click', () => {
    if(!sandwich.classList.contains('active')) {
        menu.style.display = 'block'
        setTimeout(() => classActive(sandwich, menu), 0)
    } else {
        classActive(sandwich, menu)
        setTimeout(() => menu.style.display = 'none', 300)
    }
})

menu.addEventListener('scroll', e => {
    const offset = e.target.scrollTop
    offset > 50 ?
    header.classList.add('menuScroll') :
    header.classList.remove('menuScroll')
})

document.addEventListener('scroll', () => {

    const offset = window.scrollY
    offset > 100 ?
        header.classList.add('active') :
        header.classList.remove('active')

})

document.addEventListener('DOMContentLoaded', () => {

    const currentYear = document.querySelector('.currentYear')
    if (currentYear) { currentYear.innerHTML = new Date().getFullYear() }

    const textAngle = document.querySelectorAll('.textAngle')
    Array.from(textAngle).forEach(e => {
        if (isMobile && e.classList.contains('mobile')) { return false }
        const height = e.offsetHeight
        const compStyles = window.getComputedStyle(e)
        const lineHeight = compStyles.getPropertyValue('line-height').replace('px', '')
        const numberOfLines = height / lineHeight
        const offsetIncrement = isMobile ? 45 : 60
        let highestValue = numberOfLines * offsetIncrement
        const parentNode = e.parentNode
        parentNode.style.marginLeft = `-${offsetIncrement}px`
        for (let i = 0; i <= numberOfLines; i++) {
            const newSpan = document.createElement('span')
            newSpan.classList.add('text-offset')
            newSpan.style.width = `${highestValue}px`
            newSpan.style.height = `${lineHeight}px`
            newSpan.style.float = 'left'
            newSpan.style.clear = 'left'
            parentNode.insertBefore(newSpan, e)
            highestValue = highestValue - offsetIncrement
        }
    })

    const headerMenuItems = document.querySelectorAll('header nav > ul > li')
    Array.from(headerMenuItems).forEach(e => {
        const dropdown = e.querySelector('ul')
        if (dropdown && !isMobile) {
            e.addEventListener('mouseenter', () => {
                if (!e.classList.contains('dropdown')) {
                    dropdown.style.display = 'block'
                    setTimeout(() => e.classList.add('dropdown'), 0)
                }
            })
            e.addEventListener('mouseleave', () => {
                if (!isMobile) {
                    e.classList.remove('dropdown')
                    setTimeout(() => dropdown.style.display = 'none', 300)
                }
            })
        }
    })

    const serviceList = document.querySelectorAll('#serviceText ul')
    Array.from(serviceList).forEach(e => {
        const serviceListItems = e.querySelectorAll('li')
        serviceListItems.length > 3 && e.classList.add('long')
    })






    const clientsSlider = new Swiper('#clientsSlider', {
        speed: 800,
        spaceBetween: 20,
        slidesPerView: 1,
        loop: true,
        navigation: {
            nextEl: '#homeClients .next',
            prevEl: '#homeClients .prev'
        }
    })

    const partnersSlider = new Swiper('#partnersSlider', {
        speed: 300,
        spaceBetween: 20,
        slidesPerView: 3,
        loop: true,
        autoplay: {
            delay: 4000
        },
        navigation: {
            nextEl: '#homePartners .next',
            prevEl: '#homePartners .prev'
        },
        breakpoints: {
            768: {
                speed: 600,
                slidesPerView: 5
            }
        }
    })

    const singleSlider = new Swiper('#singleSlider', {
        speed: 800,
        spaceBetween: 20,
        slidesPerView: 1,
        loop: true,
        navigation: {
            nextEl: '#serviceSlider .next',
            prevEl: '#serviceSlider .prev'
        }
    })
    const doubleSlider = new Swiper('#doubleSlider', {
        speed: 600,
        spaceBetween: 20,
        slidesPerView: 2,
        loop: true,
        navigation: {
            nextEl: '#serviceSlider .next',
            prevEl: '#serviceSlider .prev'
        }
    })

    // const callbackForm = document.getElementById('callbackForm')
    // callbackForm.addEventListener('submit', formSend)

})

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {

    }
}

// if (document.getElementById('contactsPage')) {
//     DG.then(() => {
//         let map
//         const mapIcon = DG.icon({
//             iconUrl: '/assets/app/img/marker.png',
//             iconSize: isMobile ? [23, 24] : [33, 34]
//         })
//         map = DG.map('map', {
//             center: [55.753466, 37.62017],
//             zoom: 10
//         })
//         DG.marker([55.749874, 37.53774], { icon: mapIcon }).addTo(map)
//         DG.marker([55.962681, 37.509696], { icon: mapIcon }).addTo(map)
//     })
// }