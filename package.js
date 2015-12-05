Package.describe({
	name: "ultimatejs:helper-lookup-blaze-react",
	summary: "Blaze style method lookup & more",
	version: '0.0.1',
	documentation: 'README.md',
	git: 'https://github.com/ultimatejs/helper-lookup-blaze-react'
});

Package.onUse(function (api) {
	api.versionsFrom('METEOR@1.2.1');
	api.use('underscore');
	api.use('ecmascript@0.1.5');
	
	
	api.addFiles([
		'handlebars-mixin.js',
		'handlebars-components.js',
		
		'helper-lookup-mixin.js',
		'template-register-helper.js',
	]);

	api.export([
		'HelperLookupBlazeReact', 
		'Template'
	]);
});