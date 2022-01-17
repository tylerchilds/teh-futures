import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

const methods = {
	'GET': handleGet,
	'POST': handlePost,
}

const modes = {
	'autosave': autosave,
	'save': save,
}

async function autosave(pathname, params) {
	const { value } = params
	await Deno.writeTextFile(`./public${pathname}.autosave`, value)
	return editor(request)
}

async function save(pathname, params) {
	const { value } = params
	await Deno.writeTextFile(`./public${pathname}`, value)
	return editor(request)
}

async function handleRequest(request) {
	return await (methods[request.method] || methods['POST'])(request)
}

async function handlePost(request) {
	const { pathname } = new URL(request.url);
	const params = await request.json()

	return (modes[params.mode] ||	function(){})(pathname, params)
}

async function handleGet(request) {
	const { pathname } = new URL(request.url);

	const isAutosave = pathname.split('.').slice(-1) === 'autosave'
	const extensionPosition = isAutosave ? -2 : -1

	if (pathname.startsWith('/public')) {
		const file = await Deno.readFile(`.${pathname}`)
		const extension = pathname.split('.').slice(extensionPosition)
		return new Response(file, {
			headers: {
				'content-type': getType(extension),
			},
		})
	}

	return editor(request)
}

function editor(request) {
	const { pathname } = new URL(request.url);

	return new Response(`<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>
		${pathname}
	</title>
</head>
<body>
	<main
		class="source-code"
		id="${pathname}"
	></main>
	<script type="module">
		import createEditor from '/public/editor.bundle.js'

		createEditor('.source-code')
	</script>
</body>
</html>`,
		{
			headers: {
				"content-type": getType('html'),
			},
		},
	)
}

const types = {
	'css': 'text/css; charset=utf-8',
	'html': 'text/html; charset=utf-8',
	'js': 'text/javascript; charset=utf-8'
}

function getType(ext) {
	return types[ext] || 'text/plain; charset=utf-8'
}

console.log("Listening on http://localhost:8000");
serve(handleRequest);
