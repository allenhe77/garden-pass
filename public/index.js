
const jsonData = {
	name:'terminator777',
	email:'effy@11.com',

}

const mainUrl = 'https://auth.effysurreal.codes'

const inputField = document.querySelector('#copy')

const makeReq = async () => {
	let result = await fetch('https://auth.effysurreal.codes/auth/gen2',{
		method:'post',
		headers:{
			'Content-Type':'application/json'
		},
		body:JSON.stringify(jsonData)
	})
	result = await result.json()
	console.log(result)
	inputField.value = mainUrl + "/auth/activate/" + result.uuid
}
const copyBtn = document.querySelector('#copy-link')
const genBtn = document.querySelector('#gen-link')

const copyLink = () => {
	
	inputField.select()
	document.execCommand('copy')
}

genBtn.addEventListener('click',makeReq)
copyBtn.addEventListener('click',copyLink)

const getCookieValue = (name) => (
	document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
  )