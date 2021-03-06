const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

// convenience function for generating lorem text for blog
// posts we initially add below
function lorem() {
  return 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, '
    'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse ' +
    'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non ' +
    'proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
}

BlogPosts.create(
	'10 things -- you won\'t believe #4',  lorem(), 'Billy Bob');
BlogPosts.create(
	'Lions and tigers and bears oh my', lorem(), 'Lefty Lil');

//endpoint for GET
router.get('/', (req, res) => {
	res.json(BlogPosts.get());
})

//endpoint for POST
router.post('/', jsonParser, (req,res) =>{
	//ensure 'title', 'content', and 'author' are in request body
	const requiredFields = ['title', 'content', 'author'];
	for (let i=0, i<requiredFields.length; i==){
		const fields = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	const item = BlogPosts.create(
		req.body.title, req.body.content, req.body.author);
	res.status(201).json(item);
});

//endpoint for PUT
router.put('/:id', jsonParser, (req,res) =>{
	//ensure 'id', title', 'content', 'author', and 'publish date' are in request body
	const requiredFields = [
		'id', 'title', 'content', 'author', 'publishDate'];
	for (let i=0, i<requiredFields.length, i++){
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	//ensure id exists
	if (req.params.id !== req.body.id){
		const message = (
			`Request path id (${req.params.id}) and request body id `
			`(${req.body.id}) must match`);
		console.error(message);
		return res.status(400).send(message);
	}
	//else update blog post
	console.log(`Updating blog post with id \`${req.params.id}\``);
	const updatedItem = BlogPosts.update({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
	});
	res.status(204).end();
});

//endpoint for DELETE
router.delete('/:id', (req,res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted blog post with id \`${req.params.id}\``);
	res.status(204).end();
});

module.exports = router;