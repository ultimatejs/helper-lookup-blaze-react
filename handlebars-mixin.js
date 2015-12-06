HandlebarsMixin = {
	fromHandlebars: true,
	
	_contentBlockWithData(contentBlock, parent, data) {
		let oldData = parent.props.data;	
		parent.props.data = data;	
		let ret = contentBlock.call(parent); //call in context of parent	
		parent.props.data = oldData;
		return ret;
	}
	
	render() {
		return this._wrap(this.renderFunc, this.props);
	},
	
	_wrap(renderFunc, props) {
		//`render` must return a single element, not an array of elements.
		//perhaps later we replace this with a better wrapping approach.
		//see: https://github.com/facebook/react/issues/2127
		return React.createElement('span', props, renderFunc.call(this)); 
	},
	
	
	//Shortcuts (I'd use these in handlebars_components.js, but i wanted it to be clear to start).
	//We should therefore use these shortcuts instead when ready.
	_data() {
		return this.props.data;
	},
	_parent() {
		return this.props.parent;
	}
	_content() {
		return this.props.contentBlock;
	}
	_else() {
		return this.props.elseBlock;
	}
};