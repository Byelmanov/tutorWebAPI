const sendAJAX = (method, url, data = null) => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open(method, url);
		xhr.setRequestHeader('Accept', 'application/json');
		xhr.responseType = 'json';

		xhr.onload = () => {
			if (xhr.status === 200) {
				resolve(xhr.response);
			} else {
				let responseObj;
				try {
					responseObj = xhr.response;
					responseObj.status = xhr.status;
					responseObj.statusText = xhr.statusText;
				} catch (e) {
					responseObj = {
						status: xhr.status,
						statusText: xhr.statusText,
					}
				}

				reject(responseObj);
			}
		}

		xhr.onerror = () => {
			const responseObj = {
				status: xhr.status,
				statusText: xhr.statusText,
			}
			reject(responseObj);
		}

		xhr.send(data);
	});
}

const defaultAjaxErrorHandler = data => {
	let errors = data.errors;
	if (errors !== undefined) {
		let strWithError = '';
		for (let error in errors) {
			strWithError += errors[error][0] + '\n';
		}
		putTextInAlertAndShowIt(strWithError);
	} else {
		putTextInAlertAndShowIt('Упс, что-то пошло не так(');
		console.error(data.status, data.statusText);
	}
}

const redirectIfAjaxSuccess = data => {
	let linkToRedirect = data.redirect;
	if (linkToRedirect != undefined) {
		window.location.href = linkToRedirect;
	} else {
		putTextInAlertAndShowIt('Упс, что-то пошло не так(');
		throw new Error('cant find link');
	}
}

export { sendAJAX, defaultAjaxErrorHandler, redirectIfAjaxSuccess };








