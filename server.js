import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

async function handleRequest(request) {
  const { pathname } = new URL(request.url);

  if (pathname.startsWith("/public")) {
    const file = await Deno.readFile(`.${pathname}`)
		const extension = pathname.split('.').slice(-1)
    return new Response(file, {
      headers: {
        "content-type": getType(extension),
      },
    })
  }

  return new Response(`
			<!doctype html>
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
            import createEditor
              from '/public/editor.bundle.js'

            console.log({ createEditor })

            createEditor('.source-code')
          </script>
        </body>
      </html>
		`,
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
