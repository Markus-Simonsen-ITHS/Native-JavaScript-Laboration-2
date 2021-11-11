const consent = localStorage.getItem('consent')

function loadGA() {
    const jqueryScript = document.createElement('script')
    jqueryScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-WZWLJTKVTM'
    jqueryScript.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());

        gtag('config', 'G-WZWLJTKVTM');
    }
    document.head.append(jqueryScript)
}

console.log()

if (consent && consent === 'true') {
    loadGA()
} else {
    fetch(document.currentScript.getAttribute('loc') + 'cookie.html').then(response => response.text()).then(text => {
        const cookie = document.createElement('div')
        cookie.innerHTML = text
        document.body.append(cookie)
    });
}

function consentGA(consent) {
    localStorage.setItem('consent', consent)
    loadGA()
    document.querySelector('#cookieConsent').remove()
}