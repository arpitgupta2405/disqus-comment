// ####################### LOGIN FUNCTION STARTS ########################//

function signIn(element) {
  var userEmail = $('#email').val();
  var password = $('#password').val();
  var isValid = true;

  if (userEmail.trim() === '') {
    $('#email').addClass('invalid');
    isValid = false;
    $('#error-msg-email').html('Please enter email id.').removeClass('hide');
  } else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)+$/.test(userEmail)) {
    isValid = true;
    $('#error-msg-email').html('').addClass('hide');
    $('#email').removeClass('invalid');
  } else {
    isValid = false;
    $('#email').addClass('invalid');
    $('#error-msg-email').html('Please enter valid email id.').removeClass('hide');
  }

  if (password.trim() === '') {
    $('#password').addClass('invalid');
    isValid = false;
    $('#error-msg-password').html('Please enter password.').removeClass('hide');
  } else {
    isValid = true;
    $('#error-msg-password').html('').addClass('hide');
    $('#password').removeClass('invalid');
  }

  if (isValid) {
    var data = {
      userEmail: userEmail,
      password: password
    };
    $.ajax({
        url: '/user/login',
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data)
      })
      .then(function onSuccess(response) {
        if (response.success) {
          window.location.href = response.redirectPath;
        } else {
          $('#sign-in-block .model-success h2').html(response.message);
          $('#sign-in-block').show();
          return;
        }
      })
      .fail(function onFailure(response) {
        var error;
        var message;

        error = response.responseJSON;
        message = error ? error.message : 'Internal error. Please try again.';
        $('#sign-in-block .model-success h2').html(message);
        $('#sign-in-block').show();
        return;
      });
  }
}

$('#email').on('input', function() {
  $('#error-msg-email').html('').addClass('hide');
  $('#email').removeClass('invalid');
});

$('#password').on('input', function() {
  $('#error-msg-password').html('').addClass('hide');
  $('#password').removeClass('invalid');
});


// ####################### LOGIN FUNCTION END ########################//

// ####################### SIGN UP FUNCTION STARTS ########################//


function signUp(element) {
  var userEmail = $('#femail').val();
  var password = $('#fpassword').val();
  var userName = $('#fname').val();
  var profilePic = $(element).attr('data-imagesrc');
  var isValid = true;

  if (userName.trim() === '') {
    $('#fname').addClass('invalid');
    $('#error-msg-fname').html('Please enter your name.').removeClass('hide');
    isValid = false;
  } else {
    if (/^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/.test(userName)) {
      $('#fname').removeClass('invalid');
      $('#error-msg-fname').hide();
      isValid = true;
    } else {
      $('#fname').addClass('invalid');
      $('#error-msg-fname').html('Please enter only characters and number').removeClass('hide');
      isValid = false;
    }
  }

  if (userEmail.trim() === '') {
    $('#femail').addClass('invalid');
    isValid = false;
    $('#error-msg-femail').html('Please enter email id.').removeClass('hide');
  } else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)+$/.test(userEmail)) {
    isValid = true;
    $('#error-msg-femail').html('').addClass('hide');
    $('#femail').removeClass('invalid');
  } else {
    isValid = false;
    $('#femail').addClass('invalid');
    $('#error-msg-femail').html('Please enter valid email id.').removeClass('hide');
    return;
  }

  if (password.trim() === '') {
    $('#fpassword').addClass('invalid');
    isValid = false;
    $('#error-msg-fpassword').html('Please enter password.').removeClass('hide');
  } else if (password.length < 6) {
    $('#fpassword').addClass('invalid');
    isValid = false;
    $('#error-msg-fpassword').html('Password must be of minimum 6 characters.').removeClass('hide');
  } else {
    isValid = true;
    $('#error-msg-fpassword').html('').addClass('hide');
    $('#fpassword').removeClass('invalid');
  }

  if (isValid) {
    var data = {
      userEmail: userEmail,
      password: password,
      userName: userName,
      profilePic: profilePic
    };
    $.ajax({
        url: '/user/signup',
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data)
      })
      .then(function onSuccess(response) {
        if (response.success) {
          window.location.href = response.redirectPath;
        } else {
          $('#sign-up-block .model-success h2').html(response.message);
          $('#sign-up-block').show();
          return;
        }
      })
      .fail(function onFailure(response) {
        var error;
        var message;

        error = response.responseJSON;
        message = error ? error.message : 'Internal error. Please try again.';
        $('#sign-up-block .model-success h2').html(message);
        $('#sign-up-block').show();
        return;
      });
  }
}

$('#fname').on('input', function() {
  $('#error-msg-fname').html('').addClass('hide');
  $('#fname').removeClass('invalid');
});

$('#femail').on('input', function() {
  $('#error-msg-femail').html('').addClass('hide');
  $('#femail').removeClass('invalid');
});

$('#fpassword').on('input', function() {
  $('#error-msg-fpassword').html('').addClass('hide');
  $('#fpassword').removeClass('invalid');
});


// ####################### SIGN UP FUNCTION END ########################//

// ####################### LOGOUT FUNCTION START ########################//

function logout() {
  $.ajax({
      url: '/user/logout',
      method: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: {}
    })
    .then(function onSuccess(response) {
      if (response.success) {
        window.location.href = response.redirectPath;
      }
    })
    .fail(function onFailure(response) {
      return;
    });
}

// ####################### LOGOUT FUNCTION END ########################//

function gotoSignUp(element) {
  $('#signIn').hide();
  $('#signUp').show();
}

