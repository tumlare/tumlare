var expect = require('expect.js'),
	tumlare = require('./../lib/tumlare');

describe('tumlare', function() {

	describe('util', function() {

		describe('trim', function() {
			describe('#brackets', function() {
				it('should trim surrounding brackets', function() {
					expect(tumlare.util.trim.brackets('{test}')).to.eql("test");
				});
				it('should only trim one pair', function() {
					expect(tumlare.util.trim.brackets('{{test}}')).to.eql("{test}");
				});
			});
			describe('#whitespace', function() {
				it('should trim surrounding whitespace', function() {
					expect(tumlare.util.trim.whitespace('  \t test   \t  ')).to.eql("test");
				});
			});
		});

		describe('#each', function() {
			var squareFn = function(i) {return i*i},
				inputArray = [1,2,3];
			it('should run the function for each sent in item', function() {
				expect(tumlare.util.each(squareFn, inputArray)).to.eql([1,4,9]);
			});
			it('should only accept array-like values for the third parameter', function() {
				expect(tumlare.util.each).withArgs(squareFn, inputArray, {}).to.throwError();
			});
			it('should write the output to the third parameter sent in', function() {
				var out = [1];
				expect(tumlare.util.each(squareFn, inputArray, out)).to.eql([1,1,4,9]);
			});
		});

	});

	describe('parser', function() {

		describe('#tokenize()', function() {
			it('should return [] when there is no input', function() {
				expect(tumlare.parser.tokenize('')).to.eql([]);
				expect(tumlare.parser.tokenize('')).to.eql([]);
				expect(tumlare.parser.tokenize()).to.eql([]);
			});
			it('should parse curly bracket blocks', function() {
				expect(tumlare.parser.tokenize('{block}')).to.eql(['{block}']);
				expect(tumlare.parser.tokenize('{block}{block2}')).to.eql(['{block}','{block2}']);
			});
			it('should parse text as text', function() {
				expect(tumlare.parser.tokenize('text')).to.eql(['text']);
			});
			it('should parse blocks combined with text', function() {
				expect(tumlare.parser.tokenize('text{block}')).to.eql(['text','{block}']);
				expect(tumlare.parser.tokenize('{block}text')).to.eql(['{block}', 'text']);
				expect(tumlare.parser.tokenize('text{block}text')).to.eql(['text','{block}', 'text']);
				expect(tumlare.parser.tokenize('{block}{text}{block}')).to.eql(['{block}','{text}', '{block}']);
			});
		});

		describe('#translate()', function() {
			it('should translate text to a text node', function() {
				expect(tumlare.parser.translate('text')).to.eql({
					type: 'text',
					raw: 'text'
				});
			});
			it('should translate variables to variable nodes', function() {
				expect(tumlare.parser.translate('{Variable}')).to.eql({
					type: 'variable',
					raw: 'Variable'
				});
			});
			it('should translate opening blocks to opening block nodes', function() {
				expect(tumlare.parser.translate('{block:Block}')).to.eql({
					type: 'block',
					open: true,
					raw: 'block:Block'
				});
			});
			it('should translate closing blocks to closing block nodes', function() {
				expect(tumlare.parser.translate('{/block:Block}')).to.eql({
					type: 'block',
					close: true,
					raw: '/block:Block'
				});
			});
		});

	});

});
