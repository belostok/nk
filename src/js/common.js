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

const getSiblings = e => {
    let siblings = []
    let sibling = e.parentNode.firstChild

    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== e) {
            siblings.push(sibling)
        }
        sibling = sibling.nextSibling
    }
    return siblings
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
        const response = await fetch('/assets/app/mail.php', {
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
isMobile && sandwich.addEventListener('click', () => {
    if (!sandwich.classList.contains('active')) {
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
    const scrollAnimations = !isMobile && sal()

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
            let proccess = false
            e.addEventListener('mouseenter', () => {
                if (!proccess && !e.classList.contains('dropdown')) {
                    dropdown.style.display = 'block'
                    setTimeout(() => e.classList.add('dropdown'), 0)
                }
            })
            e.addEventListener('mouseleave', () => {
                if (!isMobile) {
                    proccess = true
                    e.classList.remove('dropdown')
                    setTimeout(() => {
                        dropdown.style.display = 'none'
                        proccess = false
                    }, 300)
                }
            })
        }
    })

    const serviceList = document.querySelectorAll('#serviceText ul')
    Array.from(serviceList).forEach(e => {
        const serviceListItems = e.querySelectorAll('li')
        serviceListItems.length > 3 && e.classList.add('long')
    })

    const services = document.querySelectorAll('.serviceHover')
    services.forEach(s => {
        const siblings = getSiblings(s)
        s.addEventListener('mouseenter', () => {
            siblings.forEach(sib => sib.classList.add('sibling'))
        })
        s.addEventListener('mouseleave', () => {
            services.forEach(serv => serv.classList.remove('sibling'))
        })
    })

    const teamPage = () => {
        const teamItems = document.querySelectorAll('.commonTeam .item')
        const teamItem = document.querySelector('.commonTeam .item')
        const teamItemInner = teamItem && teamItem.querySelector('.itemInner')
        const teamItemHeight = teamItem && window.getComputedStyle(teamItem).getPropertyValue('height')
        const teamItemLeft = teamItemInner && window.getComputedStyle(teamItemInner, ':before').getPropertyValue('left').replace('px', '')

        const teamInit = active => {
            teamItems.forEach(item => {
                const itemInner = item.querySelector('.itemInner')
                const teamItemLowerLong = item.querySelector('.lowerSide .long')
                item.classList.remove('active')
                itemInner.style.height = teamItemHeight
                itemInner.style.setProperty('--left', null)
                itemInner.style.setProperty('--width', null)
                if (active) {
                    item.style.zIndex = 0
                } else {
                    setTimeout(() => item.style.zIndex = 0, 300)
                }
                if (teamItemLowerLong) { teamItemLowerLong.style.opacity = 0 }
            })
        }

        const teamHeight = item => {
            const itemInner = item.querySelector('.itemInner')
            const upperSide = item.querySelector('.upperSide')
            const lowerSide = item.querySelector('.lowerSide')
            const openHeight = (upperSide.offsetHeight + lowerSide.offsetHeight)
            const heightDif = (openHeight - teamItemHeight.replace('px', '')) / 2
            itemInner.style.height = `${openHeight}px`
            itemInner.style.setProperty('--left', `${teamItemLeft - heightDif}px`)
            itemInner.style.setProperty('--width', `${openHeight}px`)
        }

        Array.from(teamItems).forEach(t => {
            t.addEventListener('click', () => {
                const teamItemLowerLong = t.querySelector('.lowerSide .long')
                const hasChild = teamItemLowerLong && teamItemLowerLong.childNodes.length > 1

                if (!t.classList.contains('active') && hasChild) {
                    teamInit(true)
                    t.classList.add('active')
                    t.style.zIndex = 1
                    teamHeight(t)
                    setTimeout(() => {
                        if (teamItemLowerLong) { teamItemLowerLong.style.opacity = 1 }
                    }, 100)
                } else {
                    teamInit()
                }
            })
        })

        window.addEventListener('click', e => {
            const getActive = () => {
                let trueCount = 0
                teamItems.forEach(item => {
                    if (item.contains(e.target)) {
                        trueCount++
                    }
                })
                return trueCount
            }
            getActive() < 1 && teamInit()
        })
    }
    !isMobile && teamPage()

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

    const serviceSlider = document.getElementById('serviceSlider')
    const numOfSlides = document.querySelectorAll('#doubleSlider .swiper-slide').length
    if (numOfSlides > 1) {
        const doubleSlider = new Swiper('#doubleSlider', {
            speed: 600,
            spaceBetween: 20,
            slidesPerView: 1,
            loop: true,
            navigation: {
                nextEl: '#serviceSlider .next',
                prevEl: '#serviceSlider .prev'
            },
            breakpoints: {
                768: {
                    slidesPerView: 2
                }
            }
        })
    } else {
        serviceSlider && serviceSlider.classList.add('notSlider')
    }

    const homeForm = document.getElementById('homeForm')
    homeForm && homeForm.addEventListener('submit', formSend)

})

const titlesDec = document.querySelectorAll('.titleDec')
titlesDec.forEach(section => {
  gsap.from(section, 
  {
    scrollTrigger: {
        trigger: section,
        start: '10% bottom',
    },
    left: '-80px', 
    opacity: 0, 
    delay: 0.8
  })
})
gsap.from('header .dec', { left: '100vw', delay: 0.6 })
gsap.from('#homeTitle > .decs .bottomRightBlock', { right: '-45vw', delay: 0.8 })
gsap.from('#homeTitle .title .decs .topLeftLine', { opacity: 0, delay: 1.2 })
gsap.from('#homeTitle > .decs .bottomRightLine', { opacity: 0, delay: 1.4 })
gsap.from('#homeServices .wrapper > .decs .leftLine', { scrollTrigger: '#homeServices', opacity: 0, delay: 1.2 })
gsap.from('#homeServices .wrapper > .decs .rightLine', { scrollTrigger: '#homeServices', opacity: 0, delay: 1.4 })
gsap.from('#homeTeam .wrapper .decs .line', { 
    scrollTrigger: {
        trigger: '#homeTeam',
        start: '80% bottom'
    }, 
    opacity: 0, 
    delay: 1.4 
})
gsap.from('#homeApplication .wrapper .decs .line', { 
    scrollTrigger: {
        trigger: '#homeApplication',
        start: '80% bottom'
    }, 
    opacity: 0, 
    delay: 1.4 
})
