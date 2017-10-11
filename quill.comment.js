/*
* to be used with browerify, included quill module
*/
var Quill = require('quill');
var Parchment = Quill.import('parchment');
var Delta = require('quill-delta');

let CommentClass = new Parchment.Attributor.Class('commentClass', 'ql', {
  scope: Parchment.Scope.INLINE
});

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

class Comment {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.isEnabled;
	
    if(this.options.enabled) {
      this.enable();
	    this.isEnabled = true;
    }
    if(!this.options.commentAuthorId) {
      return;
    }

    Quill.register(CommentId, true);
    Quill.register(CommentClass, true);
    Quill.register(CommentAttr, true);
    Quill.register(CommentAuthorAttr, true);
    Quill.register(CommentTimestampAttr, true);
		
    this.addCommentStyle(this.options.color);

    let commentAddClick = this.options.commentAddClick;
    let commentsClick = this.options.commentsClick;
    let addComment = this.addComment;

  	// for comment color on/off toolbar item
  	let toolbar = this.quill.getModule('toolbar');
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

        window.range = quill.getSelection(); // @TODO: currently using global

        if (!range || range.length ==0) {
          return; // do nth, cuz nothing is selected
        }

        commentAddClick(addComment);

        quill.formatText(range.index, range.length, 'commentClass', 'comment', 'user');
        //quill.formatText(range.index, range.length, 'comment', 'my stupid comment');
        quill.formatText(range.index, range.length, 'commentAuthor', this.options.commentAuthorId, 'user');
        
        this.options.commentTimestamp().then(utcSeconds => {
          // UNIX epoch like 1234567890
          quill.formatText(range.index, range.length, 'commentTimestamp', utcSeconds, 'user');
          quill.formatText(range.index, range.length, 'commentId', 'ql-comment-'+this.options.commentAuthorId+'-'+utcSeconds, 'user');
        })
        
      })
    } else {
      console.log('Error: quill-comment module needs quill toolbar');
    }
  }

  addComment(comment) {
    // selection could be removed when this callback gets called, so store as global range
    quill.formatText(range.index, range.length, 'comment', comment, 'user');
  }

  enable(enabled = true) {
    this.quill.root.classList.toggle('ql-comments', enabled);
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
	    this.styleElement.classList.add('ql-comments-style-'+this.options.authorId); // in case for some manipulation
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
};

Quill.register('modules/comment', Comment);
