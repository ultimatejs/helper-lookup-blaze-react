if(Meteor.isServer) return HelperLookupBlazeReact = {}; //so server side rendering isn't broken

/** 
* PARAMS:
* @param {String} path - eg: 'obj.prop.etc.method'
* @param {Array} args - eg: [param1 param2 `paramString` 123 keywordArg=bla]
* 
*
* REGEX REPLACE:
* `this._lookup('$1', [$2])` //$2 contains a list of variables+values+kwarg
* 
* ACTUAL CALL:
* `this._lookup(
* 	'obj.prop.etc.method', 
* 	[param1, param2, `paramString`, 123, {keywordArg: bla}] 
* )` 
* 
**/

HelperLookupBlazeReact = {
	__lookup(path, args) {
		let parts = this._removeDoubleDotSegments(path).split('.'); //array: ['obj', 'prop', 'etc']
		let name = parts.shift(); //only the first part is name we must lookup!
		let level = this._parentLevel(path); //eg: ../../grandParent === 2
		let data = this.props.data; //the equivalent of the data context in React is `this.props`, but we tack it on `props.data` so `data` can be a reference to a model object, and so `props` can contain props unrelated to the true data
		let args = args || [];
		let method;
		
		//0. parent data context (note: level === 0 is falsey)
		if(level) {
			data = this.parentData(level);
			method = data[name];
		}
		
		//1. template/component helper context
		else if(this.hasOwnProperty(name)) {
			method = this[name];
		}
		
		//2. global helper context
		else if(Template.__helpers[name]) { 
			method = Template.__helpers[name];
		}
		
		//3. current data context
		else if(data[name]) {
			method = data[name];
		}
		
		
		//A. {{someProp 'foo' 'bar'}}
		if(parts.length === 0) return method.apply(data, args); 
		
		//B. {{someProp.chainedMethod 'foo' 'bar'}}
		else {
			data = _.isFunction(method) ? method.call(data) : method; //dont apply args
			return this._traversePropertyChain(data, parts, args); 		//apply args here to last method in chain
		}
	},
	

	
	//chain dot-connected props, applying arguments to last method.
	//eg: `{{someProp.prop.meth 'foo' 'bar'}}`
	//note: each chained field can either be a property or a method
	//and if the last method can optionally take parameters
	_traversePropertyChain(data, parts, argsForLast) {
		for(let i = 0; i < parts.length; i++) {
			let name = parts[i];
			let args = i === parts.length - 1 ? argsForLast : [];
			
			data = _.isFunction(data[name]) ? data[name].apply(data, args) : data[name];
		}
		
		return data;
	},
	
	
	_removeDoubleDotSegments(name) {
		return name.replace(/\.\.|\//g, '');
	},
	
	
	_parentLevel(name) {
		return (name.match(/\.\.\//g) || []).length;
	},
	parentData(level) {
		let parentComponent = this._parentComponent(level, this);
		return parentComponent.props.data;
	},
	_parentComponent(level, component) {
	  for(let i = 0; i < level; i++) {
			if(component.fromHandlebars) level++; //don't count wrapper components
			component = component.parent;
		}
		return component;
	}
};