/**
* <Each 
*		parent={this} data={this.__lookup('$1', [$2])} 
*		contentBlock={() => <CONTENT_BETWEEN_#EACH_AND_ELSE_OR_/EACH /> } 
*		elseBlock={() => <CONTENT_BETWEEN_ELSE_AND_/EACH /> } 
* />
**/
Each = React.createClass({
	mixins: [HandlebarsMixin],
	renderFunc() {
		let {data, parent, contentBlock, elseBlock} = this.props;
		
		if(_.isArray(data) && !_.isEmpty(data)) {
			return data.map((item, index) => {
				return this._contentBlockWithData(contentBlock, parent, item);
			});
		}
		else return elseBlock.call(parent);		//i.e. where block was defined
	}
});

//<With parent={this} data={this.__lookup('$1', [$2])} contentBlock={contentBlock} />
With = React.createClass({
	mixins: [HandlebarsMixin],
	renderFunc() {
		let {data, parent, contentBlock} = this.props;
		return this._contentBlockWithData(contentBlock, parent, data);
	}
});


//<If parent={this} data={this.__lookup('$1', [$2])} contentBlock={contentBlock} elseBlock={elseBlock} />
If = React.createClass({
	renderFunc() {
		let {data, parent, contentBlock, elseBlock} = this.props;

		if(data) return contentBlock.call(parent); 		//call in context of parent
		else return elseBlock.call(parent);						//i.e. where block was defined
	}
});


//<Unless parent={this} data={this.__lookup('$1', [$2])} contentBlock={contentBlock} elseBlock={elseBlock} />
Unless = React.createClass({
	mixins: [HandlebarsMixin],
	renderFunc() {
		let {data, parent, contentBlock, elseBlock} = this.props;

		if(!data) return contentBlock.call(parent); 	//call in context of parent
		else return elseBlock.call(parent);						//i.e. where block was defined
	}
});




/**
* HOW TO TRANPSPILE CUSTOM BLOCK HELPER "TEMPLATES" WHICH CONTAIN `Template.content/elseBlock`:

---------HANDLEBARS---------

<template name="UnlessSpecial">
  {{#if this}}															//note JSX has no concept of `this` being simple values
    {{> Template.elseBlock key='foo'}}
  {{else}}
    {{> Template.contentBlock key='bar'}}
  {{/if}}
</template>


------------JSX------------

UnlessSpecial = React.createClass({
	render() {
		return <If parent={this} data={this.props.data} 
			contentBlock={() => this._contentBlockWithData(this.props.elseBlock, this.props.parent, {key: 'foo'}) } 
			elseBlock={() => this._contentBlockWithData(this.props.contentBlock, this.props.parent, {key: 'foo'}) }
	 	/>;
	}	
});


* NOTICE: how the above transpilation is very close to the original handlebars code. 
* Template.elseBlock 			-> 		this.props.elseBlock
* Template.contentBlock 	-> 		this.props.contentBlock
*
* `{{> Template.elseBlock` -> `this._contentBlockWithData(this.props.elseBlock, this.props.parent` :)
*
* note: `this.props.parent` is passed, which accurately reflects exactly how Spacebars behaves!




* HERE'S WHAT THE CALLING CODE LOOKS LIKE:


---------HANDLEBARS---------

{{#UnlessSpecial true}}
	<div>something falsey - {{parentScopeProp}}</div>
{{else}}
	<div>someting truthy - {{parentScopeProp}}</div>
{{/unless}}


------------JSX-------------

<UnlessSpecial data={true} parent={this} 
	contentBlock={() => <div>something falsey - {this.__lookup('parentScopeProp')}</div> } 
	elseBlock={() => <div>something truthy - {this.__lookup('parentScopeProp')}</div> } 
/>

* NOTE: `this.__lookup()` does not need to lookup templates like lookup.js does for Blaze.
* The reason is that we automatically transpaile {{#someBlock}} to <someBlock>. 
* In short, block helpers after `#` are never looked up. We have a matching component
* by the same name always. For "built-ins" we make the react versions like we have done above
* with: <each>, <with>, <if>, <unless> :)
*
* The reason this is in the 'helper-lookup' mixin package is because this package originally
* intended to lookup custom block helpers, but then I realized the solution was instead
* to pre-make "built-ins" and facilitate a 1-to-1 match to components for custom block helpers.
**/
