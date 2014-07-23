var tumlare = module.exports = {};

tumlare.patterns = {
	block: {
		open: /\{block:.+?\}/,
		close: /\{\/block:.+?\}/
	},
	variable: /\{[A-Z][a-zA-Z0-9\-]*\}/,
	surrounding_brackets: /^\{|\}$/g,
	surrounding_whitespace: /^\s+|\s+$/g
}

tumlare.util = {
	trim: {
		brackets: function(str) {
			return str.replace(tumlare.patterns.surrounding_brackets, '');
		},
		whitespace: function(str) {
			return str.replace(tumlare.patterns.surrounding_whitespace, '');
		}
	},
	each: function(fn, tokens, out) {
		if(typeof out === 'undefined') {
			out = [];
		}
		else if(!('push' in out && typeof out.push === 'function')) {
			throw new Error('Only Array-like values are accepted as output medium.');
		}
		for(var i = 0, l = tokens.length; i < l; i++) {
			out.push(fn(tokens[i]));
		}
		return out;
	}
}

tumlare.parser = {
	tokenize: function(str) {
		str = str || '';
		var tokens = [],
			last = 0,
			now = 0,
			end = str.length;

		function flush() {
			if(now !== last) {
				tokens.push(str.slice(last, now));
			}
			last = now;
		}

		for(now = 0, end = str.length; now < end; now++) {
			if(str[now] === '\\') {
				now++;
			}
			else if(str[now] === '{') {
				flush();
				do {
					now++;
				} while(str[now] !== '}');
				tokens.push(str.slice(last, now+1));
				last = now+1;
			}
		}
		flush();

		return tokens;
	},
	translate: function(token) {
		if(token.match(tumlare.patterns.block.open)) {
			return {
				type: 'block',
				open: true,
				raw: tumlare.util.trim.brackets(token)
			}
		}
		else if(token.match(tumlare.patterns.block.close)) {
			return {
				type: 'block',
				close: true,
				raw: tumlare.util.trim.brackets(token)
			}
		}
		else if(token.match(tumlare.patterns.variable)) {
			return {
				type: 'variable',
				raw: tumlare.util.trim.brackets(token)
			}
		}
		else {
			return {
				type: 'text',
				raw: token
			}
		}
	},
	translate_all: function(raw_tokens) {
		return tumlare.util.each(tumlare.translate, raw_tokens);
	}
};

