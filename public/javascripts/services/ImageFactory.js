/* This factory manages the connection between items and bg
** and the WebSpeechCtrl. The WebSpeechCtrl manages user voice
** input and adds items or changes the bg through the ImageFactory.
*/

stayCation.factory('ImageFactory', function ImageFactory($http) {
  var factory = {};

  factory.bg = 'images/portland-320.jpg';
  factory.items = [];

  // factory.bg = "http://www.deshow.net/d/file/travel/2009-06/mexico-landscape-581-12.jpg";
  // factory.bg = 'images/leaf.jpg';



  // factory.tainted = null;
  //
  // Preload some dummy items for now
  // factory.items = [
  //   {
  //     name: 'cactus',
  //     xPosition: 0,
  //     yPosition: 0,
  //     width: 60,
  //     height: 60,
  //     url: 'http://www.i2clipart.com/cliparts/5/6/8/f/clipart-cactus-568f.png'
  //   },
  //   {
  //     name: 'taco',
  //     xPosition: 0,
  //     yPosition: 0,
  //     width: 60,
  //     height: 60,
  //     url: 'http://www.i2clipart.com/cliparts/9/3/4/c/clipart-taco-934c.png'
  //   },
  //   {
  //     name: 'sombrero',
  //     xPosition: 0,
  //     yPosition: 0,
  //     width: 60,
  //     height: 60,
  //     url: 'http://www.i2clipart.com/cliparts/4/1/2/f/clipart-sombrero-dave-pena-01-412f.png'
  //   },
  //
  // ];


  //
  // factory.isCorsCompliant = function(src) {
  //   // Create a temporary canvas to test CORS
  //   var tmpCanvas = document.createElement("canvas");
  //   var tmpCtx = tmpCanvas.getContext("2d");
  //   tmpCanvas.width = 1;
  //   tmpCanvas.height = 1;
  //
  //   var testImg = new Image();
  //   testImg.tainted = null;
  //
  //   // Set the cross-origin flag to anonymous
  //   testImg.setAttribute('crossOrigin', 'anonymous');
  //   testImg.onload = function() {
  //     // Initialize tainted to true
  //     testImg.tainted = true;
  //     tmpCtx.drawImage(testImg, 0, 0);
  //
  //     // Try to violate CORS
  //     var i = tmpCtx.getImageData(1, 1, 1, 1);
  //
  //     // If we get here, CORS is ok so set tainted = false
  //     // return false;
  //     testImg.tainted = false;
  //     // return tainted;
  //   };
  //
  //   testImg.src = src;
  //
  //   return (testImg);
  // }


  factory.checkCors = function(src) {
    var testImage = new Image();
    testImage.src = src;
    console.log('in checkcors cross origin is' + testImage.crossOrigin);
  };

  factory.removeItem = function(item) {
    var indexToRemove = factory.items.indexOf(item);

    // If we've found this item, remove it from factory.items.
    if (index > -1) {
      factory.items.splice(indexToRemove, 1);
    }
  };

  factory.add = function(query, type) {
    // don't need this stuff anymore now that we're doing api calls server-side
    // // Set up GET request to Google Custom Search API
    // var customsearch = 'https://www.googleapis.com/customsearch/v1?key=';
    // var apiKey = 'AIzaSyDB5cOgPfH_VSA7yRcHiF3MGba4Wx_2a7c';
    // var cx = '014144397479220879650:sd7rzvq2hog';
    // var fields = 'items(link,snippet)';
    // look for all types of images for now
    // var imgType = 'clipart';
    // var numResults = 1;
    // var imageSize;

    // Set image size of query depending whether we are looking for item or bg
    if (type == 'item') {
      imageSize = 'small';
    } else if (type == 'bg') {
      imageSize = 'large';
    }

    // changed getrequrl to be localhost route we created in express
    var getReqUrl = '/get-image/' + type + '/' + query;
    var returnedUrl = null;
    console.log('getReqUrl in angular: ' + getReqUrl);

    // Temporarily disable Google Images so we don't hit API limit
    // Run the API GET request and save the url
    $http.get(getReqUrl).then(function successCallback (response) {

      if (response.data.localUrl) {
        returnedUrl = response.data.localUrl;
      } else {
        console.log('google images get req on server gave back an error to angular');
      }

      console.log('returnedUrl in angular: ' + returnedUrl);

      if (type == 'item') {
        factory.items.push( { name: query, url: returnedUrl } );
      } else if (type == 'bg') {
        factory.bg = returnedUrl;
      }

    }, function errorCallback (response) {
      alert("Error getting Google images -- " +
        response.data.error.code + ': ' +
        response.data.error.errors[0].message);
    });


    // // Fake urls version
    // if (type == 'item') {
    //   factory.items.push({name: query, url: 'http://33.media.tumblr.com/avatar_6f0b931dc565_128.png'});
    // } else if (type == 'bg') {
    //   factory.bg = 'images/portland-320.jpg';
    // }



  }

  return factory;

});
