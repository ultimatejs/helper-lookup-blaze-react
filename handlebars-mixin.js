HandlebarsComponent = {
	fromHandlebars: true,
	
	_contentBlockWithData(contentBlock, parent, data) {
		let oldData = parent.props.data;	
		parent.props.data = data;	
		let ret = contentBlock.call(parent); //call in context of parent	
		parent.props.data = oldData;
		return ret;
	}
	
	render() {
		return React.createElement('span', this.props, this.renderFunc());
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