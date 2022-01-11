(function(){
	this.Class = {
	    BASE_CON_FN_NAME: "_baseCon", 
	    _className: null,
	    _error : function (name,error){
			switch(error) {
			case 0:
			throw new Error("The parent class '" + name + "' is not defined");break; 
			default:}
	    },
	    _rewSubClassCon: function(baseClassName, _conFn) {
	        var tConFnStr = _conFn.toString();
	        var tConFnstrLine = tConFnStr.split("\n");
	        tConFnStr = (tConFnstrLine[1].indexOf(this.BASE_CON_FN_NAME)!=-1) ? 
	        			tConFnStr.replace(tConFnstrLine[1],baseClassName+".call(this,"+this._getArg(tConFnstrLine[1])+")") :
	        			tConFnArr[0] + " { \n" + baseClassName + ".apply(this, arguments); " + tConFnStr.split("{")[1];
	        return(new Function("return "+tConFnStr)());
	    },
	    _getArg: function(_function) {
	        var fn = _function.toString();
	        return fn.substring(fn.indexOf('(') + 1, fn.indexOf(')')).split(',');
	    },
	    _getObjItemName: function(Obj) {
	        var objItemNames = [], i = -1;
	        for (itemName in Obj) {
	            i++;objItemNames[i] = itemName;}
	        return objItemNames;
	    },
	    $: function(className, object) {
	        if (!window[className] && !object ) {
	                this._className = className; return this; }
	        var tClass = object[this._getObjItemName(object)[0]];
	        for (var i = 1; i < this._getObjItemName(object).length; i++)
	            tClass.prototype[this._getObjItemName(object)[i]]=object[this._getObjItemName(object)[i]];
	        window[className] = tClass;return undefined;
	    },
	    extends: function(baseClassName, object) {
	        if (!window[baseClassName])this._error(baseClassName,0);
	        var tSubClass = this._rewSubClassCon(baseClassName, object[this._getObjItemName(object)[0]]); 
	        tSubClass.prototype = Object.create(window[baseClassName].prototype);
	        tSubClass.prototype.constructor = tSubClass;
	        for (var i = 1; i < this._getObjItemName(object).length; i++)
	        	tSubClass.prototype[this._getObjItemName(object)[i]]=object[this._getObjItemName(object)[i]];
	        window[this._className] = tSubClass;return undefined;
	    }
	};
}).call(this);