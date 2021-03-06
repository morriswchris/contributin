/* global io,superagent */

var body = document.body
var request = superagent

// elements
var form = body.querySelector('form#invite')
var username = form.elements['username']
var coc = form.elements['coc']
var button = body.querySelector('button')

// remove loading state
button.className = ''

// capture submit
body.addEventListener('submit', function (ev){
  ev.preventDefault()
  button.disabled = true
  button.className = ''
  button.innerHTML = 'Please Wait'
  invite(coc && coc.checked ? 1 : 0, username.value, function (err, msg){
    if (err) {
      button.removeAttribute('disabled')
      button.className = 'error'
      button.innerHTML = err.message
    } else {
      button.className = 'success'
      button.innerHTML = msg
    }
  })
})

function invite (coc, username, fn){
  request
  .post(data.path + 'invite')
  .send({
    coc: coc,
    username: username
  })
  .end(function (res){
    if (res.body.redirectUrl) {
      var err = new Error(res.body.msg || 'Server error')
      window.setTimeout(function () {
        topLevelRedirect(res.body.redirectUrl)
      }, 1500)
    }
    if (res.error) {
      var err = new Error(res.body.msg || 'Server error')
      return fn(err)
    } else {
      fn(null, res.body.msg)
    }
  })
}

// use dom element for better cross browser compatibility
var url = document.createElement('a')
url.href = window.location

// redirect, using "RPC" to parent if necessary
function topLevelRedirect (url) {
  if (window === top) location.href = url
  else parent.postMessage('slackin-redirect:' + id + ':' + url, '*')
  // Q: Why can't we just `top.location.href = url;`?
  // A:
  // [sandboxing]: http://www.html5rocks.com/en/tutorials/security/sandboxed-iframes/
  // [CSP]: http://www.html5rocks.com/en/tutorials/security/content-security-policy/
  // [nope]: http://output.jsbin.com/popawuk/16
};

// "RPC" channel to parent
var id
window.addEventListener('message', function onmsg (e){
  if (/^slackin:/.test(e.data)) {
    id = e.data.replace(/^slackin:/, '')
    window.removeEventListener('message', onmsg)
  }
})
