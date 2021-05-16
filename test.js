const { strictEqual: equal } = require('assert')
const md = require('markdown-it')
const highlightjs = require('./')

equal(
  (() => {
    try {
      return md().use(require('./core'))
    } catch (ex) {
      return ex.message
    }
  })(),
  'Please pass a highlight.js instance for the required `hljs` option.'
)

equal(
  md().use(highlightjs, { hljs: require('highlight.js/lib/core') }).render('```js\nconsole.log(42)\n```'),
  `<pre><code class="hljs language-js">console.log(42)\n</code></pre>
`)

equal(
  md().use(highlightjs).render('```js\nconsole.log(42)\n```'),
  `<pre><code class="hljs language-js"><span class="hljs-built_in">console</span>.log(<span class="hljs-number">42</span>)
</code></pre>
`)

equal(
  md().use(highlightjs).render('```\ntest\n```'),
  `<pre><code class="hljs"><span class="hljs-keyword">test
</span></code></pre>
`)

equal(
  md().use(highlightjs).render('    test\n'),
  `<pre><code class="hljs">test
</code></pre>
`)

equal(
  md().use(highlightjs, { code: false }).render('    test\n'),
  `<pre><code>test
</code></pre>
`)

equal(
  md().use(highlightjs).render('```\n<?php echo 42;\n```'),
  `<pre><code class="hljs"><span class="hljs-meta">&lt;?php</span> <span class="hljs-keyword">echo</span> <span class="hljs-number">42</span>;
</code></pre>
`)

equal(
  md().use(highlightjs, { auto: false }).render('```\n<?php echo 42;\n```'),
  `<pre><code class="hljs">&lt;?php echo 42;
</code></pre>
`)

equal(
  md().use(highlightjs, { register: { test: require('highlight.js/lib/languages/sql') } })
    .render('```test\nSELECT * FROM TABLE;\n```'),
  `<pre><code class="hljs language-test"><span class="hljs-keyword">SELECT</span> <span class="hljs-operator">*</span> <span class="hljs-keyword">FROM</span> <span class="hljs-keyword">TABLE</span>;
</code></pre>
`)

// Inline works with pandoc format e.g. `code`{.lang}
equal(
  md().use(highlightjs, { inline: true }).renderInline('`console.log(42)`{.js}'),
  '<code class="language-js"><span class="hljs-built_in">console</span>.log(<span class="hljs-number">42</span>)</code>')

// Inline works with kramdown format e.g. `code`{:.lang}
equal(
  md().use(highlightjs, { inline: true }).renderInline('`console.log(42)`{:.js}'),
  '<code class="language-js"><span class="hljs-built_in">console</span>.log(<span class="hljs-number">42</span>)</code>')

// Escape language class
equal(
  md().use(highlightjs, { inline: true }).renderInline('`console.log(42)`{:."><img onerror=alert(1) src=.>js}'),
  '<code class="language-&quot;&gt;&lt;img onerror=alert(1) src=.&gt;js"></code>')

// Inline is not enabled by default
equal(
  md().use(highlightjs).renderInline('`console.log(42)`{.js}'),
  '<code>console.log(42)</code>{.js}')

// Inline uses same auto behaviour as blocks.
equal(
  md().use(highlightjs, { inline: true }).renderInline('`console.log(42)`'),
  '<code>console.<span class="hljs-built_in">log</span>(<span class="hljs-number">42</span>)</code>')

equal(
  md().use(highlightjs, { inline: true, auto: false }).renderInline('`console.log(42)`'),
  '<code>console.log(42)</code>')
