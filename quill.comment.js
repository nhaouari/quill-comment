/*
* to be used with browerify, included quill module
*/
var Quill = require('quill');
var Parchment = Quill.import('parchment');
var Delta = require('quill-delta');

let CommentAttr = new Parchment.Attributor.Attribute('comment', 'ql-comment', {
  scope: Parchment.Scope.INLINE
});

let CommentAuthorAttr = new Parchment.Attributor.Attribute('commentAuthor', 'ql-comment-author', {
  scope: Parchment.Scope.INLINE
});

let CommentTimestampAttr = new Parchment.Attributor.Attribute('commentTimestamp', 'ql-comment-timestamp', {
  scope: Parchment.Scope.INLINE
});

let CommentId = new Parchment.Attributor.Attribute('commentId', 'id', {
  scope: Parchment.Scope.INLINE
});

let CommentAddOnAttr = new Parchment.Attributor.Attribute('commentAddOn', 'ql-comment-addon', {
  scope: Parchment.Scope.INLINE
});

let quill;
let options;
let range;

class Comment {
  constructor(ql, opt) {
    quill = ql;
    options = opt;

    this.isEnabled;
	
    if(options.enabled) {
      this.enable();
	    this.isEnabled = true;
    }
    if(!options.commentAuthorId) {
      return;
    }

    Quill.register(CommentId, true);
    Quill.register(CommentAttr, true);
    Quill.register(CommentAuthorAttr, true);
    Quill.register(CommentTimestampAttr, true);
    Quill.register(CommentAddOnAttr, true);
		
    this.addCommentStyle(options.color);

    let commentAddClick = options.commentAddClick;
    let commentsClick = options.commentsClick;
    let addComment = this.addComment;

  	// for comment color on/off toolbar item
  	let toolbar = quill.getModule('toolbar');
    if(toolbar) {
    	toolbar.addHandler('comments-toggle', function() {

      });
      toolbar.addHandler('comments-add', function() {

      });
    	let commentToggleBtn = document.querySelector('button.ql-comments-toggle');

    	let commentObj = this;
    	commentToggleBtn.addEventListener('click', function() {
    		// toggle on/off authorship colors
        commentObj.enable(!commentObj.isEnabled);
        
        if (commentsClick) {
          commentsClick();
        }
      });
      
      let addCommentBtn = document.querySelector('button.ql-comments-add');
      addCommentBtn.addEventListener('click', () => {

        range = quill.getSelection(); 

        if (!range || range.length ==0) {
          return; // do nth, cuz nothing is selected
        }

        commentAddClick(addComment);
        
      })
    } else {
      console.log('Error: quill-comment module needs quill toolbar');
    }

    // to prevent comments from being copied/pasted.
    quill.clipboard.addMatcher('span[ql-comment]', function(node, delta) {

      delta.ops.forEach(function(op) {
        op.attributes["comment"] && delete op.attributes["comment"];
        op.attributes["commentAddOn"] && delete op.attributes["commentAddOn"];
        op.attributes["commentAuthor"] && delete op.attributes["commentAuthor"];
        op.attributes["commentId"] && delete op.attributes["commentId"];
        op.attributes["commentTimestamp"] && delete op.attributes["commentTimestamp"];
        op.attributes["background"] && delete op.attributes["background"];

      });
      return delta;
    });

  }

  addComment(comment) {

    if (!comment) {
      return; // cannot work without comment 
    }

    // selection could be removed when this callback gets called, so store it first
    quill.formatText(range.index, range.length, 'commentAuthor', options.commentAuthorId, 'user');

    if (options.commentAddOn) {
      quill.formatText(range.index, range.length, 'commentAddOn', options.commentAddOn, 'user');
    }
    
    options.commentTimestamp().then(utcSeconds => {
      // UNIX epoch like 1234567890
      quill.formatText(range.index, range.length, 'commentTimestamp', utcSeconds, 'user');
      quill.formatText(range.index, range.length, 'commentId', 'ql-comment-'+options.commentAuthorId+'-'+utcSeconds, 'user');

      quill.formatText(range.index, range.length, 'comment', comment, 'user');
    });
  }

  enable(enabled = true) {
    quill.root.classList.toggle('ql-comments', enabled);
	  this.isEnabled = enabled;
  }

  disable() {
    this.enable(false);
	  this.isEnabled = false;
  }

  addCommentStyle(color) {
    let css = ".ql-comments [ql-comment] { " + "background-color:" + color + "; }\n";
    this.addStyle(css);
  }

  addStyle(css) {
    if(!this.styleElement) {
      this.styleElement = document.createElement('style');
      this.styleElement.type = 'text/css';
	    this.styleElement.classList.add('ql-comments-style'); // in case for some manipulation
	    this.styleElement.classList.add('ql-comments-style-'+options.authorId); // in case for some manipulation
      document.documentElement.getElementsByTagName('head')[0].appendChild(this.styleElement);
    }
	
	  this.styleElement.innerHTML = css; // bug fix
    // this.styleElement.sheet.insertRule(css, 0);
  }
}

Comment.DEFAULTS = {
  commentAuthorId: null,
  color: 'transparent',
  enabled: false,
  commentAddClick: null,
  commentsClick: null,
  commentTimestamp: null,
  commentAddOn: null, // additional info
};

Quill.register('modules/comment', Comment);