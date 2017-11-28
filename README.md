# quill-comment

Comment plugin for [Quill Editor](https://github.com/quilljs/quill). This plug-in is used to mark which part of a document is commented by who at what time in quill delta. It is made UX-independant by exposing callbacks to hook in.


## Usage

```html
<link rel='stylesheet' type='text/css' href='node_modules/quill-comment/quill.comment.css' />
```

```js
// need to use browserify to convert the js to browser format
var Quill = require('quill');
require('./node_modules/quill-comment/quill.comment.js');

let toolbarOptions = [
	['comments-toggle'], // comment color on/off
	['comments-add'] // comment add
];

let options = {
	theme: 'snow',
	modules: {
		toolbar: toolbarOptions,	
		// comment setting
		comment: {
			enabled: true,
			commentAuthorId: 123,
			commentAddOn: 'Author Name', // any additional info needed
			color: 'yellow', // comment background color in the text
			commentAddClick: commentAddClick, // get called when `ADD COMMENT` btn on options bar is clicked
			commentsClick: commentsClick, // get called when you click `COMMENTS` btn on options bar for you to do additional things beside color on/off. Color on/off is already done before the callback is called.
			commentTimestamp: commentServerTimestamp,
		},
	}
};

quill = new Quill('#editor', options);

function commentAddClick(callback) {
	// UX works to get comment from user, like showing modal dialog
	// $('#inputCommentModal').modal('show');
	// But after whatever UX works, call the `callback` with comment to pass back comment
	callback(comment);
}

function commentServerTimestamp() {

	// call from server or local time. But must return promise with UNIX Epoch timestamp resolved (like 1507617041)
	return new Promise((resolve, reject) => {
		currentTimestamp = Math.round((new Date()).getTime() / 1000);

		resolve(currentTimestamp); 
	});
}

function commentsClick() {
	// comments btn callback
}

```

## MIT License

Copyright (c) 2017 by Win Min Tun

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

