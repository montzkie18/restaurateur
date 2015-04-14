define('utils', function(){
	var Utils = {
		html : function(el) {
			var tmp = document.createElement("div");
			tmp.appendChild(el);
			return tmp.innerHTML;
		}
	};
	return Utils;
});