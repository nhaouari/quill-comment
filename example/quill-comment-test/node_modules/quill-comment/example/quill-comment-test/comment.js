var Quill = require('quill'); // QuillJs Editor
var dateFormat = require('dateformat');
require('./node_modules/quill-comment/quill.comment.js');

window.quill; 

window.currentDelta = function() {
	console.log(JSON.stringify(quill.editor.getDelta()));
	return quill.editor.getDelta();
}

// Starting Point
$(document).ready(function() {
    initializeQuill();
});

// Initialize Quill Editor
function initializeQuill() {

	
	// prepare toolbar 
	let toolbarOptions = [
		[{ 'size': ['small', false, 'large', 'huge'] }], 
		['bold', 'italic', 'underline', 'strike'], 
		[{ 'color': [] }, { 'background': [] }], 
		['link', 'image'], 
		[{ 'list': 'ordered'}, { 'list': 'bullet' }],
		['clean'],
		 
		// Extended toolbar buttons
		['contain'],
		['comments-toggle'], // comment color on/off
		['comments-add'] // comment add
		// Extended toolbar buttons
	]
		  
	let options = {
		theme: 'snow',
		modules: {
			toolbar: toolbarOptions,
			//'multi-cursor': true,
			
			// comment setting
			comment: {
				enabled: true,
				commentAuthorId: 123,
				commentAddOn: 'Author Name',
				color: 'yellow',
				commentAddClick: commentAddClick,
				commentsClick: commentsClick,
				commentTimestamp: commentServerTimestamp,
			},
			
		}
	};
	quill = new Quill('#editor', options);

}

function commentsClick() {
	if (!$('.ql-editor').hasClass('ql-comments')) {
		$('.ql-editor .ql-comment').removeAttr('style');
	}
}

let commentCallback;

function commentAddClick(callback) {
	commentCallback = callback;
	$('#inputCommentModal').modal('show');
}

let currentTimestamp;
function commentServerTimestamp() {
	return new Promise((resolve, reject) => {
		currentTimestamp = Math.round((new Date()).getTime() / 1000); // call from server

		resolve(currentTimestamp); 
	});
}

function addCommentToList(comment, currentTimestamp) {
	let utcSeconds = currentTimestamp;
	let d = new Date(0); // The 0 there is the key, which sets the date to the epoch
	d.setUTCSeconds(utcSeconds);
	
	let date = dateFormat(d, "dddd, mmmm dS, yyyy, h:MM:ss TT");

	let id = 'ql-comment-123-'+utcSeconds;

	let cmtbox = $(
		`<div class='comment-box ${id}' onfocus="commentBoxFocus('${id}')" onfocusout="commentBoxFocus('${id}', 'out')" tabindex="1">
			<div class='comment-head'>
				<div class='comment-initials'>AR</div>
				<div class='comment-details'>
					<div class='comment-author'>Arthur Renaldy</div>
					<div class='comment-date'>${date}</div>
				</div>
			</div>
			<div class='comment-body'>${comment}</div>
	
		</div>`
	);
	$('#comments').append(cmtbox)
}

window.commentSave = () => {
	let comment = $('#commentInput').val();
	commentCallback(comment);

	addCommentToList(comment, currentTimestamp)
	
}

window.commentBoxFocus = function(id, type) {
	$('.ql-comments span.ql-comment').css('background-color', 'yellow');
	$('#comments .comment-box').css('border-color', '#F0F0F0');
	if (type!=='out') {
		$('.ql-comments #'+id).css('background-color', 'red');
		$('#comments .'+id).css('border-color', 'red');
	}
	
}
