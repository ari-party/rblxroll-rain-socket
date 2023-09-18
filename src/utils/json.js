/**
 * Checks if a string is Json
 *
 * @param {string} str Json?
 * @returns {*} Truthy or falsy if Json respectfully
 */
module.exports.isJsonStructured = (str) => {
	if (typeof str !== "string") return false;
	try {
		const result = JSON.parse(str);
		const type = Object.prototype.toString.call(result);
		return type === "[object Object]" || type === "[object Array]";
	} catch (err) {
		return false;
	}
};