import Auth from './Auth.js'

class HTTP {

	static makeRequest(formData, method, path, authorizationRequired, callback) {
		const xhr = new XMLHttpRequest();
		xhr.open(method, path);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.responseType = 'json';

		if (authorizationRequired) {
			if (Auth.isUserAuthenticated()) {
				xhr.setRequestHeader('Authorization', `Bearer ${Auth.getToken()}`);
			} else {
				xhr.setRequestHeader('Authorization', `Bearer null`);
			}
		}

		let response = [];

		xhr.addEventListener('load', () => {
			callback(xhr);
		});

		if (formData) {
			console.log(formData);

			xhr.send(formData);
		} else {
			xhr.send();
		}
	}

}

export default HTTP;