function gotoSignIn(element) {
  $('#signUp').hide();
  $('#signIn').show();
}

function gotoCreatePostPage() {
  window.location.href = '/create-post';
}

function publishPost(element) {
  var title = $('#postTitle').val();
  var content = $('#postData').val();
  var isValid = true;

  if (title.trim() === '') {
    isValid = false;
    $('#new-post-title').html('Title Cannot Be Empty');
  } else {
    $('#new-post-title').html('');
  }

  if (content.trim() === '') {
    isValid = false;
    $('#new-post-data').html('Post Cannot Be Empty');
    return;
  } else {
    $('#new-post-data').html('');
  }

  if (isValid) {
    var data = {
      title,
      content
    };
    $.ajax({
        url: '/post/save',
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data)
      })
      .then(function onSuccess(response) {
        if (response.success) {
          $('#new-post-title').html('Post Published');
          setTimeout(() => {
            $('#new-post-title').html('');
            $('#new-post-data').html('');
          }, 2000);
          return;
        }
      })
      .fail(function onFailure(response) {
        var error;
        var message;

        error = response.responseJSON;
        message = error ? error.message : 'Internal error. Please try again.';
        $('#new-post-title').html(message);
        return;
      });
  }
}

$('#postTitle').on('input', function() {
  $('#new-post-title').html('');
});

$('#postData').on('input', function() {
  $('#new-post-data').html('');
});

function postComment(element) {
  var comment = $('#comment').val();
  var postId = $(element).data('postid');
  var isValid = true;

  if (comment.trim() === '') {
    isValid = false;
  }

  if (isValid) {
    var data = {
      comment,
      postId
    };
    $.ajax({
        url: '/post/post-comment',
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data)
      })
      .then(function onSuccess(html) {
        $('#comment').val('');
        // $('#new-comment').html(html);
        $('#new-comment').prepend(html);
      })
      .fail(function onFailure(response) {
        var error;
        var message;

        error = response.responseJSON;
        message = error ? error.message : 'Internal error. Please try again.';
        $('#new-post-title').html(message);
        return;
      });
  }
}

function showReplyBlock(element) {
  $(element).siblings('.replayComment').show();
}

function postReply(element) {
  var comment = $(element).siblings('.reply').val();
  var postId = $(element).data('postid');
  var parentCommentId = $(element).data('parentid');
  var isValid = true;

  if (comment.trim() === '') {
    isValid = false;
    return;
  }

  if (isValid) {
    var data = {
      comment,
      postId,
      parentCommentId
    };
    $.ajax({
        url: '/post/post-comment',
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data)
      })
      .then(function onSuccess(html) {
        $('.reply').val('');
        $(element).parent().hide();
        $(element).parent().parent().append(html);
      })
      .fail(function onFailure(response) {
        var error;
        var message;

        error = response.responseJSON;
        message = error ? error.message : 'Internal error. Please try again.';
        $('#new-post-title').html(message);
        return;
      });
  }
}

//######################## COMMENT PAGINATION ########################
var pagenum = 2;
var LoadMoreClick = false;
var moreExist = true;
var isProcessing = false;

function loadMoreHomePageClick(element) { // eslint-disable-line no-unused-vars
  var postId = $(element).data('postid');
  $(element).hide();
  LoadMoreClick = true;
  isProcessing = true;

  var data = {
    pagenum: pagenum,
    postId: postId
  };

  $.ajax({
    url: '/post/comment/pagination',
    data: data,
    success: function(html) {
      isProcessing = false;
      var $data = $(html);
      $('#new-comment').append($data);
      pagenum++;
    }
  });
}

$(window).scroll(() => {
  var scrltop = $(window).scrollTop();
  var postId = $('#postComment').data('postid');
  if (LoadMoreClick && moreExist && !isProcessing) {
    isProcessing = true;
    $('.loadmore').show();
    var data = {
      pagenum: pagenum,
      postId: postId
    };

    $.ajax({
      url: '/post/comment/pagination',
      data: data,
      success: function(html) {
        isProcessing = false;
        var $data = $(html);
        $('#new-comment').append($data);
        pagenum++;
      }
    });
  }
});

function gotoLoginPage() {
  window.location.href = '/login';
}

$(document).on('change', '.profile-pic', () => {
  var fileData = $('#profile-pic').prop('files')[0];

  var ext = $('#profile-pic').val().split('.').pop().toLowerCase();
  var extensions = ['gif', 'png', 'jpg', 'jpeg'];
  if (extensions.indexOf(ext) === -1) {
    alert('Invalid extension! Upload Gif, png, jpeg, jpg');
    $('#profile-pic').addClass('datarequired');
    $('#profile-pic').val('');
    return false;
  }
  $('#signUpButton').attr("disabled", true);
  var formData = new FormData();
  formData.append('profile-pic', fileData);
  $('.profile-pic').find('img').attr('src', 'https://images.template.net/images/spinner-loader.svg');
  $('.profile-pic').click(false);

  $.ajax({
      url: '/user/profile-pic-upload',
      method: 'POST',
      processData: false,
      contentType: false,
      // contentType: 'application/json; charset=utf-8',
      data: formData
    })
    .then(function onSuccess(response) {
      $('#signUpButton').attr('data-imagesrc', response.files);
      $('.profile-pic').off('click');
      $('#signUpButton').removeAttr("disabled");
      return;
    })
    .fail(function onFailure(response) {
      $('.profile-pic').off('click');
      return;
    });
});
