'use strict';
function Menu() {}

var pressed = 0;

function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    console.log(this);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      //code to log into our server using userID
      this.game.state.start('createname');
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      console.log('user logged into facebook');
      //log user into app
      this.game.state.start('createname');
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      console.log('user not logged into facebook');
      FB.login((function(response){
        pressed = 0;
        if (response.status === 'connected') {
        // Logged into your app and Facebook.
        //code to log into our server using userID
        this.game.state.start('createname');
        } 
        else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        console.log('user logged into facebook');
        //log user into app
        this.game.state.start('createname');
        } 
        else {
          console.log("you messed up");
        }
      }).bind(this));
    }
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : '909078135779019',
    xfbml      : true,
    version    : 'v2.3'
  });
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

Menu.prototype = {
  preload: function() {

  },
  create: function() { 
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};

    this.titleText = this.game.add.text(this.game.world.centerX, 300, 'Welcome to Fluwa', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to login', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);

  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      //this.game.state.start('createname');
      if(!pressed){
        pressed = 1;
        FB.getLoginStatus((function(response){
          console.log("loop");
          (statusChangeCallback.bind(this))(response);
        }).bind(this));
      }
    }
  }
};

module.exports = Menu;
